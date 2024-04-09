import React from 'react';
import Image from 'next/image';
import ButtonComponent from '../button/Button';
import DropdownMenu from '../dropdownMenu/DropdownMenu';
import styles from './ModelCard.module.css';

const ModelCard = ({
    active = false,
    modelName,
    description,
    defaultActive,
    modified_task_name,
    downloads,
    dorpdownOption,
}) => {
    const [open, setOpen] = React.useState(false);

    const formatNumber = (num) => {
        if (num < 1000) {
            return num.toString();
        } else if (num < 1e6) {
            return `${(num / 1e3).toFixed(0)}k`;
        }
        return `${(num / 1e6).toFixed(1)}M`;
    };

    const openHandler = () => setOpen(!open);

    return (
        <>
            <div
                className={
                    !active ? styles.cardWrapper : styles.cardWrapperGradient
                }
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
                            <p>{modelName}</p>
                        </div>
                        <div className={styles.cardActions}>
                            <DropdownMenu
                                onOpenChange={openHandler}
                                open={open}
                                items={dorpdownOption}
                                innerData={
                                    <Image
                                        src={
                                            active
                                                ? '/selectedModel.svg'
                                                : '/unselectedModel.svg'
                                        }
                                        alt="model"
                                        width={40}
                                        height={40}
                                        onClick={openHandler}
                                        className={styles.modelImage}
                                    />
                                }
                            />
                        </div>
                    </div>
                    <div className={styles.cardBody}>
                        <p>{description}</p>
                        <div className={styles.cardInfoWrapper}>
                            <p className={styles.cardTextInfoWrapper}>
                                <Image
                                    src="/message-text.svg"
                                    height={16}
                                    width={16}
                                    alt="message-text-icon"
                                />
                                <span>{modified_task_name}</span>
                            </p>
                            <p className={styles.cardTextInfoWrapper}>
                                <Image
                                    src="/download-icon.svg"
                                    height={16}
                                    width={16}
                                    alt="download-icon"
                                />
                                <span>{formatNumber(downloads)}</span>
                            </p>
                        </div>
                    </div>
                    <div
                        style={{
                            background: active
                                ? 'url(/active-bg.svg)'
                                : 'transparent',
                            height: '100%',
                            border: '.5px solid #ffffff00 ',
                        }}
                    >
                        <div className={styles.cardFooter}>
                            <ButtonComponent
                                label="Active"
                                variant={
                                    active
                                        ? 'default'
                                        : defaultActive
                                        ? 'defaultActive'
                                        : 'secondary'
                                }
                                showEllips
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ModelCard;
