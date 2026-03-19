import Image from "next/image";

import { firmConfig } from "@/config/firm";
import { cn } from "@/lib/utils";

type SiteLogoProps = {
  className?: string;
  imageClassName?: string;
  showName?: boolean;
  nameClassName?: string;
  priority?: boolean;
  loading?: "eager" | "lazy";
};

export function SiteLogo({
  className,
  imageClassName,
  showName = true,
  nameClassName,
  priority = false,
  loading = "lazy",
}: SiteLogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "relative h-16 w-16 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-md",
          imageClassName,
        )}
      >
        <Image
          src={firmConfig.brand.logoSrc}
          alt={firmConfig.brand.logoAlt}
          fill
          sizes="64px"
          priority={priority}
          loading={priority ? undefined : loading}
          className="object-contain p-0.5"
        />
      </div>

      {showName ? (
        <span
          className={cn("font-serif font-bold tracking-tight", nameClassName)}
        >
          {firmConfig.shortName}
        </span>
      ) : null}
    </div>
  );
}
