import React from 'react';
import { Layout } from 'antd';

const { Sider } = Layout;

const SiderComponent = ({
    children,
    isCollapsed,
    collapsedHandle,
    onBreakpoint,
}) => {
    return (
        <Sider
            collapsed={isCollapsed}
            collapsedWidth="0"
            onBreakpoint={onBreakpoint}
            onCollapse={collapsedHandle}
            style={{ background: '#16151A', minWidth: '320px' }}
            width={'320px'}
        >
            {children}
        </Sider>
    );
};

export default SiderComponent;
