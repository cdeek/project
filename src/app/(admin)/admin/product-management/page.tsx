import { columns } from "./columns/products"
import { DataTable } from "@/components/ui/data-table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import AddProduct from "./create";

export default async function ProductManagement() {
  const data = [];
  return (
    <>
      <div className="my-4">
        <h1 className="text-2xl font-bold">Products Management</h1>
      </div>
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="add-product">Add new product</TabsTrigger>
        </TabsList>
        <TabsContent value="products" className="space-y-4">
          <div className="container mx-auto py-10">
            <DataTable columns={columns} filter="title" data={data} />
          </div>
        </TabsContent>
        <TabsContent value="add-product" className="space-y-4">
          <AddProduct />
        </TabsContent>
      </Tabs>
    </>
  );
}

