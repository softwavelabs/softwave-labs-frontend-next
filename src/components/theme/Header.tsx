// components/Header.tsx
"use client";

import { Link } from "theme-ui";
import React from "react";
import { usePathname } from "next/navigation";
import { useLocale} from "@/app/contexts/LocaleContext";
import {useDictionary} from "@/app/hooks/useDictionary";

interface HeaderProps {
    theme: {
        background: string;
        text?: string;
        primary?: string;
        secondary?: string;
    };
}

const LANGUAGES = [
    { code: 'en', label: 'EN' },
    { code: 'de', label: 'DE' },
    { code: 'fr', label: 'FR' },
    { code: 'es', label: 'ES'},
    { code: 'it', label: 'IT'},
    { code: 'pl', label: 'PL' },
];

export default function Header({ theme }: HeaderProps) {
    const textColor = theme.text || "#FFFFFF";
    const [isOpen, setIsOpen] = React.useState(false);
    const pathname = usePathname();
    const { locale, setLocale } = useLocale();
    const { dictionary, loading } = useDictionary(locale, 'header');

    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Fallback labels gdy dictionary się ładuje
    const getLabel = (key: string, fallback: string) =>
        loading ? fallback : (dictionary[key] ?? fallback);

    const links = [
        { href: "/", label: getLabel('home', 'Home') },
        { href: "/about", label: getLabel('about', 'About') },
        { href: "/pricing", label: getLabel('pricing', 'Pricing') },
        { href: "/contact", label: getLabel('contact', 'Contact') },
    ];

    const currentLanguage = LANGUAGES.find(lang => lang.code === locale) || LANGUAGES[0];

    return (
        <header style={{ backgroundColor: theme.background }}>
            <div className="relative flex items-center justify-between px-2 py-2">
                <div
                    className="flex items-center gap-2 flex-shrink-0"
                    style={{ color: textColor }}
                >
                    <svg height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                        <circle r="10" cx="10" cy="10" fill={theme.secondary} />
                    </svg>

                    <Link
                        href="/"
                        className="text-sm whitespace-nowrap underline"
                        style={{
                            color: theme.text,
                            fontFamily: "DotGothic16 Regular",
                        }}
                    >
                        softwave labs
                    </Link>
                </div>

                <nav
                    className="absolute inset-x-0 z-10 flex justify-center gap-2 md:gap-12 lg:gap-12 mt-18 md:mt-0 lg:mt-0"
                    style={{
                        color: textColor,
                        fontFamily: "DotGothic16 Regular",
                        fontSize: "14px",
                    }}
                >
                    {links.map((link) => {
                        const isActive = mounted && pathname === link.href;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative p-2 link-underline ${isActive ? "active" : ""}`}
                            >
                                {mounted ? link.label : ""}
                            </Link>
                        );
                    })}
                </nav>

                <div
                    className="relative z-20 flex items-center gap-4 flex-shrink-0"
                    style={{ color: textColor }}
                >
                    <Link
                        href="/blog"
                        className="text-sm whitespace-nowrap"
                        style={{
                            fontFamily: "DotGothic16 Regular",
                            color: textColor,
                        }}
                    >
                        {getLabel('blog', 'blog')}
                    </Link>


                    <div
                        className="relative text-sm"
                        style={{ fontFamily: "DotGothic16 Regular" }}
                    >
                        <button
                            onClick={() => setIsOpen((prev) => !prev)}
                            className="p-1 hover:underline flex items-center gap-1"
                            style={{
                                color: textColor,
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            {currentLanguage.label}
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                                style={{
                                    transform: isOpen
                                        ? "rotate(180deg)"
                                        : "rotate(0deg)",
                                    transition: "transform 0.2s",
                                }}
                            >
                                <path
                                    d="M2 4L6 8L10 4"
                                    stroke={textColor}
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>

                        {isOpen && (
                            <div
                                className="absolute right-0 mt-1 flex flex-col gap-1 p-2 rounded shadow-lg"
                                style={{
                                    backgroundColor: theme.background,
                                    border: `1px solid ${textColor}`,
                                    minWidth: "60px",
                                    zIndex: 1000,
                                }}
                            >
                                {LANGUAGES.map((lang) => (
                                    <button
                                        key={lang.code}
                                        className="p-1 hover:underline text-left"
                                        onClick={() => {
                                            setLocale(lang.code);
                                            setIsOpen(false);
                                        }}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: textColor,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {lang.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}