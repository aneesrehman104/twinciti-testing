import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './ModalSettingCard.module.css';
import { Collapse, Switch, Input, Dropdown, InputNumber, Slider } from 'antd';
import ButtonComponent from '../button/Button';
import {
    DownOutlined,
    DeleteOutlined,
    InfoCircleOutlined,
} from '@ant-design/icons';
import { postApiWithAuth } from '../../../utils/api';

const handleMenuClick = (e) => {};

const menuProps = {
    items: [],
    onClick: handleMenuClick,
};

const settingsList = [
    { name: 'Max Tokens', key: 'max_token' },
    { name: 'Chat Memory', key: 'chat_memory' },
    { name: 'Temperature', key: 'temperature' },
    { name: 'Top P', key: 'top_p' },
    { name: 'Top K', key: 'top_k' },
    { name: 'Frequency Penalty', key: 'frequency_penalty' },
    { name: 'Presence Penalty', key: 'presence_penalty' },
    { name: 'Repetition Penalty', key: 'repetition_penalty' },
    { name: 'Min P', key: 'min_p' },
    { name: 'Top A', key: 'top_a' },
];

const ModalSettingCard = ({
    modelId,
    chatId,
    index = -1,
    modelName = '',
    currentModelSettings = {},
}) => {
    const [modelSettings, setModelSettings] = useState(currentModelSettings);
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

    const genExtra = () => (
        <>
            <Switch
                defaultChecked
                onChange={() => {}}
                onClick={(checked, event) => {
                    event.stopPropagation();
                }}
            />
            <DeleteOutlined
                onClick={(event) => {
                    event.stopPropagation();
                }}
            />
            <DownOutlined />
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
                {settingsList.map(({ name, key }) => (
                    <div className={styles.mainRowsWrap} key={key}>
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
                            onChange={(e) => {
                                setModelSettings((prev) => {
                                    prev[key] = e?.target?.value || prev[key];
                                    return prev;
                                });
                            }}
                            value={modelSettings[key] ? modelSettings[key] : 0}
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

    const item = {
        key: index,
        label: modelName,
        children: settings,
        extra: genExtra(),
    };

    return (
        <Collapse
            accordion
            expandIconPosition={'start'}
            expandIcon={() => (
                <Image alt="Logo" height={32} src="/whitelogo.svg" width={32} />
            )}
            items={[item]}
        />
    );
};

export default ModalSettingCard;
