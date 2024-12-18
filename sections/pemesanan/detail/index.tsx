'use client';
import { useGetOrderById, useOrderProgress } from '@/hooks/useOrder';
import { Order, OrderStatus } from '@prisma/client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription
} from '@/components/ui/card';
import Image from 'next/image';
import { formatDate, formatDateTime, formatRupiah } from '@/lib/utils';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { useSession } from 'next-auth/react';
import { OrderProgressResponse } from '@/app/api/order/[id]/tracking/route';
import Link from 'next/link';
// import TableSkeleton from '@/components/skeleton/TableSkeleton';
import BadgeStatus from '@/components/badge-status';
import ActionButtons from './action-button';
import DetailPesananSkeleton from '@/components/skeleton/DetailPesananSkeleton';
import { Button } from '@/components/ui/button';

const DetailPageOrder = () => {
    const { Id } = useParams<{ Id: string }>();
    const { isLoading: isFetching, getOrderById } = useGetOrderById();
    const { isLoading: isProgressFetching, getOrderProgress } =
        useOrderProgress();
    const session = useSession();
    const [order, setOrder] = useState<
        | (Order & {
              orderDetails: {
                  ukuranId: string;
                  quantity: number;
                  ukuran: {
                      id: string;
                      name: string;
                  };
              }[];
          } & { user: { id: string; name: string } })
        | null
    >(null);
    const [progress, setProgress] = useState<OrderProgressResponse[] | null>(
        null
    );
    const isReseller = session?.data?.user.role === 'reseller';

    const fetchAllData = async () => {
        try {
            const resOrder = await getOrderById(Id);
            const resProgress = await getOrderProgress(Id);
            setOrder(resOrder.data);
            setProgress(resProgress.data);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error fetching order details:', error);
        }
    };

    useEffect(() => {
        if (Id) {
            fetchAllData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Id]);

    if (isFetching || isProgressFetching || !session)
        return <DetailPesananSkeleton />;

    return (
        <div className="p-6 max-md:p-1">
            <Card className="mx-auto w-full bg-white dark:bg-zinc-900">
                <CardHeader className="relative">
                    <CardTitle className="text-left text-2xl font-bold">
                        Detail Pemesanan
                    </CardTitle>
                    <CardDescription className="text-left">
                        Silahkan atur data pesanan anda.
                    </CardDescription>

                    {!isReseller && (
                        <div className="absolute right-6 top-4">
                            {/* Cetak SPK (Surat Pengantar Kerja) */}
                            <Link href={`/spk/${Id}`} target="_blank">
                                <Button>Cetak SPK</Button>
                            </Link>
                        </div>
                    )}
                </CardHeader>
                <CardContent className="noscrollbar h-[78vh] overflow-auto">
                    {order && session && (
                        <div className="grid grid-cols-[300px_1fr] gap-7 max-md:flex max-md:flex-col-reverse">
                            <div className="">
                                <div className="grid grid-cols-1 gap-5">
                                    <div className="flex flex-col gap-3">
                                        <p>Foto Mockup</p>
                                        <Image
                                            src={order.linkMockup}
                                            alt="mockup"
                                            width={1000}
                                            height={1000}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <p>Foto Kerah</p>
                                        <Image
                                            src={order.linkCollar}
                                            alt="mockup"
                                            width={1000}
                                            height={1000}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <p>Foto Layout</p>
                                        <Image
                                            src={order.linkLayout}
                                            alt="mockup"
                                            width={1000}
                                            height={1000}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="">
                                        <p className="text-xs text-zinc-500">
                                            Invoice Id
                                        </p>
                                        <p>{order.invoiceId}</p>
                                    </div>
                                    <div className="">
                                        <p className="text-xs text-zinc-500">
                                            Status
                                        </p>
                                        <p>
                                            <BadgeStatus
                                                status={
                                                    order.status as OrderStatus
                                                }
                                            />
                                        </p>
                                    </div>
                                    <div className="">
                                        <p className="text-xs text-zinc-500">
                                            Judul
                                        </p>
                                        <p>{order.title}</p>
                                    </div>
                                    <div className="">
                                        <p className="text-xs text-zinc-500">
                                            Deskripsi
                                        </p>
                                        <p>{order.description}</p>
                                    </div>
                                    <div className="">
                                        <p className="text-xs text-zinc-500">
                                            Bahan
                                        </p>
                                        <p>{order.bahanCode}</p>
                                    </div>
                                    <div className="">
                                        <p className="text-xs text-zinc-500">
                                            Jenis
                                        </p>
                                        <p>{order.jenisCode}</p>
                                    </div>
                                    <div className="">
                                        <p className="text-xs text-zinc-500">
                                            Total
                                        </p>
                                        <p>{formatRupiah(order.totalAmount)}</p>
                                    </div>
                                    <div className="">
                                        <p className="text-xs text-zinc-500">
                                            DP
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <p>
                                                {formatRupiah(order.dpAmount)}
                                            </p>
                                            <Link
                                                href={order.proofDp || ''}
                                                target="_blank"
                                            >
                                                <Button size="sm">
                                                    Bukti DP
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                    {/* <div className="">
                    <p className="text-xs text-zinc-500">Settlement</p>
                    <p>{order.settlementAmount}</p>
                  </div> */}
                                    <div className="">
                                        <p className="text-xs text-zinc-500">
                                            Start
                                        </p>
                                        <p>{formatDate(order.startAt)}</p>
                                    </div>
                                    <div className="">
                                        <p className="text-xs text-zinc-500">
                                            Finish
                                        </p>
                                        <p>{formatDate(order.finishAt)}</p>
                                    </div>
                                    <div className="">
                                        <p className="text-xs text-zinc-500">
                                            Link Sharedrive
                                        </p>
                                        <p>
                                            <Link
                                                href={order.linkSharedrive}
                                                className="text-blue-500 underline"
                                                target="_blank"
                                            >
                                                Lihat
                                            </Link>
                                        </p>
                                    </div>
                                    <div className="">
                                        <p className="text-xs text-zinc-500">
                                            Link Tracking
                                        </p>
                                        <p>
                                            <Link
                                                href={`/tracking/${order.invoiceId}`}
                                                className="text-blue-500 underline"
                                                target="_blank"
                                            >
                                                Lihat
                                            </Link>
                                        </p>
                                    </div>
                                    {order.shipmentCost && (
                                        <div className="">
                                            <p className="text-xs text-zinc-500">
                                                Biaya Pengiriman
                                            </p>
                                            <p>
                                                {formatRupiah(
                                                    order.shipmentCost
                                                )}
                                            </p>
                                        </div>
                                    )}
                                    {order.shipmentLink && (
                                        <div className="">
                                            <p className="text-xs text-zinc-500">
                                                Link Pengiriman
                                            </p>
                                            <p>
                                                <Link
                                                    href={order.shipmentLink}
                                                    className="text-blue-500 underline"
                                                    target="_blank"
                                                >
                                                    Lihat
                                                </Link>
                                            </p>
                                        </div>
                                    )}
                                    {order.proofSettlement && (
                                        <div className="">
                                            <p className="text-xs text-zinc-500">
                                                Bukti Pelunasan
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <p>
                                                    {formatRupiah(
                                                        order.settlementAmount ||
                                                            0
                                                    )}
                                                </p>
                                                <Link
                                                    href={
                                                        order.proofSettlement ||
                                                        ''
                                                    }
                                                    target="_blank"
                                                >
                                                    <Button size="sm">
                                                        Bukti Pelunasan
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                    <div className="">
                                        <p className="text-xs text-zinc-500">
                                            Dipesan Oleh
                                        </p>
                                        <p>{order.user.name}</p>
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <div className="mb-2 font-bold">
                                        Detail Pesanan
                                    </div>

                                    {/* Tabel Order Detail */}
                                    {order.orderDetails.length > 0 && (
                                        <Table className="rounded border-2">
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>
                                                        Ukuran
                                                    </TableHead>
                                                    <TableHead>
                                                        Quantity
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {order.orderDetails.map(
                                                    (orderDetail) => (
                                                        <TableRow
                                                            key={
                                                                orderDetail.ukuranId
                                                            }
                                                        >
                                                            <TableCell>
                                                                {
                                                                    orderDetail
                                                                        .ukuran
                                                                        .name
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    orderDetail.quantity
                                                                }
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )}
                                            </TableBody>
                                        </Table>
                                    )}
                                </div>

                                <div className="mt-5">
                                    <div className="mb-2 font-bold">
                                        Progress
                                    </div>

                                    <div className="ml-3 mt-5 border-l-8 border-zinc-200 dark:border-zinc-800">
                                        {progress &&
                                            progress.map((item) => (
                                                <div
                                                    className="relative m-3 ml-[20px] mt-8 cursor-pointer rounded-md border bg-white p-3 shadow-lg hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                                                    key={item.id}
                                                >
                                                    <div className="absolute -left-[35px] h-5 w-5 rounded-full border-2 border-white bg-blue-600"></div>
                                                    <div className="absolute -top-6 left-0 text-sm text-blue-400">
                                                        {formatDateTime(
                                                            item.createdAt
                                                        )}
                                                    </div>
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div className="flex items-center gap-3">
                                                            <BadgeStatus
                                                                status={
                                                                    item.status as OrderStatus
                                                                }
                                                            />
                                                            <div className="text-sm">
                                                                by
                                                                <span className="ml-1 text-sm font-bold">
                                                                    {
                                                                        item
                                                                            .user
                                                                            .name
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="">
                                                            {item.linkProgress && (
                                                                <Link
                                                                    href={
                                                                        item.linkProgress
                                                                    }
                                                                    target="_blank"
                                                                >
                                                                    <Button size="sm">
                                                                        LIHAT
                                                                    </Button>
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                <ActionButtons
                                    order={order}
                                    onUpdated={fetchAllData}
                                />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default DetailPageOrder;
