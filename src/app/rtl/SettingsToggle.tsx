"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { updateSetting } from "@/redux/features/settingApiSlice/settingSliceLocal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function SettingsToggle() {
  const settings = useSelector((state: RootState) => state["setting-slice"]);

  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // هذا الكود يعمل فقط في المتصفح
    setIsMobile(window.innerWidth <= 600);

    // إذا أردت جعلها ديناميكية عند تغيير حجم الشاشة:
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);

    // تنظيف الحدث عند إزالة الكمبوننت
    return () => window.removeEventListener("resize", handleResize);
    }, []);




  const style = {
  top: isMobile ? "8px" : "16px",
  right: isMobile ? "8px" : "16px",
  zIndex: 9999,
  padding: isMobile ? "4px 8px" : "8px 16px",
  background: "#fff",
  border: "1px solid #ccc",
  borderRadius: "6px",
  cursor: "pointer",
  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
  margin: isMobile ? "8px" : "0", // مارجن حوالين العنصر على الموبايل فقط
  fontSize: isMobile ? "12px" : "16px", // يخلي الخط أصغر على الموبايل
};

  // دالة عند الضغط على الزر
const handleToggle = () => {
  const newLanguage = settings.language === "ar" ? "en" : "ar";
  const newRtl = newLanguage === "ar";
  dispatch(updateSetting({
    ...settings,
    language: newLanguage,
    rtl: newRtl,
  }));
};


  

  return (
<button
  onClick={handleToggle}
  style={style}
>
  {t("toggleLang")}
</button>


  );
}
