import styles from './ChatGistCard.module.css';
import { MoreOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { Dropdown } from 'antd';

const items = [
    {
        label: 'New',
        key: '0',
    },
    {
        label: 'Edit',
        key: '1',
    },
    {
        label: 'Delete',
        key: '2',
    },
];

const ChatGistCard = ({
    active = false,
    name,
    time,
    description,
    id,
    taskName,
}) => {
    const router = useRouter();

    return (
        <div
            className={`${styles.cardWrapper} ${
                active ? styles.cardWrapperActive : ''
            }`}
            onClick={() => {
                if (id)
                    router.push(
                        `/chats?category=${
                            taskName || 'text-generation'
                        }&&chatId=${id}`,
                    );
            }}
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
                            <Dropdown
                                overlayClassName={styles.optionsBox}
                                menu={{
                                    items,
                                }}
                                placement="bottomRight"
                                trigger={['click']}
                            >
                                <MoreOutlined />
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatGistCard;
