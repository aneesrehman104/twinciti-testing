import React, { useState } from 'react';
import { Col, Form, message, Row } from 'antd';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import './AddCard.css';
import { postApiWithAuth } from '../../../utils/api';
import { URLs } from '../../../utils/apiUrl';
import ButtonComponent from '../button/Button';

const {
    CardCvcElement,
    CardExpiryElement,
    CardNumberElement,
    useElements,
    useStripe,
} = require('@stripe/react-stripe-js');

const AddCard = ({ setCallApiAgain }) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const stripe = useStripe();
    const elements = useElements();
    const [form] = Form.useForm();
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [cardHolderName, setCardHolderName] = useState('');
    const [cardNumberError, setCardNumberError] = useState('');
    const [cardExpiryDateError, setCardExpiryDateError] = useState('');
    const [cardSecurityCodeError, setCardSecurityCodeError] = useState('');
    const [cardHolderNameError, setCardHolderNameError] = useState('');
    const [checkCard, setCheckCard] = useState({
        isValidNumber: false,
        isValidExpiry: false,
        isValidCvc: false,
    });

    const cardElementOptions = {
        style: {
            base: {
                color: '#c4c4c4',
                fontSize: '14px',
                fontFamily: 'var(--font-poppins)',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '24.167px',
                ':-webkit-autofill': {
                    color: '#FFFFFF',
                    backgroundColor: '#000000',
                    border: '1px solid #3f4147',
                },
            },
            height: '50px',
            borderRadius: '8px',
            border: '1px solid #3f4147',
            marginTop: '4px',
            background: '#000000',
            width: '100%',
            padding: '10px',
        },
    };

    const resetForm = () => {
        form.resetFields();
        setCardNumberError('');
        setCardExpiryDateError('');
        setCardSecurityCodeError('');
        setCardHolderName('');
        setCardHolderNameError('');
        setCheckCard({
            isValidNumber: false,
            isValidExpiry: false,
            isValidCvc: false,
        });
        if (elements) {
            const cardCvcElement = elements.getElement(CardCvcElement);
            const cardExpiryElement = elements.getElement(CardExpiryElement);
            const cardNumberElement = elements.getElement(CardNumberElement);

            if (cardCvcElement) {
                cardCvcElement.clear();
            }

            if (cardExpiryElement) {
                cardExpiryElement.clear();
            }

            if (cardNumberElement) {
                cardNumberElement.clear();
            }
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        if (!stripe || !elements) {
            return;
        }

        let cardElement = {};
        cardElement = {
            ...cardElement,
            ...elements.getElement(CardCvcElement),
            ...elements.getElement(CardExpiryElement),
            ...elements.getElement(CardNumberElement),
        };

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            metadata: { name: cardHolderName },
        });

        if (cardHolderName === '') {
            setCardHolderNameError('Please enter your name');
            return;
        }

        if (error) {
            message.error(error.message, 2);
            setLoading(false);
            setIsMessageVisible(true);
            setTimeout(() => {
                setIsMessageVisible(false);
            }, 2000);
        } else {
            const paymentMethodId = { payment_method: paymentMethod.id };
            const response = await postApiWithAuth(
                URLs.ADDPAYMENTMETHOD,
                paymentMethodId,
            );
            if (response.success) {
                message.success(response.data, 2);
                setLoading(false);
                setCallApiAgain(true);
                resetForm();
            } else {
                message.error(response.message, 2);
                setLoading(false);
                setIsMessageVisible(true);
                setTimeout(() => {
                    setIsMessageVisible(false);
                }, 1000);
            }
        }
    };

    const handleCardHolderName = (value) => {
        const alphabetRegex = /^[A-Za-z\s]+$/;
        const spaceRegex = /^\s|\s+$/;
        setCardHolderName(value);
        if (value === '') {
            setCardHolderNameError('Please enter card holder name');
        } else if (spaceRegex.test(value)) {
            setCardHolderNameError(
                'Spaces are not allowed at the beginning or end.',
            );
        } else if (!alphabetRegex.test(value)) {
            setCardHolderNameError(
                'Invalid characters. Only alphabets are allowed.',
            );
        } else {
            setCardHolderNameError('');
        }
    };

    const isDisabled =
        !cardHolderName ||
        !checkCard.isValidNumber ||
        cardHolderNameError ||
        !checkCard.isValidExpiry ||
        !checkCard.isValidCvc;

    const onChangeHandleCard = (event) => {
        if (event.elementType === 'cardNumber') {
            if (event.complete) {
                setCardNumberError('');
                setCheckCard({
                    ...checkCard,
                    isValidNumber: true,
                });
            } else {
                setCardNumberError('Please enter card number');
                setCheckCard({
                    ...checkCard,
                    isValidNumber: false,
                });
            }
        } else if (event.elementType === 'cardExpiry') {
            setCardExpiryDateError('');
            if (event.complete) {
                setCheckCard({
                    ...checkCard,
                    isValidExpiry: true,
                });
            } else {
                setCardExpiryDateError('Please enter expiry date');
                setCheckCard({
                    ...checkCard,
                    isValidExpiry: false,
                });
            }
        } else if (event.elementType === 'cardCvc') {
            if (event.complete) {
                setCardSecurityCodeError('');
                setCheckCard({
                    ...checkCard,
                    isValidCvc: true,
                });
            } else {
                setCardSecurityCodeError('Please enter security code');
                setCheckCard({
                    ...checkCard,
                    isValidCvc: false,
                });
            }
        }
    };

    return (
        <>
            <div>
                <Form
                    autoComplete="false"
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Row gutter={[20, 5]}>
                        <Col span={12} xs={{ span: 24 }}>
                            <div className="cardDetailLabels">
                                <label>Card Holder Name</label>
                            </div>{' '}
                            <input
                                className={`cardCvcElement ${
                                    cardHolderNameError ? 'errorBorder' : ''
                                }`}
                                onChange={(event) =>
                                    handleCardHolderName(event.target.value)
                                }
                                placeholder="Cardholder Name"
                                value={cardHolderName}
                            />
                            <p className="errorText">{cardHolderNameError}</p>
                        </Col>
                        <Col span={12} xs={{ span: 24 }}>
                            <div className="cardDetailLabels">
                                <label>Card Number</label>
                            </div>
                            <CardNumberElement
                                className={`cardCvcElement ${
                                    cardNumberError ? 'errorBorder' : ''
                                }`}
                                onChange={onChangeHandleCard}
                                options={cardElementOptions}
                            />
                            {!checkCard.isValidNumber ? (
                                <p className="errorText">{cardNumberError}</p>
                            ) : null}
                        </Col>

                        <Col md={{ span: 12 }} xs={{ span: 24 }}>
                            <div className="cardDetailLabels">
                                <label>Expiration Date</label>
                            </div>
                            <CardExpiryElement
                                className={`cardCvcElement ${
                                    cardExpiryDateError ? 'errorBorder' : ''
                                }`}
                                onChange={onChangeHandleCard}
                                options={cardElementOptions}
                            />
                            {!checkCard.isValidExpiry ? (
                                <p className="errorText">
                                    {cardExpiryDateError}
                                </p>
                            ) : null}
                        </Col>
                        <Col md={{ span: 12 }} xs={{ span: 24 }}>
                            <div className="cardDetailLabels">
                                <label>Security Code</label>
                            </div>
                            <CardCvcElement
                                className={`cardCvcElement ${
                                    cardSecurityCodeError ? 'errorBorder' : ''
                                }`}
                                onChange={onChangeHandleCard}
                                options={cardElementOptions}
                            />
                            {!checkCard.isValidCvc ? (
                                <p className="errorText">
                                    {cardSecurityCodeError}
                                </p>
                            ) : null}
                        </Col>
                    </Row>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <ButtonComponent
                            disabled={isDisabled}
                            htmlType="submit"
                            label={'Submit'}
                            className={'activePlanBtn'}
                            loading={loading || isMessageVisible}
                            style={{ marginTop: '12px', width: '120px' }}
                        />
                    </div>
                </Form>
            </div>
        </>
    );
};

export default AddCard;
