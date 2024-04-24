'use client';
import { Provider } from 'react-redux';
import React, { Suspense, useEffect, useState } from 'react';
import MainLayout from '../../components/layoutComponents/mainLayout/mainLayout';
import store from '../../states/store';
import SignUp from '../../screens/signUp/signUp';

export default function SignUpPage() {
    return (
        <Provider store={store}>
            <SignUp />
        </Provider>
    );
}
