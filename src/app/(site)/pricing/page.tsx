"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useLocale } from "@/app/contexts/LocaleContext";
import { useDictionary } from "@/app/hooks/useDictionary";
import { useRouter } from "next/navigation";

interface ScopeItem {
    children?: Array<{ text: string }>;
}

interface Bundle {
    id: number;
    order: number;
    title: string;
    description: string;
    price: string;
    scope?: ScopeItem[];
}

interface Service {
    id: number;
    order: number;
    title: string;
    description: string;
    price: string;
    scope?: ScopeItem[];
}

interface Currency {
    code: string;
}

type TranslationFunction = (key: string, fallback: string) => string;

const BundleButton = ({ bundle, t }: { bundle: Bundle; t: TranslationFunction }) => {
    const router = useRouter();

    const handleClick = () => {
        const subject = encodeURIComponent(
            t("getBundle", "Get bundles").replace("{bundle}", bundle.title)
        );
        router.push(`/contact?subject=${subject}`);
    };

    return (
        <button
            onClick={handleClick}
            className="mt-auto border-4 px-6 py-3 text-sm"
            style={{ fontFamily: "NeueMontreal Regular" }}
        >
            {t("getBundle", "Get bundles").replace("{bundle}", bundle.title)}
        </button>
    );
};

const PricingPage: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { locale } = useLocale();
    const { dictionary } = useDictionary(locale, "pricing");
    const [bundles, setBundles] = useState<Bundle[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [currency, setCurrency] = useState<string>("NONE");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const t: TranslationFunction = (key: string, fallback: string) =>
        loading ? fallback : dictionary[key] ?? fallback;

    const updateScrollButtons = useCallback(() => {
        const container = scrollRef.current;
        if (!container) return;
        const { scrollLeft, scrollWidth, clientWidth } = container;

        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [bundlesRes, servicesRes, currencyRes] = await Promise.all([
                    fetch(`/api/strapi/bundles?locale=${locale}`).then((r) => r.json()),
                    fetch(`/api/strapi/services?locale=${locale}`).then((r) => r.json()),
                    fetch(`/api/strapi/currency?locale=${locale}`).then((r) => r.json()),
                ]);

                setBundles((bundlesRes || []).sort((a: Bundle, b: Bundle) => a.order - b.order));
                setServices((servicesRes || []).sort((a: Service, b: Service) => a.order - b.order));
                setCurrency((currencyRes as Currency)?.code || "NONE");
            } catch (err) {
                console.error("Error fetching pricing data:", err);
                setError("Failed to load pricing data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [locale]);

    useEffect(() => {
        updateScrollButtons();
        const container = scrollRef.current;
        if (!container) return;

        container.addEventListener("scroll", updateScrollButtons);
        window.addEventListener("resize", updateScrollButtons);

        return () => {
            container.removeEventListener("scroll", updateScrollButtons);
            window.removeEventListener("resize", updateScrollButtons);
        };
    }, [bundles, updateScrollButtons]);

    const scroll = (direction: "left" | "right") => {
        const container = scrollRef.current;
        if (!container) return;

        const card = container.querySelector(".pricing-card") as HTMLElement;
        if (!card) return;

        const scrollAmount = card.offsetWidth + 16; // gap-4
        container.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    };

    if (error) return <p className="text-center py-20">{error}</p>;

    return (
        <div className="w-full flex justify-center" style={{ fontFamily: "DotGothic16 Regular", lineHeight: 1.6 }}>
            <section className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
                <div className="mx-auto max-w-5xl">

                    {/* Bundles Section */}
                    <div className="mb-16 text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t("bundlesTitle", "")}</h1>
                        <p className="text-sm opacity-80">{t("bundlesSubtitle", "")}</p>
                    </div>

                    <div className="flex items-center">
                        <button
                            onClick={() => scroll("left")}
                            className={`px-4 py-2 text-sm flex-shrink-0 transition-opacity ${!canScrollLeft ? "opacity-0 pointer-events-none" : ""}`}
                        >
                            <span className="block w-3 h-3 border-t-2 border-r-2 border-black rotate-225"></span>
                        </button>

                        <div
                            ref={scrollRef}
                            className="flex gap-4 overflow-x-auto flex-1 snap-x snap-mandatory"
                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        >
                            {bundles.map((bundle) => (
                                <div key={bundle.id} className="pricing-card border-4 p-6 flex flex-col snap-start flex-shrink-0">
                                    <h2 className="text-xl font-bold mb-2">{bundle.title}</h2>
                                    <p className="text-sm opacity-80 mb-6" style={{ fontFamily: "NeueMontreal Regular" }}>{bundle.description}</p>
                                    <div className="text-3xl font-bold mb-6">
                                        {t("price", "from").replace("{price}", bundle.price).replace("{currency}", currency)}
                                    </div>
                                    {bundle.scope && bundle.scope.length > 0 && (
                                        <ul className="text-sm mb-8 space-y-2" style={{ fontFamily: "NeueMontreal Regular" }} >
                                            {bundle.scope.map((item: ScopeItem, idx: number) => (
                                                <li key={idx} className="flex gap-2">
                                                    <span></span>
                                                    <span>{item.children?.[0]?.text}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    <BundleButton bundle={bundle} t={t} />
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => scroll("right")}
                            className={`px-4 py-2 text-sm flex-shrink-0 transition-opacity ${!canScrollRight ? "opacity-0 pointer-events-none" : ""}`}
                        >
                            <span className="block w-3 h-3 border-t-2 border-r-2 rotate-45"></span>
                        </button>
                    </div>

                    {/* Services Section */}
                    <div className="mt-16 mb-8 text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t("servicesTitle", "")}</h1>
                        <p className="text-sm opacity-80">{t("servicesSubtitle", "")}</p>
                    </div>

                    {/* Responsive Table Wrapper */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[600px]">
                            <thead>
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold">Service</th>
                                <th className="px-6 py-4 text-sm font-semibold">Scope</th>
                                <th className="px-6 py-4 text-sm font-semibold">Price</th>
                                <th className="px-6 py-4" />
                            </tr>
                            </thead>
                            <tbody className="divide-y">
                            {services.map((service) => (
                                <tr key={service.id}>
                                    <td className="px-6 py-5">
                                        <p className="font-medium">{service.title}</p>
                                        <p className="text-sm" style={{ fontFamily: "NeueMontreal Regular" }} >{service.description}</p>
                                    </td>
                                    <td className="px-6 py-5 text-sm">
                                        <ul className="space-y-1" style={{ fontFamily: "NeueMontreal Regular" }}>
                                            {service.scope?.map((f: ScopeItem, idx: number) => (
                                                <li key={idx}>{f.children?.[0]?.text ?? ""}</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="px-6 py-5 font-semibold whitespace-nowrap">
                                        {t("price", "from").replace("{price}", service.price).replace("{currency}", currency)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </section>

            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
              .pricing-card {
                width: 97%;
                min-width: 97%;
              }
              @media (min-width: 768px) {
                .pricing-card {
                  width: calc((100% - 2rem) / 3);
                  min-width: calc((100% - 2rem) / 3);
                }
              }
            `}</style>
        </div>
    );
};

export default PricingPage;