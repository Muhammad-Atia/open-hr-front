"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { signOut, useSession } from "next-auth/react";
import { apiSlice } from "@/redux/features/apiSlice/apiSlice";
import { Dialog, DialogTrigger } from "@/ui/dialog";
import ConfirmationPopup from "@/components/confirmation-popup";
import { LogOut } from "lucide-react";
import Gravatar from "react-gravatar";

export default function LogoutButton() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    dispatch(apiSlice.util.resetApiState());
    localStorage.removeItem("local-employees");
    router.push("/login");
  };

  return (
    <div className="pb-5">
      <Dialog>
        <DialogTrigger className="bg-light w-full rounded flex items-center px-3 py-2 cursor-pointer">
          <Gravatar
            className="rounded-full mr-2 size-5"
            email={session?.user?.email!}
            size={30}
            default="mp"
          />
          <span className="text-sm capitalize font-medium text-text-dark">
            {session?.user?.name?.slice(0, 13)}
          </span>
          <LogOut className="inline ml-auto h-5 mb-0.5" />
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
