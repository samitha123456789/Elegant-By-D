"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OrderHistory({ orders }: { orders: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="border p-4 rounded-lg">
                <p><strong>Order #:</strong> {order.trackingNumber}</p>
                <p><strong>Total:</strong> LKR {order.total.toFixed(2)}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}