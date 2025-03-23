export default function RecentSales({recentSales}) {
  return (
    <div className="space-y-8"> 
      {recentSales.map((r, i) =>  
         <div key={i} className="flex items-center">
            <div className="ml-4 space-y-1">
              <p className="text-sm text-muted-foreground">
                {p.email}
              </p>
            </div>
            <div className="ml-auto font-medium">+${p.totalAmount}</div>
         </div>
      )}
    </div>
  )
}
