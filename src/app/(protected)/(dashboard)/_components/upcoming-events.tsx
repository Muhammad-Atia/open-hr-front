import Loader from "@/components/loader";
import { dateFormat } from "@/lib/date-converter";
import { useGetUpcomingHolidaysAndEventsQuery } from "@/redux/features/calendarApiSlice/calendarSlice";
import { TEvent } from "@/redux/features/calendarApiSlice/calendarType";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { CalendarCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

const UpcomingEvents = () => {
  const today = new Date().toISOString().slice(0, 10);
  const { data, isLoading } = useGetUpcomingHolidaysAndEventsQuery(today);
  const { t } = useTranslation();

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>
          <CalendarCheck className="mr-2 inline-block" />
          {t("upcoming_events")}
        </CardTitle>
      </CardHeader>
      <CardContent className="lg:h-[300px] scroll-box">
        {isLoading ? (
          <div className="flex justify-center items-center h-[200px]">
            <Loader />
          </div>
        ) : data?.result?.events?.length === 0 ? (
          <p className="text-text-light">{t("no_upcoming_events")}</p>
        ) : (
          <ul className="space-y-3">
            {data?.result?.events?.map((event: TEvent, index: number) => (
              <li
                className="bg-success/10 px-3 py-2 rounded"
                key={`event-${index}`}
              >
                <p className="capitalize text-success block">
                  {t(`event_reasons.${event.reason}`, {
                    defaultValue: event.reason,
                  })}
                </p>
                <small className="text-text-light">
                  <span dir="ltr" style={{ display: "inline-block" }}>
                    {t("event_period", {
                      start: dateFormat(event.start_date!),
                      end: dateFormat(event.end_date!),
                    })}
                  </span>
                </small>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingEvents;
