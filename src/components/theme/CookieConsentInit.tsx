"use client";

import { useEffect, useRef } from "react";
import * as CookieConsent from "vanilla-cookieconsent";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import { useLocale } from "@/app/contexts/LocaleContext";

import en from "@/locales/en/cookies.json";
import pl from "@/locales/pl/cookies.json";
// import de from "@/locales/de/cookies.json";
// import fr from "@/locales/fr/cookies.json";
// import es from "@/locales/es/cookies.json";
// import it from "@/locales/it/cookies.json";

type CookieDict = {
    title: string;
    description: string;
    acceptAll: string;
    rejectAll: string;
    settings: string;
    settingsTitle: string;
    necessary: string;
    necessaryDesc: string;
    analytics: string;
    marketing: string;
    save: string;
    back: string;
};

const dictionaries: Record<string, CookieDict> = { en, pl /*, de, fr, es, it */ };

function buildTranslation(t: CookieDict) {
    return {
        consentModal: {
            title: t.title,
            description: t.description,
            acceptAllBtn: t.acceptAll,
            acceptNecessaryBtn: t.rejectAll,
            showPreferencesBtn: t.settings,
        },
        preferencesModal: {
            title: t.settingsTitle,
            acceptAllBtn: t.acceptAll,
            acceptNecessaryBtn: t.rejectAll,
            savePreferencesBtn: t.save,
            closeIconLabel: t.back,
            sections: [
                {
                    title: t.necessary,
                    description: t.necessaryDesc,
                    linkedCategory: "necessary",
                },
                {
                    title: t.analytics,
                    linkedCategory: "analytics",
                },
                {
                    title: t.marketing,
                    linkedCategory: "marketing",
                },
            ],
        },
    };
}

const translations = Object.fromEntries(
    Object.entries(dictionaries).map(([locale, dict]) => [locale, buildTranslation(dict)])
);

interface Theme {
    background: string;
    text?: string;
    primary?: string;
    secondary?: string;
}

interface Props {
    theme?: Theme;
}

const CookieConsentInit = ({ theme }: Props) => {
    const { locale } = useLocale();
    const initialized = useRef(false);

    useEffect(() => {
        const language = locale in translations ? locale : "en";

        if (initialized.current) {
            CookieConsent.setLanguage(language);
            return;
        }
        initialized.current = true;

        CookieConsent.run({
            guiOptions: {
                consentModal: {
                    layout: "bar",
                    position: "bottom",
                },
                preferencesModal: {
                    layout: "box",
                },
            },
            categories: {
                necessary: {
                    readOnly: true,
                },
                analytics: {},
                marketing: {},
            },
            language: {
                default: language,
                translations,
            },
        });
    }, [locale]);

    useEffect(() => {
        if (!theme) return;

        const bg = theme.background;
        const text = theme.text || "#000";
        const accent = theme.primary || text;

        const vars: Record<string, string> = {
            "--cc-bg": bg,
            "--cc-primary-color": text,
            "--cc-secondary-color": text,
            "--cc-modal-border-radius": "0",
            "--cc-btn-border-radius": "0",
            "--cc-separator-border-color": text,
            "--cc-link-color": accent,
            "--cc-btn-primary-bg": text,
            "--cc-btn-primary-color": bg,
            "--cc-btn-primary-border-color": text,
            "--cc-btn-primary-hover-bg": accent,
            "--cc-btn-primary-hover-color": bg,
            "--cc-btn-primary-hover-border-color": accent,
            "--cc-btn-secondary-bg": bg,
            "--cc-btn-secondary-color": text,
            "--cc-btn-secondary-border-color": text,
            "--cc-btn-secondary-hover-bg": text,
            "--cc-btn-secondary-hover-color": bg,
            "--cc-btn-secondary-hover-border-color": text,
            "--cc-toggle-on-bg": accent,
            "--cc-toggle-off-bg": theme.secondary || "#66748c",
            "--cc-toggle-on-knob-bg": bg,
            "--cc-toggle-off-knob-bg": bg,
            "--cc-cookie-category-block-bg": bg,
            "--cc-cookie-category-block-border": text,
            "--cc-cookie-category-expanded-block-bg": bg,
        };

        Object.entries(vars).forEach(([key, value]) => {
            document.documentElement.style.setProperty(key, value);
        });
    }, [theme?.background, theme?.text, theme?.primary, theme?.secondary]);

    return null;
};

export default CookieConsentInit;
