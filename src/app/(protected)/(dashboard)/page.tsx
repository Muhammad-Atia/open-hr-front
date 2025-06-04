"use client";

import ClearCache from "@/helpers/clear-cache";
import { useAppSelector } from "@/redux/hook";
import { useSession } from "next-auth/react";
import Gravatar from "react-gravatar";
import PendingTasks from "./_components/pending-tasks";
import UpcomingEvents from "./_components/upcoming-events";
import UpcomingHolidays from "./_components/upcoming-holidays";
import UpcomingLeaves from "./_components/upcoming-leaves";
import UserAssets from "./_components/user-assets";
import UserCourses from "./_components/user-courses";
import UserTools from "./_components/user-tools";
import { Trans, useTranslation } from "react-i18next";
import { useGetEmployeeQuery } from "@/redux/features/employeeApiSlice/employeeSlice";

const isModuleEnabled = (modules: any[], name: string) =>
  modules.find((mod) => mod.name === name)?.enable;

const UserSection = ({
  modules,
  userId,
}: {
  modules: any[];
  userId: string;
}) => (
  <>
    {isModuleEnabled(modules, "tool") && (
      <div className="col-12">
        <UserTools userId={userId} />
      </div>
    )}
    {isModuleEnabled(modules, "course") && (
      <div className="col-12">
        <UserCourses userId={userId} />
      </div>
    )}
    {isModuleEnabled(modules, "asset") && (
      <div className="col-12">
        <UserAssets userId={userId} />
      </div>
    )}
  </>
);

const AdminSection = ({ modules }: { modules: any[] }) => (
  <>
    {isModuleEnabled(modules, "leave") && (
      <div className="lg:col-6">
        <UpcomingLeaves />
      </div>
    )}
    {isModuleEnabled(modules, "employee-lifecycle") && (
      <div className="lg:col-6">
        <PendingTasks />
      </div>
    )}
    {isModuleEnabled(modules, "calendar") && (
      <>
        <div className="lg:col-6">
          <UpcomingHolidays />
        </div>
        <div className="lg:col-6">
          <UpcomingEvents />
        </div>
      </>
    )}
  </>
);

const Dashboard = () => {
  const { t } = useTranslation();

  const { data: session } = useSession();
  const userId = session?.user?.id;
  const {
    data: employeeData,
    isLoading,
    isError,
  } = useGetEmployeeQuery(userId ?? "");

  // check module enabled or not
  const { modules = [] } = useAppSelector((state) => state["setting-slice"]);

  return (
    <section className="p-6">
      <div className="row gx-3">
        <div className="col-12 mb-8">
          <ClearCache />
          <div className="flex">
            <Gravatar
              className="rounded-md shrink-0"
              email={employeeData?.result?.work_email}
              size={72}
              default="mp"
            />
            {!isLoading && employeeData?.result?.name && (
              <div className="ml-4">
                <h1 className="text-2xl m-2">
                  {t("hi")}, {employeeData?.result?.name}
                </h1>
                <p className="m-2 text-text-light">
                  <Trans
                    i18nKey="logged_in_as"
                    values={{ role: t(`roles.${session?.user?.role}`) }}
                    components={{
                      1: <strong className="capitalize text-dark" />,
                    }}
                  />
                </p>
              </div>
            )}
          </div>
        </div>
        {session?.user.role === "user" ? (
          <UserSection modules={modules} userId={session?.user?.id!} />
        ) : session?.user.role === "admin" ? (
          <AdminSection modules={modules} />
        ) : session?.user.role === "former" ? (
          <div className="col-12">
            <h4 className="mb-3">Your Account Has Been Archived!</h4>
            <p>
              Thanks you for your service. Your contribution to the organization
              is greatly appreciated.
            </p>
          </div>
        ) : (
          <div className="col-12">
            <h4 className="mb-3">You Don't Have Permissions!</h4>
          </div>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
