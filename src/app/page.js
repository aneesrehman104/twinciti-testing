'use client';
import { Provider } from 'react-redux';
import MainLayout from '../components/layoutComponents/mainLayout/mainLayout';
import { Suspense } from 'react';
import store from '../states/store';
import ModelHub from '../screens/modelHub/ModelHub';

export default function Home() {
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
