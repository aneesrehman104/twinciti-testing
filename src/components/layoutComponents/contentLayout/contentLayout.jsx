import React from 'react';
import { Layout } from 'antd';

import PageWrapper from '../../common/pageWrapper/PageWrapper';

const { Content } = Layout;

const ContentLayout = ({ children }) => {
    return (
        <Content style={{ background: '#16151A' }}>
            <PageWrapper>{children}</PageWrapper>
        </Content>
    );
};

export default ContentLayout;
