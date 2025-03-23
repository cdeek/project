import Link from 'next/link';

export default function BestSales({bestSales}) {
  return (
    <div className="space-y-8"> 
      {bestSales.map((r, i) => 
         <Link key={i} href={`products/${r._id}`}>
            {r._id}
         </Link>
      )}
    </div>
  )
}
