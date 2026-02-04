"use client";

import Layout from "@/components/theme/layout";
import Header from "@/components/theme/Header";
import Footer from "@/components/theme/Footer";
import conceptData from "@/data/conceptData.json";

import { useThemeStore } from "@/store/themeStore";
import { getColorsByIndex } from "@/components/theme/Colors";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    const activeIndex = useThemeStore((state) => state.activeIndex ?? 0);
    const { background, text, primary, secondary } = getColorsByIndex(activeIndex);

    return (
        <div
            style={{
                backgroundColor: background,
                color: text,
                minHeight: "100vh",
                borderColor: text
            }}
        >
            <Layout theme={{ background, text, primary, secondary }}>
                <Header theme={{ background, text, primary, secondary }} />

                <main>{children}</main>

                <Footer data={conceptData} theme={{ background, text, primary, secondary }} />
            </Layout>
        </div>
    );
}
