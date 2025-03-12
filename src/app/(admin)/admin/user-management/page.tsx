import { columns } from "./columns"
import { datatable } from "@/components/ui/data-table"

export default async function demopage() {
  const data = [];

  return (
    <div classname="container mx-auto py-10">
      <datatable columns={columns} filter="email" data={data} />
    </div>
  )
}

