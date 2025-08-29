

import React, { useState } from 'react';
import { RoadmapItem, RoadmapItemType, RoadmapItemPriority } from '../types';

type RoadmapItemFormData = Pick<RoadmapItem, 'title' | 'description' | 'type' | 'priority' | 'isPinned' | 'dueDate'>;

interface RoadmapItemFormProps {
  onSubmit: (data: RoadmapItemFormData) => void;
  onCancel: () => void;
  initialData?: RoadmapItem | null;
}

const RoadmapItemForm: React.FC<RoadmapItemFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [type, setType] = useState<keyof typeof RoadmapItemType>(initialData?.type || 'Add');
  const [priority, setPriority] = useState<keyof typeof RoadmapItemPriority>(initialData?.priority || 'Medium');
  const [isPinned, setIsPinned] = useState(initialData?.isPinned || false);
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({ title, description, type, priority, isPinned, dueDate: dueDate || null });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="item-title" className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
          Title
        </label>
        <input
          type="text"
          id="item-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-md px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          placeholder="e.g. Add dark mode support"
        />
      </div>
      <div>
        <label htmlFor="item-description" className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          id="item-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-md px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          placeholder="Describe the idea or change... Markdown is supported!"
        />
        <p className="mt-1 text-xs text-slate-500 dark:text-gray-400">Supports **bold**, *italic*, and [links](https://...).</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="item-type" className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
            Type
          </label>
          <select
            id="item-type"
            value={type}
            onChange={(e) => setType(e.target.value as keyof typeof RoadmapItemType)}
            className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-md px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          >
            {Object.keys(RoadmapItemType).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="item-priority" className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
            Priority
          </label>
          <select
            id="item-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as keyof typeof RoadmapItemPriority)}
            className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-md px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          >
            {Object.keys(RoadmapItemPriority).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="item-dueDate" className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
          Due Date (Optional)
        </label>
        <input
          type="date"
          id="item-dueDate"
          value={dueDate || ''}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-md px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />
      </div>
      <div>
        <label htmlFor="item-isPinned" className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            id="item-isPinned"
            checked={isPinned}
            onChange={(e) => setIsPinned(e.target.checked)}
            className="h-4 w-4 rounded bg-slate-200 dark:bg-gray-700 border-slate-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm font-medium text-slate-700 dark:text-gray-300">Mark as "To-do first" (pins to top)</span>
        </label>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-gray-300 bg-slate-100 dark:bg-gray-700 rounded-md hover:bg-slate-200 dark:hover:bg-gray-600 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 transition"
        >
          {initialData ? 'Save Changes' : 'Add Idea'}
        </button>
      </div>
    </form>
  );
};

export default RoadmapItemForm;