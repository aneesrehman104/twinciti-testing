import { useRouter } from 'next/navigation';
import { Col, Form, Row, message } from 'antd';
import styles from './Plans.module.css';
import { Slider } from 'antd';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ButtonComponent from '../../components/common/button/Button';
import { getApiWithAuth, postApiWithAuth } from '../../utils/api';
import _ from 'lodash';
import { URLs } from '../../utils/apiUrl';
import CustomModal from '../../components/common/modal/page';
import CardDetails from '../../components/common/cardDetails/page';
import TwincitiButton from '../../components/common/twincitiButton/page';
import Link from 'next/link';

const methodsArray = [
    { name: 'Paypal', icon: '/paypal.svg', type: 'paypal' },
    { name: 'Apple pay', icon: '/apple.svg', type: 'applepay' },
    { name: 'Credit/Debit card', icon: '/card.svg', type: 'card' },
];

const Plans = () => {
    const router = useRouter();
    const [form] = Form.useForm();
    const [plans, setPlans] = useState([]);
    const [activePlan, setActivePlans] = useState({});
    const [showSelectedModal, setShowSelectedModal] = useState(false);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState('');
    const [allCards, setAllCards] = useState([]);
    const [paymentId, setPaymentId] = useState({ price_id: null, name: '' });
    const [spinner, setSpinner] = useState(false);

    useEffect(() => {
        (async () => {
            const res1 = await getApiWithAuth(`/stripe/products`);
            if (res1?.data?.data?.products) setPlans(res1.data.data.products);
            const res = await getApiWithAuth(`${URLs.SUBSCRIPTION}`);
            if (res.data.success) {
                if (
                    res?.data?.data?.is_paid &&
                    res?.data?.data?.userSubscription
                ) {
                    setActivePlans(res.data.data.userSubscription);
                }
            } else {
                message.open({
                    type: 'error',
                    content: `${res.data.message}`,
                    duration: 2,
                });
            }
        })();
    }, []);

    const selectedPaymentMethod = async () => {
        setShowSelectedModal(false);
        setShowCheckoutModal(true);
    };

    const createSubscription = async () => {
        setSpinner(true);
        setSelectedMethod('');
        const payment_method = allCards?.filter((item) => item.is_default);
        const res = await postApiWithAuth(`${URLs.SUBSCRIPTION}`, {
            price_id: paymentId.price_id,
            payment_method: payment_method.payment_method,
        });
        if (res.success) {
            message.open({
                type: 'success',
                content: `${res.data}`,
                duration: 2,
            });
            setShowCheckoutModal(false);
            setSpinner(false);

            // router.push('/');
        } else {
            setSpinner(false);

            message.open({
                type: 'error',
                content: `${res.data}`,
                duration: 2,
            });
        }
    };

    return (
        <>
            <div
                style={{
                    width: '100%',
                    overflow: 'auto',
                    height: '100%',
                }}
            >
                <div className={styles.topHeadingStyle}>Plans Details</div>
                <div className={styles.topParagraphStyleWrap}>
                    Adjust the sliders to see how much quota you can get for
                    each type of content. e.g If you plan to generate words 50%
                    of the time, move the slider for words 1/2 way
                </div>
                <div className={styles.planItemMainWrap}>
                    {plans?.map((plan, index) => {
                        return (
                            <div
                                key={plan?._id}
                                className={
                                    styles.plansContainer +
                                    ` ${
                                        activePlan.subscription_code ===
                                        plan.subscription_code
                                            ? styles.plansContainerActive
                                            : ''
                                    }`
                                }
                            >
                                {plan?.offerPrice ? (
                                    <div className={styles.offerContainer}>
                                        <div
                                            className={
                                                styles.offerTextContainer
                                            }
                                        >
                                            <div
                                                className={
                                                    styles.offerTextTitle
                                                }
                                            >
                                                {plan?.offerTitle || ''}
                                            </div>
                                            <div
                                                className={
                                                    styles.offerTextSubTitle
                                                }
                                            >
                                                {plan?.offerSubtitle || ''}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    ''
                                )}
                                <div className={styles.headingStyle}>
                                    {plan?.name || ''}
                                </div>
                                <div className={styles.boldHeadingStyle}>
                                    {plan?.offerPrice ? (
                                        <>
                                            <div
                                                className={styles.discountText}
                                            >
                                                $
                                                <span
                                                    className={
                                                        styles.headingStyleWrap
                                                    }
                                                >
                                                    {plan.price}
                                                </span>
                                            </div>
                                            <div
                                                className={
                                                    styles.afterDiscountText
                                                }
                                            >
                                                $
                                                <span
                                                    className={
                                                        styles.headingStyleWrap
                                                    }
                                                >
                                                    {plan.offerPrice}
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <div
                                            className={styles.afterDiscountText}
                                        >
                                            $
                                            <span
                                                className={
                                                    styles.headingStyleWrap
                                                }
                                            >
                                                {plan.price}
                                            </span>
                                        </div>
                                    )}
                                    <sub className={styles.topParagraphStyle}>
                                        {_.capitalize(plan.interval)}
                                    </sub>
                                </div>

                                <ButtonComponent
                                    label={
                                        activePlan.subscription_code ===
                                        plan.subscription_code
                                            ? 'Upgrade'
                                            : 'Subscribe Now'
                                    }
                                    onClick={() => {
                                        setPaymentId(plan);
                                        setShowSelectedModal(true);
                                    }}
                                    className={
                                        activePlan.subscription_code ===
                                        plan.subscription_code
                                            ? styles.activePlanBtn
                                            : styles.planBtn
                                    }
                                />

                                {plan?.description?.map((listitem, index) => {
                                    return (
                                        <div
                                            key={listitem?._id}
                                            className={styles.listWrap}
                                        >
                                            {' '}
                                            <div
                                                className={
                                                    styles.usageStatContainer
                                                }
                                            >
                                                <div
                                                    className={
                                                        styles.usageStatdescription
                                                    }
                                                >
                                                    <Image
                                                        alt="tick"
                                                        height={12}
                                                        src="/tick.svg"
                                                        width={12}
                                                    />
                                                    {listitem?.text || ''}
                                                </div>
                                                {listitem?.provide ? (
                                                    <div
                                                        className={
                                                            styles.usageStatSliderContainer
                                                        }
                                                    >
                                                        <span
                                                            className={
                                                                styles.usageStatSliderText
                                                            }
                                                        >
                                                            {listitem?.minUsage}
                                                        </span>
                                                        <Slider
                                                            className={
                                                                styles.usageStatSlider
                                                            }
                                                            max={
                                                                listitem?.maxUsage
                                                            }
                                                            min={
                                                                listitem?.minUsage
                                                            }
                                                            value={
                                                                listitem?.currentUsage
                                                            }
                                                        />
                                                        <span
                                                            className={
                                                                styles.usageStatSliderText
                                                            }
                                                        >
                                                            {listitem?.maxUsage}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
                <span className={styles.warningNote}>
                    * Quota limits are estimates and can vary based on several
                    factors including the models you use.
                </span>
            </div>
            <CustomModal
                onClose={() => setShowSelectedModal(false)}
                title={'Choose payment method'}
                headerClassName={styles.modalHeadingStyle}
                visible={showSelectedModal}
                width={600}
            >
                <>
                    {methodsArray.map((item) => {
                        return (
                            <div
                                className={
                                    styles.simpleContainer +
                                    ` ${
                                        item.type === selectedMethod
                                            ? styles.simpleContainerActive
                                            : ''
                                    }`
                                }
                                key={item.name}
                                onClick={() => setSelectedMethod(item.type)}
                            >
                                <div
                                    style={{
                                        paddingLeft: 20,
                                        display: 'flex',
                                    }}
                                >
                                    <Image
                                        alt={item.icon}
                                        height={24}
                                        src={item.icon}
                                        style={{
                                            cursor: 'pointer',
                                            marginRight: 10,
                                        }}
                                        width={24}
                                    />
                                    {item.name}
                                </div>
                            </div>
                        );
                    })}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'end',
                        }}
                    >
                        <ButtonComponent
                            disabled={selectedMethod === ''}
                            htmlType="button"
                            label="Next"
                            className={
                                selectedMethod
                                    ? styles.activePlanBtn
                                    : styles.planBtn
                            }
                            style={{ width: '140px', marginTop: '15px' }}
                            onClick={() => selectedPaymentMethod()}
                        />
                    </div>
                </>
            </CustomModal>

            <CustomModal
                onClose={() => setShowCheckoutModal(false)}
                title={'Checkout Form'}
                visible={showCheckoutModal}
                width={600}
            >
                <CardDetails
                    type={selectedMethod}
                    size={24}
                    setAllCards={setAllCards}
                    setType={setSelectedMethod}
                />

                <Row className={`${styles.simpleContainer}`}>
                    <Col span={12}>
                        <div>
                            <h2>Your Selected Plan</h2>
                            <p>{paymentId?.name}</p>
                        </div>
                    </Col>
                    <Col
                        span={12}
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                        <Link
                            href="/setting?path=1"
                            onClick={() => setShowCheckoutModal(false)}
                        >
                            Change
                        </Link>
                    </Col>
                </Row>
                <ButtonComponent
                    htmlType="button"
                    label="Checkout"
                    style={{ width: '100%', marginTop: '15px' }}
                    onClick={() => createSubscription()}
                    disabled={spinner || allCards.length === 0}
                    className={styles.activePlanBtn}
                />
            </CustomModal>
        </>
    );
};

export default Plans;
