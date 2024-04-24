'use client';
import { Provider } from 'react-redux';
import React, { Suspense, useEffect, useState } from 'react';
import MainLayout from '../../components/layoutComponents/mainLayout/mainLayout';
import store from '../../states/store';
import Profile from '../../screens/profile/Profile';

export default function ChatsPage() {
    return (
        <Provider store={store}>
            <Suspense>
                <MainLayout>
                    <Profile />
                </MainLayout>
            </Suspense>
        </Provider>
    );
}
