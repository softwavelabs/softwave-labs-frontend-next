"use client";

import React from "react";
import { useLocale } from "@/app/contexts/LocaleContext";
import { useDictionary } from "@/app/hooks/useDictionary";

interface FAQItem {
    q: string;
    a: string;
}

const FAQPage: React.FC = () => {
    const { locale } = useLocale();
    const { dictionary, loading } = useDictionary(locale, "faq");

    const items: FAQItem[] = Array.isArray(dictionary?.items)
        ? dictionary.items
        : [];

    const t = (key: string, fallback: string) =>
        loading ? fallback : (dictionary?.[key] ?? fallback);

    return (
        <div
            className="w-full flex justify-center"
            style={{
                fontFamily: "DotGothic16 Regular",
                lineHeight: 1.6,
            }}
        >
            <section className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
                <div className="mx-auto max-w-3xl">

                    <div className="mb-16 text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                            {t("title", "FAQ")}
                        </h1>
                        <p className="text-sm opacity-80">
                            {t("subtitle", "Frequently asked questions")}
                        </p>
                    </div>

                    <div className="space-y-6 text-sm">
                        {loading
                            ? null
                            : items.map((item, i) => (
                                <div key={i} className="border-4 p-4">
                                    <p className="font-bold mb-2" style={{ fontFamily: "NeueMontreal Regular" }}>{item.q}</p>
                                    <p className="opacity-80" style={{ fontFamily: "NeueMontreal Regular" }}>{item.a}</p>
                                </div>
                            ))}
                    </div>

                </div>
            </section>
        </div>
    );
};

export default FAQPage;