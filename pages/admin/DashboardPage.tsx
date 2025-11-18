import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Card from '../../components/Card';
import StatCard from '../../components/StatCard';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import Spinner from '../../components/Spinner';
import * as api from '../../api/mockApi';
import { Order, CustomRequest } from '../../types';

interface DashboardData {
    todaySales: number;
    ordersToday: number;
    pendingCustomRequests: number;
    chartData: { name: string; sales: number }[];
    recentOrders: Order[];
    recentCustomRequests: CustomRequest[];
}

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchData = async () => {
          try {
              setLoading(true);
              const response = await api.getAdminDashboard();
              setData(response.data);
          } catch (error) {
              console.error("Failed to fetch dashboard data", error);
          } finally {
              setLoading(false);
          }
      };
      fetchData();
  }, []);

  if (loading || !data) {
      return <div className="flex justify-center items-center h-96"><Spinner /></div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Today's Sales" value={`$${data.todaySales}`} icon="bar-chart-2" color="bg-green-100 text-green-600" />
        <StatCard title="Orders Today" value={data.ordersToday} icon="package" color="bg-blue-100 text-blue-600" />
        <StatCard title="Pending Custom Requests" value={data.pendingCustomRequests} icon="file-text" color="bg-yellow-100 text-yellow-600" />
        <StatCard title="Best Seller This Week" value="Classic Tee" icon="tag" color="bg-purple-100 text-purple-600" />
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Sales Overview</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <AreaChart data={data.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs><linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/><stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/></linearGradient></defs>
              <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
              <Tooltip />
              <Area type="monotone" dataKey="sales" stroke="#4F46E5" fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card padding="none">
          <div className="p-6 flex justify-between items-center border-b border-border"><h3 className="text-lg font-semibold text-text-primary">Recent Orders</h3><Link to="/admin/orders"><Button variant="ghost" size="sm">View All</Button></Link></div>
          <div className="divide-y divide-border">
            {data.recentOrders.map(order => (
              <div key={order.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                <div><p className="font-semibold text-text-primary">{order.id}</p><p className="text-sm text-text-secondary">{order.name}</p></div>
                <div className="text-right"><p className="font-semibold">${order.totalAmount.toFixed(2)}</p><Badge status={order.orderStatus}>{order.orderStatus}</Badge></div>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="none">
          <div className="p-6 flex justify-between items-center border-b border-border"><h3 className="text-lg font-semibold text-text-primary">New Custom Requests</h3><Link to="/admin/requests"><Button variant="ghost" size="sm">View All</Button></Link></div>
           <div className="divide-y divide-border">
            {data.recentCustomRequests.map(req => (
              <div key={req.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                <div><p className="font-semibold text-text-primary">{req.id}</p><p className="text-sm text-text-secondary">{req.customerName}</p></div>
                <Badge status={req.status}>{req.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
