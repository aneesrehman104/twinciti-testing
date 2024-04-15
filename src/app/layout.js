import { Inter } from 'next/font/google';
import { AntdRegistry } from '@ant-design/nextjs-registry';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Twinciti',
    description: 'Twinciti',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AntdRegistry>{children}</AntdRegistry>
            </body>
        </html>
    );
}
