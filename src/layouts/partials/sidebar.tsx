import Logo from "@/components/logo";
import { menu } from "@/config/menu";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/ui/accordion";

import { usePathname } from "next/navigation";

import { useTranslation } from "react-i18next";
import { UpdateEmployeeLanguage } from "@/redux/features/languageApiSlice/languageSliceLocal";
import { useUpdateEmployeeLanguageMutation } from "@/redux/features/languageApiSlice/languageSlice";
import { useState } from "react";
import LanguageSelect from "./languageSelect";
import { useSession } from "next-auth/react";

import LogoutButton from "./logout";
import DarkModeToggle from "@/styles/darkmode";
import { Card, CardHeader } from "@/ui/card";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Button } from "@/ui/button";

const Sidebar = ({ onClose }: { onClose?: () => void }) => {
  const { data: session } = useSession();

  const dispatch = useAppDispatch();

  // const { data: employeeLanguage, isLoading } = useGetEmployeeLanguageQuery(
  //   session?.user.id as string
  // );
  // const [language, setLanguage] = useState(employeeLanguage?.language || "");

  // const [updateLanguage, { isLoading: isUpdating }] =
  //   useUpdateEmployeeLanguageMutation();

  // const handleLanguageChange = (e: { target: { value: string } }) => {
  //   setLanguage(e.target.value);

  //   const value = e.target.value as "ar" | "en";
  //   const employeeId = session?.user?.id!;
  //   const employeeLanguage = {
  //     employeeId,
  //     language: value,
  //     rtl: value === "ar",
  //   };
  //   console.log(employeeLanguage, language);
  //   // يمكنك هنا أيضًا إرسال الطلب للباك اند إذا أردت
  //   // dispatch(UpdateEmployeeLanguage(employeeLanguage));
  //   // updateLanguage(employeeLanguage);
  // };

  // const handleLanguageChange = (e: { target: { value: string } }) => {
  //   const value = e.target.value as "ar" | "en";
  //   const rtl = value === "ar";
  //   setLanguage(value);

  //   // تحديث الـ Redux store
  //   dispatch(
  //     UpdateEmployeeLanguage({
  //       employeeId: session?.user?.id!,
  //       language: value,
  //       rtl: value === "ar",
  //     })
  //   );

  //   // تحديث الـ backend (اختياري حسب الحاجة)
  //   updateLanguage({
  //     employeeId: session?.user?.id!,
  //     language: value,
  //     rtl: value === "ar",
  //   });

  //   console.log(session?.user?.id!, value, rtl);
  // };

  const { result: employeeLanguage } = useAppSelector(
    (state) => state["language-slice"]
  );
  const [, setLanguage] = useState(employeeLanguage.language);
  const rtl = employeeLanguage.rtl;

  const [updateLanguage] = useUpdateEmployeeLanguageMutation();

  const handleLanguageChange = async (lang: string) => {
    const value = lang as "ar" | "en";

    setLanguage(value);

    const payload = {
      employeeId: session?.user?.id!,
      language: value,
      rtl: value === "ar",
    };

    // 1. تحديث الـ Redux store المحلي + localStorage
    dispatch(UpdateEmployeeLanguage(payload));

    // 2. تحديث الـ backend
    await updateLanguage(payload);

    // 3. (اختياري) تغيير لغة i18next
  };

  const { t } = useTranslation();

  const pathname = usePathname();

  const { modules } = useAppSelector((state) => state["setting-slice"]);

  const filterMenuByRole = menu.filter((item) =>
    item.access?.includes(session?.user?.role!)
  );

  // only show menu if module is enabled
  const filterMenuByModule = filterMenuByRole
    .map((item) => {
      if ("children" in item && Array.isArray(item.children)) {
        const filteredChildren = item.children.filter((child) => {
          const mod = modules?.find((mod) => mod.name === child.module);
          return mod ? mod.enable : true;
        });
        return { ...item, children: filteredChildren };
      } else {
        const mod = modules?.find((mod) => mod.name === item.module);
        return mod ? (mod.enable ? item : null) : item;
      }
    })
    .filter(Boolean);

  return (
    <div className=" bg-background min-h-0">
      {/* Sidebar */}
      <Card className="h-screen flex flex-col border-none shadow-none bg-transparent">
        {/* الشعار */}
        <CardHeader className="flex items-center justify-center h-24 border-b ">
          <Logo className="w-16 h-16  flex-col" />
        </CardHeader>
        {/* القائمة + الإعدادات داخل ScrollArea واحدة */}
        <div className="flex-1 overflow-y-auto flex flex-col no-scrollbar">
          <ScrollArea className="flex-1 min-h-0 sc">
            <div className="flex flex-col min-h-full">
              {/* القائمة */}
              <nav aria-label="Main menu" className="px-3 py-4">
                <ul
                  className={`text-side-menu  rounded-md" flex flex-col gap-1 px-3 py-4 ${
                    rtl ? "text-right" : "text-left"
                  }`}
                  dir={rtl ? "rtl" : "ltr"}
                >
                  {" "}
                  {filterMenuByModule.map((item) =>
                    item && "children" in item && item.children ? (
                      <li key={item.name}>
                        <Accordion
                          type="single"
                          collapsible
                          value={
                            item.children.some(
                              (child) => pathname === child.path
                            )
                              ? item.name
                              : undefined
                          }
                          className="w-full"
                        >
                          <AccordionItem
                            value={item.name}
                            className="border-none"
                          >
                            <AccordionTrigger className="pl-2 py-2 text-sm font-semibold">
                              <div className="flex items-center gap-2">
                                {item.icon && <item.icon className="h-5 w-5" />}
                                {t(item.name)}
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <ul className="pl-4 flex flex-col gap-1">
                                {item.children.map((child) => (
                                  <li key={child.name}>
                                    <Button
                                      asChild
                                      variant={
                                        child.path === pathname
                                          ? "secondary"
                                          : "ghost"
                                      }
                                      className="w-full justify-start text-sm"
                                    >
                                      <a
                                        href={child.path}
                                        {...(onClose && {
                                          onMouseDown: onClose,
                                        })}
                                      >
                                        {child.icon && (
                                          <child.icon className="h-5 w-5 mr-2" />
                                        )}
                                        {t(child.name)}
                                      </a>
                                    </Button>
                                  </li>
                                ))}
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </li>
                    ) : item ? (
                      <li key={item.name}>
                        <Button
                          asChild
                          variant={
                            item.path === pathname ? "secondary" : "ghost"
                          }
                          className={`w-full justify-start text-sm
                            ${item.path !== pathname ? "hover:bg-gray-100 dark:hover:bg-gray-400" : ""}
                          `}
                        >
                          <a
                            href={item.path}
                            {...(onClose && { onMouseDown: onClose })}
                          >
                            {item.icon && (
                              <item.icon className="h-5 w-5 mr-2" />
                            )}
                            {t(item.name)}
                          </a>
                        </Button>
                      </li>
                    ) : null
                  )}
                </ul>
                <div className="mt-auto px-3 py-4 border-t dark:border-neutral-800 bg-background flex flex-col gap-2">
                  <LanguageSelect
                    language={employeeLanguage.language}
                    rtl={employeeLanguage.rtl}
                    handleLanguageChange={handleLanguageChange}
                  />
                  <DarkModeToggle />
                  <LogoutButton />
                </div>
              </nav>
              {/* إعدادات اللغة والثيم وزر الخروج */}
            </div>
          </ScrollArea>
        </div>
      </Card>

      {/* Main Content */}
    </div>
  );
};

export default Sidebar;
