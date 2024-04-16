import React, { useEffect, useState } from 'react';
import {
    Row,
    Col,
    Input,
    Spin,
    Form,
    Badge,
    Modal,
    Pagination,
    message,
} from 'antd';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import { CloseCircleOutlined } from '@ant-design/icons';

const ModelCard = dynamic(() =>
    import('../../components/common/modelCard/ModelCard'),
);
import styles from './ModelHub.module.css';
import ButtonComponent from '../../components/common/button/Button';
import { getApiWithoutAuth, postApiWithAuth } from '../../utils/api';
import { URLs } from '../../utils/apiUrl';

const ModelHub = () => {
    const searchParams = useSearchParams();
    const [selectedModels, setSelectedModels] = useState([]);
    const [showSelectedModal, setShowSelectedModal] = useState(false);
    const [modelsList, setModelsList] = useState({ records: [], total: 0 });
    const [showSpinner, setShowSpinner] = useState(false);
    const [filterData, setFilterData] = useState('');
    const [filterDataSearch] = useDebounce(filterData, 600);
    const [currentPageData, setCurrentPageData] = useState({});

    const [current, setCurrent] = useState(3);
    const onChange = async (page) => {
        console.log(page);
        setCurrent(page);
        setCurrentPageData({ ...currentPageData, page: page });
        setShowSpinner(true);
        const searchParams1 = new URLSearchParams(window.location.search);
        const category = searchParams1.get('category');

        const response = await getApiWithoutAuth(
            `${URLs.ApiGetModel}?q=${filterData}&filter=${
                category !== null ? category : ''
            }&page=${page}`,
        );
        console.log('=============myres', response);
        if (response.success) {
            setModelsList(response.data);
            setCurrentPageData(response.data);
            setShowSpinner(false);
        } else {
            setShowSpinner(false);
        }
    };
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
    useEffect(() => {
        console.log('=============selectedModels', selectedModels);
    }, [selectedModels]);

    const getModelsById = async (selectedCategoryItem) => {
        setShowSpinner(true);
        const response = await getApiWithoutAuth(
            `${URLs.ApiGetModel}?q=${filterData}&filter=${selectedCategoryItem}`,
        );
        console.log('=============myres', response);
        if (response.success) {
            setModelsList(response.data);
            setCurrentPageData(response.data);
            setShowSpinner(false);
        } else {
            setShowSpinner(false);
        }
    };

    const selectedModelsHandler = (model, index) => {
        console.log('======selectedModels', selectedModels, '====', model);
        if (
            selectedModels.length > 0 &&
            selectedModels[0]?.pipeline_tag !== model.pipeline_tag
        ) {
            message.info('Select same Category ');
        } else {
            const data = selectedModels.find((item) => item._id === model._id);
            setSelectedModels((pre) => {
                if (data && data._id === model._id) {
                    return pre.filter((item) => item._id !== data._id);
                } else {
                    return [...pre, model];
                }
            });
        }
    };

    const callApiForNoRoom = async () => {
        if (selectedModels?.length > 0) {
            const response = await postApiWithAuth(`${URLs.ChatRoom}`, {
                model: selectedModels?.map((obj) => obj._id),
            });
            if (response.success) {
                const searchParams1 = new URLSearchParams(
                    window.location.search,
                );
                const category = searchParams1.get('category');
                let setCategory = '';
                if (category == null) {
                    setCategory = selectedModels[0]?.pipeline_tag;
                } else {
                    setCategory = category;
                }
                const params = new URLSearchParams(searchParams.toString());
                params.set('chatId', response.data.room._id);
                params.set('category', setCategory);
                router.push(`/${setCategory}` + '?' + params.toString());
                // dispatch(removeAllModels());
            } else {
                message.open({
                    type: 'error',
                    content: `${response.message}`,
                    duration: 2,
                });
            }
        } else {
            message.info('Select atleast 1 modal ');
        }
    };
    return (
        <>
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
                                onClick={() => setShowSelectedModal(true)}
                            />
                        </Badge>
                        <ButtonComponent
                            variant="primary"
                            height="48px"
                            label="Start Chat"
                            onClick={() => {
                                callApiForNoRoom();
                            }}
                        />
                    </div>
                </Col>
                <Col span={8}>
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
                <Col span={16}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <Pagination
                            style={{ color: 'red' }}
                            current={currentPageData.page}
                            onChange={onChange}
                            total={currentPageData.total}
                            defaultPageSize={20}
                            // showTotal={(total, range) =>
                            //     `${range[0]}-${range[1]} of ${total} items`
                            // }
                            showSizeChanger={false}
                            pageSizeOptions={[20]}
                            pageSize={20}
                        />
                    </div>
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
                    <Row gutter={[36, 20]}>
                        {modelsList?.records?.map((model, index) => (
                            <Col span={24} lg={8} sm={12} key={model._id}>
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
                                    modified_task_name={
                                        model.modified_task_name
                                    }
                                    _id={model._id}
                                    downloads={model.downloads}
                                    dorpdownOption={{ model, index }}
                                    selectedModelsHandler={
                                        selectedModelsHandler
                                    }
                                />
                            </Col>
                        ))}
                    </Row>
                )}
            </Row>
            <Modal
                onCancel={() => setShowSelectedModal(false)}
                title={'Selected Models'}
                open={showSelectedModal}
                width={700}
                closeIcon={<CloseCircleOutlined />}
                footer={null}
            >
                <Row gutter={[24, 10]}>
                    {selectedModels?.length === 0 ? (
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
                            You have not selected any model.
                        </h2>
                    ) : (
                        <Row gutter={[36, 20]}>
                            {selectedModels?.map((model, index) => (
                                <Col span={10} key={model._id}>
                                    <ModelCard
                                        active={true}
                                        iconUrl={model.iconUrl}
                                        modelName={model.model_name}
                                        description={model.readme_content}
                                        taskName={model.modified_task_name}
                                        defaultActive={model.isUsed}
                                        modified_task_name={
                                            model.modified_task_name
                                        }
                                        _id={model._id}
                                        downloads={model.downloads}
                                        dorpdownOption={{ model, index }}
                                        selectedModelsHandler={
                                            selectedModelsHandler
                                        }
                                        showRemove
                                    />
                                </Col>
                            ))}
                        </Row>
                    )}
                </Row>
            </Modal>
        </>
    );
};

export default ModelHub;
