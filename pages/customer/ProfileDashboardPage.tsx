
import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import Icon from '../../components/Icon';
import Badge from '../../components/Badge';
import { MOCK_ORDERS } from '../../constants';

const QuickLink: React.FC<{ to: string; icon: any; label: string }> = ({ to, icon, label }) => (
    <Link to={to} className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition text-center">
        <Icon name={icon} className="w-8 h-8 text-accent mb-2" />
        <span className="font-semibold text-sm">{label}</span>
    </Link>
);

const ProfileDashboardPage: React.FC = () => {
    const recentOrder = MOCK_ORDERS[0];

    return (
        <div className="space-y-8">
            <Card padding="lg">
                <h1 className="text-2xl font-bold text-text-primary">Welcome Back, John!</h1>
                <p className="text-text-secondary mt-1">Here's a quick overview of your account.</p>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <QuickLink to="/profile/orders" icon="package" label="My Orders" />
                <QuickLink to="/profile/requests" icon="file-text" label="Custom Requests" />
                <QuickLink to="/profile/notifications" icon="bell" label="Notifications" />
            </div>
            
            <Card>
                <h2 className="text-lg font-semibold text-text-primary mb-4">Recent Activity</h2>
                {recentOrder ? (
                     <div className="p-4 flex flex-col md:flex-row justify-between md:items-center hover:bg-gray-50 rounded-lg">
                        <div>
                        <p className="font-semibold text-text-primary">{recentOrder.id}</p>
                        {/* FIX: Property 'date' does not exist on type 'Order'. Use 'createdAt' instead. */}
                        <p className="text-sm text-text-secondary">Date: {recentOrder.createdAt}</p>
                        </div>
                        <div className="mt-2 md:mt-0 md:text-right">
                        {/* FIX: Property 'amount' does not exist on type 'Order'. Use 'totalAmount' instead. */}
                        <p className="font-semibold">${recentOrder.totalAmount.toFixed(2)}</p>
                        <Badge status={recentOrder.orderStatus}>{recentOrder.orderStatus}</Badge>
                        </div>
                    </div>
                ) : (
                    <p className="text-text-secondary">No recent activity.</p>
                )}
            </Card>
        </div>
    );
};

export default ProfileDashboardPage;
