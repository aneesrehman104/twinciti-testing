import React from 'react';
import { Dropdown, Menu } from 'antd';
import styles from './DropdownMenu.module.css';

const DropdownMenu = ({
    children,
    items = [],
    placement = 'bottomRight',
    onOpenChange,
    open,
    trigger = 'click',
}) => {
    const menu = (
        <Menu className={styles.menuStyleAuthenticated}>
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <div
                        className={styles.menuItemStyleAuthenticated}
                        onClick={item.onClick}
                    >
                        {item.label}
                    </div>
                </React.Fragment>
            ))}
        </Menu>
    );
    return (
        <Dropdown
            overlay={menu}
            onOpenChange={onOpenChange}
            placement={placement}
            trigger={[trigger]}
            open={open}
        >
            {children}
        </Dropdown>
    );
};

export default DropdownMenu;
