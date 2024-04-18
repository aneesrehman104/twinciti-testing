import React from 'react';
import Image from 'next/image';
import styles from './ModalSettingCard.module.css';
import { Collapse, Switch, Input, Dropdown, InputNumber, Slider } from 'antd';
import ButtonComponent from '../button/Button';
import {
    DownOutlined,
    DeleteOutlined,
    InfoCircleOutlined,
} from '@ant-design/icons';

const handleMenuClick = (e) => {};
const items = [
    {
        label: '1st menu item',
        key: '1',
    },
    {
        label: '2nd menu item',
        key: '2',
    },
    {
        label: '3rd menu item',
        key: '3',
    },
    {
        label: '4rd menu item',
        key: '4',
    },
];

const settingsList = [
    { name: 'Max Tokens' },
    { name: 'Chat Memory' },
    { name: 'Temperature' },
    { name: 'Top P' },
    { name: 'Top K' },
    { name: 'Frequency Penalty' },
    { name: 'Presence Penalty' },
    { name: 'Repetition Penalty' },
    { name: 'Min P' },
    { name: 'Top A' },
];

const menuProps = {
    items,
    onClick: handleMenuClick,
};

const ModalSettingCard = ({
    index = -1,
    modelName = '',
    currentModelSettings = {},
    defaultModelSettings = {},
}) => {
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
                    icon={<DownOutlined />}
                    menu={menuProps}
                    onClick={() => {}}
                >
                    Dropdown
                </Dropdown.Button>
            </div>
            <div className={styles.itemsWrap}>
                <span className={styles.labelText}>Description</span>
                <Input.TextArea
                    className={styles.textAreaWrap}
                    placeholder="Autosize height with minimum and maximum number of lines"
                    autoSize={{ minRows: 3, maxRows: 3 }}
                />
            </div>
            <div className={styles.subItemsWrap}>
                {settingsList.map((se) => (
                    <div className={styles.mainRowsWrap}>
                        <div className={styles.rowsWrap}>
                            <div className={styles.subItemWrap}>
                                <p className={styles.headerText}>{se?.name}</p>
                                <InfoCircleOutlined />
                            </div>
                            <InputNumber
                                className={styles.inputWraper}
                                min={se?.min}
                                max={se?.max}
                                defaultValue={
                                    currentModelSettings[se?.key]
                                        ? currentModelSettings[se?.key]
                                        : 0
                                }
                                onChange={() => {}}
                                readOnly
                                changeOnWheel
                            />
                        </div>
                        <Slider
                            className={styles.rangeSlider}
                            min={se?.min}
                            max={se?.max}
                            onChange={() => {}}
                            value={
                                currentModelSettings[se?.key]
                                    ? currentModelSettings[se?.key]
                                    : 0
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
