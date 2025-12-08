"use client";
import { FaApple } from "@react-icons/all-files/fa/FaApple";

export default function Logo(props) {
  return (
    <div
      sx={{
        m: 0,
        p: 0,
        display: "flex",
        flexDirection: "row",
        textAlign: "center",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <FaApple sx={{ fontSize: [5, 1, 2], color: props.theme["primary"] }} />
      <h3
        sx={{ ml: [4, 5], fontSize: [5, 1, 2], color: props.theme["primary"] }}
      >
        Apple
      </h3>
    </div>
  );
}
