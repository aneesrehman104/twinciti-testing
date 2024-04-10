import styles from './Button.module.css';
import Image from 'next/image';

const ButtonComponent = ({
    label,
    onClick,
    htmlType = 'button',
    disabled,
    variant,
    showEllips = false,
    height = '32px',
}) => {
    const defaultStyle =
        variant === 'primary'
            ? styles.buttonPrimary
            : variant === 'secondary'
            ? styles.buttonSecondary
            : variant === 'dark'
            ? styles.buttonDark
            : variant === 'defaultActive'
            ? styles.buttonDefaultActive
            : styles.buttonDefault;
    return (
        <div className={variant === 'default' ? styles.btnGradient : null}>
            <button
                className={`${styles.buttonWrapper} ${defaultStyle}`}
                onClick={onClick}
                type={htmlType}
                disabled={disabled}
                title={label}
                aria-label={label}
                style={{ height }}
            >
                {showEllips ? <>&#x25cf;&ensp;</> : null}
                {label}
                {/* <sup>
                    <Image
                        src="/Z.svg"
                        alt="model"
                        width={15}
                        height={15}
                        style={{ marginTop: -25 }}
                    />
                </sup> */}
            </button>
        </div>
    );
};

export default ButtonComponent;
