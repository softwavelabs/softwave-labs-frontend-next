"use client";

import { useEffect, useRef } from "react";
import * as CookieConsent from "vanilla-cookieconsent";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import { useLocale } from "@/app/contexts/LocaleContext";

import en from "@/locales/en/cookies.json";
import pl from "@/locales/pl/cookies.json";
import de from "@/locales/de/cookies.json";
import fr from "@/locales/fr/cookies.json";
import es from "@/locales/es/cookies.json";
import it from "@/locales/it/cookies.json";

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

const dictionaries: Record<string, CookieDict> = { en, pl, de, fr, es, it };

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

const CookieConsentInit = () => {
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
                    layout: "box",
                    position: "bottom left",
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

    return null;
};

export default CookieConsentInit;
