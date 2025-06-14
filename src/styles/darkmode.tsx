// "use client";
// import { Button } from "@/components/ui/button";
// import { Sun, Moon } from "lucide-react"; // أيقونات جاهزة
// import useDarkMode from "./themeProvider"; // هوك مخصص لإدارة الوضع الداكن

// export default function DarkModeToggle({ lang = "ar" }) {
//   const { toggleDarkMode, isDarkMode } = useDarkMode();

//   // نص الزر حسب اللغة والوضع الحالي
//   const label =
//     lang === "ar"
//       ? isDarkMode
//         ? "وضع النهار"
//         : "وضع الليل"
//       : isDarkMode
//         ? "Light Mode"
//         : "Dark Mode";

//   return (
//     <Button
//       variant="outline"
//       onClick={toggleDarkMode}
//       className={`
//         flex items-center gap-2 justify-between
//     rounded-full px-4 py-2
//     bg-white text-black border-gray-200
//     dark:bg-gray-900 dark:text-white dark:border-gray-700
//     shadow transition
//     hover:bg-gray-100
//     dark:hover:bg-gray-800
//       `}
//       aria-label={label}
//     >
//       <span className="text-sm font-medium">{label}</span>
//       {isDarkMode ? (
//         <Sun className="w-5 h-5 text-yellow-400" />
//       ) : (
//         <Moon className="w-5 h-5 text-blue-500" />
//       )}
//     </Button>
//   );
// }

"use client";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes"; // مكتبة next-themes

export default function DarkModeToggle({ lang = "ar" }) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  // استخدم resolvedTheme لضمان التوافق مع النظام
  const isDarkMode = resolvedTheme === "dark";

  const label =
    lang === "ar"
      ? isDarkMode
        ? "وضع النهار"
        : "وضع الليل"
      : isDarkMode
        ? "Light Mode"
        : "Dark Mode";

  return (
    <Button
      variant="outline"
      onClick={() => setTheme(isDarkMode ? "light" : "dark")}
      className={`
        flex items-center gap-2 justify-between 
        rounded-full px-4 py-2
     
        shadow transition
      
      `}
      aria-label={label}
    >
      <span className="text-sm font-medium">{label}</span>
      {isDarkMode ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-blue-500" />
      )}
    </Button>
  );
}
