import React from 'react';
import Image from 'next/image';
import styles from './ModelCard.module.css';

import ButtonComponent from '../button/Button';

const ModelCard = ({ active = false }) => {
    return (
        <div
            className={active ? styles.cardWrapperGradient : styles.cardWrapper}
        >
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <div className={styles.cardTitleImage}>
                        <Image
                            src="/3dicons.svg"
                            alt="model"
                            width={40}
                            height={40}
                            className={styles.modelImage}
                        />
                        <p>bert-base-arabic-camelbert-da-sentiment</p>
                    </div>
                    <div className={styles.cardActions}>
                        <Image
                            src="/3dicons.svg"
                            alt="model"
                            width={40}
                            height={40}
                            className={styles.modelImage}
                        />
                    </div>
                </div>
                <div className={styles.cardBody}>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Facilis harum dignissimos cumque necessitatibus
                        similique aperiam, animi ipsum distinctio doloremque
                        voluptates voluptatum neque possimus, nesciunt iste
                        consectetur atque architecto, iure sint?
                    </p>
                    <div className={styles.cardInfoWrapper}>
                        <p className={styles.cardTextInfoWrapper}>
                            <Image
                                src="/message-text.svg"
                                height={16}
                                width={16}
                                alt="message-text-icon"
                            />
                            <span>Text Generation</span>
                        </p>
                        <p className={styles.cardTextInfoWrapper}>
                            <Image
                                src="/download-icon.svg"
                                height={16}
                                width={16}
                                alt="download-icon"
                            />
                            <span>122</span>
                        </p>
                    </div>
                </div>
                <div
                    style={{
                        background: 'url(/active-bg.svg)',
                        height: '100%',
                        border: '.5px solid #ffffff00 ',
                    }}
                >
                    <div className={styles.cardFooter}>
                        <ButtonComponent label="Active" variant="secondary" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModelCard;
