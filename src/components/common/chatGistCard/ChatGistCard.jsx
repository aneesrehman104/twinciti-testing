import styles from './ChatGistCard.module.css';
import { MoreOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const ChatGistCard = ({
    active = false,
    name,
    time,
    description,
    currentModelSettings,
    defaultModelSettings,
}) => {
    const formatNumber = (num) => {
        if (num < 1000) {
            return num.toString();
        } else if (num < 1e6) {
            return `${(num / 1e3).toFixed(0)}k`;
        }
        return `${(num / 1e6).toFixed(1)}M`;
    };
    return (
        <div
            className={
                active
                    ? styles.cardWrapper + ' ' + styles.cardWrapperActive
                    : styles.cardWrapper
            }
        >
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <div className={styles.cardTitleImage}>
                        <p className={styles.cardTitle}>{name}</p>
                        <div className={styles.cardBody}>
                            <p>{description}</p>
                        </div>
                    </div>
                    <div className={styles.sidewrap}>
                        <p className={styles.timeWrap}>
                            {dayjs(time).format('HH:mm')}
                        </p>
                        <div className={styles.cardActions}>
                            <MoreOutlined />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatGistCard;
