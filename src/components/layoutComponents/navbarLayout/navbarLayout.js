'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Avatar, Divider, Dropdown, Layout, Menu } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import styles from './navbarStyle.module.css';
const { Header } = Layout;

const navbarArray = [
    {
        icon: '/modelhubIcon.svg',
        title: 'Model Hub',
        route: '/models',
        key: 'models',
    },
    {
        icon: '/modelhubIcon.svg',
        title: 'Discover',
        route: '/discover',
        key: 'discover',
    },
    {
        icon: '/chatIcon.svg',
        title: 'Chats',
        route: '/chats',
        key: 'chats',
    },
];

const NavbarLayout = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [selectedNav, setSelectedNav] = useState(pathname);
    const [isLogin, setIsLogin] = useState(true);

    useEffect(() => {
        const currentRoute = pathname;
        const matchedNavItem = navbarArray.find(
            (item) => item.route === currentRoute,
        );
        if (matchedNavItem) {
            setSelectedNav(matchedNavItem.key);
        }
    }, [pathname]);

    const menu = (
        <Menu className={styles.menuStyleAuthenticated}>
            <Menu.Item
                className={styles.menuItemStyleAuthenticated}
                key="1"
                onClick={() => router.push('/setting?path=0')}
            >
                Settings
            </Menu.Item>
            <Divider className={styles.dividerAuthenticated} />

            <Menu.Item
                className={styles.menuItemStyleAuthenticated}
                key="2"
                onClick={() => setShowLogoutModal(true)}
            >
                Logout
            </Menu.Item>
        </Menu>
    );
    return (
        <Header
            className={styles.navbarHeight}
            style={{ padding: '0px .5rem' }}
        >
            <div className={styles.topLeftSide}>
                {navbarArray.map((item) => {
                    return (
                        <div
                            key={item.key}
                            className={
                                selectedNav === item.key
                                    ? styles.btnGradient
                                    : ''
                            }
                            onClick={() => {
                                router.push(item.route);
                            }}
                            style={{
                                height: 40,
                                width: 138,
                                borderRadius: 21,
                                // marginLeft: 10,
                                cursor: 'pointer',
                            }}
                        >
                            <div
                                className={
                                    selectedNav === item.key
                                        ? styles.btnGradientInner
                                        : ''
                                }
                                style={{
                                    height: 40,
                                    width: '138px',
                                    borderRadius: 21,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: 'white',
                                    cursor: 'pointer',
                                }}
                            >
                                <Image
                                    alt={item.icon}
                                    height={16}
                                    src={item.icon}
                                    style={{ marginRight: '5px' }}
                                    width={16}
                                />
                                {item.title}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div>
                {isLogin ? (
                    <Dropdown menu={menu} trigger={['click']}>
                        <div
                            style={{
                                height: 50,
                                width: 50,
                                borderRadius: '50%',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                background: 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                            }}
                        >
                            <Avatar
                                size="large"
                                style={{
                                    backgroundColor: 'rgba(46, 176, 251, 1)',
                                    verticalAlign: 'middle',
                                }}
                            >
                                {'anees'[0]?.toUpperCase()}
                            </Avatar>
                        </div>
                    </Dropdown>
                ) : null}
            </div>
        </Header>
    );
};
export default NavbarLayout;
