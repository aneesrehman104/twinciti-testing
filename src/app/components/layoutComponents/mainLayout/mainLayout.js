"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Layout, Input, Row, Col, Skeleton } from 'antd';
import SiderComponent from '../sidebarLayout/sidebarLayout';
import Image from 'next/image';
import NavbarLayout from '../navbarLayout/navbarLayout';
import ModelHub from '../../../../screens/modelHub/ModelHub';

import { getApiWithoutAuth } from '../../../../utils/api';
import { URLs } from '../../../../utils/apiUrl';

import styles from './mainLayoutStyle.module.css';

const MenuButton = dynamic(() => import('../../common/menuButton/MenuButton'), {
    loading: () => <Skeleton.Button />,
    ssr: false,
});

const ContentLayout = dynamic(() =>
    import('../../layoutComponents/contentLayout/contentLayout'),
);

const layoutStyle = {
    overflow: 'hidden',
    width: '100%',
    minHeight: '100vh',
};

const MainLayout = () => {
    const [categories, setCategories] = useState([]);
    const [isOpen, setIsOpen] = useState('');

    const fetchCategories = async () => {
        try {
            const response = await getApiWithoutAuth(URLs.ApiGetCategory);
            if (response && response.success) {
                const { records } = response.data;
                setCategories(records);
            }
        } catch (error) {
            console.log('error', error);
        }
    };

    const isOpenHandle = (name) =>
        setIsOpen((pre) => (pre === name ? '' : name));

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <Layout style={layoutStyle}>
            <SiderComponent>
                <section
                    style={{
                        padding: '15px 10px',
                        height: '100%',
                    }}
                >
                    <Row gutter={[12, 12]}>
                        <Col span={24}>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: 20,
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Image
                                        alt="/logo.svg"
                                        height={48}
                                        src="/logo.svg"
                                        style={{ marginRight: '7px' }}
                                        width={48}
                                    />
                                    <p className={styles.mainHeading}>
                                        Twinciti
                                    </p>
                                </div>

                                <Image
                                    alt="/arrowWithCircle.svg"
                                    height={48}
                                    src="/arrowWithCircle.svg"
                                    style={{ marginRight: '5px' }}
                                    width={48}
                                />
                            </div>
                        </Col>
                        <Col span={24}>
                            <div className={styles.btnGradient}>
                                <Input
                                    className={styles.inputStyle}
                                    placeholder="Filter task by name"
                                    prefix={
                                        <Image
                                            alt="/searchIcon.svg"
                                            height={16}
                                            src="/searchIcon.svg"
                                            style={{ marginRight: '5px' }}
                                            width={16}
                                        />
                                    }
                                />
                            </div>
                        </Col>
                        <Col span={24}>
                            <Row gutter={[12, 12]}>
                                {categories.map((category) => (
                                    <Col span={24}>
                                        <MenuButton
                                            label={category.label}
                                            categories={category.categories}
                                            key={category.label}
                                            isOpen={isOpen === category.label}
                                            setIsOpen={isOpenHandle}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                    </Row>
                </section>
            </SiderComponent>
            <Layout>
                <NavbarLayout />
                <ContentLayout>
                    <ModelHub />
                </ContentLayout>
            </Layout>
        </Layout>
    );
};
export default MainLayout;
