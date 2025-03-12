"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Button from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const columns: ColumnDef = [ 
  {
    cell: ({ row }) => {
      const product = row.original
      const imgSrc = product.image[0] 
      return <img src={imgSrc} alt="img" width={70} />
    }
  },
  {
    accessorKey: "title",
    header: "Product Title",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "stock",
    header: "stock"
  },
  {
    header: "Keywords",
    cell: ({ row }) => {
      const product = row.original 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-8 w-8 p-0 bg-blue-700">
              <span>View Keywords</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuLabel>Keywordss</DropdownMenuLabel> 
            {product.Keywords.map(p => <small>{p}</small>)}
          </DropdownMenuContent>
        </DropdownMenu>
        )
      )
    }
  },
  {
    accessorKey: "status",
    header: "Status"
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original

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
              onClick={() => navigator.clipboard.writeText(product._id)}
            >
              Copy product ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
            <DropdownMenuItem>  
              <form action={`/api/${product._id}/stock`}> 
                <input name="" type="number" max="500" placeholder="stock quantity.." />
                <Button type="submit" className="bg-blue-500 text-white px-2 py-1 rounded">
                  change stock quantity
                </Button>
              </form>
            </DropdownMenuItem>
              <Button className="bg-blue-500 text-white px-2 py-1 rounded">
                Edit product details
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button className="bg-red-500 text-white px-2 py-1 rounded">
                Delete Poduct
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];

