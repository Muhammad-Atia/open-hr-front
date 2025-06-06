import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TEmployeeLanguage, TEmployeeLanguageState } from "./languageType";

const defaultResult: TEmployeeLanguage = {
  employeeId: "",
  language: "ar",
  rtl: true,
};

const getInitialResult = (): TEmployeeLanguage => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("local-language");
    if (saved) return JSON.parse(saved) as TEmployeeLanguage;
  }
  return defaultResult;
};

const initialState: TEmployeeLanguageState = {
  loading: false,
  result: getInitialResult(),
  error: false,
};

export const languageSlice = createSlice({
  name: "language-slice",
  initialState,
  reducers: {
    UpdateEmployeeLanguage: (
      state,
      action: PayloadAction<TEmployeeLanguage>
    ) => {
      state.result = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("local-language", JSON.stringify(action.payload));
      }
    },
  },
});

export const { UpdateEmployeeLanguage } = languageSlice.actions;
export default languageSlice.reducer;
