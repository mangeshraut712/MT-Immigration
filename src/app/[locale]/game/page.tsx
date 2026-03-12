import { redirect } from "next/navigation"
import { isLocale } from "@/i18n/config"

export default async function GameRedirectPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  redirect(`/${isLocale(locale) ? locale : "en"}#game`)
}
