'use client'

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface Activity {
  id: string;
  description: string;
  tags: string[];
  timestamp: string;
}

const SHOW_EDITOR = process.env.NEXT_PUBLIC_SHOW_EDITOR === 'true';

export default function ActivityLogger() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [filterTag, setFilterTag] = useState<string>('');
  const [filterStartDate, setFilterStartDate] = useState<string>('');
  const [filterEndDate, setFilterEndDate] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'add' | 'history'>(SHOW_EDITOR ? 'add' : 'history');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/activities');
      if (!response.ok) throw new Error('Failed to fetch activities');
      const data = await response.json();
      setActivities(data);
      setError(null);
    } catch (err) {
      setError('Failed to load activities. Please try again later.');
      console.error('Error fetching activities:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveActivities = async (updatedActivities: Activity[]) => {
    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedActivities),
      });
      
      if (!response.ok) throw new Error('Failed to save activities');
      setActivities(updatedActivities);
      setError(null);
    } catch (err) {
      setError('Failed to save changes. Please try again later.');
      console.error('Error saving activities:', err);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleDeleteActivity = async (idToDelete: string) => {
    const updatedActivities = activities.filter(activity => activity.id !== idToDelete);
    await saveActivities(updatedActivities);
  };

  const handleDeleteActivityTag = async (activityId: string, tagToRemove: string) => {
    const updatedActivities = activities.map(activity => {
      if (activity.id === activityId) {
        return {
          ...activity,
          tags: activity.tags.filter(tag => tag !== tagToRemove)
        };
      }
      return activity;
    });
    await saveActivities(updatedActivities);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const newActivity: Activity = {
      id: Date.now().toString(),
      description: description.trim(),
      tags,
      timestamp: selectedDate || new Date().toISOString(),
    };

    const updatedActivities = [newActivity, ...activities];
    await saveActivities(updatedActivities);

    // Reset form
    setDescription('');
    setTags([]);
    setSelectedDate('');
  };

  const filteredActivities = activities
    .filter(activity => {
      const matchesTag = !filterTag || activity.tags.includes(filterTag);
      const activityDate = new Date(activity.timestamp);
      const matchesStartDate = !filterStartDate || activityDate >= new Date(filterStartDate);
      const matchesEndDate = !filterEndDate || activityDate <= new Date(filterEndDate);
      return matchesTag && matchesStartDate && matchesEndDate;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (isLoading) {
    return <div className="text-center py-4">Loading activities...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">{error}</div>;
  }

  const HistoryView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Tag
          </label>
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 p-2 focus:border-sea-blue focus:ring-sea-blue"
          >
            <option value="">All Tags</option>
            {Array.from(new Set(activities.flatMap(a => a.tags))).map(tag => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 p-2 focus:border-sea-blue focus:ring-sea-blue"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 p-2 focus:border-sea-blue focus:ring-sea-blue"
          />
        </div>
      </div>

      <div className="space-y-6">
        {filteredActivities.map(activity => (
          <div
            key={activity.id}
            className="border-b border-gray-200 pb-6 relative"
          >
            {SHOW_EDITOR && (
              <button
                onClick={() => handleDeleteActivity(activity.id)}
                className="absolute top-0 right-0 text-gray-400 hover:text-sea-blue"
                title="Delete activity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                </svg>
              </button>
            )}
            <p className="text-gray-500 text-sm">
              {format(new Date(activity.timestamp), 'PPpp')}
            </p>
            <p className="mt-2">{activity.description}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {activity.tags.map(tag => (
                <span
                  key={tag}
                  className={`border border-gray-300 text-gray-700 px-2 py-0.5 rounded-full text-sm ${
                    SHOW_EDITOR ? 'flex items-center gap-1 group cursor-pointer hover:border-sea-blue' : ''
                  }`}
                >
                  {tag}
                  {SHOW_EDITOR && (
                    <button
                      type="button"
                      onClick={() => handleDeleteActivityTag(activity.id, tag)}
                      className="text-gray-400 group-hover:text-sea-blue ml-1"
                      title="Remove tag"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      {SHOW_EDITOR ? (
        <>
          <div className="mb-6 flex gap-4">
            <button
              onClick={() => setActiveTab('add')}
              className={`px-4 py-2 rounded ${
                activeTab === 'add'
                  ? 'text-white bg-sea-blue'
                  : 'text-gray-600 hover:text-sea-blue'
              }`}
            >
              Add Activity
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded ${
                activeTab === 'history'
                  ? 'text-white bg-sea-blue'
                  : 'text-gray-600 hover:text-sea-blue'
              }`}
            >
              History
            </button>
          </div>

          {activeTab === 'add' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What did you do?
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 p-2 focus:border-sea-blue focus:ring-sea-blue"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Add Tags
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    className="block w-full rounded-md border-gray-300 p-2 focus:border-sea-blue focus:ring-sea-blue"
                    placeholder="Enter a tag and press Enter or click Add Tag"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-sea-blue text-white rounded hover:bg-opacity-90"
                  >
                    Add Tag
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map(tag => (
                    <span
                      key={tag}
                      className="border border-gray-300 text-gray-700 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-gray-500 hover:text-sea-blue"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  When did you do this? (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 p-2 focus:border-sea-blue focus:ring-sea-blue"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-sea-blue text-white rounded hover:bg-opacity-90"
              >
                Save Activity
              </button>
            </form>
          ) : (
            <HistoryView />
          )}
        </>
      ) : (
        <HistoryView />
      )}
    </div>
  );
} 