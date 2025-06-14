"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FaGlobe } from "react-icons/fa";

const LANGUAGES = [
  {
    code: "ar",
    label: "العربية",
    flag: (
      <img
        src="/icons/arabic-language.png"
        alt="العربية"
        className="inline w-3 h-3 mr-2"
      />
    ),
  },
  {
    code: "en",
    label: "English",
    flag: (
      <img src="/icons/k.png" alt="English" className="inline w-3 h-3 mr-2" />
    ),
  },
];

interface LanguageSelectProps {
  language: string;
  rtl: boolean;
  handleLanguageChange: (code: string) => void;
}

export default function LanguageSelect({
  language,
  rtl,
  handleLanguageChange,
}: LanguageSelectProps) {
  const selected = LANGUAGES.find((l) => l.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="
            w-full flex items-center justify-between rounded-lg border border-gray-200
          px-2 py-2.5text-sm font-medium shadow-sm
    transition
          "
        >
          <span className="flex items-center gap-2">
            {/* تظهر الأيقونة فقط إذا كانت اللغة إنجليزية وrtl = false */}
            {language === "en" && rtl === false && (
              <FaGlobe className="text-blue-500 inline h-5 w-5 ml-0.5 mb-0.5" />
            )}

            {/* تظهر الأيقونة فقط إذا كانت اللغة عربية وrtl = true */}
            {language === "ar" && rtl === true && (
              <FaGlobe className="text-blue-500 inline h-5 w-5 mr-2.25 mb-0.5" />
            )}
            <span>{selected?.label}</span>
          </span>
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-full min-w-[140px] p-1">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className="
              flex items-center gap-2 px-4 py-1 rounded-md cursor-pointer"
            onClick={() => handleLanguageChange(lang.code)}
            aria-selected={language === lang.code}
          >
            {lang.flag}
            <span>{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
