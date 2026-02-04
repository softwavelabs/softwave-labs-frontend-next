import {DeviceColors} from "@/app/types/colors";

interface ColorsConfig {
  [key: string]: DeviceColors;
}

export const devices = [
  2,
  3,
  4,
  5,
  6,
  1,
] as const;

export const getColorsByIndex = (index: number): DeviceColors => {
  const prevIndex = (index - 1 + devices.length) % devices.length;
  const key = devices[prevIndex] ?? devices[0];
  return Colors[key];
};

export const Colors: ColorsConfig = {
  1: { background: "#ffffff", text: "#222324", primary: "#2E2E30", secondary: "#222324" },
  2: { background: "#222324", text: "#F0E1CD", primary: "#F0E1CD", secondary: "#948685" },
  3: { background: "#F0E1CD", text: "#93311B", primary: "#871003", secondary:"#93311B" },
  4: { background: "#871003", text: "#ffffff", primary:  "#ffffff", secondary: "#BDCCE1" },
  5: { background: "#BDCCE1", text: "#1F2A37", primary:  "#1F2A37", secondary: "#2F5D8C" },
  6: { background: "#1F2A37", text: "#F9FAFB", primary: "#F9FAFB", secondary: "#BDCCE1" },
};