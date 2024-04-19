'use client';
import { Provider } from 'react-redux';
import React, { Suspense } from 'react';
import MainLayout from '../../components/layoutComponents/mainLayout/mainLayout';
import store from '../../states/store';
import ModelHub from '../../screens/modelHub/ModelHub';

export default function ChatsPage() {
    return (
        <Provider store={store}>
            <MainLayout>
                <ModelHub />
            </MainLayout>
        </Provider>
    );
}
