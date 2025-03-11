// ecommerce-platform/components/admin/recent-orders-table.tsx
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function RecentOrdersTable({ orders, onOrderClick }: { orders: any[]; onOrderClick: (order: any) => void }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order #</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow
            key={order._id}
            className="cursor-pointer hover:bg-gray-100"
            onClick={() => onOrderClick(order)}
          >
            <TableCell>{order.trackingNumber}</TableCell>
            <TableCell>{order.userId.name}</TableCell>
            <TableCell>LKR {order.total.toFixed(2)}</TableCell>
            <TableCell>{order.status}</TableCell>
            <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}