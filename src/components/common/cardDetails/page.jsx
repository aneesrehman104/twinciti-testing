import { useEffect, useState } from 'react';
import { Col, Row, Spin } from 'antd';
import { getApiWithAuth } from '../../../utils/api';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import CustomModal from '../modal/page';
import AddCard from '../AddCard/StripeWrapper';
import CardItem from '../cardItem';
import styles from './CardDetails.module.css';
import { URLs } from '../../../utils/apiUrl';
import ButtonComponent from '../button/Button';
const TwincitiButton = dynamic(
    () => import('../../common/twincitiButton/page'),
    {
        ssr: false,
    },
);

const CardDetails = ({ size = 6, setAllCards, type = '' }) => {
    const [cardNumbers, setCardNumbers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showAddCardModel, setShowAddCardModel] = useState(false);
    const [callApiAgain, setCallApiAgain] = useState(false);

    const handleAddCard = () => {
        setShowAddCardModel(true);
    };
    useEffect(() => {
        fetchDataFromAPI();
    }, []);

    const fetchDataFromAPI = async () => {
        setIsLoading(true);
        const response = await getApiWithAuth(URLs.GETPAYMENTMETHOD);
        setCardNumbers(
            !type
                ? response.data.data
                : response.data.data.filter((i) => i.type === type),
        );
        setAllCards(response.data.data);
        setIsLoading(false);
    };

    useEffect(() => {
        if (callApiAgain) {
            setShowAddCardModel(false);
            fetchDataFromAPI();
            setCallApiAgain(false);
        }
    }, [callApiAgain]);

    return (
        <>
            <div className={styles.mainContainer}>
                <div className={styles.topHeadingSettingPage}>
                    Account Payment
                </div>
                <div className={styles.mainInnerStyle}>
                    {isLoading ? (
                        <div className={styles.spinnerContainerCard}>
                            <Spin size="large" />
                        </div>
                    ) : cardNumbers.length > 0 ? (
                        <Row justify="end">
                            <Col md={size} span={24}>
                                <div>
                                    <ButtonComponent
                                        className={styles.planBtn}
                                        htmlType="button"
                                        label={'Add New Card'}
                                        onClick={handleAddCard}
                                    />
                                </div>
                            </Col>
                            <Col span={24}>
                                {cardNumbers.map((card, index) => (
                                    <CardItem
                                        card={card}
                                        key={card._id}
                                        setCallApiAgain={setCallApiAgain}
                                    />
                                ))}
                            </Col>
                        </Row>
                    ) : (
                        <div className={styles.emptyContainerData}>
                            <div>
                                <Image
                                    alt=""
                                    height={100}
                                    src="/solar_card-bold-duotone.svg"
                                    width={100}
                                />
                            </div>
                            <div>
                                <h1 className={styles.emptyContainerInnerData}>
                                    Add your first credit card for payment
                                </h1>
                                <p className={styles.emptyContainerInnerText}>
                                    This credit card will be used by default for
                                    billing
                                </p>
                            </div>
                            <TwincitiButton
                                htmlType="button"
                                label={'+\xa0\xa0\xa0\xa0Add New Card'}
                                onClick={handleAddCard}
                                style={{ width: '180px' }}
                            />
                        </div>
                    )}
                </div>
            </div>
            <CustomModal
                onClose={() => setShowAddCardModel(!showAddCardModel)}
                title={'Card Details'}
                visible={showAddCardModel}
            >
                <AddCard
                    key={Math.random()}
                    setCallApiAgain={setCallApiAgain}
                />
            </CustomModal>
        </>
    );
};

export default CardDetails;
