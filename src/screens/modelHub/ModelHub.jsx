import React, { useEffect, useState } from 'react';
import { Row, Col, Input, Spin, Form } from 'antd';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from 'use-debounce';

const ModelCard = dynamic(() =>
    import('../../app/components/common/modelCard/ModelCard'),
);
import styles from './ModelHub.module.css';
import ButtonComponent from '../../app/components/common/button/Button';
import { getApiWithoutAuth } from '../../utils/api';
import { URLs } from '../../utils/apiUrl';

const ModelHub = () => {
    const searchParams = useSearchParams();

    const [modelsList, setModelsList] = useState({ records: [], total: 0 });
    const [showSpinner, setShowSpinner] = useState(false);
    const [filterData, setFilterData] = useState('');
    const [filterDataSearch] = useDebounce(filterData, 600);
    const checkCategory = () => {
        const searchParams1 = new URLSearchParams(window.location.search);
        const category = searchParams1.get('category');
        if (category !== null) {
            getModelsById(category);
        } else {
            getModelsById('');
        }
    };
    useEffect(() => {
        checkCategory();
    }, [searchParams, filterDataSearch]);

    const getModelsById = async (selectedCategoryItem) => {
        setShowSpinner(true);
        const response = await getApiWithoutAuth(
            `${URLs.ApiGetModel}?q=${filterData}&filter=${selectedCategoryItem}`,
        );
        console.log('=============myres', response);
        if (response.success) {
            setModelsList(response.data);
            setShowSpinner(false);
        } else {
            setShowSpinner(false);
        }
    };
    return (
        <div>
            <Row gutter={[12, 12]}>
                <Col span={16}>
                    <h1 className={styles.modelHubTitle}>
                        Models {modelsList?.total}
                    </h1>
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
                        <Form
                            autoComplete="false"
                            onFinish={() => checkCategory()}
                        >
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
                                        onClick={() => checkCategory()}
                                    />
                                }
                                value={filterData}
                                onChange={(e) => setFilterData(e.target.value)}
                            />
                        </Form>
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
                {showSpinner ? (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '50vh',
                            width: '100%',
                        }}
                    >
                        <Spin />
                    </div>
                ) : modelsList?.records.length === 0 ? (
                    <h2
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '50vh',
                            width: '100%',
                        }}
                        className={styles.modelHubTitle}
                    >
                        No data Found
                    </h2>
                ) : (
                    modelsList?.records?.map((category, index) => (
                        <Col
                            span={24}
                            lg={8}
                            key={category._id}
                            {...console.log(category)}
                        >
                            <ModelCard
                                // active={category.isUsed}
                                iconUrl={category.iconUrl}
                                modelName={category.model_name}
                                description={category.readme_content}
                                taskName={category.modified_task_name}
                                defaultActive={category.isUsed}
                                modified_task_name={category.modified_task_name}
                                _id={category._id}
                                downloads={category.downloads}
                            />
                        </Col>
                    ))
                )}
            </Row>
        </div>
    );
};

export default ModelHub;
