import { URLs } from '@/ts/apiUrl';
import { getApiWithAuth } from '@/ts/api';
import { message } from 'antd';

export const fetchChat = async ({ setChatData, setModalData }) => {
    const searchParams1 = new URLSearchParams(window.location.search);
    const chatId = searchParams1.get('chatId');
    const category = searchParams1.get('category');

    if (chatId === null) {
        setChatData([]);
        setModalData({});
    } else {
        const res = await getApiWithAuth(
            `${URLs.GetConversation}/${chatId}?task_name=${category}`,
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
