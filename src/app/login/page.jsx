'use client';
import { Provider } from 'react-redux';
import React, { Suspense, useEffect, useState } from 'react';
import store from '../../states/store';
import Login from '../../screens/login/login';

export default function LoginPage() {
    return (
        <Provider store={store}>
            {/* <Suspense> */}
            <Login />
            {/* </Suspense> */}
        </Provider>
    );
}
