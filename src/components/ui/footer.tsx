import React from "react";
import { FaGithub } from "@react-icons/all-files/fa/FaGithub";
import { FaBehance } from "@react-icons/all-files/fa/FaBehance";
import {FaLinkedin} from "@react-icons/all-files/fa/FaLinkedin";
import {FaInstagram} from "@react-icons/all-files/fa/FaInstagram";

const Footer = ({ data, theme }) => {
    const iconStyle = {
        fontSize: "2rem",
        // opacity: 0.7,
        margin: "0 15px",
        color: theme["primary"],
        transition: "opacity 0.3s",
        "&:hover": {
            opacity: 1,
        },
    };

    const footerStyle = {
        fontFamily: 'NeueMontreal Regular',
        fontSize: '14px',
        color: theme["primary"],
    };

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                    padding: "20px 0",
                }}
            >

                <a
                    href={data["concept"]["linkedin"]}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FaLinkedin style={iconStyle} />
                </a>

                <a
                    href={data["concept"]["instagram"]}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FaInstagram style={iconStyle} />
                </a>

                <a
                    href={data["concept"]["github"]}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FaGithub style={iconStyle} />
                </a>

                <a
                    href={data["concept"]["behance"]}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FaBehance style={iconStyle} />
                </a>

            </div>
            <div style={footerStyle} className="">
                <span className="block text-center mb-1 hidden sm:block">Correspondence address</span>
                <span className="block text-center mb-1 ">
    Beyond Office | Fabryka Norblina, ul. Żelazna 51/53 budynek C, 00-841 Warsaw, Poland
  </span>
            </div>
        </div>
    );
};

export default Footer;
