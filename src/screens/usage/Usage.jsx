import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, message, Switch, Input } from 'antd';
import { ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import {
    getApiWithAuth,
    deleteApiWithAuth,
    patchApiWithAuth,
} from '../../utils/api';
import { URLs } from '../../utils/apiUrl';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Badge, Divider, Dropdown, Menu, Progress, Space, Table } from 'antd';
import styles from './Usage.module.css';
import ButtonComponent from '../../components/common/button/Button';

const Usage = () => {
    const router = useRouter();
    const [form] = Form.useForm();

    const [showDeleteModel, setShowDeleteModel] = useState(false);
    const [deleteChatSpinner, setDeleteChatSpinner] = useState(false);
    const [myCurrentPlan, setMyCurrentPlan] = useState({});
    const [inputValues, setInputValues] = useState('');
    const [arrayInputValues, setArrayInputValues] = useState([]);
    const [userPaid, setUserPaid] = useState(false);
    const [spinner, setSpinner] = useState(false);

    const deleteThisChat = async () => {
        await deleteChatData();
        setShowDeleteModel(false);
    };

    const deleteChatData = async () => {
        setDeleteChatSpinner(true);
        setDeleteChatSpinner(false);
        // const res = await deleteApiWithAuth(`${URLs.ChatRoom}/${id}`);
        // if (res.success) {
        //   message.open({
        //     type: "success",
        //     content: `${res.data}`,
        //     duration: 2,
        //   });
        //   form.resetFields();
        //   setDeleteChatSpinner(false);
        // } else {
        //   message.open({
        //     type: "error",
        //     content: `${res.message}`,
        //     duration: 2,
        //   });
        //   setDeleteChatSpinner(false);
        // }
    };

    useEffect(() => {
        fetchCurrectPlan();
    }, []);

    const fetchCurrectPlan = async () => {
        setSpinner(true);
        const res = await getApiWithAuth(`${URLs.SUBSCRIPTION}`);
        if (res.data.success) {
            if (res.data.data.is_paid) {
                setUserPaid(true);
                setMyCurrentPlan(res.data);
            } else {
                setUserPaid(false);
            }
            setSpinner(false);
        } else {
            setSpinner(false);
            message.open({
                type: 'error',
                content: `${res.data.message}`,
                duration: 2,
            });
        }
    };

    const onChange = (checked) => {
        // console.log(`switch to ${checked}`);
    };

    const saveThisAlert = async () => {
        // arrayInputValues.push(inputValues);
        if (inputValues !== '') {
            setArrayInputValues([...arrayInputValues, inputValues]);
            setInputValues('');
        }
        // const res = await getApiWithAuth(`${URLs.GetConversation}`);
        // if (res.data.success) {
        //   setMyCurrentPlan(res.data);
        // } else {
        //   message.open({
        //     type: "error",
        //     content: `${res.data.message}`,
        //     duration: 2,
        //   });
        // }
    };
    return (
        <>
            <div
                style={{
                    padding: 20,
                    width: '100%',
                    overflow: 'auto',
                    height: '100%',
                }}
            >
                <div className={styles.topHeadingStyle}>Usage overview</div>
                <div className={styles.topParagraphStyle}>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the
                    industry&apos;s standard dummy text ever since the 1500s,
                    when an unknown printer took a galley of type and scrambled
                    it to make a type specimen book. Lorem Ipsum is simply dummy
                    text.
                </div>
                <div className={styles.topHeadingStyle}>My Current plan</div>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {userPaid ? (
                        <></>
                    ) : (
                        <>
                            <div className={styles.boxStyle}>
                                <div className={styles.innerBoxText}>
                                    This section shows usage but you need a plan
                                    first.
                                </div>
                                <Image
                                    alt="usageNoPlan"
                                    height={200}
                                    src="/usageNoPlan.svg"
                                    width={200}
                                />
                                <ButtonComponent
                                    variant="activeBorder"
                                    height="44px"
                                    label={'View  plans'}
                                    onClick={() => router.push('/plans')}
                                />
                            </div>
                            <div className={styles.boxStyle}>
                                <div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                        }}
                                    >
                                        <Image
                                            alt="autoIcon"
                                            height={24}
                                            src="/autoIcon.svg"
                                            width={24}
                                            style={{ marginRight: 10 }}
                                        />
                                        <div>
                                            <div
                                                className={
                                                    styles.descriptionHeadingStyleInactive
                                                }
                                            >
                                                Auto-buy quota increase{' '}
                                                <Image
                                                    alt="infoIcon"
                                                    height={20}
                                                    src="/infoIcon.svg"
                                                    width={20}
                                                    style={{ marginLeft: 10 }}
                                                />
                                            </div>

                                            <div style={{ display: 'flex' }}>
                                                <div
                                                    className={
                                                        styles.descriptionStyleInactive
                                                    }
                                                >
                                                    Automatically buy quota
                                                    increases when the remaining
                                                    usage quota is below a
                                                    certain threshold.
                                                </div>
                                                <Switch
                                                    style={{ marginTop: 10 }}
                                                    value={false}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className={
                                            styles.descriptionStyleInactive
                                        }
                                    >
                                        When remaining usage quota is below
                                    </div>

                                    <Form autoComplete="false">
                                        <Input
                                            className={styles.inputStyle}
                                            placeholder="0.0"
                                            suffix={
                                                <>
                                                    <Image
                                                        alt="buttonEndPercentage"
                                                        height={50}
                                                        src="/buttonEndPercentage.svg"
                                                        style={{
                                                            position:
                                                                'absolute',
                                                            right: 0,
                                                            borderTopRightRadius: 8,
                                                            borderBottomRightRadius: 8,
                                                        }}
                                                        width={47}
                                                    />
                                                </>
                                            }
                                            // value={filterData}
                                            // onChange={(e) => setFilterData(e.target.value)}
                                        />
                                    </Form>
                                    <div
                                        className={
                                            styles.descriptionStyleInactive
                                        }
                                    >
                                        Purchase this amount
                                    </div>

                                    <Form autoComplete="false">
                                        <Input
                                            className={styles.inputStyle}
                                            placeholder="0.0"
                                            suffix={
                                                <>
                                                    <Image
                                                        alt="buttonEndDollar"
                                                        height={50}
                                                        src="/buttonEndDollar.svg"
                                                        style={{
                                                            position:
                                                                'absolute',
                                                            right: 0,
                                                            borderTopRightRadius: 8,
                                                            borderBottomRightRadius: 8,
                                                        }}
                                                        width={47}
                                                    />
                                                </>
                                            }
                                            // value={filterData}
                                            // onChange={(e) => setFilterData(e.target.value)}
                                        />
                                    </Form>
                                    <div className={styles.topParagraphStyle}>
                                        Min $10 and max $1000
                                    </div>

                                    <div
                                        className={
                                            styles.descriptionStyleInactive
                                        }
                                    >
                                        The amount entered is approximately:
                                    </div>
                                    <div className={styles.backGroundAdded}>
                                        <div
                                            className={
                                                styles.descriptionStyleInactive
                                            }
                                        >
                                            <Image
                                                alt="tick"
                                                height={12}
                                                src="/tick.svg"
                                                width={12}
                                                style={{ marginRight: 5 }}
                                            />
                                            1000 words per month
                                        </div>
                                        <div
                                            className={
                                                styles.descriptionStyleInactive
                                            }
                                        >
                                            <Image
                                                alt="tick"
                                                height={12}
                                                src="/tick.svg"
                                                width={12}
                                                style={{ marginRight: 5 }}
                                            />
                                            12 images per month
                                        </div>
                                        <div
                                            className={
                                                styles.descriptionStyleInactive
                                            }
                                        >
                                            <Image
                                                alt="tick"
                                                height={12}
                                                src="/tick.svg"
                                                width={12}
                                                style={{ marginRight: 5 }}
                                            />
                                            2 videos per month
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.boxStyle}>
                                <div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                        }}
                                    >
                                        <Image
                                            alt="autoIcon"
                                            height={24}
                                            src="/autoIcon.svg"
                                            width={24}
                                            style={{ marginRight: 10 }}
                                        />
                                        <div>
                                            <div
                                                className={
                                                    styles.descriptionHeadingStyleInactive
                                                }
                                            >
                                                Threshold alert{' '}
                                                <Image
                                                    alt="infoIcon"
                                                    height={20}
                                                    src="/infoIcon.svg"
                                                    width={20}
                                                    style={{ marginLeft: 10 }}
                                                />
                                            </div>

                                            <div style={{ display: 'flex' }}>
                                                <div
                                                    className={
                                                        styles.descriptionStyleInactive
                                                    }
                                                >
                                                    Be alerted when your usage
                                                    quota drops below a certain
                                                    threshold.
                                                </div>
                                                <Switch
                                                    style={{ marginTop: 10 }}
                                                    value={false}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className={
                                            styles.descriptionStyleInactive
                                        }
                                    >
                                        Set threshold alert
                                    </div>

                                    <Form autoComplete="false">
                                        <Input
                                            className={styles.inputStyle}
                                            placeholder="0.0"
                                            suffix={
                                                <>
                                                    <Image
                                                        alt="buttonEndPercentage"
                                                        height={50}
                                                        src="/buttonEndPercentage.svg"
                                                        style={{
                                                            position:
                                                                'absolute',
                                                            right: 0,
                                                            borderTopRightRadius: 8,
                                                            borderBottomRightRadius: 8,
                                                        }}
                                                        width={47}
                                                    />
                                                </>
                                            }
                                            // value={filterData}
                                            // onChange={(e) => setFilterData(e.target.value)}
                                        />
                                    </Form>
                                    <div
                                        className={
                                            styles.descriptionHeadingStylePerpule
                                        }
                                        onClick={() => saveThisAlert()}
                                    >
                                        + Add
                                    </div>
                                    <div
                                        className={
                                            styles.descriptionStyleInactive
                                        }
                                    >
                                        Alert 1
                                    </div>

                                    <Form autoComplete="false">
                                        <Input
                                            className={styles.inputStyle}
                                            placeholder="0.0"
                                            suffix={
                                                <>
                                                    <Image
                                                        alt="buttonEndDelete"
                                                        height={50}
                                                        src="/buttonEndDelete.svg"
                                                        style={{
                                                            position:
                                                                'absolute',
                                                            right: 0,
                                                            borderTopRightRadius: 8,
                                                            borderBottomRightRadius: 8,
                                                        }}
                                                        width={47}
                                                    />
                                                </>
                                            }
                                            value={'50%'}
                                            // onChange={(e) => setFilterData(e.target.value)}
                                        />
                                    </Form>
                                </div>
                            </div>
                        </>
                    )}
                    {/* <div
                        style={{
                            background: 'rgba(43, 45, 49, 1)',
                            borderRadius: 8,
                            // border: "1px solid rgba(73, 73, 73, 1)",
                            border: '2px solid',
                            borderImage:
                                'linear-gradient(to right, rgba(171, 105, 255, 1), rgba(247, 181, 70, 1) ) 1',
                            margin: '20px 15px 0px 0px',
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            style={{
                                padding: 10,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-evenly',
                                height: 520,
                                width: 320,
                            }}
                        >
                            <div className={styles.headingStyle}>Standard</div>
                            <div className={styles.boldHeadingStyle}>
                                $<span className={styles.headingStyle}>20</span>{' '}
                                &nbsp;
                                <sub className={styles.topParagraphStyle}>
                                    Per month
                                </sub>
                            </div>
                            <div>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                    }}
                                    className={styles.descriptionStyle}
                                >
                                    13% Remaining
                                </div>

                                <Progress
                                    percent={87}
                                    showInfo={false}
                                    strokeColor="rgba(240, 79, 79, 1)"
                                    trailColor="rgba(255, 255, 255, 1)"
                                />
                            </div>
                            <div className={styles.descriptionStyle}>
                                <Image
                                    alt="tick"
                                    height={12}
                                    src="/tick.svg"
                                    width={12}
                                    style={{ marginRight: 5 }}
                                />
                                sss
                            </div>
                            <div className={styles.descriptionStyle}>
                                <Image
                                    alt="tick"
                                    height={12}
                                    src="/tick.svg"
                                    width={12}
                                    style={{ marginRight: 5 }}
                                />
                                sss
                            </div>
                            <div className={styles.descriptionStyle}>
                                <Image
                                    alt="tick"
                                    height={12}
                                    src="/tick.svg"
                                    width={12}
                                    style={{ marginRight: 5 }}
                                />
                                sss
                            </div>
                            <div className={styles.descriptionStyle}>
                                <Image
                                    alt="tick"
                                    height={12}
                                    src="/tick.svg"
                                    width={12}
                                    style={{ marginRight: 5 }}
                                />
                                sss
                            </div>
                            <div className={styles.descriptionStyle}>
                                <Image
                                    alt="tick"
                                    height={12}
                                    src="/tick.svg"
                                    width={12}
                                    style={{ marginRight: 5 }}
                                />
                                sss
                            </div>

                            <ButtonComponent
                                variant="dark"
                                height="48px"
                                label={'Cancel Subscription'}
                            />
                            <p className={styles.topParagraphStyle}>
                                Expires on: 24 Mar, 2024
                            </p>
                        </div>
                    </div>

                    <div
                        style={{
                            background: 'rgba(43, 45, 49, 1)',
                            borderRadius: 8,
                            border: '1px solid rgba(73, 73, 73, 1)',
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden',
                            margin: '20px 15px 0px 0px',
                        }}
                    >
                        <div
                            style={{
                                padding: 10,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-evenly',
                                height: 520,
                                width: 320,
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                }}
                            >
                                <Image
                                    alt="editIconWhite"
                                    height={24}
                                    src="/editIconWhite.svg"
                                    width={24}
                                    style={{ marginRight: 10 }}
                                />
                                <div>
                                    <div
                                        className={
                                            styles.descriptionHeadingStyle
                                        }
                                    >
                                        Auto-buy quota increase
                                    </div>

                                    <div style={{ display: 'flex' }}>
                                        <div
                                            className={styles.descriptionStyle}
                                        >
                                            Automatically buy quota increases
                                            when the remaining usage quota is
                                            below a certain threshold.
                                        </div>
                                        <Switch
                                            defaultChecked
                                            onChange={onChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={styles.descriptionStyle}>
                                When remaining usage quota is below
                            </div>

                            <div className={styles.btnGradient}>
                                <Form
                                    autoComplete="false"
                                    style={{ marginBottom: -20 }}
                                >
                                    <Input
                                        className={styles.inputStyle}
                                        placeholder="0.0"
                                        suffix={
                                            <>
                                                <Image
                                                    alt="buttonEndPercentage"
                                                    height={50}
                                                    src="/buttonEndPercentage.svg"
                                                    style={{
                                                        position: 'absolute',
                                                        right: 0,
                                                        borderTopRightRadius: 8,
                                                        borderBottomRightRadius: 8,
                                                    }}
                                                    width={47}
                                                />
                                            </>
                                        }
                                        // value={filterData}
                                        // onChange={(e) => setFilterData(e.target.value)}
                                    />
                                </Form>
                            </div>
                            <div className={styles.descriptionStyle}>
                                Purchase this amount
                            </div>

                            <Form
                                autoComplete="false"
                                style={{ marginBottom: -20 }}
                            >
                                <Input
                                    className={styles.inputStyle}
                                    placeholder="0.0"
                                    suffix={
                                        <>
                                            <Image
                                                alt="buttonEndPercentage"
                                                height={50}
                                                src="/buttonEndPercentage.svg"
                                                style={{
                                                    position: 'absolute',
                                                    right: 0,
                                                    borderTopRightRadius: 8,
                                                    borderBottomRightRadius: 8,
                                                }}
                                                width={47}
                                            />
                                        </>
                                    }
                                    // value={filterData}
                                    // onChange={(e) => setFilterData(e.target.value)}
                                />
                            </Form>
                            <div className={styles.topParagraphStyle}>
                                Min $10 and max $1000
                            </div>

                            <div className={styles.descriptionStyle}>
                                The amount entered is approximately:
                            </div>
                            <div>
                                <div className={styles.descriptionStyle}>
                                    <Image
                                        alt="tick"
                                        height={12}
                                        src="/tick.svg"
                                        width={12}
                                        style={{ marginRight: 5 }}
                                    />
                                    200 words
                                </div>
                                <div className={styles.descriptionStyle}>
                                    <Image
                                        alt="tick"
                                        height={12}
                                        src="/tick.svg"
                                        width={12}
                                        style={{ marginRight: 5 }}
                                    />
                                    16 images
                                </div>
                                <div className={styles.descriptionStyle}>
                                    <Image
                                        alt="tick"
                                        height={12}
                                        src="/tick.svg"
                                        width={12}
                                        style={{ marginRight: 5 }}
                                    />
                                    2 videos
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            background: 'rgba(43, 45, 49, 1)',
                            borderRadius: 8,
                            border: '1px solid rgba(73, 73, 73, 1)',
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden',
                            margin: '20px 15px 0px 0px',
                        }}
                    >
                        <div
                            style={{
                                padding: 10,
                                paddingTop: 20,
                                paddingBottom: 20,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 520,
                                width: 320,
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                }}
                            >
                                <Image
                                    alt="editIconWhite"
                                    height={24}
                                    src="/editIconWhite.svg"
                                    width={24}
                                    style={{ marginRight: 10 }}
                                />
                                <div>
                                    <div
                                        className={
                                            styles.descriptionHeadingStyle
                                        }
                                    >
                                        Auto-buy quota increase
                                    </div>

                                    <div style={{ display: 'flex' }}>
                                        <div
                                            className={styles.descriptionStyle}
                                        >
                                            Automatically buy quota increases
                                            when the remaining usage quota is
                                            below a certain threshold.
                                        </div>
                                        <Switch
                                            defaultChecked
                                            onChange={onChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div
                                className={styles.descriptionHeadingStyle}
                                style={{ marginTop: 20 }}
                            >
                                Set threshold alert
                            </div>
                            <Form
                                autoComplete="false"
                                style={{ marginBottom: -20 }}
                            >
                                <Input
                                    className={styles.answersInputField}
                                    // className={styles.inputStyle}
                                    placeholder="0.0"
                                    suffix={
                                        <>
                                            <Image
                                                alt="buttonEndPercentage"
                                                height={50}
                                                src="/buttonEndPercentage.svg"
                                                style={{
                                                    position: 'absolute',
                                                    right: 0,
                                                    borderTopRightRadius: 8,
                                                    borderBottomRightRadius: 8,
                                                }}
                                                width={47}
                                            />
                                        </>
                                    }
                                    value={inputValues}
                                    onChange={(e) =>
                                        setInputValues(e.target.value)
                                    }
                                />
                            </Form>
                            <div
                                className={styles.descriptionHeadingStyle}
                                onClick={() => saveThisAlert()}
                            >
                                + Add
                            </div>
                            {arrayInputValues.length > 0 ? (
                                <>
                                    <div
                                        className={
                                            styles.descriptionHeadingStyle
                                        }
                                    >
                                        Alerts
                                    </div>
                                    {arrayInputValues.map((value, index) => (
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                width: '100%',
                                                border: '0.6px solid rgba(63, 65, 71, 1)',
                                                background: 'transparent',
                                                height: 44,
                                                borderRadius: 8,
                                                alignItems: 'center',
                                                paddingLeft: 10,
                                                overflow: 'hidden',
                                                marginTop: 15,
                                            }}
                                            key={index}
                                        >
                                            <div
                                                className={
                                                    styles.descriptionHeadingStyle
                                                }
                                            >
                                                {value}
                                            </div>
                                            <div
                                                style={{
                                                    width: '44px',
                                                    height: '44px',
                                                    background:
                                                        'rgba(49, 51, 56, 1)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Image
                                                    alt="tick"
                                                    height={18}
                                                    src="/deleteIconChat.svg"
                                                    width={18}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : null}
                        </div>
                    </div> */}
                </div>
            </div>
        </>
    );
};

export default Usage;
