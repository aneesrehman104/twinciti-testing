'use client';
import React, { useEffect, useState } from 'react';
import { Checkbox, Form, message } from 'antd';
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';
import { useDispatch } from 'react-redux';

import {
    getApiWithAuth,
    patchApiWithAuth,
    postApiWithAuth,
    postApiWithoutAuth,
} from '../../utils/api';
import { URLs } from '../../utils/apiUrl';
import { loginUser } from '../../states/user/userSlice';
import TwincitiInput from '../../components/common/twincitiInput/page';
import TwincitiButton from '../../components/common/twincitiButton/page';
import CustomModal from '../../components/common/modal/page';
import styles from './signUp.module.css';
import Image from 'next/image';

const SignUp = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    const [data, setData] = useState([]);
    const [detailData, setDetailData] = useState([]);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [buttonSpinner, setButtonSpinner] = useState(false);
    const [buttonDisable, setButtonDisable] = useState(false);
    const [agree, setAgree] = useState(false);
    const [verifyPhoneVisible, setVerifyPhoneVisible] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpSentEmail, setOtpSentEmail] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(60);
    const [timerRunning, setTimerRunning] = useState(false);

    const queryParams = new URLSearchParams({
        code: otp,
    });

    const url = `${URLs.VERIFY_EMAIL}?${queryParams}`;

    const onChangeHandleSubmit = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };

    const onChangeHandleDetailsSubmit = (e) => {
        const { name, value } = e.target;
        setDetailData({ ...detailData, [name]: value });
    };

    const handlePhoneNumberChange = (value, country) => {
        setPhoneNumber('+' + value);
        setCountryCode(country.dialCode);
    };
    const handleFinish = (values) => {
        setOtp(values);
    };

    const onAgreeChange = (e) => {
        setAgree(e.target.checked);
    };

    const sendOtp = async () => {
        resetTimer();
        setButtonDisable(true);
        const response = await postApiWithAuth(URLs.SMS_VERIFICATION, {
            phone: phoneNumber,
        });
        if (response.success) {
            setVerifyPhoneVisible(false);
            setOtpSent(true);
            startTimer();
        } else {
            setButtonSpinner(false);
            setTimeout(() => {
                setButtonDisable(false);
            }, 3000);
            message.open({
                type: 'error',
                content: `${response.message}`,
                duration: 2,
            });
        }
    };

    const sendOtpEmail = async () => {
        resetTimer();
        const response = await getApiWithAuth(URLs.EMAIL_VERIFICATION);
        if (response.success) {
            setOtpSentEmail(false);
            startTimer();
        } else {
            setButtonSpinner(false);
            setTimeout(() => {
                setButtonDisable(false);
            }, 3000);
            message.open({
                type: 'error',
                content: `${response.message}`,
                duration: 2,
            });
        }
    };

    const startTimer = () => {
        setTimerRunning(true);
    };

    const resetTimer = () => {
        setTimerRunning(false);
    };

    const handleOtp = async () => {
        setVerifyPhoneVisible(false);
        const response = await postApiWithAuth(URLs.VERIFY_PHONE, {
            phone: phoneNumber,
            code: otp,
            countryCode,
        });
        if (response.success) {
            setOtpSentEmail(true);
            setIsVisible(true);
            startTimer();
        } else {
            setOtpSent(true);
            setButtonSpinner(false);
            setTimeout(() => {
                setButtonDisable(false);
            }, 3000);
            message.open({
                type: 'error',
                content: `${response.message}`,
                duration: 2,
            });
        }
    };
    const handleOtpEmail = async () => {
        const response = await getApiWithAuth(url);
        setOtpSentEmail(false);
        startTimer();
        if (response.data.success) {
            setVerifyPhoneVisible(true);
            setOtpSentEmail(false);
        } else {
            setOtpSentEmail(true);
            setButtonSpinner(false);
            setTimeout(() => {
                setButtonDisable(false);
            }, 3000);
            message.open({
                type: 'error',
                content: `${response.message}`,
                duration: 2,
            });
        }
    };

    const onModalVisible = () => {
        setVerifyPhoneVisible(true);
        setIsModalVisible(true);
    };

    const onEmailModalVisible = () => {
        setIsModalVisible(true);
    };

    const signUpSubmit = async () => {
        setButtonSpinner(true);
        setButtonDisable(true);
        if (!agree) {
            message.open({
                type: 'warning',
                content: 'Please accept the terms and conditions to sign up.',
                duration: 1.5,
            });
            setTimeout(() => {
                setButtonSpinner(false);
                setButtonDisable(false);
            }, 2000);
            return;
        }
        const searchParams1 = new URLSearchParams(window.location.search);
        const refCode = searchParams1.get('code');
        const response = await postApiWithoutAuth(URLs.ApiSignUp, {
            ...data,
            rf_code: refCode,
        });
        if (response.success) {
            setCookie('accessToken', response.data.access_token);
            setCookie('user', response.data.user_details);
            dispatch(loginUser(response.data.user_details));
            setButtonDisable(false);
            setButtonSpinner(false);
            sendOtpEmail();
            setOtpSentEmail(true);
            setIsModalVisible(true);
        } else {
            setButtonSpinner(false);
            setTimeout(() => {
                setButtonDisable(false);
            }, 3000);
            message.open({
                type: 'error',
                content: `${response.message}`,
                duration: 2,
            });
        }
    };

    const signUpDetailSubmit = async () => {
        setButtonSpinner(true);
        setButtonDisable(true);
        const response = await patchApiWithAuth(URLs.meApi, {
            ...data,
            ...detailData,
        });
        if (response.success) {
            setButtonSpinner(false);
            setButtonDisable(false);
            setCookie('user', response.data.user_details);
            dispatch(loginUser(response.data.user_details));
            router.push('/');
        } else {
            setButtonSpinner(false);
            setTimeout(() => {
                setButtonDisable(false);
            }, 3000);
            message.open({
                type: 'error',
                content: `${response.message}`,
                duration: 2,
            });
        }
    };

    useEffect(() => {
        console.log(timerRunning);
        let interval;
        if (timerRunning) {
            interval = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer === 1) {
                        clearInterval(interval);
                        setTimerRunning(false);
                    }
                    return prevTimer - 1;
                });
            }, 1000);
        } else {
            clearInterval(interval);
            setTimer(60);
        }
        return () => clearInterval(interval);
    }, [timerRunning]);
    return (
        <>
            <div className={styles.mainWrapperBody}>
                {!isModalVisible && (
                    <div className={styles.mainLogin}>
                        <h4>Create your account</h4>
                        <Form
                            initialValues={{ remember: true }}
                            labelCol={{ span: 24 }}
                            layout="vertical"
                            name="signUp-form"
                            onFinish={signUpSubmit}
                            wrapperCol={{ span: 24 }}
                        >
                            <TwincitiInput
                                name="email"
                                label="Email"
                                onChange={onChangeHandleSubmit}
                                placeholder="Enter email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter your Email!',
                                    },
                                    {
                                        pattern: new RegExp(
                                            /^(?!\s)([+\w-]+(?:\.[+\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-zA-Z]{2,6}(?:\.[a-zA-Z]{2})?)$/,
                                        ),
                                        message:
                                            'Please enter valid Email Address!',
                                    },
                                ]}
                                type="text"
                                value={data.email}
                            />

                            <TwincitiInput
                                name="password"
                                label="Password"
                                onChange={onChangeHandleSubmit}
                                placeholder="Enter password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter your Password!',
                                    },
                                ]}
                                type="password"
                                value={data.password}
                            />

                            <div className={styles.conditionWrap}>
                                <span>
                                    <Image
                                        alt="vector"
                                        height={12}
                                        src="/tick.svg"
                                        width={12}
                                        style={{ marginLeft: 5 }}
                                    />
                                    <path
                                        d="M0.799988 5.5999L4.39999 9.1999L11.2 2.3999"
                                        stroke="#58D8A4"
                                        strokeLinecap="square"
                                    />
                                    Must contain 8 digits
                                </span>
                                <div className={styles.termsWrap}>
                                    <Form.Item
                                        name="agree"
                                        valuePropName="checked"
                                    >
                                        <Checkbox
                                            name="agree"
                                            onChange={onAgreeChange}
                                        />
                                    </Form.Item>

                                    <label>
                                        I agree to{' '}
                                        <a href="">Terms & Conditions</a>
                                    </label>
                                </div>
                            </div>

                            <TwincitiButton
                                disabled={buttonDisable}
                                htmlType="submit"
                                label="SignUp"
                                className={styles.btnLogin}
                                loading={buttonSpinner}
                                onClick={onChangeHandleSubmit}
                                RightImage={
                                    <Image
                                        alt="vector"
                                        height={20}
                                        src="/vector.svg"
                                        width={20}
                                        style={{ marginLeft: 5 }}
                                    />
                                }
                            />
                            <p className={styles.linkBtn}>
                                Already have an account?
                                <a
                                    className={styles.signUpLink}
                                    onClick={() => router.push('/login')}
                                >
                                    Login
                                </a>
                            </p>
                        </Form>
                    </div>
                )}
                {isVisible && (
                    <div className={styles.mainLogin}>
                        <h4>Almost there..!</h4>

                        <div className={styles.moreDetailWrapper}>
                            <Form
                                initialValues={{ remember: true }}
                                labelCol={{ span: 24 }}
                                layout="vertical"
                                name="signUpDetail-form"
                                onFinish={signUpDetailSubmit}
                                wrapperCol={{ span: 24 }}
                            >
                                <div className="inputMainWrap">
                                    <TwincitiInput
                                        name="firstName"
                                        label="Full Name"
                                        onChange={onChangeHandleDetailsSubmit}
                                        placeholder="First Name"
                                        type="text"
                                        value={detailData.firstName}
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Please enter full name',
                                            },
                                        ]}
                                    />
                                    <TwincitiInput
                                        name="lastName"
                                        label={null}
                                        onChange={onChangeHandleDetailsSubmit}
                                        placeholder="Last Name"
                                        type="text"
                                        value={detailData.lastName}
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Please enter last name',
                                            },
                                        ]}
                                    />
                                </div>
                                <TwincitiInput
                                    name="dob"
                                    label="What year were you born?"
                                    onChange={onChangeHandleDetailsSubmit}
                                    placeholder="YYYY"
                                    type="Number"
                                    value={detailData.dob}
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Please enter your birth year',
                                        },
                                    ]}
                                />
                                <TwincitiInput
                                    name="textarea"
                                    label="What do you plan on using Twinciti for? (optional)"
                                    onChange={onChangeHandleDetailsSubmit}
                                    placeholder="Enter your answer.."
                                    type="TextArea"
                                    value={detailData.textarea}
                                />
                                <TwincitiButton
                                    disabled={buttonDisable}
                                    htmlType="submit"
                                    label="Continue"
                                    loading={buttonSpinner}
                                    onClick={() => {}}
                                />
                            </Form>
                        </div>
                    </div>
                )}
                <CustomModal
                    width={'560px'}
                    className={styles.mainModalGroup}
                    footer={null}
                    onClose={() => {
                        setVerifyPhoneVisible(false);
                        setIsVisible(true);
                    }}
                    modal
                    visible={verifyPhoneVisible}
                    modalWidth={'100%'}
                    title={
                        <h4
                            style={{
                                margin: '-28px 0 18px',
                                textAlign: 'left',
                            }}
                        >
                            Add phone number
                        </h4>
                    }
                >
                    <div className={styles.modalMainWrapper}>
                        <Form
                            initialValues={{ remember: true }}
                            labelCol={{ span: 24 }}
                            layout="vertical"
                            name="verification-phone"
                            onFinish={sendOtp}
                            wrapperCol={{ span: 24 }}
                        >
                            <div className={styles.phInputWrap}>
                                <TwincitiInput
                                    type="phoneNumber"
                                    label="Phone Number"
                                    placeholder="234 567 8900"
                                    value={phoneNumber}
                                    onChange={handlePhoneNumberChange}
                                    required
                                />
                                <TwincitiInput
                                    name="Referral code"
                                    label="Referral code (Optional)"
                                    onChange={() => {}}
                                    placeholder="XYE565SDX667"
                                    rules={[
                                        {
                                            required: false,
                                        },
                                    ]}
                                    type="text"
                                    value={data.password}
                                />
                            </div>
                            <div className={styles.btnWrap}>
                                <TwincitiButton
                                    disabled={buttonDisable}
                                    htmlType="submit"
                                    label="Sent code"
                                    className={styles.btnLogin}
                                    loading={buttonSpinner}
                                    onClick={() => {}}
                                />
                            </div>
                        </Form>
                    </div>
                </CustomModal>
                <CustomModal
                    width={'440px'}
                    className={styles.mainModalGroup}
                    footer={null}
                    onClose={() => {
                        setOtpSent(false);
                        setIsModalVisible(true);
                    }}
                    modal
                    visible={otpSent}
                    modalWidth={'100%'}
                    title={
                        <h4
                            style={{
                                margin: '-28px 0 18px',
                                textAlign: 'left',
                            }}
                        >
                            Verify phone number
                        </h4>
                    }
                >
                    <div className={styles.modalMainWrapper}>
                        <p className={styles.textTitle}>
                            A 6 digits Code has been sent to your phone number
                            +123 ******987 Change
                            <span>
                                <a href="#">Change</a>
                            </span>
                        </p>
                        <Form
                            initialValues={{ remember: true }}
                            labelCol={{ span: 24 }}
                            layout="vertical"
                            name="otp-phone-verification"
                            wrapperCol={{ span: 24 }}
                            onFinish={handleOtp}
                        >
                            <div className={styles.otpWrapper}>
                                <TwincitiInput
                                    name="otp"
                                    onChange={handleFinish}
                                    placeholder="Enter your phone number"
                                    rules={[
                                        {
                                            validator: async () =>
                                                Promise.resolve(),
                                        },
                                    ]}
                                    type="OTP"
                                    value={data.password}
                                />
                            </div>

                            <div className={styles.btnWrap}>
                                <TwincitiButton
                                    disabled={buttonDisable}
                                    htmlType="submit"
                                    label="Verify Code"
                                    className={styles.btnLogin}
                                    loading={buttonSpinner}
                                    onClick={() => {
                                        setOtpSent(false);
                                    }}
                                />
                            </div>
                        </Form>
                        <div className={styles.timeSection}>
                            {timer !== 60 && (
                                <h2>{`00:${
                                    timer < 10 ? `0${timer}` : timer
                                }`}</h2>
                            )}

                            <p
                                onClick={sendOtp}
                                className="hover-pointer"
                                style={{
                                    color: timerRunning ? '#646268' : '#ab69ff',
                                    cursor: 'pointer',
                                }}
                            >
                                Resend
                            </p>
                        </div>
                    </div>
                </CustomModal>
                <CustomModal
                    width={'440px'}
                    className={styles.mainModalGroup}
                    footer={null}
                    onClose={() => {
                        setOtpSentEmail(false);
                        setIsVisible(true);
                    }}
                    visible={otpSentEmail}
                    modalWidth={'100%'}
                    title={
                        <h4
                            style={{
                                margin: '-28px 0 18px',
                                textAlign: 'left',
                            }}
                        >
                            Verify email code
                        </h4>
                    }
                >
                    <div className={styles.modalMainWrapper}>
                        <p className={styles.textTitle}>
                            A 6 digits Code has been sent to your email{' '}
                            {data.email
                                ? `${data.email.slice(
                                      0,
                                      4,
                                  )}******${data.email.slice(
                                      data.email.indexOf('@'),
                                  )}`
                                : ''}{' '}
                            Change
                        </p>

                        <Form
                            initialValues={{ remember: true }}
                            labelCol={{ span: 24 }}
                            layout="vertical"
                            name="otp-email-verification"
                            wrapperCol={{ span: 24 }}
                            onFinish={handleOtpEmail}
                        >
                            <div className={styles.otpWrapper}>
                                <TwincitiInput
                                    name="otp2"
                                    onChange={(value) => {
                                        setOtp(value);
                                    }}
                                    rules={[
                                        {
                                            validator: async () =>
                                                Promise.resolve(),
                                        },
                                    ]}
                                    type="OTP"
                                    value={data.password}
                                />
                            </div>

                            <div className={styles.btnWrap}>
                                <TwincitiButton
                                    disabled={buttonDisable}
                                    htmlType="submit"
                                    label="Verify Code"
                                    className={styles.btnLogin}
                                    loading={buttonSpinner}
                                    onClick={() => {}}
                                />
                            </div>
                        </Form>
                        <div className={styles.timeSection}>
                            {timer !== 60 && (
                                <h2>{`00:${
                                    timer < 10 ? `0${timer}` : timer
                                }`}</h2>
                            )}
                            {/* <p>
                                <a href="#">Change</a>
                            </p> */}
                            <p
                                onClick={!timerRunning ? sendOtpEmail : null}
                                className={`hover-pointer ${
                                    timerRunning ? styles.disabled : ''
                                }`}
                                style={{
                                    color: timerRunning ? '#646268' : '#ab69ff',
                                    cursor: timerRunning
                                        ? 'not-allowed'
                                        : 'pointer',
                                }}
                            >
                                Resend
                            </p>
                        </div>
                    </div>
                </CustomModal>
            </div>
        </>
    );
};

export default SignUp;
