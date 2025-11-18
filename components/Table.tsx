
import React from 'react';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

const Table: React.FC<TableProps> = ({ headers, children }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-panel">
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="px-6 py-3 border-b-2 border-border text-left text-xs font-semibold text-text-secondary uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
