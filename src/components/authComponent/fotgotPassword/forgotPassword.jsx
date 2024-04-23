'use client';
import React, { useState } from 'react';
import { Form, message } from 'antd';
import { postApiWithoutAuth } from '../../../utils/api';
import { URLs } from '../../../utils/apiUrl';
import TwincitiInput from '../../common/twincitiInput/page';
import TwincitiButton from '../../common/twincitiButton/page';
import styles from './forgot.module.css';

const ForgotModal = (props) => {
    const [data, setData] = useState({
        email: '',
    });
    const [buttonDisable, setButtonDisable] = useState(false);

    const [buttonSpinner, setButtonSpinner] = useState(false);
    const onChangeHandle = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };

    const signupSubmit = async () => {
        setButtonSpinner(true);
        setButtonDisable(true);
        const response = await postApiWithoutAuth(URLs.ApiForgotPassword, data);
        if (response.success) {
            message.open({
                type: 'success',
                content: `${response.data}`,
                duration: 2,
            });
            setButtonDisable(false);
            setButtonSpinner(false);
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
            <h4>Forgot your password?</h4>
            <p>No problem! We&apos;ll send you a link to reset it.</p>
            <Form
                initialValues={{ remember: true }}
                labelCol={{ span: 24 }}
                layout="vertical"
                name="forgot-form"
                onFinish={signupSubmit}
                wrapperCol={{ span: 24 }}
            >
                <TwincitiInput
                    name="email"
                    label="Email"
                    onChange={onChangeHandle}
                    placeholder="Enter email"
                    rules={[
                        { required: true, message: 'Please enter your Email!' },
                        {
                            pattern: new RegExp(
                                /^(?!\s)([+\w-]+(?:\.[+\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-zA-Z]{2,6}(?:\.[a-zA-Z]{2})?)$/,
                            ),
                            message: 'Please enter Vaild Email Address!',
                        },
                    ]}
                    type="text"
                    value={data.email}
                />
                <Form.Item>
                    <TwincitiButton
                        disabled={buttonDisable}
                        htmlType="submit"
                        label={'Send Email'}
                        loading={buttonSpinner}
                        type="primary"
                    />
                </Form.Item>
                <Form.Item>
                    <TwincitiButton
                        className={styles.btnOutline}
                        htmlType="button"
                        label={'Back to Login'}
                        onClick={props.onBackToLogin}
                        type="primary"
                        variant="outline"
                    />
                </Form.Item>
            </Form>
        </div>
    );
};

export default ForgotModal;
