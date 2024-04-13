'use client';
import { Provider } from 'react-redux';
import React, { Suspense, useEffect, useState } from 'react';
import MainLayout from '../../components/layoutComponents/mainLayout/mainLayout';
import store from '../../states/store';
import Chats from '../../screens/chats/chats';
import { useSearchParams } from 'next/navigation';
import { message } from 'antd';

export default function ChatsPage() {
    const searchParams = useSearchParams();

    const [chatData, setChatData] = useState([]);
    const [modalData, setModalData] = useState({});

    useEffect(() => {
        fetchChat();
    }, [searchParams]);

    const fetchChat = async () => {
        const searchParams1 = new URLSearchParams(window.location.search);
        const chatId = searchParams1.get('chatId');

        if (chatId === null) {
            setChatData([]);
            setModalData({});
        } else {
            const res = await getApiWithAuth(
                `${URLs.GetConversation}/${chatId}`,
            );
            if (res.data.success) {
                setChatData(res.data.data.conversation);
                setModalData(res.data.data.room);
            } else {
                message.open({
                    type: 'error',
                    content: `${res.data.message}`,
                    duration: 2,
                });
            }
        }
    };
    return (
        <Provider store={store}>
            <Suspense>
                <MainLayout>
                    <Chats
                        chatData={chatData}
                        modalData={modalData}
                        setChatData={setChatData}
                        setModalData={setModalData}
                    />
                </MainLayout>
            </Suspense>
        </Provider>
    );
}
