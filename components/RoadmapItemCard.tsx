import React from 'react';
import { RoadmapItem, RoadmapItemType, RoadmapItemPriority } from '../types';
import { EditIcon, PinIcon, ArchiveIcon, UnarchiveIcon, CheckCircleIcon, CalendarIcon } from './Icons';

interface RoadmapItemCardProps {
  item: RoadmapItem;
  onEdit: () => void;
  onArchive: () => void;
  onUnarchive: () => void;
  onToggleDone: () => void;
}

const typeBadgeStyles: { [key in keyof typeof RoadmapItemType]: string } = {
  [RoadmapItemType.Add]: 'bg-green-500 text-white',
  [RoadmapItemType.Edit]: 'bg-sky-500 text-white',
  [RoadmapItemType.Remove]: 'bg-slate-500 text-white',
};

const priorityStyles: { [key in keyof typeof RoadmapItemPriority]: string } = {
  [RoadmapItemPriority.Low]: 'bg-slate-500 text-white',
  [RoadmapItemPriority.Medium]: 'bg-sky-500 text-white',
  [RoadmapItemPriority.High]: 'bg-amber-500 text-white',
  [RoadmapItemPriority.Urgent]: 'bg-red-500 text-white',
};

const renderMarkdown = (text: string) => {
  const regex = /(\*\*(.*?)\*\*)|(\*(.*?)\*)|(\[(.*?)\]\((https?:\/\/[^\s)]+)\))/g;

  return text.split('\n').map((line, lineIndex) => {
    if (line.trim() === "") return <div key={lineIndex} className="h-2" />;

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    
    for (const match of line.matchAll(regex)) {
        const index = match.index || 0;
        const [fullMatch, , bold, , italic, linkText, linkUrl] = match;

        if (index > lastIndex) {
            parts.push(line.substring(lastIndex, index));
        }

        if (bold) parts.push(<strong key={index}>{bold}</strong>);
        else if (italic) parts.push(<em key={index}>{italic}</em>);
        else if (linkText && linkUrl) {
            parts.push(
                <a key={index} href={linkUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-500 dark:text-indigo-400 hover:underline">
                    {linkText}
                </a>
            );
        }
        lastIndex = index + fullMatch.length;
    }

    if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
    }

    return <div key={lineIndex}>{parts}</div>;
  });
};

const RoadmapItemCard: React.FC<RoadmapItemCardProps> = ({ item, onEdit, onArchive, onUnarchive, onToggleDone }) => {
  const today = new Date().toISOString().split('T')[0];
  const isOverdue = item.dueDate && !item.isDone && item.dueDate < today;

  return (
    <div className={`p-4 rounded-lg border bg-white dark:bg-gray-800 transition-all group animate-fade-in-up ${item.isPinned ? 'border-amber-400' : 'border-slate-200 dark:border-gray-700'} ${item.isDone ? 'opacity-60' : ''} ${item.isArchived ? 'opacity-50 bg-slate-50 dark:bg-gray-800/50' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          {item.isPinned && <PinIcon className="w-4 h-4 text-amber-400 shrink-0" title="Pinned item"/>}
          <span className={`px-2 py-0.5 text-xs font-semibold rounded-md ${typeBadgeStyles[item.type]}`}>
              {item.type}
          </span>
          <span className={`px-2 py-0.5 text-xs font-semibold rounded-md ${priorityStyles[item.priority]}`}>
              {item.priority}
          </span>
          <h3 className={`font-semibold text-slate-800 dark:text-gray-100 ${item.isDone ? 'line-through' : ''}`}>{item.title}</h3>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-sm text-slate-400 dark:text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</span>
          {!item.isArchived && (
            <>
              <button 
                onClick={onToggleDone} 
                className={`p-1.5 rounded transition-colors ${item.isDone ? 'text-green-500 bg-green-500/10 hover:bg-green-500/20' : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-700'}`}
                title={item.isDone ? 'Mark as not done' : 'Mark as done'}
              >
                <CheckCircleIcon className="w-4 h-4" />
              </button>
              <button onClick={onEdit} className="p-1.5 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-700 rounded" title="Edit idea">
                <EditIcon className="w-4 h-4" />
              </button>
            </>
          )}
          {item.isArchived ? (
             <button onClick={onUnarchive} className="p-1.5 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-700 rounded" title="Unarchive idea">
                <UnarchiveIcon className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={onArchive} className="p-1.5 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-700 rounded" title="Archive idea">
              <ArchiveIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      {item.description && (
        <div className={`text-sm text-slate-600 dark:text-gray-400 ${item.isDone ? 'line-through' : ''}`}>
          {renderMarkdown(item.description.length > 150 ? item.description.substring(0, 150) + '...' : item.description)}
        </div>
      )}

      <div className="flex justify-end items-end mt-2">
        {item.dueDate && (
            <div className={`flex items-center gap-1.5 text-xs px-2 py-0.5 rounded ml-4 shrink-0 ${isOverdue ? 'bg-red-100 text-red-800 dark:bg-red-800/50 dark:text-red-300' : 'bg-slate-100 text-slate-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                <CalendarIcon className="w-3.5 h-3.5"/>
                <span>{new Date(item.dueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })}</span>
            </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapItemCard;