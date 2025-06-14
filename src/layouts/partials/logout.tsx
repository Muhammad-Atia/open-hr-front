"use client";

import { useDispatch } from "react-redux";
import { signOut, useSession } from "next-auth/react";
import { apiSlice } from "@/redux/features/apiSlice/apiSlice";
import { Dialog, DialogTrigger } from "@/components/ui/dialog"; // shadcn-ui
import ConfirmationPopup from "@/components/confirmation-popup";
import { LogOut } from "lucide-react";
import Gravatar from "react-gravatar";
import { Button } from "@/components/ui/button"; // shadcn-ui
import { useGetEmployeeQuery } from "@/redux/features/employeeApiSlice/employeeSlice";

export default function LogoutButton() {
  const dispatch = useDispatch();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut();
    dispatch(apiSlice.util.resetApiState());
    localStorage.removeItem("local-employees");
  };

  const userId = session?.user?.id;
  const { data: employeeData } = useGetEmployeeQuery(userId ?? "");

  return (
    <div className="pb-5">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="
              w-full flex items-center gap-2 rounded-lg border
             
              px-2 py-2.5 text-sm font-medium shadow-sm
             
              "
          >
            <Gravatar
              className="rounded-full mr-2 size-5"
              email={session?.user?.email!}
              size={30}
              default="mp"
            />
            <span className="truncate">
              {employeeData?.result.name.slice(0, 13)}
            </span>
            <LogOut className="inline ml-auto h-5 mb-0.5" />
          </Button>
        </DialogTrigger>
        <ConfirmationPopup
          handleConfirmation={handleLogout}
          description="You will be logged out"
          skipWrite={true}
        />
      </Dialog>
    </div>
  );
}
