import { Input } from "@/ui/input";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const SearchBox = ({
  className = "mr-2",
  onSearch,
}: {
  className?: string;
  onSearch?: (value: string) => void;
}) => {
  const pathname = usePathname();
  const ref = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch?.(ref.current?.value || "");
    if (ref.current?.value) {
      router.push(`?search=${ref.current?.value}`);
    } else {
      if (pathname) {
        router.push(pathname);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  const { t } = useTranslation();

  return (
    <form onSubmit={handleSearch} className={className}>
      <Input
        className="text-xs w-full max-w-xs"
        ref={ref}
        type="text"
        placeholder={t("search_placeholder")}
      />
    </form>
  );
};

export default SearchBox;
