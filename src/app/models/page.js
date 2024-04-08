'use client';
import { Provider } from 'react-redux';
import MainLayout from '../components/layoutComponents/mainLayout/mainLayout';
import { Suspense } from 'react';

export default function ModelHub() {
    return (
        // <Provider store={true}>
        <Suspense>
            <MainLayout />
        </Suspense>
        // </Provider>
    );
}
