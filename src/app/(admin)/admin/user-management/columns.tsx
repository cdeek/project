"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";

export const columns: ColumnDef = [
  {
    accessorKey: "name",
    header: "User Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "isreturningCustomer",
    header: "Is Customer",
  },
  {
    accessorKey: "disabled",
    header: "Account disabled"
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original

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
              onClick={() => navigator.clipboard.writeText(product.id)}
            >
              Copy product ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <button className="bg-blue-500 text-white px-2 py-1 rounded">
                Make user Staff
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button className="bg-blue-500 text-white px-2 py-1 rounded">
                View user
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button className="bg-red-500 text-white px-2 py-1 rounded">
                Disable user account
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button className="bg-red-500 text-white px-2 py-1 rounded">
                Delete user account
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];

