"use client";

import Pagination from "@/components/pagination";
import SearchBox from "@/components/search-box";
import { useDialog } from "@/hooks/useDialog";
import useLocalCacheHook from "@/hooks/useLocalCacheHook";
import { useGetEmployeesQuery } from "@/redux/features/employeeApiSlice/employeeSlice";
import { useAppSelector } from "@/redux/hook";
import { Button } from "@/ui/button";
import { Dialog, DialogTrigger } from "@/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import EmployeeInsert from "./_components/employee-insert";
import EmployeePage from "./_components/employee-page";
import { useTranslation } from "react-i18next";

export default function Employees() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const { limit } = useAppSelector((state) => state.filter);
  const page = searchParams?.get("page");
  const search = searchParams?.get("search");

  // get all employees from cache or api
  const { data } = useGetEmployeesQuery({
    page: page ? Number(page) : 1,
    limit: limit,
    search: search ? search : "",
  });

  const { result: employees, meta } = data || {};
  const { localData } = useLocalCacheHook(
    {
      data: employees!,
    },
    "local-employees"
  );
  const { isDialogOpen, onDialogChange } = useDialog();
  const { t } = useTranslation();

  return (
    <section className="p-6 ">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-h4 hidden sm:block mr-2">{t("employees")}</h2>
        <SearchBox />
        <Dialog modal={true} open={isDialogOpen} onOpenChange={onDialogChange}>
          <DialogTrigger asChild>
            <Button className="ml-auto">Add Employee</Button>
          </DialogTrigger>
          <EmployeeInsert onDialogChange={onDialogChange} />
        </Dialog>
      </div>

      <Table className="text-align-last-center">
        <TableHeader className="sticky top-0">
          <TableRow className="sticky top-0 text-align-last-center">
            <TableHead className="sticky top-0">Name</TableHead>
            <TableHead className="sticky top-0">Department</TableHead>
            <TableHead className="sticky top-0">Email</TableHead>
            <TableHead className="sticky top-0">Phone</TableHead>
            <TableHead className="sticky top-0">Status</TableHead>

            {session?.user?.role === "admin" && (
              <TableHead className="sticky top-0 text-right">More</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {!employees?.length && (
            <TableRow>
              <TableCell colSpan={session?.user?.role === "admin" ? 6 : 5}>
                <div className="loader">
                  <div className="loader-line" />
                </div>
              </TableCell>
            </TableRow>
          )}

          {employees?.length ? (
            <EmployeePage employees={employees} />
          ) : (
            <EmployeePage employees={localData} />
          )}
        </TableBody>
      </Table>

      <Pagination
        total={meta?.total!}
        className="ltr-element ml-auto flex mt-4"
      />
    </section>
  );
}
