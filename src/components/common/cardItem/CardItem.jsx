import React, { useState } from 'react';
import { Col, Dropdown, Menu, message, Row } from 'antd';
import Image from 'next/image';
import { MoreOutlined } from '@ant-design/icons';
import styles from './cardItem.module.css';
import { deleteApiWithAuth, patchApiWithAuth } from '../../../utils/api';
import { URLs } from '../../../utils/apiUrl';

const cardBrandImages = {
    visa: '/visaCard.svg',
    mastercard: '/1156750_finance_mastercard_payment_icon.svg',
    amex: '/1156736_american_express_finance_payment_icon.svg',
    diners: '/1156716_club_diners_international_icon (1).svg',
    unionpay: '/icons8-unionpay.svg',
    cartesBancaires: '/204866.svg',
    jcb: '/209438_japan credit bureau_jcb_icon.svg',
};

const CardItem = ({ card, setCallApiAgain }) => {
    const [checkClick, setCheckClick] = useState(false);

    const setDefaultPaymentCard = async () => {
        const response = await patchApiWithAuth(URLs.DEFAULTPAYMENTMETHOD, {
            payment_method: card.payment_method,
        });
        if (response.success) {
            message.success(response.data, 1);
            setCallApiAgain(true);
        }
    };

    const handleDelete = async () => {
        const response = await deleteApiWithAuth(
            `${URLs.DELETEPAYMENTMETHOD}?payment_method=${card.payment_method}`,
        );
        if (response.success) {
            message.success(response.data, 1);
            setCallApiAgain(true);
        } else {
            message.error(response.message, 1);
        }
    };

    const menu = (
        <Menu className={styles.menuStyleAuthenticated}>
            <Menu.Item
                className={styles.menuItemStyleAuthenticated}
                key="1"
                onClick={setDefaultPaymentCard}
            >
                <div style={{ display: 'flex' }}>
                    <div>
                        <Image
                            alt="defaultSet"
                            height={24}
                            src="/defaultSet.svg"
                            style={{ marginRight: 5 }}
                            width={24}
                        />
                    </div>
                    Set as default
                </div>
            </Menu.Item>
            <Menu.Item
                className={styles.menuItemStyleAuthenticated}
                key="2"
                onClick={handleDelete}
            >
                <div style={{ display: 'flex' }}>
                    <div>
                        <Image
                            alt="deleteCard"
                            height={24}
                            src="/deleteCard.svg"
                            style={{ marginRight: 5 }}
                            width={24}
                        />
                    </div>
                    Delete
                </div>
            </Menu.Item>
        </Menu>
    );

    return (
        <Row
            gutter={[24, 0]}
            className={`${styles.simpleContainer} ${
                checkClick ? styles.simpleActiveContainer : ''
            }`}
        >
            <Col
                md={{ span: 3 }}
                span={5}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <div>
                    <Image
                        alt={cardBrandImages[card.brand?.toLowerCase()]}
                        className="cardBrandImg"
                        height={70}
                        src={cardBrandImages[card.brand?.toLowerCase()]}
                        width={70}
                    />
                </div>
            </Col>
            <Col
                md={{ span: 18 }}
                span={16}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <div style={{ color: '#fff' }}>
                    <div className={styles.cardNumber}>
                        **** **** **** {card.card_no}
                    </div>
                    <div className={styles.expireDate}>
                        Exp. date {card.exp_month.padStart(2, '0')}/
                        {card.exp_year}
                    </div>
                </div>
            </Col>
            <Col
                span={3}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                }}
            >
                {card.is_default && (
                    <span className={styles.defaultTextStyle}>Default</span>
                )}
                {card.is_default ? null : (
                    <div style={{ color: '#fff', cursor: 'pointer' }}>
                        <Dropdown
                            onOpenChange={() => setCheckClick(false)}
                            overlay={menu}
                            trigger={['click']}
                        >
                            <MoreOutlined
                                onClick={() => setCheckClick(true)}
                                style={{ fontSize: 24 }}
                            />
                        </Dropdown>
                    </div>
                )}
            </Col>
        </Row>
    );
};

export default CardItem;
