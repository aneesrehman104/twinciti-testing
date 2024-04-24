import React from 'react';
import { Button } from 'antd';
import './twincitiButton.css';

const TwincitiButton = ({ className, label, ...restProps }) => {
    return (
        <Button
            className={className ? className : 'twincitiButton'}
            {...restProps}
        >
            {label}
        </Button>
    );
};

export default TwincitiButton;
