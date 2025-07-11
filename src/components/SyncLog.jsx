import React from 'react';

const SyncLog = ({ logs }) => (
  <div className="bg-white p-6 rounded-xl shadow">
    <h2 className="text-xl font-semibold mb-2">📜 Sync Logs</h2>
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="text-left py-2">Folder Pair</th>
          <th className="text-left py-2">Time</th>
        </tr>
      </thead>
      <tbody>
        {logs.map(log => (
          <tr key={log.id} className="border-b">
            <td className="py-2">{log.folder_pair?.source} → {log.folder_pair?.destination}</td>
            <td className="py-2">{new Date(log.timestamp).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default SyncLog;