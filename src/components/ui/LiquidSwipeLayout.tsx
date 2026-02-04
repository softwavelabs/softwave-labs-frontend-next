import React from "react";
import Layout from "../theme/layout";
import Header from "../theme/Header";
import Showcase from "./Showcase";
import Footer from "../theme/Footer";
import { Colors } from "../theme/Colors";
import conceptData from "@/data/conceptData.json";

export const LiquidSwipeLayout = ({ data }: any) => {
    const selectedColor = Colors[data.order];

    return (
        <Layout theme={selectedColor}>
            <Header data={data} theme={selectedColor} />
            <Showcase data={data} theme={selectedColor} />
            <Footer data={conceptData} theme={selectedColor} />
        </Layout>
    );
};
