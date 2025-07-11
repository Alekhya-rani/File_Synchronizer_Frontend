import React, { useState } from 'react';
import API from '../api/api';
import { toast } from 'react-toastify';

const FolderPairTable = ({ folderPairs, refresh }) => {
  const [syncingId, setSyncingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editSource, setEditSource] = useState('');
  const [editDestination, setEditDestination] = useState('');
  const [savingId, setSavingId] = useState(null);

  const handleSync = async (id) => {
    setSyncingId(id);
    try {
      await API.post(`folder-pairs/${id}/sync/`);
      toast.success('✅ Sync completed!');
      setTimeout(() => refresh(), 1000);
    } catch (error) {
      toast.error('❌ Sync failed');
    }
    setSyncingId(null);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await API.delete(`folder-pairs/${id}/`);
      toast.success('🗑️ Folder pair deleted!');
      refresh();
    } catch (error) {
      toast.error('❌ Failed to delete');
    }
    setDeletingId(null);
  };

  const handleEdit = (pair) => {
    setEditingId(pair.id);
    setEditSource(pair.source);
    setEditDestination(pair.destination);
  };

  const handleEditSubmit = async () => {
    setSavingId(editingId); // set saving ID
    try {
      await API.put(`folder-pairs/${editingId}/`, {
        source: editSource,
        destination: editDestination,
      });
      toast.success('✅ Folder pair updated!');
      setEditingId(null);
      refresh();
    } catch (error) {
      toast.error('❌ Update failed');
    }
    setSavingId(null);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow mb-6">
      <h2 className="text-xl font-semibold mb-2">📁 Folder Pairs</h2>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Source</th>
            <th className="text-left py-2">Destination</th>
            <th className="text-left py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {folderPairs.map((pair) => (
            <tr key={pair.id} className="border-b">
              <td className="py-2">
                {editingId === pair.id ? (
                  <input
                    type="text"
                    value={editSource || ''}
                    onChange={(e) => setEditSource(e.target.value)}
                    className="border px-2 py-1 rounded w-full bg-white focus:outline-none focus:ring focus:ring-blue-300"
                  />
                ) : (
                  pair.source
                )}
              </td>
              <td className="py-2">
                {editingId === pair.id ? (
                  <input
                    type="text"
                    value={editDestination || ''}
                    onChange={(e) => setEditDestination(e.target.value)}
                    className="border px-2 py-1 rounded w-full bg-white focus:outline-none focus:ring focus:ring-blue-300"
                  />
                ) : (
                  pair.destination
                )}
              </td>
              <td className="py-2 space-x-2">
                {editingId === pair.id ? (
                  <>
                    <button
                      className={`px-2 py-1 text-white rounded ${savingId === pair.id ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                      onClick={handleEditSubmit}
                      disabled={savingId === pair.id}
                      style={{ pointerEvents: savingId === pair.id ? 'none' : 'auto' }}
                    >
                      {savingId === pair.id ? (
                        <span className="flex items-center">
                          <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Saving...
                        </span>
                      ) : (
                        "✅ Save"
                      )}
                    </button>
                    <button
                      className="px-2 py-1 bg-gray-400 text-white rounded"
                      onClick={() => setEditingId(null)}
                    >
                      ❌ Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className={`px-3 py-1 text-white rounded ${syncingId === pair.id ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                      onClick={() => handleSync(pair.id)}
                      disabled={syncingId === pair.id}
                    >
                      {syncingId === pair.id ? (
                        <span className="flex items-center">
                          <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Syncing...
                        </span>
                      ) : (
                        "🔁 Sync Now"
                      )}
                    </button>
                    <button
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      onClick={() => handleEdit(pair)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className={`px-2 py-1 text-white rounded ${deletingId === pair.id ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                      onClick={() => handleDelete(pair.id)}
                      disabled={deletingId === pair.id}
                    >
                      {deletingId === pair.id ? (
                        <span className="flex items-center">
                          <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Deleting...
                        </span>
                      ) : (
                        "🗑️ Delete"
                      )}
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FolderPairTable;
