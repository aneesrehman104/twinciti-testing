import React, { useEffect, useState } from 'react';
import { Row, Col, Input, Spin, Form, Badge } from 'antd';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from 'use-debounce';

const ModelCard = dynamic(() =>
    import('../../components/common/modelCard/ModelCard'),
);
import styles from './ModelHub.module.css';
import ButtonComponent from '../../components/common/button/Button';
import { getApiWithoutAuth } from '../../utils/api';
import { URLs } from '../../utils/apiUrl';

const ModelHub = () => {
    const searchParams = useSearchParams();
    const [selectedModels, setSelectedModels] = useState([]);
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

    const selectedModelsHandler = (model, index) => {
        const data = selectedModels.find((item) => item._id === model._id);
        setSelectedModels((pre) => {
            if (data && data._id === model._id) {
                return pre.filter((item) => item._id !== data._id);
            } else {
                return [...pre, model];
            }
        });
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
                        <Badge count={selectedModels.length}>
                            <ButtonComponent
                                variant="dark"
                                height="48px"
                                label="Selected Model"
                            />
                        </Badge>
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
                    modelsList?.records?.map((model, index) => (
                        <Col span={24} lg={8} key={model._id}>
                            <ModelCard
                                active={
                                    selectedModels.findIndex(
                                        (item) => item._id === model._id,
                                    ) !== -1
                                }
                                iconUrl={model.iconUrl}
                                modelName={model.model_name}
                                description={model.readme_content}
                                taskName={model.modified_task_name}
                                defaultActive={model.isUsed}
                                modified_task_name={model.modified_task_name}
                                _id={model._id}
                                downloads={model.downloads}
                                dorpdownOption={[
                                    {
                                        key: 0,
                                        label: 'Add to new chat',
                                        onClick: () =>
                                            selectedModelsHandler(model, index),
                                    },
                                    {
                                        key: 1,
                                        label: 'Add to existing chat',
                                        onClick: () =>
                                            selectedModelsHandler(model, index),
                                    },
                                ]}
                            />
                        </Col>
                    ))
                )}
            </Row>
        </div>
    );
};

export default ModelHub;
