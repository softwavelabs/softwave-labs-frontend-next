'use client';

import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';

type LocaleContextType = {
    locale: string;
    setLocale: (locale: string) => void;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({
                                   children,
                                   initialLocale = 'en',
                               }: {
    children: React.ReactNode;
    initialLocale?: string;
}) {
    const [locale, setLocaleState] = useState(initialLocale);
    const router = useRouter();

    const setLocale = (newLocale: string) => {
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
        setLocaleState(newLocale);
        router.refresh();
    };

    return (
        <LocaleContext.Provider value={{ locale, setLocale }}>
            {children}
        </LocaleContext.Provider>
    );
}

export const useLocale = () => {
    const context = useContext(LocaleContext);
    if (!context) {
        throw new Error('useLocale must be used within LocaleProvider');
    }
    return context;
};
