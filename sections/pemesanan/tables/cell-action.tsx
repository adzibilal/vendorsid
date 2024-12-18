'use client';

import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { isAdmin } from '@/lib/utils';
import { OrdersResponse, OrderType } from '@/types/response';
import { Order } from '@prisma/client';
import { Edit, MoreHorizontal, Trash, Eye } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface OrderCellActionProps {
    data: OrderType;
    onDeleted: () => void;
}

export const OrderCellAction: React.FC<OrderCellActionProps> = ({
    data,
    onDeleted
}) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();

    const onConfirm = async () => {
        setLoading(true);
        try {
            await fetch(`/api/order/${data.id}`, {
                method: 'DELETE'
            });
            router.refresh();
            onDeleted();
            toast.success('Order deleted successfully');
        } catch (error) {
            console.error('Error deleting order:', error);
            toast.error('Error deleting order');
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onConfirm}
                loading={loading}
            />
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    <DropdownMenuItem
                        onClick={() =>
                            router.push(
                                `/dashboard/pemesanan/detail/${data.id}`
                            )
                        }
                    >
                        <Eye className="mr-2 h-4 w-4" /> View
                    </DropdownMenuItem>

                    {data.status === 'REQUESTED' && (
                        <DropdownMenuItem
                            onClick={() =>
                                router.push(`/dashboard/pemesanan/${data.id}`)
                            }
                        >
                            <Edit className="mr-2 h-4 w-4" /> Update
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Trash className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
