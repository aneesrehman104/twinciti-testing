import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, message, Switch, Input, Modal } from 'antd';
import { ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import {
    getApiWithAuth,
    deleteApiWithAuth,
    patchApiWithAuth,
    postApiWithAuth,
} from '../../utils/api';
import { URLs } from '../../utils/apiUrl';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Badge, Divider, Dropdown, Menu, Progress, Space, Table } from 'antd';
import styles from './Usage.module.css';
import ButtonComponent from '../../components/common/button/Button';
import { CloseCircleOutlined } from '@ant-design/icons';

const Usage = () => {
    const router = useRouter();
    const [form] = Form.useForm();
    const [myCurrentPlan, setMyCurrentPlan] = useState({});
    const [inputValues, setInputValues] = useState('');
    const [arrayInputValues, setArrayInputValues] = useState([]);
    const [userPaid, setUserPaid] = useState(false);
    const [spinner, setSpinner] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [spinnerCancel, setSpinnerCancel] = useState(false);
    const [quotaEnable, setQuotaEnable] = useState(false);
    const [thresholdEnable, setThresholdEnable] = useState(false);
    const [planDetails, setPlanDetails] = useState({});

    useEffect(() => {
        fetchCurrectPlan();
    }, []);
    const fetchThresholdData = async () => {
        setSpinner(true);
        const res = await getApiWithAuth(`${URLs.PLAN_DETAILS}`);
        if (res.data.success) {
            setPlanDetails(res.data.data);
            setQuotaEnable(res.data.data?.autoBuy?.status);
            setThresholdEnable(res.data.data?.alertDetails?.alertEmailStatus);
            setArrayInputValues(res.data.data?.alertDetails?.alerts);

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
    useEffect(() => {
        quotaEnableFunction();
    }, [quotaEnable]);
    const quotaEnableFunction = async () => {
        const res = await patchApiWithAuth(
            `${URLs.LIMITS_STATUS}?status=${quotaEnable}`,
        );
    };

    useEffect(() => {
        thresholdEnableFunction();
    }, [thresholdEnable]);
    const thresholdEnableFunction = async () => {
        const res = await patchApiWithAuth(
            `${URLs.LIMITS_STATUS}?status=${thresholdEnable}`,
        );
    };
    const fetchCurrectPlan = async () => {
        setSpinner(true);
        const res = await getApiWithAuth(`${URLs.SUBSCRIPTION}`);
        if (res.data.success) {
            if (res.data.data.is_paid) {
                setUserPaid(true);
                setMyCurrentPlan(res.data.data);
                if (res.data.data.userSubscription?.subscription_code === 3) {
                    fetchThresholdData();
                }
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

    const cancelMySubscription = async () => {
        setSpinnerCancel(true);
        const res = await deleteApiWithAuth(
            `${URLs.CANCEL_MY_PLAN}/${myCurrentPlan?.userSubscription?.id}`,
        );
        if (res.success) {
            setSpinnerCancel(false);
            setShowCancelModal(false);
            fetchCurrectPlan();
        } else {
            setSpinnerCancel(false);
            message.open({
                type: 'error',
                content: `${res.data.message}`,
                duration: 2,
            });
        }
    };

    const saveThisAlert = async () => {
        if (inputValues !== '') {
            const res = await postApiWithAuth(`${URLs.ThresholdAdded}`, {
                alertValue: inputValues,
            });
            if (res.success) {
                message.open({
                    type: 'success',
                    content: `${res.data}`,
                    duration: 2,
                });
                setArrayInputValues([...arrayInputValues, inputValues]);
                setInputValues('');
            } else {
                message.open({
                    type: 'error',
                    content: `${res.message}`,
                    duration: 2,
                });
            }
        }
    };
    const deleteThisAlert = async (value) => {
        const res = await deleteApiWithAuth(`${URLs.ThresholdAdded}/${value}`);
        if (res.success) {
            fetchThresholdData();
            message.open({
                type: 'success',
                content: `${res.message}`,
                duration: 2,
            });
        } else {
            message.open({
                type: 'error',
                content: `${res.message}`,
                duration: 2,
            });
        }
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
                className="usagePage"
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
                        <>
                            <div className={styles.btnGradient}>
                                <div
                                    style={{
                                        width: '100%',
                                    }}
                                >
                                    <div className={styles.headingStyle}>
                                        {myCurrentPlan?.userSubscription?.name}
                                    </div>
                                    <div className={styles.boldHeadingStyle}>
                                        <span style={{ marginRight: 10 }}>
                                            $
                                        </span>
                                        <span className={styles.headingStyle}>
                                            {
                                                myCurrentPlan?.userSubscription
                                                    ?.price
                                            }
                                        </span>
                                        &nbsp;
                                        <sub
                                            className={styles.topParagraphStyle}
                                        >
                                            Per month
                                        </sub>
                                    </div>
                                    <div>
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                flexWrap: 'wrap',
                                                marginTop: 10,
                                            }}
                                        >
                                            <p className={styles.expireStyle}>
                                                Expires on: 24 Mar, 2024
                                            </p>
                                            <p
                                                className={
                                                    styles.remianingStyle
                                                }
                                            >
                                                {
                                                    myCurrentPlan.usage
                                                        .quotaRemaining
                                                }
                                                % Remaining
                                            </p>
                                        </div>

                                        <Progress
                                            percent={
                                                myCurrentPlan.usage
                                                    .quotaRemaining - 100
                                            }
                                            showInfo={false}
                                            strokeColor="rgba(240, 79, 79, 1)"
                                            trailColor="rgba(217, 217, 217, 1)"
                                        />
                                    </div>
                                    <div
                                        className={
                                            styles.descriptionStyleActive
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
                                    <Progress
                                        percent={
                                            myCurrentPlan.usage.usageRemaining
                                                .text - 1000
                                        }
                                        showInfo={false}
                                        strokeColor="rgba(171, 105, 255, 1)"
                                        trailColor="rgba(217, 217, 217, 1)"
                                    />
                                    <div
                                        className={
                                            styles.descriptionStyleActive
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
                                    <Progress
                                        percent={
                                            myCurrentPlan.usage.usageRemaining
                                                .img - 12
                                        }
                                        showInfo={false}
                                        strokeColor="rgba(171, 105, 255, 1)"
                                        trailColor="rgba(217, 217, 217, 1)"
                                    />
                                    <div
                                        className={
                                            styles.descriptionStyleActive
                                        }
                                    >
                                        <Image
                                            alt="tick"
                                            height={12}
                                            src="/tick.svg"
                                            width={12}
                                            style={{ marginRight: 5 }}
                                        />
                                        2 vedios per month
                                    </div>
                                    <Progress
                                        percent={
                                            myCurrentPlan.usage.usageRemaining
                                                .img - 2
                                        }
                                        showInfo={false}
                                        strokeColor="rgba(171, 105, 255, 1)"
                                        trailColor="rgba(217, 217, 217, 1)"
                                    />
                                    <div
                                        className={
                                            styles.descriptionStyleActive
                                        }
                                    >
                                        <Image
                                            alt="tick"
                                            height={12}
                                            src="/tick.svg"
                                            width={12}
                                            style={{ marginRight: 5 }}
                                        />
                                        Custom threshold alerts
                                    </div>
                                    <div
                                        className={
                                            styles.descriptionStyleActive
                                        }
                                    >
                                        <Image
                                            alt="tick"
                                            height={12}
                                            src="/tick.svg"
                                            width={12}
                                            style={{ marginRight: 5 }}
                                        />
                                        Automatically buy quota increases
                                        (optional)
                                    </div>

                                    <ButtonComponent
                                        variant="activeBorderRed"
                                        height="44px"
                                        label={'Cancel Subscription'}
                                        onClick={() => setShowCancelModal(true)}
                                    />
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
                                                    quotaEnable
                                                        ? styles.descriptionHeadingStyleInactive
                                                        : styles.descriptionHeadingStyleBlur
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
                                                        quotaEnable
                                                            ? styles.descriptionStyleInactive
                                                            : styles.descriptionStyleBlue
                                                    }
                                                >
                                                    Automatically buy quota
                                                    increases when the remaining
                                                    usage quota is below a
                                                    certain threshold.
                                                </div>
                                                <Switch
                                                    style={{ marginTop: 10 }}
                                                    value={quotaEnable}
                                                    onChange={(checked) => {
                                                        myCurrentPlan
                                                            ?.userSubscription
                                                            ?.subscription_code ===
                                                        3
                                                            ? setQuotaEnable(
                                                                  checked,
                                                              )
                                                            : null;
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className={
                                            quotaEnable
                                                ? styles.descriptionStyleInactive
                                                : styles.descriptionStyleBlue
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
                                            disabled={
                                                myCurrentPlan?.userSubscription
                                                    ?.subscription_code !== 3
                                            }
                                            value={planDetails?.autoBuy?.limit}
                                        />
                                    </Form>
                                    <div
                                        className={
                                            quotaEnable
                                                ? styles.descriptionStyleInactive
                                                : styles.descriptionStyleBlue
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
                                            disabled={
                                                myCurrentPlan?.userSubscription
                                                    ?.subscription_code !== 3
                                            }
                                            value={planDetails?.autoBuy?.amount}
                                        />
                                    </Form>
                                    <div className={styles.topParagraphStyle}>
                                        Min $10 and max $1000
                                    </div>

                                    <div
                                        className={
                                            quotaEnable
                                                ? styles.descriptionStyleInactive
                                                : styles.descriptionStyleBlue
                                        }
                                    >
                                        The amount entered is approximately:
                                    </div>
                                    <div className={styles.backGroundAdded}>
                                        <div
                                            className={
                                                quotaEnable
                                                    ? styles.descriptionStyleInactive
                                                    : styles.descriptionStyleBlue
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
                                                quotaEnable
                                                    ? styles.descriptionStyleInactive
                                                    : styles.descriptionStyleBlue
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
                                                quotaEnable
                                                    ? styles.descriptionStyleInactive
                                                    : styles.descriptionStyleBlue
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
                                                    thresholdEnable
                                                        ? styles.descriptionHeadingStyleInactive
                                                        : styles.descriptionHeadingStyleBlur
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
                                                        thresholdEnable
                                                            ? styles.descriptionStyleInactive
                                                            : styles.descriptionStyleBlue
                                                    }
                                                >
                                                    Be alerted when your usage
                                                    quota drops below a certain
                                                    threshold.
                                                </div>
                                                <Switch
                                                    style={{ marginTop: 10 }}
                                                    value={thresholdEnable}
                                                    onChange={(checked) => {
                                                        myCurrentPlan
                                                            ?.userSubscription
                                                            ?.subscription_code ===
                                                        3
                                                            ? setThresholdEnable(
                                                                  checked,
                                                              )
                                                            : null;
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className={
                                            thresholdEnable
                                                ? styles.descriptionStyleInactive
                                                : styles.descriptionStyleBlue
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
                                            disabled={
                                                myCurrentPlan?.userSubscription
                                                    ?.subscription_code !== 3
                                            }
                                            value={inputValues}
                                            onChange={(e) =>
                                                setInputValues(e.target.value)
                                            }
                                        />
                                    </Form>
                                    <div
                                        className={
                                            styles.descriptionHeadingStylePerpule
                                        }
                                        onClick={
                                            myCurrentPlan?.userSubscription
                                                ?.subscription_code !== 3
                                                ? () => {}
                                                : () => saveThisAlert()
                                        }
                                    >
                                        + Add
                                    </div>

                                    {arrayInputValues.length > 0 ? (
                                        <>
                                            <div
                                                className={
                                                    thresholdEnable
                                                        ? styles.descriptionStyleInactive
                                                        : styles.descriptionStyleBlue
                                                }
                                            >
                                                Alerts
                                            </div>
                                            {arrayInputValues.map(
                                                (value, index) => (
                                                    <Input
                                                        key={index}
                                                        className={
                                                            styles.inputStyle
                                                        }
                                                        style={{
                                                            marginTop: 10,
                                                        }}
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
                                                                        cursor: 'pointer',
                                                                    }}
                                                                    onClick={() =>
                                                                        deleteThisAlert(
                                                                            value,
                                                                        )
                                                                    }
                                                                    width={47}
                                                                />
                                                            </>
                                                        }
                                                        value={`${value}%`}
                                                        disabled={
                                                            myCurrentPlan
                                                                ?.userSubscription
                                                                ?.subscription_code !==
                                                            3
                                                        }
                                                        // onChange={(e) => setFilterData(e.target.value)}
                                                    />
                                                ),
                                            )}
                                        </>
                                    ) : null}

                                    {/* <Form autoComplete="false">
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
                                            disabled={
                                                myCurrentPlan?.userSubscription
                                                    ?.subscription_code !== 3
                                            }
                                            // onChange={(e) => setFilterData(e.target.value)}
                                        />
                                    </Form> */}
                                </div>
                            </div>
                        </>
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
                                                    value={true}
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
                    <span className={styles.warningNote}>
                        * Quota limits are estimates and can vary based on
                        several factors including the models you use.
                    </span>
                </div>
                <Modal
                    onCancel={() => setShowCancelModal(false)}
                    open={showCancelModal}
                    width={400}
                    closeIcon={null}
                    footer={null}
                >
                    <div>
                        <div className={styles.modelHeading}>
                            Cancel subscription?
                        </div>
                        <div className={styles.modelDescription}>
                            Are you sure you want to cancel the subscription
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                marginTop: 20,
                            }}
                        >
                            <div style={{ marginRight: 20 }}>
                                <ButtonComponent
                                    variant="activeBorderCancel"
                                    height="44px"
                                    label={'Cancel'}
                                    onClick={() => setShowCancelModal(false)}
                                />
                            </div>
                            <ButtonComponent
                                variant="activeBorderConfirm"
                                height="44px"
                                label={'Confirm'}
                                onClick={() => cancelMySubscription()}
                            />
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    );
};

export default Usage;
