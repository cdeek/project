"use client";
import { useEffect, useState } from "react"
import DashboardCard from '@/components/dashboard/DashboardCard';
import SalesChart from '@/components/dashboard/AnalyticsChart';
import RecentSales from '@/components/dashboard/RecentSales'
import Iventory from '@/components/dashboard/Iventory'
import BestSales from '@/components/dashboard/BestSellers'
import { Folder, DollarSign, UserCheck, User, } from 'lucide-react';
import { useAuth } from '@/app/_providers/Auth';
import { CardContent, CardHeader, CardTitle, Card } from "@/components/ui/card";


export default function Home() { 
  const [analytics, setAnalytics] = useState<any>(null);
  const { user } = useAuth();
  // if (!user || user.role !== "admin") {  
  //   return <h3>Unauthorized</h3>;  
  // }
  useEffect(() => {
   async function call() {
    try {
      const res = await fetch("/api/report/sales", {
        cache: 'force-cache', 
        method: 'POST',
        headers: {
         'Authorization': `Bearer ${user.token}`
        },
      })
   
      const data = await res.json()
      setAnalytics(data);
    } catch (error) {
      console.log(error)
    }}
    call()
  }, []);

  return (
    <>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <DashboardCard
          title='Total Revenue'
          data={analytics?.allTimeSales?.totalRevenue || 0}
          icon={<DollarSign className='text-slate-500' size={50} />}
        />
        <DashboardCard
          title='Products Categories'
          data={"100+"}
          icon={<Folder className='text-slate-500' size={50} />}
        />
        <DashboardCard
          title='Total Sales'
          data={analytics?.allTimeSales?.totalOrders || 0}
          icon={<Folder className='text-slate-500' size={50} />}
        />
        <DashboardCard
          title='Users'
          data={analytics?.totalCustomers || 1}
          icon={<User className='text-slate-500' size={50} />}
        />
        <DashboardCard
          title='Returning Customers'
          data={analytics?.returningCustomers || 0}
          icon={<UserCheck className='text-slate-500' size={50} />}
        />
        <DashboardCard
          title='Retention Rate'
          data={analytics?.retentionRate || 0}
          icon={<User className='text-slate-500' size={50} />}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Chart</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <SalesChart salesData={{salesParDay: analytics?.salesParDay || [], salesPerMonth: analytics?.salesPerMonth || [], salesPerYear: analytics?.salesPerYear || []}} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Most Sales Products</CardTitle>
          </CardHeader>
          <CardContent>
            <BestSales bestSales={analytics?.bestSales || []} />
          </CardContent>
        </Card> 
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentSales recentSales={analytics?.recentSales || []} />
          </CardContent>
        </Card> 
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Iventory</CardTitle>
          </CardHeader>
          <CardContent>
            <Iventory lowStock={analytics?.lowStock || []} />
          </CardContent>
        </Card> 
      </div>
    </>
  );
}

