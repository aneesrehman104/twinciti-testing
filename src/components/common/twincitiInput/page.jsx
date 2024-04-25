import React, { useCallback } from 'react';
import { Form, Input } from 'antd';
import {
    EyeInvisibleOutlined,
    EyeOutlined,
    EditOutlined,
} from '@ant-design/icons';
import './style.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import Image from 'next/image';

import './style.css';

export default function TwincitiInput({
    rules,
    style,
    value,
    type,
    name,
    placeholder,
    onChange,
    onFinish,
    required,
    className,
    suffix,
    prefix,
    onKeyDown,
    disabled,
    dependencies,
    autoFocus,
    isMention,
    setMentionValue,
    modelsList,
    checkmodalData,
    selectedModel,
    onChangeHandle,
    onAdd,
    label,
    readOnly,
    isEditing,
    onClick,
}) {
    const renderIcon = () => {
        if (isEditing) {
            return <EditOutlined onClick={onClick} />;
        } else {
            return null; // Return null if icon is not to be shown
        }
    };

    return (
        <>
            <Form.Item
                className="inputStyle"
                dependencies={dependencies}
                name={name}
                rules={rules}
                style={style}
                label={label}
                readOnly={readOnly}
            >
                {type === 'password' ? (
                    <Input.Password
                        autoFocus={autoFocus}
                        className={className ? className : 'inputFieldStyle'}
                        disabled={disabled}
                        iconRender={(visible) =>
                            visible ? (
                                <EyeOutlined />
                            ) : (
                                <Image
                                    alt="vector"
                                    height={20}
                                    src="/hidePasswordIcon.svg"
                                    width={20}
                                />
                            )
                        }
                        name={name}
                        onChange={onChange}
                        placeholder={placeholder}
                        required={required}
                        type={type}
                        value={value}
                        readOnly={readOnly}
                    />
                ) : type === 'phoneNumber' ? (
                    <PhoneInput
                        country={'us'}
                        value={value}
                        onChange={onChange}
                        inputProps={{
                            name,
                            placeholder,
                            required,
                            autoFocus,
                            disabled,
                        }}
                        placeholder={placeholder}
                    />
                ) : type === 'TextArea' ? (
                    <Input.TextArea
                        autoFocus={autoFocus}
                        className={className ? className : 'inputFieldStyle'}
                        disabled={disabled}
                        name={name}
                        onChange={onChange}
                        placeholder={placeholder}
                        required={required}
                        type={type}
                        value={value}
                        label={label}
                    />
                ) : type === 'OTP' ? (
                    <Input.OTP
                        autoFocus={autoFocus}
                        className={className ? className : 'inputFieldStyle'}
                        disabled={disabled}
                        name={name}
                        onFinish={onFinish}
                        onChange={onChange}
                        required={required}
                        type={type}
                        value={value}
                        label={label}
                    />
                ) : (
                    <Input
                        autoFocus={autoFocus}
                        className={className ? className : 'inputFieldStyle'}
                        disabled={disabled}
                        name={name}
                        onChange={onChange}
                        onKeyDown={onKeyDown}
                        placeholder={placeholder}
                        required={required}
                        type={type}
                        value={value}
                        label={label}
                        suffix={renderIcon()}
                    />
                )}
            </Form.Item>
        </>
    );
}
