"use client";
import React, {useEffect, useState} from "react";
import TixyPattern from "@/components/animation/TixyPattern";
/** @jsxImportSource theme-ui */


const Showcase = ({ data, theme }) => {

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

  const dataNode = data;
    const imageNode = data.image;
    return (
    <div
      sx={{
        display: "flex",
        flexDirection: ["column-reverse", "row", "row"],
        width: "100%",
        mt: ["0px", "10px"],
        minHeight: ["auto", "450px"],
          userSelect: "none",
      }}
    >
      <div
        sx={{
          width: ["100%", "50%", "50%"],
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          sx={{
            width: "80%",
          }}
        >
          <h1
              className={"text-4xl md:text-[55px] lg:text-[55px]"}
            sx={{
              fontFamily: 'NeueMontreal Bold',
              // fontSize: [6, 7, 7],
              lineHeight: 1.5,
              color: theme["text"],
            }}
          >
            {dataNode.title}
          </h1>
          <h4
              className={"text-sm md:text-[25px] lg:text-[25px]"}
            sx={{
              fontFamily: 'NeueMontreal Regular',
              // fontSize: [0, 1, 2],
              lineHeight: 1.15,
              color: theme["text"],
            }}
          >
            {dataNode.subtitle}
          </h4>
          <h6
              className={"text-xl md:text-3xl lg:text-3xl"}
            sx={{
              fontFamily: 'NeueMontreal Light',
              // fontSize: [3, 4, 5],
              lineHeight: 1.5,
              letterSpacing: 1.15,
              mt: 10,
              color: theme["text"],
            }}
          >
            {dataNode.description}
          </h6>
        </div>
      </div>
      <div
        sx={{
          width: ["100%", "50%", "50%"],
        }}
      >

          <div
              sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: isMobile ? "15px" : "100px",
                  marginBottom: isMobile ? "10px" : "100px",
              }}
          >
              <TixyPattern theme={theme} />
          </div>
          <div
              sx={{
                  display: "block",
                  margin: "auto",
                  width: ["60%", "70%", "80%"],
                  maxWidth: "100%",
                  height: "auto",
              }}
              src={imageNode}
              alt={dataNode.title}
          />
        {/*<img*/}
        {/*  sx={{*/}
        {/*    display: "block",*/}
        {/*    margin: "auto",*/}
        {/*    width: ["60%", "70%", "80%"],*/}
        {/*    maxWidth: "100%",*/}
        {/*    height: "auto",*/}
        {/*  }}*/}
        {/*  src={imageNode}*/}
        {/*  alt={dataNode.title}*/}
        {/*/>*/}
      </div>
    </div>
  );
};

export default Showcase;
