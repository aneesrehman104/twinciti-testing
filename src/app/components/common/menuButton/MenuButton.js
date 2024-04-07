import React from 'react';
import Image from 'next/image';
import styles from './MenuButton.module.css';

const convertToSpace = (string) => string.replace(/-/g, ' ');

const MenuButton = ({ label, iconURL, isOpen, setIsOpen, categories }) => {
    return (
        <div className={styles.menuStyle}>
            <div className={styles.menuStyleItem}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Image
                        alt="Icon"
                        height={45}
                        src={iconURL ?? '/3dicons.svg'}
                        width={45}
                    />
                    <p style={{ textTransform: 'uppercase' }}>{label}</p>
                </div>
                <div onClick={() => setIsOpen(label)}>
                    <Image
                        alt="Icon"
                        height={16}
                        src={isOpen ? '/upIcon.svg' : '/downIcon.svg'}
                        width={16}
                    />
                </div>
            </div>
            {isOpen &&
                categories &&
                categories.length > 0 &&
                categories.map((category, index) => (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            marginBottom:
                                index !== categories.length - 1
                                    ? '0px'
                                    : '10px',
                        }}
                    >
                        <div
                            style={{
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                height: 50,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRightStyle: 'none',
                                borderRadius: '10px 10px 0px 10px',
                                width: '25%',
                                marginTop: '-8px',
                            }}
                        >
                            <Image
                                alt="/searchIcon.svg"
                                height={24}
                                src={category.iconUrl ?? '/searchIcon.svg'}
                                width={24}
                            />
                        </div>
                        <p
                            style={{
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                height: 42,
                                display: 'flex',
                                alignItems: 'center',
                                borderLeftStyle: 'none',
                                borderRadius: '0px 10px 10px 0px',
                                width: '80%',
                                textTransform: 'capitalize',
                            }}
                        >
                            {convertToSpace(category.label)}
                        </p>
                    </div>
                ))}
        </div>
    );
};

export default MenuButton;
