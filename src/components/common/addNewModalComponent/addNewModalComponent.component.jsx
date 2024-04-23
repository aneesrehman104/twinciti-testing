import { Col, Form, Row } from 'antd';
import styles from './models.module.css';
import Image from 'next/image';
import CustomModal from '../modal/page';
import TwincitiButton from '../twincitiButton/page';
import TwincitiInput from '../twincitiInput/page';
import { useRouter } from 'next/navigation';

const AddNewModalComponent = ({
    modelsList,
    showNewModal,
    setShowNewModal,
    modelInfo,
    selectedModel,
    getModelsById,
    setFilterData,
    filterData,
    selectedCategoryId,
    checkmodalData,
    removeSeletedModel,
}) => {
    const router = useRouter();

    const formatNumber = (num) => {
        if (num < 1000) {
            return num.toString();
        } else if (num < 1e6) {
            return `${(num / 1e3).toFixed(0)}k`;
        }
        return `${(num / 1e6).toFixed(1)}M`;
    };
    return (
        <>
            <CustomModal
                className={styles.fullWidth}
                onClose={() => setShowNewModal(false)}
                title={''}
                visible={showNewModal}
                width={1100}
            >
                <div style={{ width: '100%', marginTop: 20 }}>
                    <Row gutter={[48, 10]}>
                        <Col md={{ span: 8 }} span={12} xs={{ span: 24 }}>
                            <div className={styles.modelTotalStyle}>
                                You might like
                            </div>
                            <div style={{ height: '50vh', overflow: 'hidden' }}>
                                <Row
                                    gutter={[12, 12]}
                                    style={{
                                        height: '100%',
                                        overflow: 'auto',
                                        overflowX: 'hidden',
                                    }}
                                >
                                    {modelsList?.records?.length === 0 ? (
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                width: '100%',
                                                height: '20vh',
                                                alignItems: 'center',
                                            }}
                                        >
                                            You model found.
                                        </div>
                                    ) : (
                                        modelsList?.records
                                            ?.filter(
                                                (record) =>
                                                    !checkmodalData?.some(
                                                        (info) =>
                                                            info._id ===
                                                            record._id,
                                                    ),
                                            )
                                            .map((item, index) => {
                                                return (
                                                    <Col
                                                        key={item.index}
                                                        md={{ span: 24 }}
                                                        onClick={() =>
                                                            selectedModel(item)
                                                        }
                                                        span={24}
                                                        xs={{ span: 24 }}
                                                    >
                                                        <div
                                                            className={
                                                                styles.modelStyle
                                                            }
                                                        >
                                                            <div
                                                                className={
                                                                    styles.modelIdStyle
                                                                }
                                                            >
                                                                <Image
                                                                    alt="modelidIcon"
                                                                    height={14}
                                                                    src="/modelidIcon.svg"
                                                                    style={{
                                                                        marginRight: 7,
                                                                    }}
                                                                    width={14}
                                                                />
                                                                {
                                                                    item.model_name.split(
                                                                        '/',
                                                                    )[1]
                                                                }
                                                            </div>
                                                            <div
                                                                style={{
                                                                    display:
                                                                        'flex',
                                                                    flexWrap:
                                                                        'wrap',
                                                                }}
                                                            >
                                                                <div
                                                                    className={
                                                                        styles.modeltextStyle
                                                                    }
                                                                >
                                                                    <Image
                                                                        alt="tagIcon"
                                                                        height={
                                                                            14
                                                                        }
                                                                        src="/tagIcon.svg"
                                                                        style={{
                                                                            marginRight: 7,
                                                                        }}
                                                                        width={
                                                                            14
                                                                        }
                                                                    />
                                                                    {
                                                                        item.modified_task_name
                                                                    }
                                                                </div>
                                                                <div
                                                                    className={
                                                                        styles.modeltextStyle
                                                                    }
                                                                >
                                                                    <Image
                                                                        alt="downloadIcon"
                                                                        height={
                                                                            14
                                                                        }
                                                                        src="/downloadIcon.svg"
                                                                        style={{
                                                                            marginRight: 7,
                                                                        }}
                                                                        width={
                                                                            14
                                                                        }
                                                                    />
                                                                    {formatNumber(
                                                                        item.downloads,
                                                                    )}
                                                                </div>
                                                                <div
                                                                    className={
                                                                        !item.isUsed
                                                                            ? styles.modelSleepStyle
                                                                            : styles.modelActiveStyle
                                                                    }
                                                                >
                                                                    <span
                                                                        style={{
                                                                            marginRight: 7,
                                                                        }}
                                                                    >
                                                                        ●
                                                                    </span>
                                                                    {!item.isUsed
                                                                        ? 'Sleeping'
                                                                        : 'Active'}
                                                                </div>
                                                            </div>
                                                            {item.is_llm &&
                                                            item.pipeline_tag ===
                                                                'text-generation' ? (
                                                                <div
                                                                    className={
                                                                        styles.modelActiveStyle
                                                                    }
                                                                >
                                                                    <span
                                                                        style={{
                                                                            marginRight: 7,
                                                                        }}
                                                                    >
                                                                        ●
                                                                    </span>
                                                                    {'LLM'}
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                    </Col>
                                                );
                                            })
                                    )}
                                </Row>
                            </div>
                            <TwincitiButton
                                className={styles.saveButtonStyle}
                                htmlType="button"
                                label={'See All Models'}
                                onClick={() => router.push('/models')}
                                type="primary"
                            />
                        </Col>
                        <Col md={{ span: 16 }} span={12} xs={{ span: 24 }}>
                            <div style={{ height: '70vh', overflow: 'hidden' }}>
                                <div className={styles.searchFieldMain}>
                                    <Form
                                        onFinish={() =>
                                            getModelsById(selectedCategoryId)
                                        }
                                    >
                                        <TwincitiInput
                                            className={styles.searchStyleModel}
                                            name="searchh"
                                            onChange={(e) =>
                                                setFilterData(e.target.value)
                                            }
                                            placeholder="Search by model name"
                                            prefix={
                                                <Image
                                                    alt="searchIcon"
                                                    height={14}
                                                    onClick={() =>
                                                        getModelsById(
                                                            selectedCategoryId,
                                                        )
                                                    }
                                                    src="/searchIcon.svg"
                                                    width={14}
                                                />
                                            }
                                            type="text"
                                            value={filterData}
                                        />
                                    </Form>
                                </div>
                                <div
                                    style={{
                                        height: '40%',
                                        paddingBottom: 20,
                                        overflow: 'auto',
                                        overflowX: 'hidden',
                                    }}
                                >
                                    <Row gutter={[0, 10]}>
                                        {modelsList?.records?.length === 0 ? (
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    width: '100%',
                                                    height: '20vh',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                You model found.
                                            </div>
                                        ) : (
                                            modelsList?.records
                                                ?.filter(
                                                    (record) =>
                                                        !checkmodalData?.some(
                                                            (info) =>
                                                                info._id ===
                                                                record._id,
                                                        ),
                                                )
                                                .map((item, index) => {
                                                    return (
                                                        <Col
                                                            key={item.index}
                                                            md={{ span: 12 }}
                                                            onClick={() =>
                                                                selectedModel(
                                                                    item,
                                                                )
                                                            }
                                                            span={24}
                                                            xs={{ span: 24 }}
                                                        >
                                                            <div
                                                                className={
                                                                    styles.modelStyle
                                                                }
                                                            >
                                                                <div
                                                                    className={
                                                                        styles.modelIdStyle
                                                                    }
                                                                >
                                                                    <Image
                                                                        alt="modelidIcon"
                                                                        height={
                                                                            14
                                                                        }
                                                                        src="/modelidIcon.svg"
                                                                        style={{
                                                                            marginRight: 7,
                                                                        }}
                                                                        width={
                                                                            14
                                                                        }
                                                                    />
                                                                    {
                                                                        item.model_name.split(
                                                                            '/',
                                                                        )[1]
                                                                    }
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        display:
                                                                            'flex',
                                                                        flexWrap:
                                                                            'wrap',
                                                                    }}
                                                                >
                                                                    <div
                                                                        className={
                                                                            styles.modeltextStyle
                                                                        }
                                                                    >
                                                                        <Image
                                                                            alt="tagIcon"
                                                                            height={
                                                                                14
                                                                            }
                                                                            src="/tagIcon.svg"
                                                                            style={{
                                                                                marginRight: 7,
                                                                            }}
                                                                            width={
                                                                                14
                                                                            }
                                                                        />
                                                                        {
                                                                            item.modified_task_name
                                                                        }
                                                                    </div>
                                                                    <div
                                                                        className={
                                                                            styles.modeltextStyle
                                                                        }
                                                                    >
                                                                        <Image
                                                                            alt="downloadIcon"
                                                                            height={
                                                                                14
                                                                            }
                                                                            src="/downloadIcon.svg"
                                                                            style={{
                                                                                marginRight: 7,
                                                                            }}
                                                                            width={
                                                                                14
                                                                            }
                                                                        />
                                                                        {formatNumber(
                                                                            item.downloads,
                                                                        )}
                                                                    </div>
                                                                    <div
                                                                        className={
                                                                            !item.isUsed
                                                                                ? styles.modelSleepStyle
                                                                                : styles.modelActiveStyle
                                                                        }
                                                                    >
                                                                        <span
                                                                            style={{
                                                                                marginRight: 7,
                                                                            }}
                                                                        >
                                                                            ●
                                                                        </span>
                                                                        {!item.isUsed
                                                                            ? 'Sleeping'
                                                                            : 'Active'}
                                                                    </div>
                                                                </div>
                                                                {item.is_llm &&
                                                                item.pipeline_tag ===
                                                                    'text-generation' ? (
                                                                    <div
                                                                        className={
                                                                            styles.modelActiveStyle
                                                                        }
                                                                    >
                                                                        <span
                                                                            style={{
                                                                                marginRight: 7,
                                                                            }}
                                                                        >
                                                                            ●
                                                                        </span>
                                                                        {'LLM'}
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                        </Col>
                                                    );
                                                })
                                        )}
                                    </Row>
                                </div>
                                <div style={{ marginTop: 10 }}>
                                    Selected Models:
                                </div>
                                <div
                                    style={{
                                        height: '40%',
                                        paddingBottom: 20,
                                        overflow: 'auto',
                                        overflowX: 'hidden',
                                    }}
                                >
                                    <Row gutter={[12, 5]}>
                                        {checkmodalData?.length === 0 ? (
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    width: '100%',
                                                    height: '20vh',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                You have not selected any model.
                                            </div>
                                        ) : (
                                            checkmodalData?.map(
                                                (item, index) => {
                                                    return (
                                                        <Col
                                                            key={item.index}
                                                            md={{ span: 12 }}
                                                            span={24}
                                                            xs={{ span: 24 }}
                                                        >
                                                            <div
                                                                onClick={() =>
                                                                    removeSeletedModel(
                                                                        item,
                                                                    )
                                                                }
                                                                style={{
                                                                    display:
                                                                        'flex',
                                                                    justifyContent:
                                                                        'end',
                                                                    marginBottom:
                                                                        '-10px',
                                                                }}
                                                            >
                                                                <Image
                                                                    alt="closeModelIcon"
                                                                    height={18}
                                                                    src="/closeModelIcon.svg"
                                                                    style={{
                                                                        cursor: 'pointer',
                                                                    }}
                                                                    width={18}
                                                                />
                                                            </div>
                                                            <div
                                                                className={
                                                                    styles.modelStyleSelected
                                                                }
                                                            >
                                                                <div
                                                                    className={
                                                                        styles.modelIdStyle
                                                                    }
                                                                >
                                                                    <Image
                                                                        alt="modelidIcon"
                                                                        height={
                                                                            14
                                                                        }
                                                                        src="/modelidIcon.svg"
                                                                        style={{
                                                                            marginRight: 7,
                                                                        }}
                                                                        width={
                                                                            14
                                                                        }
                                                                    />
                                                                    {
                                                                        item.model_name.split(
                                                                            '/',
                                                                        )[1]
                                                                    }
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        display:
                                                                            'flex',
                                                                        flexWrap:
                                                                            'wrap',
                                                                    }}
                                                                >
                                                                    <div
                                                                        className={
                                                                            styles.modeltextStyle
                                                                        }
                                                                    >
                                                                        <Image
                                                                            alt="tagIcon"
                                                                            height={
                                                                                14
                                                                            }
                                                                            src="/tagIcon.svg"
                                                                            style={{
                                                                                marginRight: 7,
                                                                            }}
                                                                            width={
                                                                                14
                                                                            }
                                                                        />
                                                                        {
                                                                            item.modified_task_name
                                                                        }
                                                                    </div>
                                                                    <div
                                                                        className={
                                                                            styles.modeltextStyle
                                                                        }
                                                                    >
                                                                        <Image
                                                                            alt="downloadIcon"
                                                                            height={
                                                                                14
                                                                            }
                                                                            src="/downloadIcon.svg"
                                                                            style={{
                                                                                marginRight: 7,
                                                                            }}
                                                                            width={
                                                                                14
                                                                            }
                                                                        />
                                                                        {formatNumber(
                                                                            item.downloads,
                                                                        )}
                                                                    </div>
                                                                    <div
                                                                        className={
                                                                            !item.isUsed
                                                                                ? styles.modelSleepStyle
                                                                                : styles.modelActiveStyle
                                                                        }
                                                                    >
                                                                        <span
                                                                            style={{
                                                                                marginRight: 7,
                                                                            }}
                                                                        >
                                                                            ●
                                                                        </span>
                                                                        {!item.isUsed
                                                                            ? 'Sleeping'
                                                                            : 'Active'}
                                                                    </div>
                                                                </div>
                                                                {item.is_llm &&
                                                                item.pipeline_tag ===
                                                                    'text-generation' ? (
                                                                    <div
                                                                        className={
                                                                            styles.modelActiveStyle
                                                                        }
                                                                    >
                                                                        <span
                                                                            style={{
                                                                                marginRight: 7,
                                                                            }}
                                                                        >
                                                                            ●
                                                                        </span>
                                                                        {'LLM'}
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                        </Col>
                                                    );
                                                },
                                            )
                                        )}
                                    </Row>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </CustomModal>
        </>
    );
};

export default AddNewModalComponent;
