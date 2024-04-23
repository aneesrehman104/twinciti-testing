import React from 'react';
import { Form, Input } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import './style.css';

const TwincitiInput = ({
    rules,
    style,
    value,
    type,
    name,
    placeholder,
    onChange,
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
}) => {
    return (
        <>
            <Form.Item
                className="inputStyle"
                dependencies={dependencies}
                name={name}
                rules={rules}
                style={style}
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
                ) : (
                    <Input
                        autoFocus={autoFocus}
                        className={className ? className : 'inputFieldStyle'}
                        disabled={disabled}
                        name={name}
                        onChange={onChange}
                        onKeyDown={onKeyDown}
                        placeholder={placeholder}
                        prefix={prefix}
                        required={required}
                        suffix={suffix}
                        type={type}
                        value={value}
                    />
                )}
            </Form.Item>
        </>
    );
};

export default TwincitiInput;
