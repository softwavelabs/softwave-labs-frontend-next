"use client";

import React from "react";
import { useLocale } from "@/app/contexts/LocaleContext";
import { useDictionary } from "@/app/hooks/useDictionary";

const PrivacyPolicyPage: React.FC = () => {
    const { locale } = useLocale();
    const { dictionary, loading } = useDictionary(locale, "privacy");

    const t = (key: string, fallback: string) =>
        loading ? fallback : dictionary?.[key] ?? fallback;

    const sections = Array.isArray(dictionary?.sections)
        ? dictionary.sections
        : [];

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

                    {/* HEADER */}
                    <div className="mb-16 text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                            {t("title", "Privacy Policy")}
                        </h1>
                        <p className="text-sm opacity-80">
                            {t("subtitle", "How we process your data and cookies")}
                        </p>
                    </div>

                    {/* SECTIONS */}
                    <div className="space-y-6 text-sm">

                        {loading
                            ? null
                            : sections.map((section: any, i: number) => (
                                <div key={i} className="border-4 p-5">
                                    <h2
                                        className="font-bold mb-3 text-base"
                                        style={{ fontFamily: "NeueMontreal Regular" }}
                                    >
                                        {section.title}
                                    </h2>

                                    <div
                                        className="opacity-80 space-y-2"
                                        style={{ fontFamily: "NeueMontreal Regular" }}
                                    >
                                        {Array.isArray(section.content) ? (
                                            section.content.map((line: string, idx: number) => (
                                                <p key={idx}>{line}</p>
                                            ))
                                        ) : (
                                            <p>{section.content}</p>
                                        )}
                                    </div>
                                </div>
                            ))}

                        {!loading && sections.length === 0 && (
                            <div className="border-4 p-5">
                                <p className="opacity-80">
                                    {t("empty", "No privacy policy content available.")}
                                </p>
                            </div>
                        )}
                    </div>

                </div>
            </section>
        </div>
    );
};

export default PrivacyPolicyPage;