import Link from 'next/link';

export default function Iventory({lowStock}) {
  return (
    <div className="space-y-8"> 
      {lowStock.map((r, i) => 
         <div key={i} className="flex items-center">
            <Link href={`products/${r._id}`}>{r.title}</Link>
            <form action={`/api/${r._id}/stock`}> 
              <input name="" type="number" max="500" placeholder="stock quantity.." />
              <Button type="submit" className="bg-blue-500 text-white px-2 py-1 rounded">
                change stock quantity
              </Button>
            </form>
         </div>
      )}
    </div>
  )
}
