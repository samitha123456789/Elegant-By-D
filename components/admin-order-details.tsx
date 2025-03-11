// ecommerce-platform/components/admin-order-details.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getBaseUrl } from "@/lib/utils";

export default function AdminOrderDetails({
  order,
  onStatusUpdate,
  onClose,
}: {
  order: any;
  onStatusUpdate: () => void;
  onClose: () => void;
}) {
  const [status, setStatus] = useState(order.status);

  const updateStatus = async (newStatus: string) => {
    const res = await fetch(`${getBaseUrl()}/api/orders`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackingNumber: order.trackingNumber, status: newStatus }),
    });
    if (res.ok) {
      setStatus(newStatus);
      onStatusUpdate();
    }
  };

  return (
    <div className="mt-4 border rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Order #{order.trackingNumber}</h2>
        <Button variant="ghost" onClick={onClose}>Close</Button>
      </div>
      <div className="space-y-4">
        <div>
          <strong>Products:</strong>
          <ul className="space-y-2">
            {order.items.map((item: any) => (
              <li key={item.id} className="flex items-center gap-4">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} width={50} height={50} />
                <div>
                  {item.name} - Qty: {item.quantity}, Size: {item.size}, Price: LKR {item.price.toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <p><strong>Total:</strong> LKR {order.total.toFixed(2)}</p>
        <p><strong>Shipping Address:</strong> {Object.values(order.shippingDetails || {}).join(", ")}</p>
        <div>
          <strong>Status:</strong>
          <select
            value={status}
            onChange={(e) => updateStatus(e.target.value)}
            className="ml-2 p-1 border rounded"
          >
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>
    </div>
  );
}