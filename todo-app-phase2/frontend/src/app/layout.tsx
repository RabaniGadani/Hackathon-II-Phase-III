import '../styles/globals.css';
import { Providers } from './providers';
import { AuthProvider } from './contexts/auth-context';
import Navbar from './components/Navbar';
import Footer from '../components/Footer';
import ToastProvider from '../components/ToastProvider';
import { FloatingChatWidget } from '../components/chat';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Providers>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
                {children}
              </main>
              <Footer/>
            </div>
            <ToastProvider />
            <FloatingChatWidget />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}