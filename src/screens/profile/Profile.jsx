import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Col, Form, message, Popover, Row } from 'antd';
import styles from './Profile.module.css';
import Image from 'next/image';

import {
    getApiWithAuth,
    patchApiWithAuth,
    postApiWithAuth,
} from '../../utils/api';
import { URLs } from '../../utils/apiUrl';
import CustomModal from '../../components/common/modal/page';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../states/user/userSlice';
import { setCookie } from 'cookies-next';
import TwincitiInput from '../../components/common/twincitiInput/page';
import TwincitiButton from '../../components/common/twincitiButton/page';
import ChangePassword from '../../components/authComponent/changePassword/changePassword';

const Profile = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const profileData = useSelector((state) => state.user.userInfo);
    const [initialUserData, setInitialUserData] = useState({ ...profileData });
    const [userData, setUserData] = useState({
        ...profileData,
    });
    const [buttonSpinner, setButtonSpinner] = useState(false);
    const [buttonDisable, setButtonDisable] = useState(false);
    const [showUpdatePasswordModel, setShowUpdatePasswordModel] =
        useState(false);
    const [showEditButton, setShowEditButton] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(60);
    const [timerRunning, setTimerRunning] = useState(false);
    const [showOtpMethodModal, setShowOtpMethodModal] = useState(false);
    const [otpMethod, setOtpMethod] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('+917229030115');
    const [countryCode, setCountryCode] = useState('');
    const [isVerify, setIsVerify] = useState(false);
    const [isDisable, setIsDisable] = useState(true);
    const [data, setData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: '',
    });

    const queryParams = new URLSearchParams({
        code: otp,
    });

    const url = `${URLs.VERIFY_EMAIL}?${queryParams}`;
    const startTimer = () => {
        setTimerRunning(true);
    };

    const resetTimer = () => {
        setTimerRunning(false);
    };

    const handlePhoneNumberChange = (value, country) => {
        setPhoneNumber('+' + value);
        setCountryCode(country.dialCode);
        const formattedPhoneNumber = '+' + value;
        setUserData({
            ...userData,
            phone: formattedPhoneNumber,
        });
    };

    const sendOtp = async () => {
        setShowOtpMethodModal(false);
        resetTimer();
        setButtonDisable(true);
        const response = await postApiWithAuth(URLs.SMS_VERIFICATION, {
            phone: phoneNumber,
        });

        if (response.success) {
            startTimer();
            setOtpSent(true);
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

    const handleOtp = async () => {
        const response = await postApiWithAuth(URLs.VERIFY_PHONE, {
            phone: phoneNumber,
            code: otp,
            countryCode: countryCode,
        });
        if (response.success) {
            setOtpSent(false);
            setIsVerify(true);
            handleSaveData();
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
        setShowOtpMethodModal(false);
        const response = await getApiWithAuth(url);
        startTimer();
        if (response.data.success) {
            setOtpSent(false);
            handleSaveData();
            updatePasswordUser();
            setIsVerify(true);
        } else {
            setButtonSpinner(false);
            setTimeout(() => {
                setButtonDisable(false);
            }, 3000);
            message.open({
                type: 'error',
                content: `${response.data.message}`,
                duration: 2,
            });
        }
    };

    const sendOtpEmail = async () => {
        resetTimer();
        setButtonDisable(true);
        const response = await getApiWithAuth(URLs.EMAIL_VERIFICATION);
        if (response.data.success) {
            setOtpSent(true);
            startTimer();
            handleSaveData();
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

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };
    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        const base64 = await convertBase64(file);
        const sendFile = { profileImage: base64 };
        updateData(sendFile);
    };

    const handleCheckVerification = () => {
        setShowOtpMethodModal(true);
        setShowUpdatePasswordModel(false);
    };

    const handleSaveData = () => {
        if (userData.email !== profileData.email) {
            handleCheckVerification();
        } else if (phoneNumber !== profileData.phone && phoneNumber) {
            handleCheckVerification();
        } else {
            const updateUserData = {
                firstName: userData.firstName,
                lastName: userData.lastName,
                birthYear: userData.birthYear,
            };
            updateData(updateUserData);
        }
    };

    const updateData = async (data) => {
        setButtonSpinner(true);
        setButtonDisable(true);
        const response = await patchApiWithAuth(URLs.meApi, data);
        if (response.success) {
            setButtonSpinner(false);
            setButtonDisable(false);
            setShowUpdatePasswordModel(false);
            setCookie('user', response.data.user_details);
            dispatch(loginUser(response.data.user_details));
            message.open({
                type: 'success',
                content: 'Your Data has been updated successfully.',
                duration: 2,
            });
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

    const updatePasswordUser = async () => {
        setButtonSpinner(true);
        setButtonDisable(true);
        const response = await patchApiWithAuth(URLs.ApiUpdatePasswprd, data);
        if (response.success) {
            setButtonSpinner(false);
            setButtonDisable(false);
            setShowUpdatePasswordModel(false);
            setShowOtpMethodModal(true);
            message.open({
                type: 'success',
                content: 'Your password has been updated successfully.',
                duration: 2,
            });
            form.resetFields();
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
    const onChangeHandle = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };

    useEffect(() => {
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

    useEffect(() => {
        setInitialUserData({ ...profileData });
    }, [profileData, phoneNumber]);

    useEffect(() => {
        const hasChanges =
            userData.firstName !== initialUserData.firstName ||
            userData.lastName !== initialUserData.lastName ||
            userData.email !== initialUserData.email ||
            userData.phone !== initialUserData.phone;

        setIsDisable(!hasChanges);
    }, [userData, initialUserData]);
    return (
        <div className={styles.mainContainer}>
            <div className={styles.topHeadingSettingPage}>Profile Setting</div>
            <div className={styles.mainInnerStyle}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        margin: 20,
                    }}
                >
                    <div
                        onMouseEnter={(e) => setShowEditButton(true)}
                        onMouseLeave={(e) => setShowEditButton(false)}
                        className={styles.imgWrapper}
                    >
                        {showEditButton && (
                            <label htmlFor="fileUpload">
                                <Popover
                                    content="Edit"
                                    overlayInnerStyle={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                    }}
                                    placement="bottomRight"
                                    trigger="hover"
                                >
                                    <div className={styles.imgTag}>
                                        <Image
                                            alt="edit"
                                            height={26}
                                            src="/edit.svg"
                                            width={26}
                                        />
                                    </div>
                                </Popover>
                            </label>
                        )}
                        <input
                            id="fileUpload"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            type="file"
                        />

                        {profileData?.profileImage ? (
                            <>
                                <img
                                    alt="Profile"
                                    className="cardprofile"
                                    src={
                                        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRKgUUpHpc-JwcJiRLScAepL-T3oeaxR8T5A&s'
                                    }
                                    style={{
                                        borderRadius: '50%',
                                        width: '120px',
                                        height: '120px',
                                        cursor: 'pointer',
                                    }}
                                />
                            </>
                        ) : (
                            <>
                                {
                                    <Image
                                        alt="Profile"
                                        className="cardprofile"
                                        src={
                                            profileData?.profileImage
                                                ? profileData?.profileImage
                                                : '/camera.svg'
                                        }
                                        width={40}
                                        height={40}
                                    />
                                }
                                <div className={styles.textImg}>
                                    Upload Profile Picture
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className={styles.mainLogin}>
                    <Form onFinish={handleSaveData}>
                        <div className={styles.inputRowWrap}>
                            <TwincitiInput
                                onChange={(e) => {
                                    setUserData({
                                        ...userData,
                                        firstName: e.target.value,
                                    });
                                }}
                                placeholder="Enter First Name"
                                style={{ marginBottom: 0 }}
                                type="text"
                                value={userData.firstName}
                                label="First Name"
                            />
                            <TwincitiInput
                                onChange={(e) => {
                                    setUserData({
                                        ...userData,
                                        lastName: e.target.value,
                                    });
                                }}
                                placeholder="Enter Last name"
                                style={{ marginBottom: 0 }}
                                type="text"
                                value={userData.lastName}
                                label="Last Name"
                            />
                        </div>
                        <TwincitiInput
                            onChange={(e) => {
                                setUserData({
                                    ...userData,
                                    email: e.target.value,
                                });
                            }}
                            type="text"
                            label="Email"
                            placeholder="Enter email"
                            value={userData.email}
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
                        />

                        <div className={styles.phInputWrap}>
                            <TwincitiInput
                                type="phoneNumber"
                                label="Phone Number"
                                placeholder="+1 234 567890"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Enter your phone number',
                                    },
                                ]}
                                value={userData.phone}
                                onChange={handlePhoneNumberChange}
                                required
                            />
                        </div>

                        <TwincitiInput
                            onChange={(e) => {
                                setUserData({
                                    ...userData,
                                    password: e.target.value,
                                });
                            }}
                            style={{ marginBottom: 0 }}
                            type="text"
                            value="*********"
                            label="Password"
                            readOnly={true}
                            isEditing={true}
                            onClick={() => setShowUpdatePasswordModel(true)}
                        />
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'end',
                                marginTop: 10,
                            }}
                        >
                            <TwincitiButton
                                disabled={isDisable}
                                htmlType="submit"
                                label="Save Changes"
                                loading={buttonSpinner}
                                style={{ width: '140px' }}
                            />
                        </div>
                    </Form>
                </div>
            </div>
            {showUpdatePasswordModel && (
                <ChangePassword
                    buttonSpinner={buttonSpinner}
                    buttonDisable={buttonDisable}
                    data={data}
                    updatePasswordUser={handleCheckVerification}
                    onChangeHandle={onChangeHandle}
                    onClose={() => setShowUpdatePasswordModel(false)}
                    visible={showUpdatePasswordModel}
                    form={form}
                />
            )}

            <CustomModal
                width={'440px'}
                className={styles.mainModalGroup}
                footer={null}
                onClose={() => {
                    setOtpSent(false);
                }}
                modal
                visible={otpSent}
                modalWidth={'100%'}
                title={'Enter Code'}
            >
                <div className={styles.modalMainWrapper}>
                    {otpMethod === 'SMS' && (
                        <p className={styles.textTitle}>
                            A 6 digits Code has been sent to your phone number
                            +123 ******987 Change
                            <span>
                                <a href="#">Change</a>
                            </span>
                        </p>
                    )}
                    {otpMethod === 'Email' && (
                        <p className={styles.textTitle}>
                            A 6 digits Code has been sent to your email address
                            ****@example.com
                            <span>
                                <a href="#">Change</a>
                            </span>
                        </p>
                    )}
                    <Form
                        initialValues={{ remember: true }}
                        labelCol={{ span: 24 }}
                        layout="vertical"
                        name="otp-verification"
                        wrapperCol={{ span: 24 }}
                        onFinish={(values) => {
                            setOtp(values.otp);
                            if (otpMethod === 'SMS') {
                                handleOtp();
                            } else if (otpMethod === 'Email') {
                                handleOtpEmail();
                            }
                        }}
                    >
                        <div className={styles.otpWrapper}>
                            <TwincitiInput
                                name="otp"
                                onChange={() => {}}
                                rules={[
                                    {
                                        validator: async () =>
                                            Promise.resolve(),
                                    },
                                ]}
                                type="OTP"
                            />
                        </div>

                        <div className={styles.btnWrapEle}>
                            <TwincitiButton
                                // disabled={buttonDisable}
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
                    <div
                        className={styles.timeSection}
                        onClick={() => {
                            if (otpMethod === 'SMS') {
                                sendOtp();
                            } else if (otpMethod === 'Email') {
                                sendOtpEmail();
                            }
                        }}
                    >
                        <h2>{`00:${timer < 10 ? `0${timer}` : timer}`}</h2>
                        <p>
                            <a href="#">Change</a>
                        </p>
                    </div>
                </div>
            </CustomModal>
            <CustomModal
                width={'440px'}
                className={styles.mainModalGroup}
                footer={null}
                onClose={() => {
                    setOtpSent(false);
                    setShowOtpMethodModal(false);
                }}
                modal
                visible={showOtpMethodModal}
                modalWidth={'100%'}
                title={'Choose OTP Method'}
            >
                <div className={styles.wrapperModal}>
                    <div
                        className={styles.otpLinkShare}
                        onClick={() => {
                            setOtpMethod('SMS');
                            sendOtp();
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        <Image
                            alt="phone"
                            height={32}
                            src="/phone.svg"
                            width={32}
                        />
                        <div className={styles.linkWrp}>
                            <h5>SMS</h5>
                            <p>OTP will be sent to responded phone SMS</p>
                        </div>
                    </div>
                    <div
                        className={styles.otpLinkShare}
                        onClick={() => {
                            setOtpMethod('Email');
                            sendOtpEmail();
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        <Image
                            alt="email"
                            height={32}
                            src="/email.svg"
                            width={32}
                        />

                        <div className={styles.linkWrp}>
                            <h5>Email</h5>
                            <p>OTP will be sent to responded email</p>
                        </div>
                    </div>
                </div>
            </CustomModal>
        </div>
    );
};

export default Profile;
