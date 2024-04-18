'use client';
import { Provider } from 'react-redux';
import React, { Suspense, useEffect, useState } from 'react';
import MainLayout from '../../components/layoutComponents/mainLayout/mainLayout';
import store from '../../states/store';
import Usage from '../../screens/usage/Usage';
import { useSearchParams } from 'next/navigation';
import { message } from 'antd';

export default function ChatsPage() {
    return (
        <Provider store={store}>
            <Suspense>
                <MainLayout>
                    <Usage />
                </MainLayout>
            </Suspense>
        </Provider>
    );
}
