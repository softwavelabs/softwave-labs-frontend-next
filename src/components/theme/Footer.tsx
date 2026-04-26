"use client";
import React from "react";
import { FaGithub } from "@react-icons/all-files/fa/FaGithub";
import { FaBehance } from "@react-icons/all-files/fa/FaBehance";
import { FaLinkedin } from "@react-icons/all-files/fa/FaLinkedin";
import { FaInstagram } from "@react-icons/all-files/fa/FaInstagram";
import { useLocale } from "@/app/contexts/LocaleContext";
import { useDictionary } from "@/app/hooks/useDictionary";
import type { DeviceColors } from "@/app/types/colors";
import { Link } from "theme-ui";

interface FooterData {
    linkedin?: string;
    instagram?: string;
    github?: string;
    behance?: string;
    [key: string]: unknown;
}

interface FooterProps {
    data: FooterData;
    theme: DeviceColors;
}

const Footer: React.FC<FooterProps> = ({ data, theme }) => {
    const { locale } = useLocale();
    const { dictionary, loading } = useDictionary(locale, "footer");

    const t = (key: string, fallback: string) =>
        loading ? fallback : (dictionary[key] ?? fallback);

    const iconStyle = {
        fontSize: "2rem",
        margin: "0 15px",
        color: theme.text,
        transition: "opacity 0.3s",
    };

    const footerStyle = {
        fontFamily: "NeueMontreal Regular",
        fontSize: "14px",
        color: theme.text,
    };

    return (
        <footer className="pt-6 pb-10 bg-transparent">
            <div className="flex justify-center items-center gap-4 mb-4">
                {data.linkedin && (
                    <a href={data.linkedin} target="_blank" rel="noopener noreferrer">
                        <FaLinkedin style={iconStyle} />
                    </a>
                )}
                {data.instagram && (
                    <a href={data.instagram} target="_blank" rel="noopener noreferrer">
                        <FaInstagram style={iconStyle} />
                    </a>
                )}
                {data.github && (
                    <a href={data.github} target="_blank" rel="noopener noreferrer">
                        <FaGithub style={iconStyle} />
                    </a>
                )}
                {data.behance && (
                    <a href={data.behance} target="_blank" rel="noopener noreferrer">
                        <FaBehance style={iconStyle} />
                    </a>
                )}
            </div>

            <div style={footerStyle} className="text-center">
                <span className="block mb-1 hidden sm:block text-xs md:text-sm lg:text-sm">
                    {t("title", "Correspondence address")}
                </span>
                <span className="block mb-1 hidden sm:block text-xs md:text-sm lg:text-sm">
                    {t(
                        "address_full",
                        "Beyond Office | Fabryka Norblina, ul. Żelazna 51/53 budynek C, 00-841 Warsaw, Poland"
                    )}
                </span>

                <span className="block mb-1 sm:hidden text-xs">
                    {t("address_short_1", "Beyond Office | Fabryka Norblina")}
                </span>
                <span className="block mb-1 sm:hidden text-xs">
                    {t(
                        "address_short_2",
                        "ul. Żelazna 51/53 budynek C, 00-841 Warsaw, Poland"
                    )}
                </span>
                <div className="flex justify-center items-center gap-x-2 text-xs">
                    <Link href="/privacy">
                        {t("privacy", "")}
                    </Link>

                    <span className="">|</span>

                    <Link href="/faq">
                        {t("faq", "")}
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
