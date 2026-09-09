"use client";

import Button from "@/components/ui/Button";
import { useEnquiryModal } from "./EnquiryModalProvider";

export default function EnquiryTriggerButton({
  format,
  course,
  children,
  ...props
}) {
  const { open } = useEnquiryModal();

  return (
    <Button
      type="button"
      onClick={() => open({ format, course })}
      {...props}
    >
      {children}
    </Button>
  );
}
