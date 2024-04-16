import React from 'react';
import { Form } from 'antd';
import { Mention, MentionsInput } from 'react-mentions';
import styles from './chatInput.module.css';

const ChatInput = ({
    value,
    modelsList,
    checkmodalData,
    prefix,
    suffix,
    rules,
    onChangeHandle,
    style,
    type,
    name,
    placeholder,
    onChange,
    required,
    className,
    onKeyDown,
    disabled,
    dependencies,
    autoFocus,
    isMention,
    setMentionValue,
    selectedModel,
    mentionList,
    getModelsByIdMdntionSearch,
    onSend,
}) => {
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            onSend();
        }
    };

    return (
        <>
            <Form.Item
                className="inputStyle"
                dependencies={dependencies}
                name={name}
                rules={rules}
                style={style}
            >
                <div className={styles.inputFieldMention}>
                    <div style={{ width: 'auto', marginTop: 10 }}>{prefix}</div>
                    <MentionsInput
                        onKeyDown={handleKeyDown}
                        a11ySuggestionsListLabel={'Suggested mentions'}
                        allowSuggestionsAboveCursor={true}
                        customSuggestionsContainer={(children) => (
                            <div>{children}</div>
                        )}
                        onChange={onChangeHandle}
                        placeholder={placeholder}
                        style={{
                            width: '100%',
                            position: 'relative',
                            control: {
                                backgroundColor: 'rgba(43, 45, 49, 1)',
                                fontSize: 14,
                                fontWeight: 'normal',
                            },
                            '&multiLine': {
                                control: {
                                    fontFamily: 'var(--font-poppins)',
                                    minHeight: 45,
                                    maxHeight: 280,
                                },
                                highlighter: {
                                    padding: 9,
                                    border: '1px solid transparent',
                                },
                                input: {
                                    padding: 9,
                                    border: 'none',
                                    overflow: 'auto',
                                    maxHeight: 280,
                                },
                            },
                            '&singleLine': {
                                display: 'inline-block',
                                width: 180,
                                highlighter: {
                                    padding: 1,
                                    border: '2px inset transparent',
                                },
                                input: {
                                    padding: 1,
                                    border: '2px inset',
                                },
                            },
                            suggestions: {
                                position: 'absolute',
                                top: 'auto',
                                bottom: '100%',
                                list: {
                                    backgroundColor: 'rgba(43, 45, 49, 1)',
                                    border: 'none',
                                    fontSize: 14,
                                    width: '100%',
                                    color: 'rgba(255, 255, 255, 1)',
                                    fontFamily: 'var(--font-poppins)',
                                    height: '200px',
                                    overflowY: 'auto',
                                },
                                item: {
                                    padding: '5px 15px',
                                    borderBottom: 'none',
                                    '&focused': {
                                        backgroundColor: 'rgba(43, 45, 49, 1)',
                                    },
                                },
                            },
                        }}
                        value={value}
                    >
                        <Mention
                            data={getModelsByIdMdntionSearch}
                            displayTransform={(display, id) => ` @${id}  `}
                            markup="@[__display__]"
                            style={{
                                width: '100%',
                                marginTop: '10px',
                                backgroundColor: 'rgba(171, 105, 255, 1)',
                                borderRadius: '10px',
                                padding: '5px 0px 5px 0px',
                            }}
                            trigger={'@'}
                            appendSpaceOnAdd
                        />
                    </MentionsInput>
                    <div style={{ marginTop: 5 }}>{suffix}</div>
                </div>
            </Form.Item>
        </>
    );
};

export default ChatInput;
