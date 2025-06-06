export type TEmployeeLanguage = {
  employeeId: string;
  language: "ar" | "en"; // أضف لغات أخرى إذا أردت
  rtl: boolean;
};

export type TEmployeeLanguageState = {
  loading: boolean;
  result: TEmployeeLanguage;
  error: boolean;
};
