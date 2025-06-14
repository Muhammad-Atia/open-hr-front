"use client";

import { Button, buttonVariants } from "@/layouts/components/ui/button";
import { cn } from "@/lib/shadcn";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import PasswordInput from "@/ui/password-input";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { loginUser } from "./utils";
import { useTranslation } from "react-i18next";

export default function LoginForm() {
  const { t } = useTranslation();
  // const rtl = useAppSelector((state) => state["setting-slice"].rtl);
  const [loading, setLoading] = useState(false);

  const defaultValues = {
    email: "",
    password: "",
  };

  const [loginInfo, setLoginInfo] = useState(defaultValues);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const result = await loginUser(loginInfo);
    if (result?.success === false) {
      toast.error(result.error.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <Label htmlFor="user">{t("Work Email:")}</Label>
        <Input
          type="email"
          id="user"
          placeholder={t("Enter work email")}
          value={loginInfo.email}
          required
          onChange={(e) =>
            setLoginInfo({ ...loginInfo, email: e.target.value })
          }
        />
      </div>

      <div className="">
        <Label htmlFor="password">{t("Password")}</Label>
        <PasswordInput
          id="password"
          name="password"
          placeholder={t("Enter password")}
          value={loginInfo.password}
          required
          onChange={(e) =>
            setLoginInfo({ ...loginInfo, password: e.target.value })
          }
        />
      </div>

      <div className="mb-5">
        <Link
          className={cn(
            buttonVariants({
              variant: "link",
              className: "underline px-0 text-text-light text-start",
            })
          )}
          href="/forgot-password"
        >
          {t("Forgot password?")}
        </Link>
      </div>
      <div>
        <Button disabled={loading} className="w-full">
          {loading ? (
            <>
              {t("Login")}
              <Loader2 className="size-4 ml-2 animate-spin" />
            </>
          ) : (
            t("Login")
          )}
        </Button>
      </div>
    </form>
  );
}
