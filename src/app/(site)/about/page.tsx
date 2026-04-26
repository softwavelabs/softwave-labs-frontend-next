"use client";
import { useLocale } from "@/app/contexts/LocaleContext";
import { useDictionary } from "@/app/hooks/useDictionary";
import React from "react";

interface ValueItem {
    title: string;
    description: string;
}

const AboutPage: React.FC = () => {
    const { locale } = useLocale();
    const { dictionary, loading } = useDictionary(locale, "about");

    const paragraphs = Array.isArray(dictionary?.paragraphs) ? dictionary.paragraphs : [];
    const values: ValueItem[] = Array.isArray(dictionary?.values) ? dictionary.values : [];

    const t = (key: string, fallback: string) =>
        loading ? fallback : (dictionary[key] ?? fallback);

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
                            {t("title", "About Us")}
                        </h1>
                        <p className="text-sm opacity-80">
                            {t("subtitle", "Who we are and what we build")}
                        </p>
                    </div>

                    <div className="space-y-10 text-sm text-justify " style={{ fontFamily: "NeueMontreal Regular" }}>
                        <p>{loading ? "" : paragraphs[0]}</p>
                        <p>{loading ? "" : paragraphs[1]}</p>
                        <p>{loading ? "" : paragraphs[2]}</p>
                        <p>{loading ? "" : paragraphs[3]}</p>
                    </div>

                    <div className="my-16 border-t-4" />

                    <div className="grid gap-8 sm:grid-cols-3 text-sm">
                        {loading
                            ? null
                            : values.map(
                                (v: ValueItem, index: number) => (
                                    <div key={index}>
                                        <h3 className="font-bold mb-2" style={{ fontFamily: "NeueMontreal Regular" }}>{v.title}</h3>
                                        <p className="opacity-80" style={{ fontFamily: "NeueMontreal Regular" }} >{v.description}</p>
                                    </div>
                                )
                            )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;