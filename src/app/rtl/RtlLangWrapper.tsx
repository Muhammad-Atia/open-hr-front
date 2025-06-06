"use client";

import { useAppSelector } from "@/redux/hook";
import { useEffect } from "react";
import i18n from "@/i18n";

export default function RtlLangProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language, rtl } = useAppSelector(
    (state) => state["language-slice"].result
  );

  useEffect(() => {
    document.documentElement.setAttribute("dir", rtl ? "rtl" : "ltr");
  }, [rtl]);

  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.setAttribute("lang", language);
  }, [language]);

  return <>{children}</>;
}
