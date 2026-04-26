"use client";

import React from "react";
import {useLocale} from "@/app/contexts/LocaleContext";
import {useDictionary} from "@/app/hooks/useDictionary";
import {useSearchParams} from "next/navigation";

interface FormItem {
    label: string;
    placeholder: string;
}

interface ContactDictionary {
    email: FormItem;
    subject: FormItem;
    message: FormItem;
    title: string;
    subtitle: string;
    sendButton: string;
}


const ContactPage: React.FC = () => {
    const { locale } = useLocale();
    const { dictionary, loading } = useDictionary(locale, "contact");
    const searchParams = useSearchParams();
    const subjectFromQuery = searchParams.get("subject") || "";
    const email: FormItem =
        dictionary?.email && typeof dictionary.email === "object"
            ? dictionary.email
            : { label: "", placeholder: "" };

    const subject: FormItem =
        dictionary?.subject && typeof dictionary.subject === "object"
            ? dictionary.subject
            : { label: "", placeholder: "" };

    const message: FormItem =
        dictionary?.message && typeof dictionary.message === "object"
            ? dictionary.message
            : { label: "", placeholder: "" };


    const t = (key: keyof ContactDictionary, fallback: string) =>
        loading ? fallback : (dictionary?.[key] ?? fallback);
    return (
        <div
            className="w-full flex justify-center"
            style={{
                fontFamily: "DotGothic16 Regular",
                lineHeight: 1.6,
            }}
        >
            <section className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
                <div className="mx-auto max-w-xl">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                            {t("title", "")}
                        </h1>
                        <p className="text-sm opacity-80">
                            {t("subtitle", "")}
                        </p>
                    </div>

                    <form
                        action="https://formsubmit.co/softwavelabs@protonmail.com"
                        method="POST"
                        className="space-y-8"
                    >
                        <input
                            type="hidden"
                            name="_next"
                            value="https://softwave-labs.com/thank-you"
                        />
                        <input type="hidden" name="_captcha" value="true" />
                        <input
                            type="hidden"
                            name="_subject"
                            value="New Message from Website"
                        />

                        <div>
                            <label className="block mb-2 text-xs uppercase font-bold">
                                <p>{loading ? "" : email.label}</p>
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder={email.placeholder || ""}
                                required
                                className="
                                    w-full
                                    border-4
                                    px-3 py-2
                                    text-sm
                                    bg-transparent
                                    focus:outline-none
                                    focus:ring-0
                                "
                                style={{ fontFamily: "NeueMontreal Regular" }}
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-xs uppercase font-bold" >
                                <p>{loading ? "" : subject.label}</p>
                            </label>
                            <input
                                type="text"
                                name="subject"
                                placeholder={subject.placeholder || ""}
                                defaultValue={subjectFromQuery || ""}
                                required
                                className="w-full border-4 px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-0"
                                style={{ fontFamily: "NeueMontreal Regular" }}
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-xs uppercase font-bold">
                                <p>{loading ? "" : message.label}</p>
                            </label>
                            <textarea
                                name="message"
                                rows={6}
                                placeholder={message.placeholder || ""}
                                required
                                className="
                                    w-full
                                    border-4
                                    px-3 py-2
                                    text-sm
                                    resize-none
                                    bg-transparent
                                    focus:outline-none
                                    focus:ring-0
                                "
                                style={{ fontFamily: "NeueMontreal Regular" }}
                            />
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                className="
                                    w-full sm:w-auto
                                    border-4
                                    px-8 py-3
                                    text-sm
                                    transition
                                "
                                style={{ fontFamily: "NeueMontreal Regular" }}
                            >
                                {t("sendButton", "Send Message")}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;
