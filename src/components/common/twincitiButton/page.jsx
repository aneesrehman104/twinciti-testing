import React from 'react';
import { Button } from 'antd';
import './twincitiButton.css';

export default function TwincitiButton({
    className,
    label,
    RightImage,
    ...restProps
}) {
    return (
        <Button
            className={className ? className : 'twincitiButton'}
            {...restProps}
        >
            {label}
            {RightImage}
        </Button>
    );
}
