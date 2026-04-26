"use client";

import React, { useEffect, useState } from "react";
import { useDictionary} from "@/app/hooks/useDictionary";
import {useLocale} from "@/app/contexts/LocaleContext";

const COOKIE_KEY = "cookie_consent";

type Consent = {
    necessary: true;
    analytics: boolean;
    marketing: boolean;
};

const defaultConsent: Consent = {
    necessary: true,
    analytics: false,
    marketing: false,
};

interface Props {
    theme: {
        background: string;
        text?: string;
        primary?: string;
        secondary?: string;
    };
}

interface ToggleProps {
    checked: boolean;
    onChange: () => void;
    disabled?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, disabled }) => {
    return (
        <button
            onClick={onChange}
            disabled={disabled}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                checked ? "bg-black" : "bg-gray-400"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                    checked ? "translate-x-6" : "translate-x-0"
                }`}
            />
        </button>
    );
};

const CookieBanner: React.FC<Props> = ({ theme }) => {
    const { locale } = useLocale();
    const { dictionary, loading } = useDictionary(locale, "cookies");
    console.log("cookies dict:", dictionary);
    const t = (key: string, fallback: string) =>
        loading ? fallback : dictionary?.[key] ?? fallback;

    const [visible, setVisible] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [consent, setConsent] = useState<Consent>(defaultConsent);

    useEffect(() => {
        const saved = localStorage.getItem(COOKIE_KEY);

        if (!saved) {
            setVisible(true);
        } else {
            try {
                setConsent(JSON.parse(saved));
            } catch {
                setVisible(true);
            }
        }
    }, []);

    const saveConsent = (data: Consent) => {
        localStorage.setItem(COOKIE_KEY, JSON.stringify(data));
        setConsent(data);
        setVisible(false);

        console.log("Consent saved:", data);
    };

    const acceptAll = () => {
        saveConsent({
            necessary: true,
            analytics: true,
            marketing: true,
        });
    };

    const rejectAll = () => {
        saveConsent({
            necessary: true,
            analytics: false,
            marketing: false,
        });
    };

    const toggle = (key: "analytics" | "marketing") => {
        setConsent((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full z-50">
            <div
                className="max-w-5xl mx-auto m-4 p-6 border-4 shadow-lg animate-slideUp"
                style={{
                    backgroundColor: theme.background,
                    color: theme.text || "#000",
                }}
            >
                {!settingsOpen ? (
                    <>
                        <p className="text-sm mb-4">
                            {t("description", "")}
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={acceptAll}
                                className="px-4 py-2 border-2 font-bold"
                            >
                                {t("acceptAll", "")}
                            </button>

                            <button
                                onClick={rejectAll}
                                className="px-4 py-2 border-2"
                            >
                                {t("rejectAll", "")}
                            </button>

                            <button
                                onClick={() => setSettingsOpen(true)}
                                className="px-4 py-2 underline"
                            >
                                {t("settings", "")}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <h3 className="font-bold mb-4">
                            {t("settingsTitle", "")}
                        </h3>

                        <div className="space-y-4 text-sm">
                            {/* Necessary */}
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold">
                                        {t("necessary", "")}
                                    </p>
                                    <p className="opacity-70">
                                        {t("necessaryDesc", "")}
                                    </p>
                                </div>
                                <Toggle checked={true} onChange={() => {}} disabled />
                            </div>

                            {/* Analytics */}
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold">
                                        {t("analytics", "")}
                                    </p>
                                </div>
                                <Toggle
                                    checked={consent.analytics}
                                    onChange={() => toggle("analytics")}
                                />
                            </div>

                            {/* Marketing */}
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold">
                                        {t("marketing", "")}
                                    </p>
                                </div>
                                <Toggle
                                    checked={consent.marketing}
                                    onChange={() => toggle("marketing")}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => saveConsent(consent)}
                                className="px-4 py-2 border-2 font-bold"
                            >
                                {t("save", "")}
                            </button>

                            <button
                                onClick={() => setSettingsOpen(false)}
                                className="px-4 py-2 underline"
                            >
                                {t("back", "")}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CookieBanner;