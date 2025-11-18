
import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import { MOCK_NOTIFICATIONS } from '../../constants';
import { Notification } from '../../types';

// FIX: `iconMap` keys should match `Notification['relatedType']`.
const iconMap: Record<Notification['relatedType'], any> = {
  order: 'package',
  custom_request: 'file-text',
};

const NotificationsPage: React.FC = () => {
  return (
    <Card padding="none">
      <div className="p-6 border-b border-border flex justify-between items-center">
          <h1 className="text-2xl font-bold text-text-primary">Notifications</h1>
          <Button variant="ghost" size="sm">Clear All</Button>
      </div>
      <div className="divide-y divide-border">
        {MOCK_NOTIFICATIONS.map(notif => (
          <div key={notif.id} className={`p-6 flex items-start space-x-4 hover:bg-gray-50 ${!notif.isRead ? 'bg-accent/5' : ''}`}>
            <div className={`p-2 rounded-full ${!notif.isRead ? 'bg-accent/10 text-accent' : 'bg-gray-100 text-text-secondary'}`}>
              {/* FIX: Property 'icon' does not exist on type 'Notification'. Use 'relatedType' instead. */}
              <Icon name={iconMap[notif.relatedType]} className="w-6 h-6" />
            </div>
            <div className="flex-grow">
              <h2 className="font-semibold">{notif.title}</h2>
              <p className="text-text-secondary text-sm">{notif.message}</p>
              {/* FIX: Property 'timestamp' does not exist on type 'Notification'. Use 'createdAt' instead. */}
              <p className="text-xs text-text-secondary mt-1">{notif.createdAt}</p>
            </div>
            {!notif.isRead && <div className="w-2.5 h-2.5 bg-accent rounded-full mt-1.5"></div>}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default NotificationsPage;
