"use client";
import React from "react";
import { FaGithub } from "@react-icons/all-files/fa/FaGithub";
import { FaBehance } from "@react-icons/all-files/fa/FaBehance";
import { FaLinkedin } from "@react-icons/all-files/fa/FaLinkedin";
import { FaInstagram } from "@react-icons/all-files/fa/FaInstagram";
import { useLocale } from "@/app/contexts/LocaleContext";
import { useDictionary } from "@/app/hooks/useDictionary";

const Footer = ({ data, theme }) => {
    // ← hooki muszą być TU, wewnątrz komponentu
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
            {/* Ikony społecznościowe */}
            <div className="flex justify-center items-center gap-4 mb-4">
                <a href={data.linkedin} target="_blank" rel="noopener noreferrer">
                    <FaLinkedin style={iconStyle} />
                </a>
                <a href={data.instagram} target="_blank" rel="noopener noreferrer">
                    <FaInstagram style={iconStyle} />
                </a>
                <a href={data.github} target="_blank" rel="noopener noreferrer">
                    <FaGithub style={iconStyle} />
                </a>
                <a href={data.behance} target="_blank" rel="noopener noreferrer">
                    <FaBehance style={iconStyle} />
                </a>
            </div>

            {/* Tekst stopki */}
            <div style={footerStyle} className="text-center">
                {/* Desktop */}
                <span className="block mb-1 hidden sm:block text-xs md:text-sm lg:text-sm">
                    {t("title", "Correspondence address")}
                </span>
                <span className="block mb-1 hidden sm:block text-xs md:text-sm lg:text-sm">
                    {t(
                        "address_full",
                        "Beyond Office | Fabryka Norblina, ul. Żelazna 51/53 budynek C, 00-841 Warsaw, Poland"
                    )}
                </span>

                {/* Mobile */}
                <span className="block mb-1 sm:hidden text-xs">
                    {t("address_short_1", "Beyond Office | Fabryka Norblina")}
                </span>
                <span className="block mb-1 sm:hidden text-xs">
                    {t(
                        "address_short_2",
                        "ul. Żelazna 51/53 budynek C, 00-841 Warsaw, Poland"
                    )}
                </span>
            </div>
        </footer>
    );
};

export default Footer;
