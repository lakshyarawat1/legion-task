"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import ModalTaskDetail from "./ModalTaskDetail/ModalTaskDetail";

export default function TaskModalProvider() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const taskIdParam = searchParams.get("taskId");
  const taskId = taskIdParam ? taskIdParam : null;

  const handleClose = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("taskId");
    const searchString = newParams.toString() ? `?${newParams.toString()}` : "";
    router.push(`${pathname}${searchString}`, { scroll: false });
  };

  return (
    <AnimatePresence>
      {taskId && <ModalTaskDetail key="task-modal" taskId={taskId} onClose={handleClose} />}
    </AnimatePresence>
  );
}
