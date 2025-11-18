
import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Table from '../../components/Table';
import PageHeader from '../../components/PageHeader';
import Spinner from '../../components/Spinner';
import { Log } from '../../types';
import * as api from '../../api/mockApi';

const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
        try {
            setLoading(true);
            const response = await api.getLogs();
            setLogs(response.data || []);
        } catch (error) {
            console.error("Failed to fetch logs", error);
        } finally {
            setLoading(false);
        }
    };
    fetchLogs();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;

  return (
    <div>
      <PageHeader title="Activity Logs" />
      <Card padding="none">
        <Table headers={['Time', 'Admin Name', 'Action', 'Details']}>
          {logs.map(log => (
            <tr key={log.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{log.createdAt}</td>
              <td className="px-6 py-4 whitespace-nowrap font-medium">{log.adminName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{log.action}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary max-w-xs truncate" title={log.details}>{log.details}</td>
            </tr>
          ))}
        </Table>
        {logs.length === 0 && <div className="p-6 text-center text-text-secondary">No logs found.</div>}
      </Card>
    </div>
  );
};

export default LogsPage;
