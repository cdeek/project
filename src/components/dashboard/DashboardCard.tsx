import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  data: any;
  icon: React.ReactElement<LucideIcon>;
}

const DashboardCard = ({ title, data, icon }: DashboardCardProps) => {
  return (
    <Card className='bg-slate-100 dark:bg-slate-800'> 
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
          {icon} 
        </CardHeader>
      <CardContent> 
        <div className="text-2xl font-bold">{data}</div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;

