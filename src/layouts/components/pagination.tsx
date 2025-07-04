"use client";

import useQuerySelector from "@/hooks/useQuerySelector";
import { useAppSelector } from "@/redux/hook";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next"; // أضف هذا السطر

const Pagination = ({
  total,
  className,
}: {
  total: number;
  className?: string;
}) => {
  const { t } = useTranslation(); // أضف هذا السطر
  const { limit } = useAppSelector((state) => state.filter);
  const totalPages = total && limit ? Math.max(1, Math.ceil(total / limit)) : 1;
  const searchParams = useSearchParams();
  const page = Number(searchParams?.get("page")) || 1;
  const [inputPage, setInputPage] = useState(page);
  const { onSelect } = useQuerySelector();

  // handle pagination by input box
  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSelect(`${inputPage}`, "page");
  };
  useEffect(() => setInputPage(page), [page]);

  return (
    <div className={`flex justify-end items-center ${className}`}>
      <p className="mr-4">
        {t("Page")} {page ? page : 1} {t("of")} {totalPages}
      </p>
      <div>
        <ul className="flex space-x-2">
          <li
            className={`border border-border rounded-sm bg-white ${
              page === 1 ? "text-text-light" : "text-primary"
            }`}
            onClick={() => onSelect("1", "page")}
          >
            <button className="block p-2" disabled={page === 1}>
              <ChevronsLeft size={16} />
            </button>
          </li>

          <li
            className={`border border-border rounded-sm bg-white ${
              page === 1 ? "text-text-light" : "text-primary"
            }`}
            onClick={() => onSelect(`${page - 1}`, "page")}
          >
            <button className="block p-2" disabled={page === 1}>
              <ChevronLeft size={16} />
            </button>
          </li>

          <li>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="page"
                value={inputPage}
                onChange={(e) => setInputPage(Number(e.target.value))}
                autoComplete="off"
                className="w-9 text-center border border-border border-border rounded-sm bg-white h-9 p-0 focus:outline-none focus:ring-0 focus:border-dark"
                aria-label={t("Go to page")}
              />
            </form>{" "}
          </li>
          <li
            className={`border border-border rounded-sm bg-white  ${
              page === totalPages ? "text-text-light" : "text-primary"
            }`}
            onClick={() => onSelect(`${page + 1}`, "page")}
          >
            <button className="block p-2" disabled={page === totalPages}>
              <ChevronRight size={16} />
            </button>
          </li>

          <li
            className={`border border-border rounded-sm bg-white  ${
              page === totalPages ? "text-text-light" : "text-primary"
            }`}
            onClick={() => onSelect(`${totalPages}`, "page")}
          >
            <button className="block p-2" disabled={page === totalPages}>
              <ChevronsRight size={16} />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Pagination;
