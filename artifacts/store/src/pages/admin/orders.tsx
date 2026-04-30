import { AdminLayout } from "@/components/layout/admin-layout";
import { 
  useListAdminOrders, 
  getListAdminOrdersQueryKey,
  useUpdateAdminOrderStatus
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ExternalLink } from "lucide-react";
import { Link } from "wouter";

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  processing: "default",
  shipped: "default",
  delivered: "outline",
  cancelled: "destructive"
};

export default function AdminOrders() {
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useListAdminOrders({
    query: { queryKey: getListAdminOrdersQueryKey() }
  });

  const updateStatusMutation = useUpdateAdminOrderStatus({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAdminOrdersQueryKey() });
        toast.success("Order status updated");
      },
      onError: (error: any) => toast.error(error.message || "Failed to update status")
    }
  });

  const handleStatusChange = (orderId: number, status: any) => {
    updateStatusMutation.mutate({ id: orderId, data: { status } });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage and fulfill customer orders.</p>
        </div>

        <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-3 font-medium">Order</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Total</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><Skeleton className="h-5 w-16" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-5 w-24" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-10 w-32" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-5 w-16" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-20" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-8 w-28 ml-auto" /></td>
                    </tr>
                  ))
                ) : orders && orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium">
                        <Link href={`/orders/${order.id}`} className="text-primary hover:underline flex items-center gap-1 group">
                          #{order.id.toString().padStart(6, '0')}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {format(new Date(order.createdAt), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{order.shippingName}</div>
                        <div className="text-xs text-muted-foreground">{order.shippingCity}, {order.shippingZip}</div>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={statusColors[order.status]} className="capitalize">
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end">
                          <Select 
                            defaultValue={order.status} 
                            onValueChange={(val) => handleStatusChange(order.id, val)}
                            disabled={updateStatusMutation.isPending}
                          >
                            <SelectTrigger className="w-[130px] h-8 text-xs bg-background">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled" className="text-destructive">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
