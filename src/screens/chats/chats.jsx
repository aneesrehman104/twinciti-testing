import React, { useEffect, useRef, useState } from 'react';
import styles from './chats.module.css';
import { Form, Spin } from 'antd';
import { SendOutlined, PauseOutlined } from '@ant-design/icons';
import ChatInput from '../../components/common/chatInput/chatInput';
import ButtonComponent from '../../components/common/button/Button';
import Image from 'next/image';
import ChatContainer from '../../components/common/chatContainer/ChatContainer.component';
import { useDebounce } from 'use-debounce';
import { URLs } from '../../utils/apiUrl';
import {
    getApiWithoutAuth,
    postStreamApiWithAuth,
    getStreamApiWithAuth,
} from '../../utils/api';
import { message } from 'antd';

export default function Chats({
    setChatData,
    chatData,
    setModalData,
    modalData,
}) {
    const [checkmodalData, setCheckmodalData] = useState([]);
    const [modelsList, setModelsList] = useState({ records: [], total: 0 });
    const [nonTextInput, setNonTextInput] = useState(<></>);
    const [showChatSpinner, setShowChatSpinner] = useState(false);
    const [streamInProgress, setStreamInProgress] = useState(false);
    const [filterData, setFilterData] = useState('');
    const [filterDataSearch] = useDebounce(filterData, 600);
    const [streamingData, setStreamingData] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);
    const [abortController, setAbortController] = useState();
    const [mentionList, setMentionList] = useState([]);
    const [data, setData] = useState({
        prompt: '',
        onlyPrompt: '',
    });
    const [form] = Form.useForm();
    const fileRef = useRef(null);
    const messageRef = useRef(null);

    useEffect(() => {
        const searchParams1 = new URLSearchParams(window.location.search);
        const category = searchParams1.get('category');
        getModelsById(category);
    }, [filterDataSearch]);

    useEffect(() => {
        const tempChatData = [...chatData];

        if (
            streamingData?.length &&
            tempChatData?.length &&
            tempChatData[tempChatData.length - 1]
        ) {
            tempChatData[tempChatData.length - 1].answers = [streamingData];
            setChatData(tempChatData);
            setStreamingData([]);
        }
    }, [chatData, streamingData]);

    const getModelsById = async (selectedCategoryItem) => {
        if (selectedCategoryItem) {
            setShowSpinner(true);
            const response = await getApiWithoutAuth(
                `${URLs.ApiGetModel}?q=${filterData}&filter=${selectedCategoryItem}`,
            );
            if (response.success) {
                setModelsList(response.data);
                setShowSpinner(false);
            } else {
                setShowSpinner(false);
            }
        }
    };

    const getModelsByIdMdntionSearch = (filterDataMentionSearch, callback) => {
        const searchParams1 = new URLSearchParams(window.location.search);
        const category = searchParams1.get('category');

        getApiWithoutAuth(
            `${URLs.ApiGetModel}?q=${filterDataMentionSearch}&filter=${category}`,
        )
            .then((response) => {
                if (response.success) {
                    const filteredRecords = response.data.records?.filter(
                        (record) =>
                            !checkmodalData?.some(
                                (info) => info._id === record._id,
                            ),
                    );

                    const transformedModels = filteredRecords?.map((item) => ({
                        id: item._id,
                        display: item.model_name.split('/')[1],
                    }));

                    callback(transformedModels);
                }
            })
            .catch((error) => {
                // Handle error if needed
            });
    };

    const handleFileChange = async (event) => {
        const fileInput = event.target;
        const file = fileInput.files[0];
        const fileName = file?.name?.split('.').slice(0, -1).join('.');

        if (file) {
            const reader = new FileReader();

            setNonTextInput(
                <div
                    style={{
                        display: 'flex',
                        width: '100%',
                        whiteSpace: 'nowrap',
                        marginLeft: 5,
                    }}
                >
                    {fileName}
                    <Image
                        alt="clearCross"
                        height={16}
                        onClick={handleClearFile}
                        src="/clearCrossIcon.svg"
                        style={{ marginLeft: '10px' }}
                        width={16}
                    />
                </div>,
            );
            reader.onload = (e) => {
                const fileContent = e?.target?.result;
                const prompt = form.getFieldValue('prompt');
                const updatedValue = prompt
                    ? fileContent + ' ' + prompt
                    : fileContent;
                setFileContent(fileContent);
                setData({ prompt: updatedValue, onlyPrompt: prompt });
            };

            reader.readAsText(file);
        }
    };

    const handleCancel = () => {
        if (abortController) {
            abortController?.abort();
            setStreamingData([]);
            setShowChatSpinner(false);
            setStreamInProgress(false);
            setAbortController(undefined);
        }
    };

    const onSend = async () => {
        setData({ prompt: '', onlyPrompt: '' });
        fileRef.current.value = null;
        setNonTextInput(<></>);
        form.resetFields();
        if (data?.prompt?.length < 1) {
            return;
        }

        const abortController = new AbortController();
        setAbortController(abortController);
        const { signal } = abortController;

        const searchParams1 = new URLSearchParams(window.location.search);
        const chatId = searchParams1.get('chatId');
        const category = searchParams1.get('category');
        if (checkmodalData?.length === 0) {
            message.open({
                type: 'error',
                content: 'Please Select at least One Model',
                duration: 2,
            });
        } else {
            setChatData([...chatData, { prompt: data.prompt }]);
            setShowChatSpinner(true);
            setStreamInProgress(true);

            const response = await postStreamApiWithAuth(
                `${process.env.NEXT_PUBLIC_API_URL}/chat/stream?chatId=${chatId}&task_name=${category}`,
                {
                    prompt: data.prompt,
                    model: checkmodalData?.map((obj) => obj._id),
                },
                {
                    signal,
                },
            );

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            const loopRunner = true;
            let currString = '';

            signal.addEventListener('abort', () => {
                setStreamingData([]);
            });

            while (loopRunner) {
                const { value, done } = await reader.read();

                if (done) {
                    setStreamingData([]);
                    break;
                }
                const decodedChunk = decoder.decode(value, { stream: true });
                currString += decodedChunk;

                const streamObjects = currString.match(
                    /{"index":\d+,"content":"[^"]+","chatId":"[^"]+"}/g,
                );
                await new Promise((resolve) => setTimeout(resolve, 100));
                const groupedObjects =
                    streamObjects?.reduce((acc, obj) => {
                        const index = JSON.parse(obj).index;
                        acc[index] = acc[index] || [];
                        acc[index].push(JSON.parse(obj).content);
                        return acc;
                    }, {}) ?? {};

                const resultArray = Object.values(groupedObjects).map(
                    (group) => ({
                        message: group.join(''),
                    }),
                );

                setStreamingData(resultArray);
            }

            setShowChatSpinner(false);
            setStreamInProgress(false);
        }
    };

    const regenerateFunction = async (id, setShowSpinnerRegenerate) => {
        setShowSpinnerRegenerate(true);
        setStreamInProgress(true);

        const abortController = new AbortController();
        setAbortController(abortController);
        const { signal } = abortController;

        const response = await getStreamApiWithAuth(
            `${process.env.NEXT_PUBLIC_API_URL}${URLs.GetConversation}/regenerate/${id}`,
            {
                signal,
            },
        );

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        const loopRunner = true;
        let currString = '';

        signal.addEventListener('abort', () => {
            setStreamingData([]);
        });

        while (loopRunner) {
            const { value, done } = await reader.read();

            if (done) {
                setStreamingData([]);
                break;
            }
            const decodedChunk = decoder.decode(value, { stream: true });
            currString += decodedChunk;

            const streamObjects = currString.match(
                /{"index":\d+,"content":"[^"]+","chatId":"[^"]+"}/g,
            );

            await new Promise((resolve) => setTimeout(resolve, 100));
            const groupedObjects =
                streamObjects?.reduce((acc, obj) => {
                    const index = JSON.parse(obj).index;
                    acc[index] = acc[index] || [];
                    acc[index].push(JSON.parse(obj).content);
                    return acc;
                }, {}) ?? {};

            const resultArray = Object.values(groupedObjects).map((group) => ({
                message: group.join(''),
            }));

            setChatData(
                chatData.map((item) => {
                    if (item._id === id) {
                        item.answers = resultArray?.length
                            ? [resultArray]
                            : [''];
                    }
                    return item;
                }),
            );
        }

        setShowSpinnerRegenerate(false);
        setStreamInProgress(false);
    };

    const onChangeHandle = (event, mentions) => {
        setData({ ...data, prompt: event.target.value });
        setMentionList(mentions);
    };

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                flexShrink: 1,
                padding: '15px 0',
            }}
        >
            <div className={styles.dropdownPosition}>DROPDOWN</div>
            <section className={styles.chatInnerHeight}>
                {chatData.length === 0 ? (
                    <div className={styles.noChatsContainer}>
                        <div className={styles.noChatsContent}>
                            <Image
                                alt="nochatyetIcon"
                                height={31}
                                src="/nochatyetIcon.svg"
                                width={34}
                            />
                            <div className={styles.noChatsText}>
                                No chats yet
                            </div>
                        </div>
                    </div>
                ) : (
                    chatData?.map((item, index) => {
                        return (
                            <ChatContainer
                                answers={item.answers ? item.answers : []}
                                chatSpecficId={item._id}
                                favouriteAnswer={item}
                                key={item._id}
                                messageRef={messageRef}
                                models={item.model ? item.model : []}
                                question={item.prompt}
                                isLastIndexChat={chatData.length - 1 === index}
                                regenerateFunction={regenerateFunction}
                                setChatData={setChatData}
                                chatData={chatData}
                            />
                        );
                    })
                )}
            </section>
            <Form form={form} onFinish={onSend}>
                <ChatInput
                    checkmodalData={checkmodalData}
                    getModelsByIdMdntionSearch={getModelsByIdMdntionSearch}
                    modelsList={modelsList}
                    name="prompt"
                    onChangeHandle={onChangeHandle}
                    placeholder={'Type @ to mention someone'}
                    prefix={
                        <div style={{ display: 'flex' }}>
                            <label
                                htmlFor="file"
                                style={{
                                    display: 'flex',
                                    width: 'max-content',
                                }}
                            >
                                <Image
                                    alt="uploadIcon"
                                    height={17}
                                    src="/uploadIcon.svg"
                                    width={20}
                                />
                                <input
                                    accept=".txt"
                                    id="file"
                                    name="text"
                                    onChange={handleFileChange}
                                    ref={fileRef}
                                    style={{ display: 'none' }}
                                    type="file"
                                />
                            </label>
                            {nonTextInput}
                        </div>
                    }
                    suffix={
                        streamInProgress ? (
                            <ButtonComponent
                                className={styles.stopButtonStyle}
                                label={
                                    <PauseOutlined
                                        style={{
                                            color: 'white',
                                        }}
                                    />
                                }
                                onClick={() => handleCancel()}
                            />
                        ) : (
                            <ButtonComponent
                                htmlType="submit"
                                className={styles.sendButtonStyle}
                                disabled={data?.prompt?.length < 1}
                                label={
                                    showChatSpinner ? (
                                        <Spin />
                                    ) : (
                                        <SendOutlined
                                            style={{
                                                color: 'white',
                                            }}
                                        />
                                    )
                                }
                                onClick={() => onSend()}
                            />
                        )
                    }
                    value={data.prompt}
                    onSend={onSend}
                />
            </Form>
        </div>
    );
}
