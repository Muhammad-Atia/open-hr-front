import Loader from "@/components/loader";
import { dateFormat } from "@/lib/date-converter";
import { useGetUpcomingHolidaysAndEventsQuery } from "@/redux/features/calendarApiSlice/calendarSlice";
import { TEvent } from "@/redux/features/calendarApiSlice/calendarType";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Calendar1 } from "lucide-react";
import { useTranslation } from "react-i18next";

const UpcomingHolidays = () => {
  const { t } = useTranslation();
  const today = new Date().toISOString().slice(0, 10);
  const { data, isLoading } = useGetUpcomingHolidaysAndEventsQuery(today);

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>
          <Calendar1 className="mr-2 inline-block" />
          {t("upcoming_holidays")}
        </CardTitle>
      </CardHeader>
      <CardContent className="lg:h-[300px] scroll-box">
        {isLoading ? (
          <div className="flex justify-center items-center h-[200px]">
            <Loader />
          </div>
        ) : data?.result?.holidays?.length === 0 ? (
          <p className="text-text-light">{t("no_upcoming_holidays")}</p>
        ) : (
          <ul className="space-y-3">
            {data?.result?.holidays?.map((holiday: TEvent, index: number) => (
              <li
                className="ltr-element bg-destructive/10 px-3 py-2 rounded"
                key={`holiday-${index}`}
              >
                <p className="capitalize text-destructive block">
                  {t(`holiday_reasons.${holiday.reason}`, {
                    defaultValue: holiday.reason,
                  })}
                </p>
                <small className="text-text-light">
                  {t("holiday_period", {
                    start: dateFormat(holiday.start_date!),
                    end: dateFormat(holiday.end_date!),
                  })}
                </small>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingHolidays;
