import React from "react";
import Layout from "../theme/layout";
import Header from "../theme/Header";
import Showcase from "./Showcase";
import Footer from "../theme/Footer";
import { Colors } from "../theme/Colors";
import conceptData from "@/data/conceptData.json";
import type { DeviceColors} from "@/app/types/colors";

interface PageData {
    id: number;
    documentId?: string;
    title: string;
    subtitle?: string;
    description?: string;
    order?: number;
    [key: string]: unknown;
}

interface LiquidSwipeLayoutProps {
    data: PageData;
}


interface LiquidSwipeLayoutProps {
    data: PageData;
    color?: DeviceColors;
}

export const LiquidSwipeLayout: React.FC<LiquidSwipeLayoutProps> = ({ data, color }) => {
    const selectedColor = color ?? Colors[data.order ?? 0] ?? { background: "#000000", text: "#FFFFFF" };

    return (
        <Layout theme={selectedColor}>
            <Header theme={selectedColor} />
            <main style={{
                flex: 1,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <Showcase data={data} theme={selectedColor} />
            </main>
            <Footer data={conceptData} theme={selectedColor} />
        </Layout>
    );
};

