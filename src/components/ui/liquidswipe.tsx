"use client";

import React, {
    useState,
    useEffect,
    ReactNode,
    JSX,
    useRef,
} from "react";
import { useSpring, animated } from "react-spring";
import { useDrag } from "react-use-gesture";
import styled from "styled-components";

// === Styled Components ===
const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  box-shadow: 0 0 25px -8px rgba(53, 53, 53, 0.82);
  overflow: hidden;

  @media only screen and (max-width: 500px) {
    width: 100%;
  }
`;

const PageDiv = styled.div.withConfig({
    shouldForwardProp: (prop) => prop !== "themeColor",
})<{ themeColor: string }>`
  
  
  width: 100%;
  height: 100%;
  position: absolute;
  text-align: center;
  font-size: 37px;
  font-weight: bold;
  flex-direction: column;
  display: flex;
  justify-content: space-between;
  background-color: ${(props) => props.themeColor};
  transition: background-color 0.3s ease;
  pointer-events: auto;
`;

const StyledSVG = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  background-color: transparent;
  width: 20%;
  height: 100%;
`;

// === Utility Function ===
const getPath = (y: number, x: number, width: number, height: number): string => {
    const yAdjusted = y - 120;
    const anchorDistance = 200 + x * 0.5;
    const curviness = anchorDistance - 60;
    return `M0,${height}H0V0h${width}v${yAdjusted - anchorDistance}c0,${curviness},${x},${curviness},${x},${anchorDistance}S${width},${yAdjusted},${width},${yAdjusted + anchorDistance * 2}V${height}z`;
};

// === Page Component ===
interface PageProps {
    children: ReactNode;
    theme: string;
    index: number;
    setActive: (index: number) => void;
    gone?: boolean;
}

const Page: React.FC<PageProps> = ({
                                       children,
                                       theme,
                                       index,
                                       setActive,
                                       gone = false,
                                   }) => {
    const [isGone, setGone] = useState<boolean>(gone);
    const [isMove, setMove] = useState<boolean>(false);
    const initializedRef = useRef(false);

    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const updateDimensions = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    const { width, height } = dimensions;

    const [{ posX, posY }, setPosApi] = useSpring(() => ({
        posX: -50,
        posY: height * 0.72 - 20,
        config: { mass: 3 },
    }));

    const [{ d }, setDvalueApi] = useSpring(() => ({
        d: gone ? getPath(0, 0, width, height) : getPath(height * 0.72, 0, 0, height),
        config: { mass: 3 },
    }));

    // === Initial animation on mount ===
    useEffect(() => {
        if (!gone && !initializedRef.current) {
            initializedRef.current = true;
            setDvalueApi.start({ d: getPath(height * 0.72, 48, 5, height) });
            setTimeout(() => {
                setPosApi.start({ posX: 7 });
            }, 100);
        }
    }, [gone, setDvalueApi, setPosApi, height]);

    // === Update path + pos on resize or gone toggled ===
    useEffect(() => {
        setDvalueApi.start({
            d: isGone
                ? getPath(0, 0, width, height)
                : getPath(height * 0.72, 48, 5, height),
            immediate: true
        });

        setPosApi.start({
            posX: isGone ? -50 : 7,
            posY: isGone ? height : height * 0.72 - 20,
            immediate: true
        });
    }, [width, height, isGone, setDvalueApi, setPosApi]);

    // === Drag gesture ===
    const bind = useDrag(
        (state) => {
            const { down, movement: [mx], xy: [, my], vxvy: [vx] } = state;

            if (!isGone) {
                const shouldSwipe = mx > width / 2 || vx > 3;

                if (down && isMove) {
                    setDvalueApi.start({ d: getPath(my, mx + 60, 10, height) });
                    setPosApi.start({ posX: mx + 20, posY: my - 20 });
                } else if (!down && isMove && shouldSwipe) {
                    setDvalueApi.start({ d: getPath(my, -50, width, height) });
                    setGone(true);

                    setTimeout(() => {
                        setDvalueApi.start({ d: getPath(my, 0, width, height) });
                        setActive(index);
                    }, 240);
                } else {
                    setDvalueApi.start({ d: getPath(height * 0.72, 48, 5, height) });
                    setPosApi.start({ posX: 7, posY: height * 0.72 - 20 });
                }
            }
        },
        { filterTaps: true }
    );

    const handleStart = () => setMove(true);
    const handleEnd = () => setMove(false);

    return (
        <div id={`pageContainer${index}`}>
            <StyledSVG width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
                <clipPath id={`clipping${index}`}>
                    <animated.path
                        id={`blob-path${index}` as any}
                        d={d as any}
                    />
                </clipPath>
            </StyledSVG>

            {/* ———————————————
                GESTURE TYLKO TUTAJ
                ——————————————— */}
            <PageDiv
                themeColor={theme}
                {...bind()}
                onMouseDown={handleStart}
                onTouchStart={handleStart}
                onMouseUp={handleEnd}
                onTouchEnd={handleEnd}
                style={{
                    clipPath: `url(#clipping${index})`,
                    WebkitClipPath: `url(#clipping${index})`,
                }}
            >
                {children}
            </PageDiv>
        </div>
    );
};

// === LiquidSwipe Component ===
interface LiquidSwipeProps {
    components: ReactNode[];
    colors: string[];
}

export const LiquidSwipe: React.FC<LiquidSwipeProps> = ({
                                                            components,
                                                            colors,
                                                        }) => {
    const size = components.length;
    const [activeIndex, setActive] = useState(0);
    const [pages, setPages] = useState<JSX.Element[]>([
        <Page
            key={0}
            index={0}
            setActive={setActive}
            gone={true}
            theme={colors[0]}
        >
            {components[0]}
        </Page>,
    ]);

    const addedPagesRef = useRef(new Set([0]));

    useEffect(() => {
        const nextIndex = (activeIndex + 1) % size;

        if (addedPagesRef.current.has(nextIndex)) {
            return;
        }

        addedPagesRef.current.add(nextIndex);

        if (pages.length === size - 1) {
            setTimeout(() => {
                setPages((prev) => [
                    ...prev.slice(1),
                    <Page
                        key={nextIndex}
                        index={nextIndex}
                        setActive={setActive}
                        theme={colors[nextIndex]}
                    >
                        {components[nextIndex]}
                    </Page>,
                ]);
            }, 600);
        } else {
            setPages((prev) => [
                ...prev,
                <Page
                    key={nextIndex}
                    index={nextIndex}
                    setActive={setActive}
                    theme={colors[nextIndex]}
                >
                    {components[nextIndex]}
                </Page>,
            ]);
        }
    }, [activeIndex, colors, components, size, pages.length]);

    return <Container>{pages}</Container>;
};
