import { FaGlobe } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";

type LanguageSelectProps = {
  language: string;
  rtl: boolean;
  handleLanguageChange: (lang: string) => void;
};

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

export default function LanguageSelect({
  language,
  rtl,
  handleLanguageChange,
}: LanguageSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = LANGUAGES.find((l) => l.code === language);

  return (
    <div ref={ref} className="relative mt-2 mb-4">
      <button
        type="button"
        className="
          w-full flex items-center justify-between rounded-lg border border-gray-200
          bg-white px-2 py-2.5 text-black text-sm font-medium shadow-sm
          hover:bg-blue-50 transition
        "
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
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
      </button>
      {open && (
        <ul
          className="absolute left-0 z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow"
          role="listbox"
        >
          {LANGUAGES.map((lang) => (
            <li
              key={lang.code}
              className={`
              px-4 py-1 flex items-center gap-2 cursor-pointer
              ${language === lang.code ? "bg-blue-100 font-bold" : "hover:bg-blue-50"}
            `}
              onClick={() => {
                handleLanguageChange(lang.code);
                setOpen(false);
              }}
              role="option"
              aria-selected={language === lang.code}
            >
              {lang.flag}
              <span>{lang.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
