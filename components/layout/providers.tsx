'use client';
import React from 'react';
import ThemeProvider from './ThemeToggle/theme-provider';
import { SessionProvider, SessionProviderProps } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

export default function Providers({
    session,
    children
}: {
    session: SessionProviderProps['session'];
    children: React.ReactNode;
}) {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <SessionProvider session={session}>
                        {children}
                    </SessionProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </>
    );
}
