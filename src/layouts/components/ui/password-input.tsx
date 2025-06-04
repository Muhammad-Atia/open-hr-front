"use client";

import { Input } from "@/ui/input";
import { Check, Eye, EyeOff } from "lucide-react";
import React, { forwardRef, useState } from "react";
import { useAppSelector } from "@/redux/hook";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  className?: string;
  isSuccess?: boolean;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, isSuccess, ...rest }, ref) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const rtl = useAppSelector((state) => state["setting-slice"].rtl);

    const type = isVisible ? "text" : "password";

    return (
      <div className="relative">
        <Input
          key={rest.name}
          ref={ref}
          className={className}
          placeholder="Password"
          autoComplete="off"
          {...rest}
          type={type}
        />
        {isSuccess ? (
          <Check className={`absolute top-1/2 -translate-y-1/2 text-success ${rtl ? "left-2" : "right-2"}`} />
        ) : (
          <button
            type="button"
            className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground ${rtl ? "left-2" : "right-2"}`}
            onClick={() => setIsVisible(!isVisible)}
          >
            {isVisible ? <Eye /> : <EyeOff />}
          </button>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
