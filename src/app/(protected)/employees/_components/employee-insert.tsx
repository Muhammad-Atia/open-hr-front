import options from "@/config/options.json";
import { dateFormat, formatDateWithTime } from "@/lib/date-converter";
import { employeeGroupByDepartment } from "@/lib/employee-info";
import { useAddEmployeeMutation } from "@/redux/features/employeeApiSlice/employeeSlice";
import { TEmployeeCreate } from "@/redux/features/employeeApiSlice/employeeType";
import { Button } from "@/ui/button";
import { Calendar } from "@/ui/calendar";
import { DialogContent, DialogTitle } from "@/ui/dialog";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const initialEmployeeData = {
  name: "",
  personal_email: "",
  work_email: "",
  department: "" as any,
  job_type: "" as any,
  gross_salary: 0,
  joining_date: new Date(),
  designation: "",
  manager_id: "",
  password: "",
};

const EmployeeInsert = ({
  onDialogChange,
}: {
  onDialogChange: (open: boolean) => void;
}) => {
  const [loader, setLoader] = useState(false);
  const [employeeData, setEmployeeData] =
    useState<TEmployeeCreate>(initialEmployeeData);

  const [addEmployee, { isSuccess, isError, error }] = useAddEmployeeMutation();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoader(true);
    try {
      // @ts-ignore
      addEmployee(employeeData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setLoader(false);
      setEmployeeData(initialEmployeeData);
      // close modal/dialog
      onDialogChange(false);
      toast("Employee added successfully");
    } else if (isError) {
      setLoader(false);
      toast("Something went wrong");
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);
  const { t } = useTranslation();

  return (
    <DialogContent
      className="!max-w-2xl overflow-y-auto max-h-[90vh]"
      onPointerDownOutside={(e) => e.preventDefault()}
    >
      <DialogTitle className="mb-4">{t("Add_New_Employee")}</DialogTitle>
      <form onSubmit={handleSubmit} className="row">
        <div className="col-12 mb-4">
          <Label>{t("Empolyee_Name")}</Label>
          <Input
            required
            type="text"
            value={employeeData.name || ""}
            onChange={(e) =>
              setEmployeeData((prev) => ({
                ...prev,
                name: e.target.value || "",
              }))
            }
            placeholder={t("Empolyee_Name")}
          />
        </div>

        <div className="col-12 mb-4">
          <Label>{t("Work Email:")}</Label>
          <Input
            required
            type="email"
            value={employeeData.work_email || ""}
            onChange={(e) =>
              setEmployeeData((prev) => ({
                ...prev,
                work_email: e.target.value || "",
              }))
            }
            placeholder={t("Work Email:")}
          />
        </div>

        <div className="col-12 mb-4">
          <Label>{t("Personal_Email")}</Label>
          <Input
            required
            type="email"
            value={employeeData.personal_email || ""}
            onChange={(e) =>
              setEmployeeData((prev) => ({
                ...prev,
                personal_email: e.target.value || "",
              }))
            }
            placeholder={t("Personal_Email")}
          />
        </div>
        <div className="col-12 mb-4">
          <Label>{t("Department")}</Label>
          <Select
            required
            value={employeeData.department}
            onValueChange={(e: string) =>
              setEmployeeData((prev) => ({
                ...prev,
                department: e as
                  | "development"
                  | "design"
                  | "marketing"
                  | "admin"
                  | "hr_finance"
                  | "production"
                  | "other",
              }))
            }
          >
            <SelectTrigger dir="rtl">
              <SelectValue placeholder={t("Select_Department")} />
            </SelectTrigger>
            <SelectContent>
              {options.employee_department.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="col-12 mb-4">
          <Label>{t("Job_Type")}</Label>
          <Select
            required
            value={employeeData.job_type}
            onValueChange={(e: string) =>
              setEmployeeData((prev) => ({
                ...prev,
                job_type: e as
                  | "full_time"
                  | "part_time"
                  | "remote"
                  | "contractual"
                  | "internship",
              }))
            }
          >
            <SelectTrigger dir="rtl">
              <SelectValue placeholder={t("Select_Job_Type")} />
            </SelectTrigger>
            <SelectContent>
              {options.employee_job_type.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="col-12 mb-4">
          <Label>{t("Designation")}</Label>
          <Input
            type="text"
            required
            value={employeeData.designation || ""}
            onChange={(e) =>
              setEmployeeData((prev) => ({
                ...prev,
                designation: e.target.value,
              }))
            }
            placeholder={t("Designation")}
          />
        </div>

        <div className="col-12 mb-4">
          <Label>{t("Gross_Salary")}</Label>
          <Input
            type="text"
            value={employeeData.gross_salary || ""}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, ""); // فقط أرقام
              setEmployeeData((prev) => ({
                ...prev,
                gross_salary: value === "" ? 0 : Number(value),
              }));
            }}
            placeholder={t("Gross_Salary")}
          />
        </div>

        <div className="col-12 mb-4">
          <Label>{t("Manager")}</Label>
          <Select
            dir="rtl"
            required
            value={employeeData.manager_id}
            onValueChange={(value) =>
              setEmployeeData((prev) => ({
                ...prev,
                manager_id: value,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={t("Select_User")} />
            </SelectTrigger>
            <SelectContent>
              {employeeGroupByDepartment().map((group) => (
                <SelectGroup key={group.label}>
                  <SelectLabel>{group.label}</SelectLabel>
                  {group.options.map(
                    (option: { value: string; label: string }) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    )
                  )}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="col-12 mb-4">
          <Label>{t("Joining_Date")}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                dir="ltr"
                variant={"input"}
                className="w-full flex justify-between"
              >
                {employeeData.joining_date ? (
                  dateFormat(employeeData.joining_date)
                ) : (
                  <span>{t("Pick_a_date")}</span>
                )}
                <span className="flex items-center">
                  <span className="bg-border mb-2 mt-2 h-5 block w-[1px]"></span>
                  <span className="pl-2  block">
                    <CalendarIcon className="ml-auto border-box h-4 w-4 opacity-50" />
                  </span>
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                required
                mode="single"
                selected={
                  employeeData.joining_date
                    ? new Date(employeeData.joining_date)
                    : new Date()
                }
                onSelect={(date) => {
                  setEmployeeData((prev) => ({
                    ...prev,
                    joining_date: formatDateWithTime(date!),
                  }));
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="col-12 mb-4">
          <Label>{t("Password")}</Label>
          <Input
            required
            type="password"
            value={employeeData.password || ""}
            onChange={(e) =>
              setEmployeeData((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
            placeholder={t("Password")}
            autoComplete="new-password"
          />
        </div>

        <div className="col-12 text-right">
          <Button className="self-end" disabled={loader}>
            {loader ? (
              <>
                {t("Please_wait")}
                <Loader2 className="ml-2 h-4 w-4 animate-spin inline-block" />
              </>
            ) : (
              t("Add_Now")
            )}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default EmployeeInsert;
