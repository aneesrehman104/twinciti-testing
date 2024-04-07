import styles from './Button.module.css';

const ButtonComponent = ({
    label,
    onClick,
    htmlType = 'button',
    disabled,
    variant,
    showEllips = false,
    height = '28px',
}) => {
    const defaultStyle =
        variant === 'primary'
            ? styles.buttonPrimary
            : variant === 'secondary'
            ? styles.buttonSecondary
            : variant === 'dark'
            ? styles.buttonDark
            : styles.buttonDefault;
    return (
        <button
            className={`${styles.buttonWrapper} ${defaultStyle}`}
            onClick={onClick}
            type={htmlType}
            disabled={disabled}
            title={label}
            aria-label={label}
            style={{ height }}
        >
            {showEllips && (
                <svg
                    width="6"
                    height="6"
                    viewBox="0 0 6 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle
                        cx="3"
                        cy="3"
                        r="3"
                        fill={variant === 'default' ? '#fff' : '#B784FF'}
                    />
                </svg>
            )}
            {label}
        </button>
    );
};

export default ButtonComponent;
