import { useRouter } from 'next/navigation';
import { Form } from 'antd';
import styles from './Plans.module.css';
import { Slider } from 'antd';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ButtonComponent from '../../components/common/button/Button';
import { getApiWithAuth } from '../../utils/api';
import _ from 'lodash';
import { URLs } from '../../utils/apiUrl';

const Plans = () => {
    const router = useRouter();
    const [form] = Form.useForm();
    const [plans, setPlans] = useState([]);
    const [activePlan, setActivePlans] = useState({});

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
        </>
    );
};

export default Plans;
