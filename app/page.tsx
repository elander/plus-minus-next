// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, Minus, ArrowRight, Trash2, Save } from 'lucide-react';

type Entry = {
  id: string;
  date: string;
  plus: string[];
  minus: string[];
  next: string[];
};

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<Entry>({
    id: '',
    date: new Date().toISOString().split('T')[0],
    plus: [''],
    minus: [''],
    next: [''],
  });

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/entries');
      if (!response.ok) throw new Error('Failed to fetch entries');
      const data = await response.json();
      setEntries(data);
    } catch (err) {
      setError('Failed to load entries');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveEntry = async () => {
    setSaving(true);
    try {
      const entryToSave = {
        date: currentEntry.date,
        plus: currentEntry.plus.filter(item => item.trim() !== ''),
        minus: currentEntry.minus.filter(item => item.trim() !== ''),
        next: currentEntry.next.filter(item => item.trim() !== ''),
      };

      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entryToSave),
      });

      if (!response.ok) throw new Error('Failed to save entry');
      
      const newEntry = await response.json();
      setEntries([newEntry, ...entries]);

      // Reset form
      setCurrentEntry({
        id: '',
        date: new Date().toISOString().split('T')[0],
        plus: [''],
        minus: [''],
        next: [''],
      });
    } catch (err) {
      setError('Failed to save entry');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: 'plus' | 'minus' | 'next', index: number, value: string) => {
    setCurrentEntry(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item),
    }));
  };

  const addField = (field: 'plus' | 'minus' | 'next') => {
    setCurrentEntry(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeField = (field: 'plus' | 'minus' | 'next', index: number) => {
    if (currentEntry[field].length > 1) {
      setCurrentEntry(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index),
      }));
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const response = await fetch(`/api/entries/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete entry');
      
      setEntries(entries.filter(entry => entry.id !== id));
    } catch (err) {
      setError('Failed to delete entry');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Plus Minus Next</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {/* Entry Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={currentEntry.date}
              onChange={e => setCurrentEntry(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Plus Section */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <Plus className="w-5 h-5 text-green-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Plus</h2>
            </div>
            {currentEntry.plus.map((item, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={e => updateField('plus', index, e.target.value)}
                  placeholder="What went well?"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={() => removeField('plus', index)}
                  className="ml-2 p-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => addField('plus')}
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              + Add more
            </button>
          </div>

          {/* Minus Section */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <Minus className="w-5 h-5 text-red-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Minus</h2>
            </div>
            {currentEntry.minus.map((item, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={e => updateField('minus', index, e.target.value)}
                  placeholder="What could be improved?"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  onClick={() => removeField('minus', index)}
                  className="ml-2 p-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => addField('minus')}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              + Add more
            </button>
          </div>

          {/* Next Section */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <ArrowRight className="w-5 h-5 text-blue-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Next</h2>
            </div>
            {currentEntry.next.map((item, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={e => updateField('next', index, e.target.value)}
                  placeholder="Action items to do next"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => removeField('next', index)}
                  className="ml-2 p-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => addField('next')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              + Add more
            </button>
          </div>

          <button
            onClick={saveEntry}
            disabled={saving}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center disabled:bg-blue-400"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Entry'}
          </button>
        </div>

        {/* Entries List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Previous Entries</h2>
          {entries.map(entry => (
            <div key={entry.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">{entry.date}</h3>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              
              {entry.plus.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <Plus className="w-4 h-4 text-green-500 mr-2" />
                    <h4 className="font-medium text-green-700">Plus</h4>
                  </div>
                  <ul className="list-disc list-inside text-gray-700">
                    {entry.plus.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {entry.minus.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <Minus className="w-4 h-4 text-red-500 mr-2" />
                    <h4 className="font-medium text-red-700">Minus</h4>
                  </div>
                  <ul className="list-disc list-inside text-gray-700">
                    {entry.minus.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {entry.next.length > 0 && (
                <div>
                  <div className="flex items-center mb-2">
                    <ArrowRight className="w-4 h-4 text-blue-500 mr-2" />
                    <h4 className="font-medium text-blue-700">Next</h4>
                  </div>
                  <ul className="list-disc list-inside text-gray-700">
                    {entry.next.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}