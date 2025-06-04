"use client";

import { useAppSelector } from "@/redux/hook";
import { useEffect } from "react";
import i18n from "@/i18n";

export default function RtlLangProvider({ children }: { children: React.ReactNode }) {
  const rtl = useAppSelector((state) => state["setting-slice"].rtl);
  const language = useAppSelector((state) => state["setting-slice"].language);

  useEffect(() => {
    document.documentElement.setAttribute("dir", rtl ? "rtl" : "ltr");
  }, [rtl]);

  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.setAttribute("lang", language);
  }, [language]);

  return <>{children}</>;
}
