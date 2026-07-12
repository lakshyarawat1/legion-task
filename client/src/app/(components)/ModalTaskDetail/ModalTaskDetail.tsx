import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetTaskByIdQuery, useGetMeQuery, useUpdateTaskMutation } from "@/state/api";
import { format } from "date-fns";
import { Clock, MessageSquareMore, Check, X, Pencil } from "lucide-react";
import Image from "next/image";
import { PriorityBadge, StatusBadge } from "@/app/(components)/Badges/Badges";
import UserAvatar from "@/app/(components)/UserAvatar/UserAvatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Props = {
  taskId: string | null;
  onClose: () => void;
};

export default function ModalTaskDetail({ taskId, onClose }: Props) {
  const { data: task, isLoading, isError, error } = useGetTaskByIdQuery(
    { taskId: taskId as number },
    { skip: taskId === null }
  );
  const { data: currentUser } = useGetMeQuery();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editDesc, setEditDesc] = useState("");

  useEffect(() => {
    if (task) {
      setEditTitle(task.title);
      setEditDesc(task.description || "");
      setIsEditingTitle(false);
      setIsEditingDesc(false);
    }
  }, [task]);

  if (!taskId) return null;

  // Permissions Logic
  const isAuthor = currentUser?.userId === task?.authorUserId;
  const isAssignee = currentUser?.userId === task?.assignedUserId;
  const isPoOrPm = Boolean(
    currentUser?.teamId && 
    task?.project?.projectTeams?.some(pt => pt.teamId === currentUser?.teamId) &&
    (currentUser.team?.productOwnerUserId === currentUser.userId || currentUser.team?.projectManagerUserId === currentUser.userId)
  );
  const canEdit = isAuthor || isAssignee || isPoOrPm;

  const handleSaveTitle = async () => {
    if (!task || !editTitle.trim() || editTitle === task.title) {
      setIsEditingTitle(false);
      return;
    }
    await updateTask({ taskId: task.id, title: editTitle });
    setIsEditingTitle(false);
  };

  const handleSaveDesc = async () => {
    if (!task || editDesc === task.description) {
      setIsEditingDesc(false);
      return;
    }
    await updateTask({ taskId: task.id, description: editDesc });
    setIsEditingDesc(false);
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center pointer-events-none p-4 sm:p-8">
        <motion.div
          key="modal-content"
          layoutId={`task-card-${taskId}`}
          className="w-full max-w-4xl max-h-[90vh] rounded-3xl border border-border bg-card shadow-2xl pointer-events-auto relative flex flex-col overflow-hidden"
        >
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            transition={{ duration: 0.2 }}
            className="w-full h-full overflow-y-auto p-6 sm:p-8 flex flex-col gap-8"
          >
            <button
              onClick={onClose}
              className="absolute right-6 top-6 rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors z-10"
            >
              <X className="h-5 w-5" />
            </button>

            {isLoading || (!task && !isError) ? (
              <div className="animate-pulse text-muted-foreground flex flex-col gap-4">
                <div className="h-8 bg-secondary rounded w-3/4"></div>
                <div className="h-4 bg-secondary rounded w-full mt-4"></div>
                <div className="h-4 bg-secondary rounded w-5/6"></div>
                <div className="h-4 bg-secondary rounded w-1/2"></div>
              </div>
            ) : isError || !task ? (
              <div className="text-red-500 flex flex-col gap-4 items-center justify-center py-10">
                <span className="font-semibold text-lg">Error loading task details.</span>
                <Button onClick={onClose} variant="outline">Close</Button>
              </div>
            ) : (
              <>
                {/* Header section */}
                <div className="flex flex-col gap-4 pr-8">
                  <div className="flex items-center gap-3">
                    <PriorityBadge priority={task.priority} />
                <StatusBadge status={task.status} />
              </div>

              <div className="group flex flex-col gap-2">
                {isEditingTitle ? (
                  <div className="flex items-center gap-2 w-full">
                    <Input 
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="text-2xl font-bold h-12 flex-1"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveTitle();
                        if (e.key === "Escape") setIsEditingTitle(false);
                      }}
                    />
                    <Button size="icon" variant="ghost" onClick={handleSaveTitle} disabled={isUpdating} className="text-green-500"><Check className="h-5 w-5"/></Button>
                    <Button size="icon" variant="ghost" onClick={() => setIsEditingTitle(false)} disabled={isUpdating} className="text-red-500"><X className="h-5 w-5"/></Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <motion.h2 layoutId={`task-title-${task.id}`} className="text-2xl sm:text-3xl font-bold text-foreground">{task.title}</motion.h2>
                    {canEdit && (
                      <button 
                        onClick={() => setIsEditingTitle(true)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
                
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <span>in project</span>
                  <span className="font-semibold text-foreground px-2 py-0.5 bg-secondary rounded-md">{task.project?.name}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 flex flex-col gap-8">
                {/* Description Section */}
                <div className="rounded-2xl border border-border bg-secondary/20 p-5">
                  <div className="flex items-center justify-between mb-3 border-b border-border/50 pb-3">
                    <h3 className="text-lg font-semibold text-foreground">Description</h3>
                    {canEdit && !isEditingDesc && (
                      <Button variant="ghost" size="sm" onClick={() => setIsEditingDesc(true)}>
                        <Pencil className="h-4 w-4 mr-2" /> Edit
                      </Button>
                    )}
                  </div>
                  
                  {isEditingDesc ? (
                    <div className="flex flex-col gap-3">
                      <Textarea 
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        className="min-h-[120px] resize-y bg-background"
                        placeholder="Add a more detailed description..."
                      />
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => setIsEditingDesc(false)} disabled={isUpdating}>Cancel</Button>
                        <Button onClick={handleSaveDesc} disabled={isUpdating}>Save</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed text-sm">
                      {task.description ? task.description : <span className="italic opacity-50">No description provided.</span>}
                    </div>
                  )}
                </div>
                
                {/* Comments Section */}
                <div className="rounded-2xl border border-border bg-secondary/20 p-5">
                  <h3 className="text-lg font-semibold text-foreground mb-3 border-b border-border/50 pb-3 flex items-center gap-2">
                    <MessageSquareMore className="h-5 w-5" /> Comments ({task.comments?.length || 0})
                  </h3>
                  {task.comments && task.comments.length > 0 ? (
                    <div className="flex flex-col gap-3">
                      {task.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                            {comment.user?.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 bg-background border border-border rounded-2xl rounded-tl-none p-3 text-sm text-foreground">
                            <div className="font-semibold mb-1 text-xs opacity-70">{comment.user?.username}</div>
                            {comment.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm italic">No comments yet.</p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-5 rounded-2xl border border-border bg-secondary/20 p-5 h-fit">
                
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Assignee</span>
                  <div className="flex items-center gap-2">
                    {task.assignee ? (
                      <>
                        <UserAvatar user={task.assignee} size={24} />
                        <span className="font-medium text-foreground text-sm">{task.assignee.username}</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground italic text-sm">Unassigned</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Reporter</span>
                  <div className="flex items-center gap-2">
                    {task.author && (
                      <>
                        <UserAvatar user={task.author} size={24} />
                        <span className="font-medium text-foreground text-sm">{task.author.username}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Dates</span>
                  <div className="flex flex-col gap-1 text-sm text-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="w-10 text-muted-foreground text-xs">Start:</span>
                      <span className="text-xs">{task.startDate ? format(new Date(task.startDate), "MMM d, yyyy") : "-"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="w-10 text-muted-foreground text-xs">Due:</span>
                      <span className={`text-xs ${task.dueDate && new Date(task.dueDate) < new Date() ? "text-red-500 font-semibold" : ""}`}>
                        {task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "-"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Tags</span>
                  {task.tags ? (
                    <div className="flex flex-wrap gap-1.5">
                      {task.tags.split(",").map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded-md bg-background border border-border text-[10px] font-medium text-foreground">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground italic text-xs">No tags</span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Story Points</span>
                  <span className="font-medium text-foreground">{task.points || "-"}</span>
                </div>

              </div>
            </div>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
