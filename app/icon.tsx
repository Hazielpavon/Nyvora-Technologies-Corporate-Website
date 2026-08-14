import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  const logo = await readFile(join(process.cwd(), "public", "nyvora-logo.png"));
  const logoSource = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          overflow: "hidden",
          borderRadius: 5,
          background: "#f4f8fc",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSource}
          alt=""
          width={107}
          height={40}
          style={{
            position: "absolute",
            top: -4,
            left: 0,
            width: 107,
            height: 40,
          }}
        />
      </div>
    ),
    size,
  );
}
