import { apiSlice } from "../apiSlice/apiSlice";
import { UpdateEmployeeLanguage } from "./languageSliceLocal";
import { TEmployeeLanguage } from "./languageType";

const languageApiWithTag = apiSlice.enhanceEndpoints({
  addTagTypes: ["employeeLanguage"],
});

export const languageApi = languageApiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    // جلب لغة وrtl موظف معيّن
    getEmployeeLanguage: builder.query<TEmployeeLanguage, string>({
      // employeeId هو البراميتر
      query: (employeeId) => ({
        url: `/employee/language/${employeeId}`,
        method: "GET",
      }),
      async onQueryStarted(employeeId, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(UpdateEmployeeLanguage(data)); // حفظها في local state
        } catch (error) {
          console.log(error);
        }
      },
      providesTags: (result, error, employeeId) => [
        { type: "employeeLanguage", id: employeeId },
      ],
    }),

    updateEmployeeLanguage: builder.mutation<
      TEmployeeLanguage,
      TEmployeeLanguage
    >({
      query: ({ employeeId, language, rtl }) => ({
        url: `/employee/language/${employeeId}`,
        method: "PATCH",
        body: { language, rtl },
      }),
      invalidatesTags: (result, error, { employeeId }) => [
        { type: "employeeLanguage", id: employeeId },
      ],
    }),
  }),
});

export const {
  useGetEmployeeLanguageQuery,
  useUpdateEmployeeLanguageMutation,
} = languageApi;
