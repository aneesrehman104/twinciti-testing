import { useRouter } from 'next/navigation';
import { Form } from 'antd';
import styles from './Plans.module.css';
import { Slider } from 'antd';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ButtonComponent from '../../components/common/button/Button';
import { getApiWithAuth } from '../../utils/api';
import _ from 'lodash';

const Plans = () => {
    const router = useRouter();
    const [form] = Form.useForm();
    const [plans, setPlans] = useState([]);
    const [activePlan, setActivePlans] = useState('');

    useEffect(() => {
        (async () => {
            const res = await getApiWithAuth(`/stripe/products`);
            if (res?.data?.data?.products) setPlans(res.data.data.products);
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
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the
                    industry&apos;s standard dummy text ever since the 1500s,
                    when an unknown printer took a galley of type and scrambled
                    it to make a type specimen book. Lorem Ipsum is simply dummy
                    text.
                </div>
                <div className={styles.planItemMainWrap}>
                    {plans?.map((plan) => {
                        return (
                            <div
                                className={
                                    styles.plansContainer +
                                    ` ${
                                        activePlan === plan._id
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
                                        activePlan === plan._id
                                            ? 'Upgrade'
                                            : 'Subscribe Now'
                                    }
                                    className={
                                        activePlan === plan._id
                                            ? styles.activePlanBtn
                                            : styles.planBtn
                                    }
                                />

                                {plan?.description?.map((listitem) => {
                                    return (
                                        <div className={styles.listWrap}>
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
            </div>
        </>
    );
};

export default Plans;
