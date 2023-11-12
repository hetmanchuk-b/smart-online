import React from "react";
import type { Metadata } from 'next';
import '@/styles/globals.css';
import {Navbar} from "@/components/navbar";
import {ToasterProvider} from "@/providers/toaster-provider";
import {SocketProvider} from "@/providers/socket-provider";
import {ModalProvider} from "@/providers/modal-provider";
import {font} from "@/lib/fonts";
import {QueryProvider} from "@/providers/query-provider";


export const metadata: Metadata = {
  title: 'Smart Teams App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode,
  authModal: React.ReactNode,
}) {
  return (
    <html lang="en">
      <body className={font.className}>
      <SocketProvider>
        <Navbar />
        {authModal}
        <div className="h-full pt-[60px]">
          <QueryProvider>
            {children}
          </QueryProvider>
        </div>

        <ToasterProvider />
        <ModalProvider />
      </SocketProvider>
      </body>
    </html>
  )
}