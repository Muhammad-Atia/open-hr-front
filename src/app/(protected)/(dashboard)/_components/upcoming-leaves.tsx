import UserInfo from "@/components/user-info";
import { dateFormat } from "@/lib/date-converter";
import { employeeInfoById } from "@/lib/employee-info";
import { useGetUpcomingLeaveRequestsQuery } from "@/redux/features/leaveRequestApiSlice/leaveRequestSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { UserRoundMinus } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import Loader from "@/components/loader"; // تأكد أن لديك مكون Loader

const UpcomingLeaves = () => {
  const { t } = useTranslation();

  const today = new Date().toISOString().slice(0, 10);
  const { data, isLoading } = useGetUpcomingLeaveRequestsQuery(today);

  // today leave
  const todaysLeave = useMemo(() => {
    return data?.result?.filter((leave: any) => {
      const start = new Date(leave.start_date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(leave.end_date);
      end.setHours(0, 0, 0, 0);
      const currentDate = new Date(today);
      currentDate.setHours(0, 0, 0, 0);
      return currentDate >= start && currentDate <= end;
    });
  }, [data, today]);

  // tomorrow leave
  const tomorrowsLeave = useMemo(() => {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return data?.result?.filter((leave: any) => {
      const start = new Date(leave.start_date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(leave.end_date);
      end.setHours(0, 0, 0, 0);
      const currentDate = new Date(tomorrow);
      currentDate.setHours(0, 0, 0, 0);
      return currentDate >= start && currentDate <= end;
    });
  }, [data, today]);

  // others leave without today and tomorrow
  const othersLeave = useMemo(() => {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return data?.result?.filter((leave: any) => {
      const start = new Date(leave.start_date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(leave.end_date);
      end.setHours(0, 0, 0, 0);
      const currentDate = new Date(today);
      currentDate.setHours(0, 0, 0, 0);
      return (currentDate < start && tomorrow < start) || currentDate > end;
    });
  }, [data, today]);

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>
          <UserRoundMinus className="mr-2 inline-block" />
          {t("whos_out")}
        </CardTitle>
      </CardHeader>
      <CardContent className="lg:h-[300px] scroll-box">
        {isLoading ? (
          <div className="flex justify-center items-center h-[200px]">
            <Loader />
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h4 className="text-base font-medium mb-3">{t("today")}</h4>
              {todaysLeave?.length === 0 ? (
                <p className="text-text-light">
                  {t("nobody_requested_time_off_today")}
                </p>
              ) : (
                <ul className="space-y-3">
                  {todaysLeave?.map((leave: any) => (
                    <li key={leave.employee_id}>
                      <UserInfo
                        user={employeeInfoById(leave.employee_id)!}
                        description={`${dateFormat(leave.start_date)} - ${dateFormat(leave.end_date)}`}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mb-6">
              <h4 className="text-base font-medium mb-3">{t("tomorrow")}</h4>
              {tomorrowsLeave?.length === 0 ? (
                <p className="text-text-light">
                  {t("nobody_requested_time_off_tomorrow")}
                </p>
              ) : (
                <ul className="space-y-3">
                  {tomorrowsLeave?.map((leave: any) => (
                    <li key={leave.employee_id}>
                      <UserInfo
                        user={employeeInfoById(leave.employee_id)!}
                        description={`${dateFormat(leave.start_date)} - ${dateFormat(leave.end_date)}`}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mb-6">
              <h4 className="text-base font-medium mb-3">
                {t("upcoming_leaves")}
              </h4>
              {othersLeave?.length === 0 ? (
                <p className="text-text-light">
                  {t("nobody_requested_time_off_upcoming")}
                </p>
              ) : (
                <ul className="space-y-3">
                  {othersLeave?.map((leave: any) => (
                    <li key={leave.employee_id}>
                      <UserInfo
                        user={employeeInfoById(leave.employee_id)!}
                        description={`${dateFormat(leave.start_date)} - ${dateFormat(leave.end_date)}`}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingLeaves;
