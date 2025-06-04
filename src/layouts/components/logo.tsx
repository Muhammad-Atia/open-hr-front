"use client";

import { useAppSelector } from "@/redux/hook";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/shadcn";

const Logo = ({ src, className }: { src?: string; className?: string }) => {
  const [mounted, setMounted] = useState(false);

  // حل سريع: انتظر حتى يتم تركيب المكون على العميل
  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    logo_url: logo,
    logo_width,
    logo_height,
    app_name: logo_text,
  } = useAppSelector((state) => state["setting-slice"]);

  const logoPath = logo ? logo : src;

  // لا ترندر أي شيء متعلق بالبيانات إلا بعد التركيب (hydration)
  if (!mounted) return null;

  return (
    <Link href="/" className={cn("navbar-brand inline-block", className)}>
      {logoPath ? (
        <img
          width={logo_width}
          height={logo_height}
          src={logoPath}
          alt={logo_text}
        />
      ) : logo_text ? (
        logo_text
      ) : (
        logo_text
      )}
    </Link>
  );
};

export default Logo;
