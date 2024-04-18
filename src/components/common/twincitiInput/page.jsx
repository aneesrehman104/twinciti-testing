import React, { useCallback } from 'react';
import { Form, Input } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
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
}) {
    return (
        <>
            <Form.Item
                className="inputStyle"
                dependencies={dependencies}
                name={name}
                rules={rules}
                style={style}
                label={label}
            >
                {type === 'password' ? (
                    <Input.Password
                        autoFocus={autoFocus}
                        className={className ? className : 'inputFieldStyle'}
                        disabled={disabled}
                        iconRender={(visible) =>
                            visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                        }
                        name={name}
                        onChange={onChange}
                        placeholder={placeholder}
                        required={required}
                        type={type}
                        value={value}
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
                    />
                )}
            </Form.Item>
        </>
    );
}
