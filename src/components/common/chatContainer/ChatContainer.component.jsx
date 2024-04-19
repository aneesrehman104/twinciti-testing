import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './ChatContainer.module.css';
import { message, Tooltip } from 'antd';
import {
    CaretLeftOutlined,
    CaretRightOutlined,
    LikeFilled,
    SyncOutlined,
} from '@ant-design/icons';
import ShareSocialPlatforms from '../shareSocialPlatforms/shareSocialPlatforms';
import { URLs } from '../../../utils/apiUrl';
import { getApiWithAuth } from '../../../utils/api';

const ChatContainer = ({
    answers,
    models,
    question,
    messageRef,
    favouriteAnswer,
    chatSpecficId,
    isLastIndexChat,
    regenerateFunction,
    setChatData,
    chatData,
}) => {
    const [selectedAnswer, setSelectedAnswer] = useState(0);
    const [likeShow, setLikeShow] = useState(false);
    const [isShare, setIsShare] = useState(false);
    const [isHover, setIsHover] = useState(false);
    const [showGrid, setShowGrid] = useState(true);
    const [expandChat, setExpandChat] = useState(true);
    const [currentAnswerIndex, setCurrentAnswerIndex] = useState(0);
    const [showSpinnerRegenerate, setShowSpinnerRegenerate] = useState(false);

    useEffect(() => {
        if (answers.length > 0) {
            setLikeShow(
                favouriteAnswer?.answers?.length &&
                    favouriteAnswer.answers[currentAnswerIndex]?.length &&
                    favouriteAnswer.answers[currentAnswerIndex][selectedAnswer]
                        ?.like
                    ? favouriteAnswer.answers[currentAnswerIndex][
                          selectedAnswer
                      ]?.like
                    : false,
            );
        }
    }, [likeShow]);

    useEffect(() => {
        if (answers.length > 0) {
            setCurrentAnswerIndex(answers.length - 1);
        }
    }, [answers]);

    const handlePrevious = (length) => {
        if (currentAnswerIndex === 0) {
            return;
        }
        setCurrentAnswerIndex(currentAnswerIndex - 1);
    };

    const handleNext = (length) => {
        if (currentAnswerIndex === length - 1) {
            return;
        }
        setCurrentAnswerIndex(currentAnswerIndex + 1);
    };

    const handleItemClick = (index) => {
        setSelectedAnswer(index);
    };

    const copyToClipBoard = async (copyMe) => {
        try {
            await navigator.clipboard.writeText(copyMe);
            message.open({
                type: 'success',
                content: 'Copied!',
                duration: 2,
            });
        } catch (err) {
            message.open({
                type: 'error',
                content: 'Try Again!',
                duration: 2,
            });
        }
    };

    const saveFav = async (selectedAnswer) => {
        const res = await getApiWithAuth(
            `${URLs.ChatRoom}/favourite/${chatSpecficId}/${selectedAnswer._id}`,
        );
        if (res.data.success) {
            setChatData(
                chatData.map((item) => {
                    if (item._id === chatSpecficId) {
                        return res.data.data;
                    }
                }),
            );
            message.open({
                type: 'success',
                content: 'Chat save as a fav',
                duration: 2,
            });
        } else {
            message.open({
                type: 'error',
                content: `${res.data.message}`,
                duration: 2,
            });
        }
    };

    return (
        <div className={styles.mainDivStyle}>
            <div className={styles.positionAvatar + ' ' + styles.adminChat}>
                <div className={styles.avatarStyle}>{'A'}</div>
                <div className={styles.chatWrap}>
                    <span className={styles.adminName}>You</span>
                    <div className={styles.innerDivWidth}>
                        <div className={styles.questionStyle}>{question}</div>
                        <div
                            ref={messageRef}
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                            }}
                        >
                            <Image
                                alt="regenerateIcon"
                                height={16}
                                src="/regenerateIcon.svg"
                                style={{
                                    cursor: 'pointer',
                                }}
                                width={16}
                                onClick={() =>
                                    regenerateFunction(
                                        chatSpecficId,
                                        setShowSpinnerRegenerate,
                                    )
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div
                className={styles.positionAvatar}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => {
                    setIsHover(false);
                    setIsShare(false);
                }}
            >
                <div
                    className={styles.avatarStyle2}
                    style={{
                        background: 'rgba(171, 105, 255, 1)',
                    }}
                >
                    <Image
                        alt="circularLogo"
                        height={24}
                        src="/circularLogo.svg"
                        width={24}
                    />
                </div>
                <div className={styles.chatWrap}>
                    {isHover && !showGrid ? (
                        <div ref={messageRef} className={styles.ShareSocialBtn}>
                            <div
                                className={styles.socialBtn}
                                onClick={() => setIsShare(!isShare)}
                            >
                                <Image
                                    alt="shareIcon"
                                    height={20}
                                    src="/sharelcon.svg"
                                    width={20}
                                />
                            </div>
                            <div
                                className={styles.socialBtn}
                                onClick={() =>
                                    saveFav(
                                        answers[currentAnswerIndex][
                                            selectedAnswer
                                        ],
                                    )
                                }
                            >
                                <Image
                                    alt="copyIcon"
                                    height={22}
                                    src="/starredIcon.svg"
                                    width={22}
                                />
                            </div>
                            <div
                                className={styles.socialBtn}
                                onClick={() =>
                                    copyToClipBoard(
                                        answers[currentAnswerIndex][
                                            selectedAnswer
                                        ].message,
                                    )
                                }
                            >
                                <Image
                                    alt="copyIcon"
                                    height={16}
                                    src="/fluentCopyIcon.svg"
                                    width={16}
                                />
                            </div>
                        </div>
                    ) : null}
                    <div
                        className={
                            styles.chatinerWrap +
                            ` ${showGrid ? styles.gridView : ''}`
                        }
                    >
                        <span className={styles.clientChatWrap}>Twinciti</span>

                        <div className={styles.innerDivWidth}>
                            {showGrid ? (
                                <div className={styles.cardWrap}>
                                    <div className={styles.gridBox} style={{}}>
                                        {models.map((item, index) => {
                                            return (
                                                <div
                                                    className={
                                                        styles.questionStyle
                                                    }
                                                    key={index}
                                                    onClick={() =>
                                                        handleItemClick(index)
                                                    }
                                                >
                                                    <Image
                                                        alt="Logo"
                                                        height={32}
                                                        src="/whitelogo.svg"
                                                        width={32}
                                                    />
                                                    <div
                                                        className={
                                                            styles.detailWrap
                                                        }
                                                    >
                                                        <div
                                                            className={
                                                                styles.compareHadding
                                                            }
                                                        >
                                                            {
                                                                item.model_name.split(
                                                                    '/',
                                                                )[1]
                                                            }
                                                        </div>
                                                        <div
                                                            className={
                                                                expandChat
                                                                    ? styles.comparAnswers
                                                                    : styles.comparAnswersCollapsed
                                                            }
                                                        >
                                                            {answers?.length &&
                                                            answers[
                                                                currentAnswerIndex
                                                            ] &&
                                                            answers[
                                                                currentAnswerIndex
                                                            ]?.length &&
                                                            answers[
                                                                currentAnswerIndex
                                                            ][index] &&
                                                            answers[
                                                                currentAnswerIndex
                                                            ][index].message
                                                                ? answers[
                                                                      currentAnswerIndex
                                                                  ][index]
                                                                      .message
                                                                : ''}
                                                        </div>
                                                    </div>
                                                    {isHover ? (
                                                        <div
                                                            ref={messageRef}
                                                            className={
                                                                styles.shareIconWrap
                                                            }
                                                        >
                                                            <div
                                                                className={
                                                                    styles.socialBtn
                                                                }
                                                            >
                                                                <Image
                                                                    alt="shareIcon"
                                                                    height={18}
                                                                    src="/sharelcon.svg"
                                                                    width={18}
                                                                    onClick={() =>
                                                                        setIsShare(
                                                                            !isShare,
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                            <div
                                                                className={
                                                                    styles.socialBtn
                                                                }
                                                            >
                                                                <Image
                                                                    alt="copyIcon"
                                                                    height={20}
                                                                    src="/starredIcon.svg"
                                                                    width={20}
                                                                    onClick={() =>
                                                                        saveFav(
                                                                            answers[
                                                                                currentAnswerIndex
                                                                            ][
                                                                                index
                                                                            ],
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                            <div
                                                                className={
                                                                    styles.socialBtn
                                                                }
                                                            >
                                                                <Image
                                                                    alt="copyIcon"
                                                                    height={16}
                                                                    onClick={() =>
                                                                        copyToClipBoard(
                                                                            answers[
                                                                                currentAnswerIndex
                                                                            ][
                                                                                index
                                                                            ]
                                                                                .message,
                                                                        )
                                                                    }
                                                                    src="/fluentCopyIcon.svg"
                                                                    width={16}
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            flexWrap: 'wrap',
                                            width: '100%',
                                            marginTop: 5,
                                            marginBottom: 16,
                                            overflow: 'visible',
                                            gap: '8px',
                                        }}
                                    >
                                        {models?.map((item, index) => (
                                            <div
                                                className={`${
                                                    styles.notSelectedTab
                                                } ${
                                                    selectedAnswer === index
                                                        ? styles.selectedTab
                                                        : ''
                                                }`}
                                                key={index}
                                                onClick={() =>
                                                    handleItemClick(index)
                                                }
                                            >
                                                {item.model_name.split('/')[1]}
                                            </div>
                                        ))}
                                    </div>
                                    {answers.length > 1 && (
                                        <div
                                            style={{
                                                color: 'black',
                                                display: 'flex',
                                                alignSelf: 'flex-start',
                                            }}
                                        >
                                            <CaretLeftOutlined
                                                onClick={() =>
                                                    handlePrevious(
                                                        answers.length,
                                                    )
                                                }
                                                style={{
                                                    color:
                                                        currentAnswerIndex === 0
                                                            ? 'grey'
                                                            : 'white',
                                                }}
                                            />
                                            <span style={{ color: 'white' }}>
                                                {currentAnswerIndex + 1}/
                                                {answers.length}
                                            </span>
                                            <CaretRightOutlined
                                                onClick={() =>
                                                    handleNext(answers.length)
                                                }
                                                style={{
                                                    color:
                                                        currentAnswerIndex ===
                                                        answers.length - 1
                                                            ? 'grey'
                                                            : 'white',
                                                }}
                                            />
                                        </div>
                                    )}
                                    <p
                                        className={
                                            expandChat
                                                ? styles.answerStyle
                                                : styles.answerStyleCollapsed
                                        }
                                        style={{
                                            color:
                                                answers?.answers?.length &&
                                                answers.answers[
                                                    currentAnswerIndex
                                                ]?.length &&
                                                answers.answers[
                                                    currentAnswerIndex
                                                ][selectedAnswer]?.like
                                                    ? 'rgba(171, 105, 255, 1)'
                                                    : '',
                                        }}
                                    >
                                        {answers.length === 0 ||
                                        showSpinnerRegenerate ? (
                                            <SyncOutlined spin />
                                        ) : answers?.length &&
                                          answers[currentAnswerIndex] &&
                                          answers[currentAnswerIndex]?.length &&
                                          answers[currentAnswerIndex][
                                              selectedAnswer
                                          ] &&
                                          answers[currentAnswerIndex][
                                              selectedAnswer
                                          ].message ? (
                                            answers[currentAnswerIndex][
                                                selectedAnswer
                                            ].message
                                        ) : (
                                            ''
                                        )}
                                    </p>
                                </>
                            )}

                            {isShare && (
                                <ShareSocialPlatforms
                                    answer={
                                        answers?.answers?.length &&
                                        answers.answers[currentAnswerIndex]
                                            ?.length &&
                                        answers.answers[currentAnswerIndex][
                                            selectedAnswer
                                        ]?.message
                                            ? answers[currentAnswerIndex][
                                                  selectedAnswer
                                              ].message
                                            : ''
                                    }
                                    question={question}
                                />
                            )}
                        </div>
                    </div>
                    {isHover ? (
                        <div ref={messageRef} className={styles.bottomNav}>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '100%',
                                }}
                            >
                                {expandChat ? (
                                    <Image
                                        alt="collapseIcon"
                                        height={18}
                                        src="/collapseIcon.svg"
                                        style={{ cursor: 'pointer' }}
                                        width={30}
                                        onClick={() => setExpandChat(false)}
                                    />
                                ) : (
                                    <Image
                                        alt="expandIcon"
                                        height={18}
                                        src="/expandIcon.svg"
                                        style={{ cursor: 'pointer' }}
                                        width={30}
                                        onClick={() => setExpandChat(true)}
                                    />
                                )}
                            </div>
                            <div className={styles.iconGirdList}>
                                <div
                                    className={
                                        styles.iconWrap +
                                        ` ${showGrid ? styles.activeView : ''}`
                                    }
                                >
                                    <Image
                                        alt="grid"
                                        height={16}
                                        src="/gridIcon.svg"
                                        style={{
                                            cursor: 'pointer',
                                        }}
                                        width={16}
                                        onClick={() => setShowGrid(true)}
                                    />
                                </div>
                                <div
                                    className={
                                        styles.iconWrap +
                                        ` ${!showGrid ? styles.activeView : ''}`
                                    }
                                >
                                    <Image
                                        alt="list"
                                        height={16}
                                        onClick={() => setShowGrid(false)}
                                        src="/listIcon.svg"
                                        style={{
                                            cursor: 'pointer',
                                        }}
                                        width={16}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default ChatContainer;
