'use client';
import { Provider } from 'react-redux';
import React, { Suspense } from 'react';
import MainLayout from '../../components/layoutComponents/mainLayout/mainLayout';
import store from '../../states/store';
import Discover from '../../screens/discover/discover';

export default function ChatsPage() {
    return (
        <Provider store={store}>
            <Suspense>
                <MainLayout>
                    <Discover />
                </MainLayout>
            </Suspense>
        </Provider>
    );
}
