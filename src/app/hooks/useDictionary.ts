'use client';

import { useEffect, useState } from 'react';

export function useDictionary(locale: string, page: string) {
    const [dictionary, setDictionary] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        setLoading(true);
        import(`@/locales/${locale}/${page}.json`)
            .then((module) => {
                if (mounted) {
                    setDictionary(module.default);
                    setLoading(false);
                }
            })
            .catch(() => {
                if (mounted) {
                    setDictionary({});
                    setLoading(false);
                }
            });

        return () => {
            mounted = false;
        };
    }, [locale, page]);

    return { dictionary, loading };
}
