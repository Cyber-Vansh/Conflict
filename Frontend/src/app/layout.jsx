import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatDrawer from "@/components/chat/ChatDrawer";
import { Toaster } from "sonner";
import { ChatProvider } from "@/context/ChatContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Conflict",
  description: "Competitive Coding Arena",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ChatProvider>
          {children}
          <ChatDrawer />
        </ChatProvider>
        <Toaster
          theme="dark"
          position="top-center"
          toastOptions={{
            style: {
              background: '#0a0a0a',
              border: '1px solid #262626',
              color: '#fff',
            },
            classNames: {
              toast: 'group toast group-[.toaster]:bg-neutral-950 group-[.toaster]:text-white group-[.toaster]:border-neutral-800 group-[.toaster]:shadow-lg',
              description: 'group-[.toast]:text-neutral-400',
              actionButton: 'group-[.toast]:bg-emerald-600 group-[.toast]:text-white',
              cancelButton: 'group-[.toast]:bg-neutral-800 group-[.toast]:text-neutral-400',
              success: 'group-[.toaster]:border-emerald-500/50 group-[.toaster]:text-emerald-500',
              error: 'group-[.toaster]:border-red-500/50 group-[.toaster]:text-red-500',
              info: 'group-[.toaster]:border-blue-500/50 group-[.toaster]:text-blue-500',
              warning: 'group-[.toaster]:border-yellow-500/50 group-[.toaster]:text-yellow-500',
            }
          }}
        />
      </body>
    </html>
  );
}
