'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Input, Row, Col, Skeleton } from 'antd';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import { getApiWithoutAuth } from '../../../utils/api';
import { URLs } from '../../../utils/apiUrl';
import styles from './settingsSidebar.module.css';
import ButtonComponent from '../../common/button/Button';

const SettingsSidebar = ({}) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const menuItems = [
        {
            id: 0,
            label: 'Profile Settings',
            route: '/profile',
            icon: '/profileIcon.svg',
        },
        {
            id: 1,
            label: 'Billings',
            route: '/billing',
            icon: 'cardBrokenIcon.svg',
        },
        { id: 2, label: 'Plans', route: '/plans', icon: '/plansIcon.svg' },
        {
            id: 3,
            label: 'Usage Overview',
            route: '/usage',
            icon: '/statsIcon.svg',
        },
        { id: 4, label: 'API Keys', route: '/apiKeys', icon: '/lockIcon.svg' },
    ];

    return (
        <section className={styles.mainSidebarWrapper}>
            {' '}
            <Row>
                <Col span={24}>
                    <div className={styles.logoWrp}>
                        <div className={styles.logo}>
                            <Image
                                alt="/logo.svg"
                                height={48}
                                src="/logo.svg"
                                style={{ marginRight: '12px' }}
                                width={48}
                            />
                            <p className={styles.mainHeading}>Twinciti</p>
                        </div>
                    </div>
                </Col>
            </Row>
            <div className={styles.bodyContent}>
                <Row gutter={[12, 12]}>
                    {menuItems.map((item) => (
                        <Col key={item?.id} span={24}>
                            <div
                                onClick={() => {
                                    router.push(item?.route || '');
                                }}
                                className={`${styles.cardContainer} ${
                                    pathname === item.route
                                        ? styles.activeCardContainer
                                        : ''
                                }`}
                            >
                                {pathname === item.route ? (
                                    <div className={styles.imageContainer}>
                                        <Image
                                            alt={item.icon}
                                            height={18}
                                            src={item.icon}
                                            width={18}
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <Image
                                            alt={item.icon}
                                            height={24}
                                            src={item.icon}
                                            width={24}
                                        />
                                    </div>
                                )}
                                <div className={styles.textlabel}>
                                    {item?.label}
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            </div>
            <div className={styles.subscriptionWrap}>
                <div className={styles.subscriptionDetailCard}>
                    <div className={styles.subHeaderWrap}>
                        <Image
                            alt="/paymentLogoWhiteBG.svg"
                            height={32}
                            src="/paymentLogoWhiteBG.svg"
                            width={32}
                        />
                        <div className={styles.priceDetailsWrap}>
                            <span className={styles.priceWrap}>$700</span>{' '}
                            <span className={styles.priceDetails}>
                                Credits earned
                            </span>
                        </div>
                    </div>
                    <div className={styles.cardDetails}>
                        Gets you<span> 50% off</span> the
                        <span> next 2 months</span> on your current{' '}
                        <span>Basic plan</span>
                    </div>
                    <ButtonComponent
                        label={'Refer & earn'}
                        className={styles.referralBtn}
                    />
                </div>
            </div>
        </section>
    );
};

export default SettingsSidebar;
