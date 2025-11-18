
import React from 'react';
import Card from './Card';
import Icon from './Icon';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: any;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <Card>
      <div className="flex items-center">
        <div className={`p-3 rounded-full mr-4 ${color}`}>
          <Icon name={icon} className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-text-secondary">{title}</p>
          <p className="text-2xl font-semibold text-text-primary">{value}</p>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
