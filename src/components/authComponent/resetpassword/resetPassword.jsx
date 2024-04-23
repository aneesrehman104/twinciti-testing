'use client';
import React, { useState } from 'react';
import { Form, message } from 'antd';
import dynamic from 'next/dynamic';
import styles from './resetPassword.module.css';
import { patchApiWithoutAuth } from '../../../utils/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { URLs } from '../../../utils/apiUrl';
import TwincitiInput from '../../common/twincitiInput/page';
import TwincitiButton from '../../common/twincitiButton/page';

const ResetPassword = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [data, setData] = useState({
        password: '',
        confirm_password: '',
    });
    const [buttonSpinner, setButtonSpinner] = useState(false);
    const [buttonDisable, setButtonDisable] = useState(false);

    const token = searchParams.get('token');
    const onChangeHandle = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };

    const signupSubmit = async () => {
        setButtonSpinner(true);
        setButtonDisable(true);
        const response = await patchApiWithoutAuth(
            `${URLs.ApiForgotPassword}?token=${token}`,
            data,
        );
        if (response.success) {
            message.success(`${response.data}`);
            setButtonSpinner(false);
            setButtonDisable(false);
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
        <div className={styles.mainLogin}>
            <div className="innerWidth">
                <div className="authHeading "> Create New Password</div>
                <p className="authSubheading mt-3">
                    New password must be different from your old password.
                </p>
                <Form
                    initialValues={{ remember: true }}
                    labelCol={{ span: 24 }}
                    layout="vertical"
                    name="forgot-form"
                    onFinish={signupSubmit}
                    wrapperCol={{ span: 24 }}
                >
                    <TwincitiInput
                        name="password"
                        onChange={onChangeHandle}
                        placeholder="Enter password"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter your Password!',
                            },
                            {
                                pattern: new RegExp(
                                    /^(?=.*\d)(?=.*?[@$!%*#?&^_.,-])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                                ),
                                message:
                                    'Must contain Number , Special Character , upper case letter,\n lower case letter, min length 8!',
                            },
                        ]}
                        type="password"
                        value={data.password}
                    />
                    <TwincitiInput
                        dependencies={['password']}
                        name="confirm_password"
                        onChange={onChangeHandle}
                        placeholder="Enter Confirm password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input confirm password!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (
                                        !value ||
                                        getFieldValue('password') === value
                                    ) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error(
                                            'The two passwords that you entered do not match!',
                                        ),
                                    );
                                },
                            }),
                        ]}
                        type="password"
                        value={data.confirm_password}
                    />

                    <Form.Item>
                        <TwincitiButton
                            disabled={buttonDisable}
                            htmlType="submit"
                            label={'Update Password'}
                            loading={buttonSpinner}
                            type="primary"
                        />
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default ResetPassword;
