import Logo from "@/components/logo";
import { menu } from "@/config/menu";
import { cn } from "@/lib/shadcn";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/ui/accordion";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Gravatar from "react-gravatar";
import ConfirmationPopup from "../components/confirmation-popup";
import { useTranslation } from "react-i18next";
import { UpdateEmployeeLanguage } from "@/redux/features/languageApiSlice/languageSliceLocal";
import {
  useGetEmployeeLanguageQuery,
  useUpdateEmployeeLanguageMutation,
} from "@/redux/features/languageApiSlice/languageSlice";
import { useState } from "react";
import LanguageSelect from "./languageSelect";
import { useDispatch } from "react-redux";
import { apiSlice } from "@/redux/features/apiSlice/apiSlice";
import router from "next/router";
import LogoutButton from "./logout";

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
  const [language, setLanguage] = useState(employeeLanguage.language);

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

  const handleLogout = async () => {
    // signOut بدون redirect تلقائي
    await signOut({ redirect: false });

    // الآن نفذ أكوادك بأمان
    dispatch(apiSlice.util.resetApiState());
    localStorage.removeItem("local-employees");

    // إعادة التوجيه يدويًا
    router.push("/login");
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto no-scrollbar">
      <div className="sm:mt-10 mb-6 flex justify-center items-center h-32">
        <Logo className="pl-5" />
      </div>
      <nav className="px-5 flex-1 flex flex-col">
        <ul className="flex-1">
          {filterMenuByModule.map((item) => {
            if (item && "children" in item && item.children) {
              const isActive = item.children.some(
                (child) => pathname === child.path
              );
              return (
                <Accordion
                  key={item.name}
                  type="single"
                  collapsible
                  value={isActive ? item.name : undefined}
                >
                  <AccordionItem className="border-none" value={item.name}>
                    <AccordionTrigger className="pl-2 hover:no-underline pb-3 pt-2 text-sm">
                      <div className="flex items-center justify-start">
                        {item.icon && (
                          <item.icon className="inline h-5 mr-2 mb-0.5" />
                        )}
                        {t(item.name)}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="pl-2">
                        {item.children.map((child) => (
                          <li className="mb-2" key={child.name}>
                            <Link
                              {...(onClose && { onMouseDown: onClose })}
                              href={child.path}
                              className={cn(
                                "rounded text-black text-sm font-medium block px-2 py-2.5",
                                child.path === pathname &&
                                  "bg-primary text-primary-foreground"
                              )}
                            >
                              {child.icon && (
                                <child.icon className="inline h-5 mr-2 mb-0.5" />
                              )}
                              {t(child.name)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              );
            } else if (item) {
              return (
                <li className="mb-2" key={item.name}>
                  <Link
                    {...(onClose && { onMouseDown: onClose })}
                    href={item.path}
                    className={cn(
                      "rounded text-black text-sm font-medium block px-2 py-2.5",
                      item.path === pathname &&
                        "bg-primary text-primary-foreground"
                    )}
                  >
                    {item.icon && (
                      <item.icon className="inline h-5 mr-2 mb-0.5" />
                    )}
                    {t(item.name)}
                  </Link>
                </li>
              );
            }
            return null;
          })}

          {/* عنصر اختيار اللغة بمحاذاة باقي العناصر */}
          <LanguageSelect
            language={employeeLanguage.language}
            rtl={employeeLanguage.rtl}
            handleLanguageChange={handleLanguageChange}
          />
        </ul>
        <LogoutButton />
      </nav>
    </div>
  );
};

export default Sidebar;
