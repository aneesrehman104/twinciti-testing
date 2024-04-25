'use client';
import React, { useState } from 'react';
import { Modal } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import './style.css';
interface CustomModalProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title: string;
    className?: any;
    inLine?: boolean;
    width?: number;
    closable?: boolean;
    maskClosable?: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({
    visible,
    onClose,
    children,
    title,
    className,
    inLine,
    width,
    closable,
    maskClosable,
    ...restProps
}) => {
    const [confirmLoading, setConfirmLoading] = useState(false);

    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            setConfirmLoading(false);
            onClose();
        }, 1000);
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <Modal
            closeIcon={<CloseCircleOutlined />}
            confirmLoading={confirmLoading}
            footer={null}
            closable={closable ? false : true}
            onCancel={handleCancel}
            onOk={handleOk}
            className={className}
            open={visible}
            maskClosable={maskClosable}
            title={
                <p className={inLine ? 'headerStyleInLine' : 'headerStyle'}>
                    {title}
                </p>
            }
            width={width ? width : 700}
            {...restProps}
        >
            <div className={className ? className : 'modalWidth'}>
                {children}
            </div>
        </Modal>
    );
};

export default CustomModal;
