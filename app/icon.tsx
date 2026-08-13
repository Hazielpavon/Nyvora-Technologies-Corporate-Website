import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #3bd6ff",
          borderRadius: 5,
          color: "#f4f8fc",
          background: "#07111d",
          fontFamily: "Arial, sans-serif",
          fontSize: 19,
          fontWeight: 700,
        }}
      >
        N
      </div>
    ),
    size,
  );
}
