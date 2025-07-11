import React, { useState } from 'react';
import API from '../api/api';

const FolderPairForm = ({ onFolderPairAdded }) => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!source || !destination) return alert("Please fill both paths");

    try {
      const res = await API.post('folder-pairs/', { source, destination });
      onFolderPairAdded(); // refresh folder pairs
      setSource('');
      setDestination('');
    } catch (err) {
      console.error('Error adding folder pair', err);
      alert("Failed to add folder pair. Check paths or backend.");
    }
  };
  const openFolderPicker = async (setter) => {
    if (window.electronAPI?.selectFolder) {
      const selected = await window.electronAPI.selectFolder();
      if (selected) setter(selected);
    } else {
      alert("Folder picker not available in browser. Use Electron app.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow mb-6">
      <h2 className="text-xl font-semibold mb-2">Add Folder Pair</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium">Source Folder</label>
        <div className="flex gap-2 mt-1">
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="flex-1 border px-3 py-2 rounded"
            placeholder="C:\\Users\\YourName\\Documents"
          />
          <button
            type="button"
            onClick={() => openFolderPicker(setSource)}
            className="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            📂 Browse
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Destination Folder</label>
        <div className="flex gap-2 mt-1">
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="flex-1 border px-3 py-2 rounded"
            placeholder="D:\\Backup\\Documents"
          />
          <button
            type="button"
            onClick={() => openFolderPicker(setDestination)}
            className="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            📂 Browse
          </button>
        </div>
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        ➕ Add Pair
      </button>
    </form>
  );
};

export default FolderPairForm;
