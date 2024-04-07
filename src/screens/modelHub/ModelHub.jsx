import React from 'react';
import { Row, Col, Input } from 'antd';
import dynamic from 'next/dynamic';
import Image from 'next/image';
const ModelCard = dynamic(() =>
    import('../../app/components/common/modelCard/ModelCard'),
);
import styles from './ModelHub.module.css';
import ButtonComponent from '../../app/components/common/button/Button';

const ModelHub = () => {
    const [total, setTotal] = React.useState(123);
    return (
        <div>
            <Row gutter={[12, 12]}>
                <Col span={16}>
                    <h1 className={styles.modelHubTitle}>Models {total}</h1>
                </Col>
                <Col span={8}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '1rem',
                        }}
                    >
                        <ButtonComponent
                            variant="dark"
                            height="48px"
                            label="Selected Model"
                        />
                        <ButtonComponent
                            variant="primary"
                            height="48px"
                            label="Start Chat"
                        />
                    </div>
                </Col>
                <Col span={12}>
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
                <Col span={12}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                        }}
                    ></div>
                </Col>
                <Col span={24} lg={8}>
                    <ModelCard active={true} />
                </Col>
                <Col span={24} lg={8}>
                    <ModelCard />
                </Col>
                <Col span={24} lg={8}>
                    <ModelCard />
                </Col>
                <Col span={24} lg={8}>
                    <ModelCard />
                </Col>
                <Col span={24} lg={8}>
                    <ModelCard />
                </Col>
                <Col span={24} lg={8}>
                    <ModelCard />
                </Col>
                <Col span={24} lg={8}>
                    <ModelCard />
                </Col>
                <Col span={24} lg={8}>
                    <ModelCard />
                </Col>
            </Row>
        </div>
    );
};

export default ModelHub;
