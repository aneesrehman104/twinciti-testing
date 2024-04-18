'use client';
import dynamic from 'next/dynamic';
import { Layout } from 'antd';
import SiderComponent from '../sidebarLayout/sidebarLayout';
import NavbarLayout from '../navbarLayout/navbarLayout';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ModalSidebar from '../../sidebarComponents/modelsSidebar/modelsSidebar';
import DiscoverSidebar from '../../sidebarComponents/discoverSidebar/discoverSidebar';
import ChatSidebar from '../../sidebarComponents/chatsSidebar/chatsSidebar';
import styles from './mainLayoutStyle.module.css';

const ContentLayout = dynamic(() =>
    import('../../layoutComponents/contentLayout/contentLayout'),
);

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
    };

    return (
        <Layout style={layoutStyle}>
            <SiderComponent>{sideBarObj[pathname] || ''}</SiderComponent>
            <Layout className={styles.rightpanel}>
                <NavbarLayout />
                <ContentLayout>{children}</ContentLayout>
            </Layout>
        </Layout>
    );
};
export default MainLayout;
