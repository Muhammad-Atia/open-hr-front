import { dateFormat } from "@/lib/date-converter";
import { employeeInfoById } from "@/lib/employee-info";
import {
  useGetPendingOffboardingTaskQuery,
  useUpdateOffboardingTaskStatusMutation,
} from "@/redux/features/employeeOffboardingApiSlice/employeeOffboardingSlice";
import {
  useGetPendingOnboardingTaskQuery,
  useUpdateOnboardingTaskStatusMutation,
} from "@/redux/features/employeeOnboardingApiSlice/employeeOnboardingSlice";
import { TOnboardingTask } from "@/redux/features/employeeOnboardingApiSlice/employeeOnboardingType";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { BadgeInfo, CheckCircle, CircleDashed } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useTranslation, Trans } from "react-i18next";
import Loader from "@/components/loader";

const PendingTasks = () => {
  const { t } = useTranslation();
  const [allDisabled, setAllDisabled] = useState(false);

  const { data: offboardingTasks, isLoading: isOffboardingLoading } =
    useGetPendingOffboardingTaskQuery(undefined);

  const { data: onboardingTasks, isLoading: isOnboardingLoading } =
    useGetPendingOnboardingTaskQuery(undefined);

  const [updateOffboardingTask] = useUpdateOffboardingTaskStatusMutation();
  const [updateOnboardingTask] = useUpdateOnboardingTaskStatusMutation();

  const mergeTasks = useMemo(() => {
    return [
      ...(offboardingTasks?.result?.map((task) => ({
        ...task,
        type: "offboarding",
      })) || []),
      ...(onboardingTasks?.result?.map((task) => ({
        ...task,
        type: "onboarding",
      })) || []),
    ];
  }, [offboardingTasks, onboardingTasks]);

  const handleCompleteTask = async (
    employeeId: string,
    taskName: string,
    type: string
  ) => {
    try {
      setAllDisabled(true); // عطل كل الأزرار

      if (type === "offboarding") {
        await updateOffboardingTask({
          employee_id: employeeId,
          task_name: taskName,
        }).unwrap();
      } else {
        await updateOnboardingTask({
          employee_id: employeeId,
          task_name: taskName,
        }).unwrap();
      }
      toast.success("Task marked as completed");
      setTimeout(() => setAllDisabled(false), 2000);
    } catch (error: any) {
      toast.error(error.message ?? "Failed to complete task");
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>
          <BadgeInfo className="mr-2 inline-block" />
          {t("pending_tasks")}
        </CardTitle>
      </CardHeader>
      <CardContent className="lg:h-[300px] scroll-box">
        {isOffboardingLoading || isOnboardingLoading ? (
          <div className="flex justify-center items-center h-[200px]">
            <Loader />
          </div>
        ) : null}

        {!isOffboardingLoading &&
          !isOnboardingLoading &&
          mergeTasks?.length === 0 && (
            <p className="text-text-light">{t("no_pending_tasks")}</p>
          )}

        {!isOffboardingLoading &&
          !isOnboardingLoading &&
          mergeTasks?.length > 0 && (
            <ul className="space-y-3">
              {mergeTasks?.map(
                (
                  task: TOnboardingTask & {
                    employee_id: string;
                    createdAt: Date;
                    type: string;
                  }
                ) => {
                  // Use a unique key based on employee_id and task_name
                  const key = `task-${task.employee_id}-${task.task_name}`;
                  return (
                    <li
                      className="flex items-start justify-between flex-wrap lg:flex-nowrap"
                      key={key}
                    >
                      <div className="flex items-start">
                        <CircleDashed className="mr-2 mt-1 size-5 text-muted" />
                        <div className="flex-1">
                          <strong className="font-medium">
                            {task.task_name}
                          </strong>
                          <small className="block text-text-light">
                            <Trans
                              i18nKey="employee_name"
                              values={{
                                name:
                                  employeeInfoById(task.employee_id)?.name ??
                                  "",
                              }}
                              components={[
                                <strong key="employee-name-strong" />,
                              ]}
                            />
                          </small>
                          <small className="block text-text-light">
                            <Trans
                              i18nKey="assigned_to"
                              values={{
                                name:
                                  employeeInfoById(task.assigned_to)?.name ??
                                  "",
                              }}
                              components={[<strong key="assigned-to-strong" />]}
                            />
                          </small>
                          <small className="block text-text-light">
                            {t("started_at_label")}
                            <span
                              dir="ltr"
                              style={{
                                display: "inline-block",
                                marginRight: 3,
                              }}
                            >
                              {dateFormat(task.createdAt)}
                            </span>
                          </small>
                        </div>
                      </div>
                      <Button
                        disabled={allDisabled}
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleCompleteTask(
                            task.employee_id,
                            task.task_name,
                            task.type
                          )
                        }
                        className="ml-2"
                      >
                        <CheckCircle className="size-4 mr-1" />
                        {t("complete")}
                      </Button>
                    </li>
                  );
                }
              )}
            </ul>
          )}
      </CardContent>
    </Card>
  );
};

export default PendingTasks;
