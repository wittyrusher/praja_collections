import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';
import SessionProvider from '../components/SessionProvider';
import Script from 'next/script';
import { APP_NAME, APP_DESCRIPTION } from '../utils/constants';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <AuthProvider>
            <CartProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
              <Toaster position="top-right" />
            </CartProvider>
          </AuthProvider>
        </SessionProvider>

        {/* Razorpay Script */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}