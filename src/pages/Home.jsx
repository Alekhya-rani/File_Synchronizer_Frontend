import React, { useEffect, useState } from 'react';
import API from '../api/api';
import FolderPairTable from '../components/FolderPairTable';
import SyncLog from '../components/SyncLog';
import FolderPairForm from '../components/FolderPairForm';
import { toast } from 'react-toastify';

const Home = () => {
  const [syncingId, setSyncingId] = useState(null);
  const [folderPairs, setFolderPairs] = useState([]);
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);

  useEffect(() => {
    fetchFolderPairs();
    fetchLogs();
  }, []);

  const fetchFolderPairs = async () => {
    try {
      const res = await API.get('folder-pairs/');
      setFolderPairs(res.data);
    } catch (error) {
      console.error("Error fetching folder pairs", error);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await API.get('sync-logs/');
      setLogs(res.data);
    } catch (error) {
      console.error("Error fetching sync logs", error);
    }
  };

  const handleSync = async (id) => {
  setSyncingId(id);
  setLogsLoading(true); // ⏳ Show loading in sync log

  try {
    const previousCount = logs.length;

    await API.post(`folder-pairs/${id}/sync/`);
    toast.success("✅ Sync triggered");

    let attempts = 10;
    const interval = setInterval(async () => {
      try {
        const res = await API.get('sync-logs/');
        if (res.data.length > previousCount || attempts <= 0) {
          clearInterval(interval);
          setLogs(res.data);
          setLogsLoading(false); // ✅ Stop loading
        }
        attempts--;
      } catch (err) {
        clearInterval(interval);
        setLogsLoading(false);
        console.error("Polling failed", err);
      }
    }, 1000);
  } catch (error) {
    toast.error("❌ Sync failed");
    setLogsLoading(false);
  }
  setSyncingId(null);
};


  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">📁 File Synchronizer</h1>
      <FolderPairForm onFolderPairAdded={fetchFolderPairs} />
      <FolderPairTable folderPairs={folderPairs} onSync={handleSync} refresh={fetchFolderPairs} />
      {logsLoading ? (
  <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
    <div className="flex items-center justify-center mb-2">
      <svg className="animate-spin h-5 w-5 mr-2 text-blue-500" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
      <span>Waiting for logs...</span>
    </div>
  </div>
) : (
  <SyncLog logs={logs} />
)}
    </div>
  );
};

export default Home;
