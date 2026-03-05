import { useEffect, useState } from "react";

interface Locale {
    code: string;
    name: string;
}

export function useLocales() {
    const [locales, setLocales] = useState<Locale[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log(process.env.NEXT_PUBLIC_API_URL);
        async function fetchLocales() {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/i18n/locales`
                );

                const json = await res.json();

                // obsługa różnych formatów Strapi
                const localesArray = Array.isArray(json) ? json : json.data || [];

                setLocales(localesArray);
            } catch (err) {
                console.log(process.env.NEXT_PUBLIC_API_URL);
                console.error("Locales fetch error:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchLocales();
    }, []);

    return { locales, loading };
}