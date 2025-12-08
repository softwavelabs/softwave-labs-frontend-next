import { Link } from "theme-ui";
import React from "react";

interface HeaderProps {
    theme: {
        background: string;
        text?: string;
        primary?: string;
    };
    data?: any;
}

export default function Header({ theme }: HeaderProps) {
    const textColor = theme.text || "#FFFFFF";
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <header style={{ backgroundColor: theme.background }}>
            <div className="grid grid-cols-3 items-start md:items-center">

                {/* Lewa kolumna */}
                <div className="flex items-center gap-2 flex-shrink-0 p-2" style={{ color: textColor }}>
                    <svg height="20" width="20" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                        <circle r="10" cx="10" cy="10" fill={textColor} />
                    </svg>

                    <Link
                        style={{ color: textColor, fontFamily: 'DotGothic16 Regular' }}
                        href="/"
                        className="text-sm underline whitespace-nowrap"
                    >
                        softwave labs
                    </Link>
                </div>

                {/* Środkowa kolumna */}
                <nav
                    className="flex justify-center gap-0 md:gap-12 lg:gap-12 md:text-base"
                    style={{ color: textColor, fontFamily: 'NeueMontreal Regular', fontSize: '14px' }}
                >
                    <Link href="/" className="underline p-10 md:p-2 lg:p-2">home</Link>
                    <Link href="/about" className="p-10 md:p-2 lg:p-2">about</Link>
                    <Link href="/contact" className="p-10 md:p-2 lg:p-2">contact</Link>
                    <Link href="/blog" className="p-10 md:p-2 lg:p-2">blog</Link>
                </nav>

                {/* Prawa kolumna – Language Switcher */}
                <div className="flex justify-end items-start md:items-center gap-3 p-2" style={{ color: textColor }}>

                    {/* Language Switcher */}
                    <div
                        className="relative text-sm"
                        style={{ fontFamily: 'DotGothic16 Regular' }}
                    >
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-1 hover:underline flex items-center gap-1"
                            style={{ color: textColor, cursor: "pointer", background: 'none', border: 'none' }}
                        >
                            EN
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                                style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                            >
                                <path d="M2 4L6 8L10 4" stroke={textColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>

                        {isOpen && (
                            <div
                                className="absolute right-0 mt-1 flex flex-col gap-1 p-2 rounded shadow-lg"
                                style={{
                                    backgroundColor: theme.background,
                                    border: `1px solid ${textColor}`,
                                    minWidth: '60px',
                                    zIndex: 1000
                                }}
                            >
                                <Link href="/?lang=en" className="p-1 hover:underline" onClick={() => setIsOpen(false)}>EN</Link>
                                <Link href="/?lang=de" className="p-1 hover:underline" onClick={() => setIsOpen(false)}>DE</Link>
                                <Link href="/?lang=pl" className="p-1 hover:underline" onClick={() => setIsOpen(false)}>PL</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}