import React from 'react';
import styles from './PageWrapper.module.css';

const PageWrapper = ({ children }) => {
    return (
        <div className={styles.pageWrapper}>
            <div className={styles.pageContentWrapper}>{children}</div>
        </div>
    );
};

export default PageWrapper;
