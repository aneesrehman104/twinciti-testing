import React from 'react';
import { Col, Row } from 'antd';
import Image from 'next/image';
import styles from './discoverSidebar.module.css';
const DiscoverSidebar = () => {
    return (
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
                            <p className={styles.mainHeading}>Twinciti</p>
                        </div>
                    </div>
                </Col>
            </Row>
        </section>
    );
};

export default DiscoverSidebar;
