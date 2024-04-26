import React from 'react';
import { Form, message } from 'antd';
import styles from './changePassword.module.css';
import TwincitiInput from '../../common/twincitiInput/page';
import TwincitiButton from '../../common/twincitiButton/page';
import CustomModal from '../../common/modal/page';

const ChangePassword = ({
    buttonSpinner,
    buttonDisable,
    data,
    updatePasswordUser,
    onChangeHandle,
    onClose,
    visible,
    form,
}) => {
    return (
        <CustomModal
            width={'440px'}
            onClose={onClose}
            title={'Change Password'}
            visible={visible}
            className={styles.mainModalGroup}
        >
            <Form
                form={form}
                onFinish={updatePasswordUser}
                style={{ width: '95%' }}
            >
                <TwincitiInput
                    name="old_password"
                    onChange={onChangeHandle}
                    placeholder="Enter old password"
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
                                'Must contain Number , Special Character , upper case letter, lower case letter, min length 8!',
                        },
                    ]}
                    type="password"
                    value={data.old_password}
                />
                <TwincitiInput
                    dependencies={['old_password']}
                    name="new_password"
                    onChange={onChangeHandle}
                    placeholder="Enter New Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Enter New Password!',
                        },
                        {
                            pattern: new RegExp(
                                /^(?=.*\d)(?=.*?[@$!%*#?&^_.,-])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                            ),
                            message:
                                'Must contain Number , Special Character , upper case letter, lower case letter, min length 8',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (
                                    !value ||
                                    getFieldValue('old_password') !== value
                                ) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error(
                                        'Current And new Password should be different!',
                                    ),
                                );
                            },
                        }),
                    ]}
                    type="password"
                    value={data.new_password}
                />

                <TwincitiInput
                    dependencies={['new_password']}
                    name="confirm_password"
                    onChange={onChangeHandle}
                    placeholder="Confirm New Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter your Confirm New Password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (
                                    !value ||
                                    getFieldValue('new_password') === value
                                ) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error('Both passwords will be same'),
                                );
                            },
                        }),
                    ]}
                    type="password"
                    value={data.confirm_password}
                />

                <div className={styles.btnWrap}>
                    <TwincitiButton
                        disabled={buttonDisable}
                        htmlType="submit"
                        label="Update"
                        loading={buttonSpinner}
                        style={{ width: '120px' }}
                    />
                </div>
            </Form>
        </CustomModal>
    );
};

export default ChangePassword;
