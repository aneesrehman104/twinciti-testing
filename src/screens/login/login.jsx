'use client';
import React, { useState } from 'react';
import { Form, message } from 'antd';
import { postApiWithoutAuth } from '../../utils/api';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';

import { URLs } from '../../utils/apiUrl';
import { loginUser } from '../../states/user/userSlice';
import TwincitiInput from '../../components/common/twincitiInput/page';
import TwincitiButton from '../../components/common/twincitiButton/page';
import styles from './login.module.css';
import ForgotModal from '../../components/authComponent/fotgotPassword/forgotPassword';
import ResetPassword from '../../components/authComponent/resetpassword/resetPassword';

export default function Login() {
    const router = useRouter();
    const dispatch = useDispatch();

    const [data, setData] = useState([]);
    const [buttonSpinner, setButtonSpinner] = useState(false);
    const [buttonDisable, setButtonDisable] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [showLogin, setShowLogin] = useState(true);

    const onChangeHandle = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };

    const handleBackToLogin = () => {
        setShowLogin(true);
        setShowForgotPassword(false);
    };
    const loginSubmit = async () => {
        setButtonSpinner(true);
        setButtonDisable(true);
        const response = await postApiWithoutAuth(URLs.ApiLogin, data);
        if (response.success) {
            setCookie('accessToken', response.data.access_token);
            setCookie('user', response.data.user_details);
            dispatch(loginUser(response.data.user_details));

            message.open({
                type: 'success',
                content: 'Sign In Successfully',
                duration: 2,
            });
            setButtonDisable(false);
            setButtonSpinner(false);
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
    return (
        <div className={styles.mainWrapperBody}>
            {showLogin && (
                <>
                    <div className={styles.mainLogin}>
                        <h4>Login</h4>
                        <Form
                            initialValues={{ remember: true }}
                            labelCol={{ span: 24 }}
                            layout="vertical"
                            name="signin-form"
                            onFinish={loginSubmit}
                            wrapperCol={{ span: 24 }}
                        >
                            <TwincitiInput
                                name="email"
                                label="Email"
                                onChange={onChangeHandle}
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
                                            'Please enter Vaild Email Address!',
                                    },
                                ]}
                                type="text"
                                value={data.email}
                            />

                            <TwincitiInput
                                name="password"
                                label="Password"
                                onChange={onChangeHandle}
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
                            <div className={styles.linkWrapper}>
                                <div className={styles.checkLabel}>
                                    <input type="checkbox" />
                                    <label>Remember me</label>
                                </div>
                                {/* <a
                            className={styles.forgotPassword}
                            onClick={showForgotModal}
                        >
                            Forgot Password?
                        </a> */}
                                <div
                                    className={styles.forgotPassword}
                                    onClick={() => {
                                        setShowForgotPassword(true);
                                        setShowLogin(false);
                                    }}
                                >
                                    Forgot Password?
                                </div>
                            </div>

                            <TwincitiButton
                                disabled={buttonDisable}
                                htmlType="submit"
                                label="Login"
                                className={styles.btnLogin}
                                loading={buttonSpinner}
                            />
                            <p className={styles.linkBtn}>
                                Already have an account?
                                <a
                                    className={styles.signUpLink}
                                    onClick={() => router.push('/login')}
                                >
                                    Signup
                                </a>
                            </p>
                        </Form>
                    </div>
                </>
            )}
            {showForgotPassword && (
                <ForgotModal onBackToLogin={handleBackToLogin} />
                // <ResetPassword />
            )}
        </div>
    );
}
