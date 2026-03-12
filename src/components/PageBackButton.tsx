"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

type PageBackButtonProps = {
  fallbackHref: string
  label?: string
}

export function PageBackButton({
  fallbackHref,
  label = "Back to portfolio",
}: PageBackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (window.history.length > 1) {
      router.back()
      return
    }

    router.push(fallbackHref)
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleClick}
      className="rounded-full px-5"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      {label}
    </Button>
  )
}
