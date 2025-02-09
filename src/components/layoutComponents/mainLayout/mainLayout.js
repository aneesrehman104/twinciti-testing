'use client';
import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Layout } from 'antd';
import SiderComponent from '../sidebarLayout/sidebarLayout';
// import NavbarLayout from '../navbarLayout/navbarLayout';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ModalSidebar from '../../sidebarComponents/modelsSidebar/modelsSidebar';
import DiscoverSidebar from '../../sidebarComponents/discoverSidebar/discoverSidebar';
import ChatSidebar from '../../sidebarComponents/chatsSidebar/chatsSidebar';
import SettingsSidebar from '../../sidebarComponents/settingsSidebar/settingsSidebar';
import styles from './mainLayoutStyle.module.css';

const ContentLayout = dynamic(() =>
    import('../../layoutComponents/contentLayout/contentLayout'),
);
const NavbarLayout = dynamic(() => import('../navbarLayout/navbarLayout'), {
    ssr: false,
});
const layoutStyle = {
    overflow: 'hidden',
    width: '100%',
    minHeight: '100vh',
};

const MainLayout = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const sideBarObj = {
        '/': <ModalSidebar />,
        '/chats': <ChatSidebar />,
        '/discover': <DiscoverSidebar />,
        '/models': <ModalSidebar />,

        // Settings Pages
        '/usage': <SettingsSidebar />,
        '/billing': <SettingsSidebar />,
        '/plans': <SettingsSidebar />,
        '/profile': <SettingsSidebar />,
        '/apiKeys': <SettingsSidebar />,
    };

    return (
        <Layout className={styles.sideBodyWrap} style={layoutStyle}>
            <SiderComponent>{sideBarObj[pathname] || ''}</SiderComponent>
            <Layout className={styles.rightpanel}>
                <NavbarLayout />
                <ContentLayout>{children}</ContentLayout>
            </Layout>
        </Layout>
    );
};
export default MainLayout;
