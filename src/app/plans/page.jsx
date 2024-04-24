'use client';
import { Provider } from 'react-redux';
import React, { Suspense, useEffect, useState } from 'react';
import MainLayout from '../../components/layoutComponents/mainLayout/mainLayout';
import store from '../../states/store';
import Plans from '../../screens/plans/Plans';
export default function PlansPage() {
    return (
        <Provider store={store}>
            <Suspense>
                <MainLayout>
                    <Plans />
                </MainLayout>
            </Suspense>
        </Provider>
    );
}
