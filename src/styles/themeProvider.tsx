// // app/providers.tsx
"use client";
import { ThemeProvider } from "next-themes";
import { ReactNode, useEffect, useState } from "react";

export default function ThemeProviders({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // لا ترندر أي شيء متعلق بالثيم حتى يتم mounting
  if (!mounted) return null;
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
    </ThemeProvider>
  );
}
// "use client";
// import { useState, useEffect, useCallback } from "react";

// export default function useDarkMode() {
//   const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
//     const savedTheme = localStorage.getItem("theme");
//     if (savedTheme) {
//       return savedTheme === "dark";
//     }
//     return window.matchMedia("(prefers-color-scheme: dark)").matches;
//   });

//   // Toggle dark mode
//   const toggleDarkMode = useCallback(() => {
//     setIsDarkMode((prev) => {
//       const newMode = !prev;
//       const html = document.documentElement;
//       if (newMode) {
//         html.classList.add("dark");
//         localStorage.setItem("theme", "dark");
//       } else {
//         html.classList.remove("dark");
//         localStorage.setItem("theme", "light");
//       }
//       return newMode;
//     });
//   }, []);

//   // Sync the theme with the <html> element
//   useEffect(() => {
//     const html = document.documentElement;
//     if (isDarkMode) {
//       html.classList.add("dark");
//     } else {
//       html.classList.remove("dark");
//     }
//   }, [isDarkMode]);

//   return { isDarkMode, toggleDarkMode };
// }
