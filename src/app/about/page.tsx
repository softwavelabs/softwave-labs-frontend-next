"use client";

import dynamic from "next/dynamic";
import { DevicePage } from "@/components/ui/devicePage";
import { Colors } from "@/components/ui/colors";
import pagesData from "@/data/pagesData.json";
import conceptData from "@/data/conceptData.json";
import { JSX } from "react";

const LiquidSwipe = dynamic(
    () => import("@/components/ui/liquidswipe").then((mod) => ({ default: mod.LiquidSwipe })),
    { ssr: false }
);

export const getDeviceDataById = (id: string) => {
    const dataNode = pagesData.find((item) => item.id === id);
    const conceptNode = conceptData;

    const imagePath = dataNode?.imageOriginalName
        ? `/images/${dataNode.imageOriginalName}`
        : null;

    return {
        data: dataNode,
        concept: conceptNode,
        image: imagePath
    };
};

const ids = ["airpod", "watch", "iphone", "ipad", "mac", "mouse"];

export default function About() {
    const pages = ids.map((id) => getDeviceDataById(id));
    const colors = ids.map((id) => Colors[id].background);

    const componentsToRender: JSX.Element[] = pages.map((pageData, i) => (
        <DevicePage key={ids[i]} data={pageData} />
    ));

    return <LiquidSwipe components={componentsToRender} colors={colors} />;
}