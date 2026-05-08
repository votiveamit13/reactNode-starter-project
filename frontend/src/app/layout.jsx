import { Outfit } from 'next/font/google';
import './globals.css';
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
const outfit = Outfit({
  subsets: ["latin"],
});
export default function RootLayout({ children, }) {
  return (<html lang="en">
    <body className={`${outfit.className} dark:bg-gray-900`}>
      <ThemeProvider>
        <SidebarProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="bottom-right"
              containerStyle={{
                zIndex: 999999,
              }}
              toastOptions={{
                style: {
                  zIndex: 999999,
                },
              }}
            />
          </AuthProvider>
        </SidebarProvider>
      </ThemeProvider>
    </body>
  </html>);
}
