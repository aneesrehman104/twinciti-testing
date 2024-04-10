'use client';
import { Provider } from 'react-redux';
import React, { Suspense } from 'react';
import MainLayout from '../../components/layoutComponents/mainLayout/mainLayout';
import ModelHub from '../../screens/modelHub/ModelHub';
import store from '../../states/store';

export default function Chat() {
    return (
        <Provider store={store}>
            <Suspense>
                <MainLayout>
                    <ModelHub />
                </MainLayout>
            </Suspense>
        </Provider>
    );
}
