import styles from './Button.module.css';
import Image from 'next/image';

const ButtonComponent = ({
    label,
    onClick,
    htmlType = 'button',
    disabled,
    variant,
    className = '',
    showEllips = false,
    height = '32px',
    width = '100%',
}) => {
    const defaultStyle =
        variant === 'activeBorder'
            ? styles.activeBorder
            : variant === 'activeBorderCancel'
            ? styles.activeBorderCancel
            : variant === 'activeBorderConfirm'
            ? styles.activeBorderConfirm
            : variant === 'activeBorderRed'
            ? styles.activeBorderRed
            : variant === 'primary'
            ? styles.buttonPrimary
            : variant === 'secondary'
            ? styles.buttonSecondary
            : variant === 'dark'
            ? styles.buttonDark
            : variant === 'defaultActive'
            ? styles.buttonDefaultActive
            : !className
            ? styles.buttonDefault
            : '';
    return (
        <div
            className={
                variant === 'activeBorder'
                    ? styles.activeBorder
                    : variant === 'default'
                    ? styles.btnGradient
                    : null
            }
        >
            <button
                className={`${styles.buttonWrapper} ${defaultStyle} ${className}`}
                onClick={onClick}
                type={htmlType}
                disabled={disabled}
                title={label}
            >
                {showEllips ? <>&#x25cf;&ensp;</> : null}
                {label}
            </button>
        </div>
    );
};

export default ButtonComponent;
