import { TPagination } from "@/types";
import { apiSlice } from "../apiSlice/apiSlice";
import { TEmployeeJob, TEmployeeJobState } from "./employeeJobType";

const employeeJobApiWithTag = apiSlice.enhanceEndpoints({
  addTagTypes: ["employee-jobs"],
});

export const employeeJobApi = employeeJobApiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeJobs: builder.query<TEmployeeJobState, TPagination>({
      query: ({ page, limit, search }) => ({
        url: `/employee-job?page=${page}&limit=${limit}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["employee-jobs"],
      keepUnusedDataFor: 30 * 60,
    }),

    getEmployeeJob: builder.query<TEmployeeJobState<TEmployeeJob>, string>({
      query: (id) => ({
        url: `/employee-job/${id}`,
        method: "GET",
      }),
      transformResponse: (response: TEmployeeJobState<TEmployeeJob>) => {
        if (!response || !response.result) return response;

        if (Array.isArray(response.result.promotions)) {
          response.result.promotions = response.result.promotions.sort(
            (a, b) => {
              return (
                new Date(b.promotion_date).getTime() -
                new Date(a.promotion_date).getTime()
              );
            }
          );
        } else {
          response.result.promotions = [];
        }

        if (Array.isArray(response.result.prev_jobs)) {
          response.result.prev_jobs = response.result.prev_jobs.sort((a, b) => {
            return (
              new Date(b.end_date).getTime() - new Date(a.end_date).getTime()
            );
          });
        } else {
          response.result.prev_jobs = [];
        }

        return response;
      },

      providesTags: ["employee-jobs"],
    }),

    addEmployeeJob: builder.mutation<TEmployeeJobState, TEmployeeJob>({
      query: (data) => ({
        url: `/employee-job`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["employee-jobs"],
    }),

    updateEmployeeJob: builder.mutation<
      TEmployeeJobState,
      Partial<TEmployeeJob>
    >({
      query: (data) => {
        return {
          url: `/employee-job/${data.employee_id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["employee-jobs"],
    }),

    deleteEmployeeJob: builder.mutation({
      query: (id) => ({
        url: `/employee-job/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["employee-jobs"],
    }),
  }),
});

export const {
  useGetEmployeeJobsQuery,
  useGetEmployeeJobQuery,
  useAddEmployeeJobMutation,
  useUpdateEmployeeJobMutation,
  useDeleteEmployeeJobMutation,
} = employeeJobApi;
