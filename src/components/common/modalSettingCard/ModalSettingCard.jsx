import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './ModalSettingCard.module.css';
import { Collapse, Switch, Input, Dropdown, InputNumber, Slider } from 'antd';
import ButtonComponent from '../button/Button';
import { InfoCircleOutlined } from '@ant-design/icons';
import { postApiWithAuth } from '../../../utils/api';

const handleMenuClick = (e) => {};

const menuProps = {
    items: [],
    onClick: handleMenuClick,
};

const settingsList = [
    { name: 'Max Tokens', key: 'max_token', max: 10, min: 0, unit: 1 },
    { name: 'Chat Memory', key: 'chat_memory', max: 10, min: 0, unit: 1 },
    { name: 'Temperature', key: 'temperature', max: 1, min: 0, unit: 1 / 4 },
    { name: 'Top P', key: 'top_p', max: 1, min: 0, unit: 1 / 4 },
    { name: 'Top K', key: 'top_k', max: 1, min: 0, unit: 1 / 4 },
    {
        name: 'Frequency Penalty',
        key: 'frequency_penalty',
        max: 1,
        min: 0,
        unit: 1 / 4,
    },
    {
        name: 'Presence Penalty',
        key: 'presence_penalty',
        max: 1,
        min: 0,
        unit: 1 / 4,
    },
    {
        name: 'Repetition Penalty',
        key: 'repetition_penalty',
        max: 1,
        min: 0,
        unit: 1 / 4,
    },
    { name: 'Min P', key: 'min_p', max: 1, min: 0, unit: 1 / 4 },
    { name: 'Top A', key: 'top_a', max: 1, min: 0, unit: 1 / 4 },
];

const ModalSettingCard = ({
    modelId,
    chatId,
    index = -1,
    modelName = '',
    currentModelSettings = {},
}) => {
    const [modelSettings, setModelSettings] = useState(currentModelSettings);
    const [isExpanded, setIsExpanded] = useState(false);
    const [editName, setEditName] = useState(false);
    useEffect(() => {
        (async () => {
            if (chatId && modelId) {
                const response = await postApiWithAuth(
                    `${process.env.NEXT_PUBLIC_API_URL}/setting/${chatId}/model/${modelId}`,
                    modelSettings,
                );
            }
        })();
    }, [modelSettings]);

    const collapseIconSrc = isExpanded
        ? '/collapseExIcon.svg'
        : '/expandedCoIcon.svg';

    const genExtra = () => (
        <>
            <Switch
                defaultChecked
                onChange={() => {}}
                onClick={(checked, event) => {
                    event.stopPropagation();
                }}
            />
            <Image
                alt="trashIcon"
                height={16}
                src="/trashIcon.svg"
                width={16}
                onClick={(event) => {
                    event.stopPropagation();
                }}
            />
            <Image
                alt="collapse"
                height={16}
                src={collapseIconSrc}
                width={16}
            />
        </>
    );

    const settings = (
        <div className={styles.modalBodyWrap}>
            <div className={styles.itemsWrap}>
                <span className={styles.labelText}>Model</span>
                <Dropdown.Button
                    className={styles.dropdownWrap}
                    icon={
                        <Image
                            alt="expandIcon"
                            height={18}
                            src="/expandIcon.svg"
                            width={30}
                        />
                    }
                    menu={menuProps}
                    disabled
                >
                    {modelName}
                </Dropdown.Button>
            </div>
            <div className={styles.itemsWrap}>
                <span className={styles.labelText}>Description</span>
                <Input.TextArea
                    className={styles.textAreaWrap}
                    placeholder=""
                    onChange={(e) =>
                        setModelSettings((prev) => {
                            return {
                                ...prev,
                                system_prompt: e?.target?.value || '',
                            };
                        })
                    }
                    autoSize={{ minRows: 3, maxRows: 3 }}
                />
            </div>
            <div className={styles.subItemsWrap}>
                {settingsList.map(({ name, key, max, min, unit }) => (
                    <div className={styles.mainRowsWrap}>
                        <div className={styles.rowsWrap}>
                            <div className={styles.subItemWrap}>
                                <p className={styles.headerText}>{name}</p>
                                <InfoCircleOutlined />
                            </div>
                            <InputNumber
                                className={styles.inputWraper}
                                defaultValue={
                                    modelSettings[key] ? modelSettings[key] : 0
                                }
                                readOnly
                                changeOnWheel
                            />
                        </div>
                        <Slider
                            className={styles.rangeSlider}
                            max={max}
                            min={min}
                            step={unit}
                            onChange={(e) => {
                                setModelSettings((prev) => {
                                    prev[key] = e?.target?.value || prev[key];
                                    return prev;
                                });
                            }}
                            defaultValue={
                                modelSettings[key] ? modelSettings[key] : 0
                            }
                        />
                    </div>
                ))}
            </div>
            <div className={styles.modelsButtonWrap}>
                <button className={styles.btnmodal}>Apply to All</button>
                <button className={styles.btnmodal}>Reset</button>
                <button className={styles.btnmodal}>Model Info</button>
            </div>
        </div>
    );

    const handleKeyDown = (event) => {
        event.stopPropagation();
        if (event.key === 'Enter') {
            setEditName(false);
        }
    };

    return (
        <div onClick={() => setIsExpanded(!isExpanded)}>
            <Collapse
                accordion
                expandIconPosition={'start'}
                expandIcon={() => (
                    <Image
                        alt="Logo"
                        style={{
                            borderRadius: '8px',
                        }}
                        height={32}
                        src="/modelDemoIcon.svg"
                        width={32}
                    />
                )}
                items={[
                    {
                        key: index,
                        label: editName ? (
                            <span>
                                {
                                    <Input
                                        onClick={(event) => {
                                            event.stopPropagation();
                                        }}
                                        onKeyDown={handleKeyDown}
                                        style={{
                                            cursor: 'pointer',
                                        }}
                                        defaultValue={modelName}
                                    />
                                }
                            </span>
                        ) : (
                            <span
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setEditName(true);
                                }}
                                style={{
                                    cursor: 'pointer',
                                }}
                            >
                                {modelName}
                            </span>
                        ),
                        children: settings,
                        extra: genExtra(),
                    },
                ]}
            />
        </div>
    );
};

export default ModalSettingCard;
