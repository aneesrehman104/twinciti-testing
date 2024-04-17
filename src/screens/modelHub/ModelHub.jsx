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
import { useDispatch, useSelector } from 'react-redux';
import {
    addModel,
    removeModel,
    removeAllModels,
} from '../../states/modelInfo/modelInfoSlice';
import { deleteCookie, setCookie } from 'cookies-next';
import { deleteUser } from '../../states/user/userSlice';

const ModelCard = dynamic(() =>
    import('../../components/common/modelCard/ModelCard'),
);
import styles from './ModelHub.module.css';
import ButtonComponent from '../../components/common/button/Button';
import {
    getApiWithoutAuth,
    postApiWithAuth,
    getApiWithAuth,
} from '../../utils/api';
import { URLs } from '../../utils/apiUrl';

const ModelHub = () => {
    const user = useSelector((state) => state.user);
    const modelInfo = useSelector((state) => state.models);
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const [showSelectedModal, setShowSelectedModal] = useState(false);
    const [modelsList, setModelsList] = useState({ records: [], total: 0 });
    const [showSpinner, setShowSpinner] = useState(false);
    const [filterData, setFilterData] = useState('');
    const [filterDataSearch] = useDebounce(filterData, 600);
    const [currentPageData, setCurrentPageData] = useState({});
    const logoutUser = () => {
        deleteCookie('accessToken');
        deleteCookie('user');
        dispatch(deleteUser());
    };
    useEffect(() => {
        const getUserInfo = async () => {
            const response = await getApiWithAuth(URLs.meApi);
            if (response.status === 401) {
                logoutUser();
            }
        };
        getUserInfo();
    }, [user]);

    const onChange = async (page) => {
        setCurrentPageData({ ...currentPageData, page: page });
        setShowSpinner(true);
        const searchParams1 = new URLSearchParams(window.location.search);
        const category = searchParams1.get('category');

        const response = await getApiWithoutAuth(
            `${URLs.ApiGetModel}?q=${filterData}&filter=${
                category !== null ? category : ''
            }&page=${page}`,
        );
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

    const getModelsById = async (selectedCategoryItem) => {
        setShowSpinner(true);
        const response = await getApiWithoutAuth(
            `${URLs.ApiGetModel}?q=${filterData}&filter=${selectedCategoryItem}`,
        );
        if (response.success) {
            setModelsList(response.data);
            setCurrentPageData(response.data);
            setShowSpinner(false);
        } else {
            setShowSpinner(false);
        }
    };

    const addSelectedModel = async (selectedModelItem) => {
        if (
            modelInfo?.modelInfo?.length > 0 &&
            modelInfo?.modelInfo[0]?.pipeline_tag !==
                selectedModelItem.pipeline_tag
        ) {
            message.info('Select same Category Models ');
        } else {
            dispatch(addModel(selectedModelItem));
        }
    };
    const removeSelectedModel = (selectedModelItem) => {
        dispatch(removeModel(selectedModelItem));
    };
    useEffect(() => {
        const data = modelInfo?.modelInfo?.map((item) => {
            return {
                _id: item._id,
                pipeline_tag: item.pipeline_tag,
                downloads: item.downloads,
                isUsed: item.isUsed,
                model_name: item.model_name,
                name: item.name,
                platform_type: item.platform_type,
                readme_content: item.readme_content,
            };
        });
        setCookie('modelInfo', data);
    }, [modelInfo]);

    const callApiForNoRoom = async () => {
        if (modelInfo?.modelInfo?.length > 0) {
            const response = await postApiWithAuth(`${URLs.ChatRoom}`, {
                model: modelInfo?.modelInfo?.map((obj) => obj._id),
            });
            if (response.success) {
                const searchParams1 = new URLSearchParams(
                    window.location.search,
                );
                const category = searchParams1.get('category');
                let setCategory = '';
                if (category == null) {
                    setCategory = modelInfo?.modelInfo[0]?.pipeline_tag;
                } else {
                    setCategory = category;
                }
                const params = new URLSearchParams(searchParams.toString());
                params.set('chatId', response.data.room._id);
                params.set('category', setCategory);
                router.push(`/${setCategory}` + '?' + params.toString());
                dispatch(removeAllModels());
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
            <Row gutter={[12, 12]} align="bottom">
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
                        <Badge
                            count={
                                modelInfo.modelInfo?.length > 0
                                    ? modelInfo.modelInfo?.length
                                    : ''
                            }
                        >
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
                                        modelInfo.modelInfo?.findIndex(
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
                                    addSelectedModel={addSelectedModel}
                                    removeSelectedModel={removeSelectedModel}
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
                {modelInfo.modelInfo?.length === 0 ? (
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
                    <Row gutter={[20, 20]}>
                        {modelInfo.modelInfo?.map((model, index) => (
                            <Col span={12} key={model._id}>
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
                                    addSelectedModel={addSelectedModel}
                                    removeSelectedModel={removeSelectedModel}
                                    showRemove
                                />
                            </Col>
                        ))}
                    </Row>
                )}
            </Modal>
        </>
    );
};

export default ModelHub;
