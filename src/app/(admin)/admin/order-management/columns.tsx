"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Payment = {
  _id: string;
  totalAmount: number;
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  email: string;
  paymentMethod: ["paypal" | "crypto" | "transfer" | "card"
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "paymentStatus",
    header: "Payment Status",
  }, 
  {
    accessorKey: "orderStatus",
    header: "Order Status"
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method"
  },
  {
    accessorKey: "_id", 
    header: "Order Id"
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "totalAmount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    header: "Products",
    cell: ({ row }) => {
      const order = row.original 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 bg-blue-700">
              <span>View Products</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuLabel>Products</DropdownMenuLabel> 
            {order.products.map(p => {
              <div className={}>
                <small>{p.title}</small> 
                <small>Q: {p.quantity}</small> 
                <a href={`/products/${p._id}`} targe="_blank">link</a>
              </div>
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        )
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(order.transactionId)}
            >
              Copy transaction ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];

