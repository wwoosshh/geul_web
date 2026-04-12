import { cookies } from "next/headers";
import type { Language } from "./translations";

export async function getServerLanguage(): Promise<Language> {
  const cookieStore = await cookies();
  const lang = cookieStore.get("geul-lang")?.value;
  return lang === "en" ? "en" : "ko";
}
