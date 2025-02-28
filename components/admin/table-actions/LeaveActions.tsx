import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { useUpdateLeaveRequest } from "@/hooks/query-hooks/useAdmin";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import { useState } from "react";

enum LEAVE_STATUS {
    APPROVE = 'APPROVED',
    REJECT = 'DENIED',
}

export function LeaveActions({ leave }: { leave: Leave }) {

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [leaveStatus, setLeaveStatus] = useState<LEAVE_STATUS>(LEAVE_STATUS.APPROVE);

    const { mutate, isPending } = useUpdateLeaveRequest();

    const onUpdateLeave = () => {

        mutate({
            userId: leave.id,
            status: leaveStatus
        }, {
            onSuccess: (data) => {
                console.log(data)
                setIsDialogOpen(false);
                toast({
                    title: 'Success',
                    description: `Leave has been ${leaveStatus} successfully!`
                })
            }
        })
    }

    const onOpenDialog = (status: LEAVE_STATUS) => {
        setLeaveStatus(status)
        setIsDialogOpen(true)
    }

    return leave.status === LEAVE_STATUS.APPROVE ||
        leave.status === LEAVE_STATUS.REJECT ? '-' : (
        <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => setIsDialogOpen(open)}
        >
            <div
                className="flex space-x-4 w-fit"
            >
                <DialogTrigger
                    asChild
                >
                    <Button
                        size={'sm'}
                        className="!text-white"
                        onClick={() => onOpenDialog(LEAVE_STATUS.APPROVE)}
                    >
                        Approve
                    </Button>
                </DialogTrigger>
                <DialogTrigger
                    asChild
                >
                    <Button
                        size={'sm'}
                        variant={"destructive"}
                        onClick={() => onOpenDialog(LEAVE_STATUS.REJECT)}
                    >
                        Reject
                    </Button>
                </DialogTrigger>
            </div>
            <DialogContent
                className="sm:max-w-md bg-swamp-foreground text-white"
            >
                <DialogHeader>
                    <DialogTitle>{leaveStatus === LEAVE_STATUS.APPROVE ? 'Approve' : 'Reject'} this leave?</DialogTitle>
                </DialogHeader>

                <article
                    className="gap-2 space-y-1"
                >
                    <h3>
                        Reason:
                    </h3>
                    <p
                        className="italic bg-swamp-light/10 p-2 rounded text-neutral-300  "
                    >
                        &quot;{leave.reason}&quot;
                    </p>
                </article>

                <DialogFooter>
                    <DialogClose
                        asChild
                    >
                        <Button
                            variant={'outline'}
                            className="!text-white !bg-transparent"
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={onUpdateLeave}
                        disabled={isPending}
                        className="text-white"
                        variant={leaveStatus === LEAVE_STATUS.APPROVE ? 'default' : 'destructive'}
                    >
                        <Loader
                            className={cn('hidden', {
                                'block animate-spin': isPending
                            })}
                        />
                        {
                            leaveStatus === LEAVE_STATUS.APPROVE
                                ? 'Approve'
                                : 'Reject'
                        }
                    </Button>
                </DialogFooter>
            </DialogContent >
        </Dialog >
    )

} 