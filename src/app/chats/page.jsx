'use client';
import { Provider } from 'react-redux';
import { Suspense } from 'react';
import MainLayout from '../../components/layoutComponents/mainLayout/mainLayout';
import store from '../../states/store';
import Chats from '../../screens/chats/chats';

export default function ChatsPage() {
    return (
        <Provider store={store}>
            <Suspense>
                <MainLayout>
                    <Chats />
                </MainLayout>
            </Suspense>
        </Provider>
    );
}
