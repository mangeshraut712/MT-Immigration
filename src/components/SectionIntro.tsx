import { cn } from "@/lib/utils"

type SectionIntroProps = {
  eyebrow: string
  title: string
  description?: string
  align?: "left" | "center"
  className?: string
}

export function SectionIntro({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionIntroProps) {
  const isCentered = align === "center"

  return (
    <div
      className={cn(
        "mb-16 max-w-3xl",
        isCentered && "mx-auto text-center",
        className
      )}
    >
      <p
        className={cn(
          "text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground",
          isCentered && "mx-auto"
        )}
      >
        {eyebrow}
      </p>
      <h2 className="font-display mt-6 text-balance text-4xl font-medium leading-tight text-foreground sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg font-light",
            isCentered && "mx-auto"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}
