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
    const [currentAnswerIndex, setCurrentAnswerIndex] = useState(0);
    const [showSpinnerRegenerate, setShowSpinnerRegenerate] = useState(false);

    useEffect(() => {
        if (answers.length > 0) {
            setLikeShow(
                favouriteAnswer.answers[currentAnswerIndex][selectedAnswer]
                    ?.like,
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
            <div className={styles.positionAvatar}>
                <div className={styles.avatarStyle}>{'A'}</div>
                <div className={styles.innerDivWidth}>
                    <div className={styles.questionStyle}>{question}</div>
                    <div
                        ref={messageRef}
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginTop: 20,
                        }}
                    >
                        <div style={{ display: 'flex' }}>
                            <Image
                                alt="editIcon"
                                height={20}
                                src="/editIcon.svg"
                                style={{ marginRight: 10, cursor: 'pointer' }}
                                width={20}
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
                        alt="whitelogo"
                        height={24}
                        src="/whitelogo.svg"
                        width={24}
                    />
                </div>
                <div className={styles.innerDivWidth}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            width: '100%',
                            marginTop: 5,
                            marginBottom: 15,
                            overflow: 'visible',
                            gap: '20px',
                        }}
                    >
                        {models?.map((item, index) => (
                            <div
                                className={
                                    selectedAnswer === index
                                        ? styles.selectedTab
                                        : styles.notSelectedTab
                                }
                                key={index}
                                onClick={() => handleItemClick(index)}
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
                                onClick={() => handlePrevious(answers.length)}
                                style={{
                                    color:
                                        currentAnswerIndex === 0
                                            ? 'grey'
                                            : 'white',
                                }}
                            />
                            <span style={{ color: 'white' }}>
                                {currentAnswerIndex + 1}/{answers.length}
                            </span>
                            <CaretRightOutlined
                                onClick={() => handleNext(answers.length)}
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
                        className={styles.answerStyle}
                        style={{
                            color:
                                answers.length > 0 &&
                                answers[currentAnswerIndex][selectedAnswer]
                                    ?.like
                                    ? 'rgba(171, 105, 255, 1)'
                                    : '',
                        }}
                    >
                        {answers.length === 0 || showSpinnerRegenerate ? (
                            <SyncOutlined spin />
                        ) : answers?.length &&
                          answers[currentAnswerIndex] &&
                          answers[currentAnswerIndex]?.length &&
                          answers[currentAnswerIndex][selectedAnswer] &&
                          answers[currentAnswerIndex][selectedAnswer]
                              .message ? (
                            answers[currentAnswerIndex][selectedAnswer].message
                        ) : (
                            ''
                        )}
                    </p>
                    {isHover || isLastIndexChat
                        ? models.length > 0 && (
                              <div
                                  ref={messageRef}
                                  style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      marginTop: 20,
                                  }}
                              >
                                  <div>
                                      <Image
                                          alt="shareIcon"
                                          height={21}
                                          src="/sharelcon.svg"
                                          style={{ cursor: 'pointer' }}
                                          width={60}
                                          onClick={() => setIsShare(!isShare)}
                                      />
                                  </div>
                                  <div style={{ display: 'flex' }}>
                                      {models[selectedAnswer].is_llm && (
                                          <Tooltip title={'Click and save'}>
                                              <LikeFilled
                                                  onClick={() =>
                                                      saveFav(
                                                          answers[
                                                              currentAnswerIndex
                                                          ][selectedAnswer],
                                                      )
                                                  }
                                                  style={{
                                                      fontSize: '18px',
                                                      marginRight: 10,
                                                      cursor: 'pointer',
                                                      color:
                                                          answers.length > 0 &&
                                                          answers[
                                                              currentAnswerIndex
                                                          ][selectedAnswer].like
                                                              ? 'rgba(171, 105, 255, 1)'
                                                              : '#7D7F7E',
                                                  }}
                                              />
                                          </Tooltip>
                                      )}
                                      <Image
                                          alt="regenerateIcon"
                                          height={16}
                                          src="/regenerateIcon.svg"
                                          style={{
                                              marginRight: 10,
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
                                      <Image
                                          alt="copyIcon"
                                          height={12}
                                          onClick={() =>
                                              copyToClipBoard(
                                                  answers[currentAnswerIndex][
                                                      selectedAnswer
                                                  ].message,
                                              )
                                          }
                                          src="/fluentCopyIcon.svg"
                                          style={{
                                              marginRight: 10,
                                              cursor: 'pointer',
                                          }}
                                          width={15}
                                      />
                                  </div>
                              </div>
                          )
                        : null}
                    {isShare && (
                        <ShareSocialPlatforms
                            answer={
                                answers[currentAnswerIndex][selectedAnswer]
                                    .message
                            }
                            question={question}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatContainer;
