import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  highPriority?: boolean;
  sizes: string;
};

/**
 * Official Nyvora wordmark; swaps to the light-ink variant in dark mode.
 * Both images stay lazy so only the visible variant downloads (Next 16 guidance).
 */
export function BrandLogo({ className = "", highPriority = false, sizes }: BrandLogoProps) {
  const shared = {
    alt: "",
    width: 1200,
    height: 368,
    sizes,
    fetchPriority: highPriority ? ("high" as const) : undefined,
  };

  return (
    <>
      <Image {...shared} className={`logo-on-light h-auto ${className}`} src="/brand/logo-light.png" />
      <Image {...shared} className={`logo-on-dark h-auto ${className}`} src="/brand/logo-dark.png" />
    </>
  );
}
