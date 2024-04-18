import { useEffect, useState } from 'react';
import { Col, Input, Row, Tabs } from 'antd';
import Image from 'next/image';
import ModalSettingCard from '../../common/modalSettingCard/ModalSettingCard';
import ChatGistCard from '../../common/chatGistCard/ChatGistCard';
import styles from './chatsSidebar.module.css';
import { useSearchParams } from 'next/navigation';
import { getApiWithAuth } from '../../../utils/api';
import { URLs } from '../../../utils/apiUrl';
import { useDispatch, useSelector } from 'react-redux';
import { setChatroomList } from '../../../states/chat/chatSlice';

const ChatSidebar = ({}) => {
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const chatsState = useSelector((state) => state.chats);
    const chatrooms = chatsState?.roomList ? chatsState.roomList : [];
    const chatroomModels = chatsState?.roomModels ? chatsState.roomModels : [];
    const selectedChatId = searchParams.get('chatId');
    const [searchChats, setSearchChats] = useState('');

    useEffect(() => {
        fetchChatrooms(searchChats);
    }, [searchChats]);

    const fetchChatrooms = async (search = '') => {
        try {
            let response = await getApiWithAuth(
                search ? `${URLs.ChatRoom}?search=${search}` : URLs.ChatRoom,
            );
            response = response?.data ? response.data : response;
            if (response && response.success) {
                const { records } = response.data;
                dispatch(setChatroomList(records));
            }
        } catch (error) {
            console.log('error', error);
        }
    };

    const chatSettingsSection = (
        <>
            <Col span={24}>
                <div className={styles.addModalWrap}>
                    <span>Add</span>
                    <Image
                        alt="addBtn"
                        height={32}
                        src="addBtn.svg"
                        style={{
                            marginRight: '5px',
                        }}
                        width={32}
                    />
                </div>
            </Col>
            <div
                id="model-settings-container"
                className={styles.modalGroupWrap}
            >
                {chatroomModels?.map((modal, i) => (
                    <ModalSettingCard
                        modelName={modal.model_name.split('/')[1]}
                        modelId={modal._id}
                        chatId={selectedChatId}
                        index={i}
                        key={i}
                    />
                ))}
                <div className={styles.buttonGropWrap}>
                    <div className={styles.subButtonGroup}>
                        <button className={styles.buttonWrap}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="21"
                                height="20"
                                viewBox="0 0 21 20"
                                fill="none"
                            >
                                <path
                                    d="M14.2 7.41602C17.2 7.67435 18.425 9.21602 18.425 12.591V12.6993C18.425 16.4243 16.9333 17.916 13.2083 17.916H7.78332C4.05832 17.916 2.56665 16.4243 2.56665 12.6993V12.591C2.56665 9.24102 3.77498 7.69935 6.72498 7.42435"
                                    stroke="white"
                                    strokeOpacity="0.6"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M10.5 1.6665V12.3998M13.2916 10.541L10.4999 13.3327L7.70825 10.541"
                                    stroke="white"
                                    strokeOpacity="0.6"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            Import Chat
                        </button>
                        <button className={styles.buttonWrap}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="21"
                                height="20"
                                viewBox="0 0 21 20"
                                fill="none"
                            >
                                <path
                                    d="M14.2 7.41602C17.2 7.67435 18.425 9.21602 18.425 12.591V12.6993C18.425 16.4243 16.9333 17.916 13.2083 17.916H7.78332C4.05832 17.916 2.56665 16.4243 2.56665 12.6993V12.591C2.56665 9.24102 3.77498 7.69935 6.72498 7.42435"
                                    stroke="white"
                                    strokeOpacity="0.7"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M10.5 12.5007V3.01733M13.2916 4.87516L10.4999 2.0835L7.70825 4.87516"
                                    stroke="white"
                                    strokeOpacity="0.7"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            Export Chat
                        </button>
                    </div>
                    <div className={styles.subButtonGroup}>
                        <button className={styles.buttonWrap}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                            >
                                <g clipPath="url(#clip0_2391_3817)">
                                    <path
                                        d="M4.16663 4.1665L15.8333 15.8332M9.99996 18.3332C14.6025 18.3332 18.3333 14.6023 18.3333 9.99984C18.3333 5.39734 14.6025 1.6665 9.99996 1.6665C5.39746 1.6665 1.66663 5.39734 1.66663 9.99984C1.66663 14.6023 5.39746 18.3332 9.99996 18.3332Z"
                                        stroke="white"
                                        strokeOpacity="0.6"
                                        strokeWidth="1.4"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_2391_3817">
                                        <rect
                                            width="20"
                                            height="20"
                                            fill="white"
                                        />
                                    </clipPath>
                                </defs>
                            </svg>
                            Remove all Models
                        </button>
                    </div>
                </div>
            </div>
        </>
    );

    const chatsListSection = (
        <>
            <Col span={24}>
                <div className={styles.searchBarGradient}>
                    <Input
                        className={styles.inputStyle}
                        placeholder="Search Chat"
                        onChange={(e) => setSearchChats(e.target.value)}
                        prefix={
                            <Image
                                alt="/searchIcon.svg"
                                height={16}
                                src="/searchIcon.svg"
                                style={{
                                    marginRight: '5px',
                                }}
                                width={16}
                            />
                        }
                    />
                </div>
            </Col>

            <Col span={24}>
                <div className={styles.customeScroll}>
                    <Row gutter={[12, 12]}>
                        {chatrooms.map((room, index) => (
                            <Col span={24} key={index}>
                                <ChatGistCard
                                    active={
                                        selectedChatId
                                            ? selectedChatId === room?._id
                                            : false
                                    }
                                    name={room?.name}
                                    time={room?.updatedAt}
                                    id={room?._id}
                                    description={room?.description}
                                    taskName={room?.taskName}
                                />
                            </Col>
                        ))}
                    </Row>
                </div>
            </Col>
        </>
    );

    const chatsSideBar = [
        {
            key: '1',
            label: 'Settings',
            children: chatSettingsSection,
        },
        {
            key: '2',
            label: 'Chats',
            children: chatsListSection,
        },
    ];

    return (
        <section
            style={{
                padding: '16px 10px',
                height: '100%',
            }}
        >
            <Row gutter={[12, 12]}>
                <Col span={24}>
                    <div className={styles.logoWrap}>
                        <Image
                            alt="/logo.svg"
                            height={48}
                            src="/logo.svg"
                            width={48}
                        />
                        <p className={styles.mainHeading}>Twinciti</p>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Tabs
                        className={styles.tabsWrap}
                        defaultActiveKey="2"
                        items={chatsSideBar}
                        onChange={() => {}}
                    />
                </Col>
            </Row>
        </section>
    );
};

export default ChatSidebar;
