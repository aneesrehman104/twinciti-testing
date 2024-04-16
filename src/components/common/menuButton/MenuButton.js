import React, { useState } from 'react';
import Image from 'next/image';
import styles from './MenuButton.module.css';

const convertToSpace = (string) => string.replace(/-/g, ' ');

const MenuButton = ({
    label,
    iconURL,
    isOpen,
    setIsOpen,
    categories,
    selectedCategory,
    selectedCategoryId,
}) => {
    return (
        <div className={styles.menuStyle}>
            <div
                className={styles.menuStyleItem}
                onClick={() => setIsOpen(label)}
            >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Image
                        alt="Icon"
                        height={45}
                        src={iconURL ?? '/3dicons.svg'}
                        width={45}
                    />
                    <p style={{ textTransform: 'uppercase' }}>{label}</p>
                </div>
                <div>
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
                        key={index}
                        onClick={() => selectedCategory(category)}
                        style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <Image
                            alt="Icon"
                            height={52}
                            src={
                                selectedCategoryId === category.label
                                    ? '/sidebarActive.svg'
                                    : '/sidebarInactive.svg'
                            }
                            width={270}
                        />
                        <div
                            style={{
                                position: 'absolute',
                                paddingLeft: 15,
                                display: 'flex',
                                alignItems: 'center',
                                textTransform: 'capitalize',
                            }}
                        >
                            <Image
                                alt="/searchIcon.svg"
                                height={24}
                                src={'/modelImage.svg'}
                                width={24}
                                style={{ marginRight: 10 }}
                            />
                            <div>{convertToSpace(category.label)}</div>
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default MenuButton;
