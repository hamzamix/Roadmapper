import React from 'react';
import { RoadmapItem, Project, RoadmapItemType, RoadmapItemPriority } from '../types';
import { PinIcon, CheckCircleIcon, CalendarIcon } from './Icons';

interface RecentIdeasViewProps {
  ideas: RoadmapItem[];
  projects: Project[];
  onSelectProject: (id: string) => void;
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


const RecentIdeasView: React.FC<RecentIdeasViewProps> = ({ ideas, projects, onSelectProject }) => {
  const getProjectTitle = (projectId: string) => projects.find(p => p.id === projectId)?.title || 'Unknown Project';
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="animate-fade-in">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Recent Ideas</h1>
        <p className="text-slate-500 dark:text-gray-400 mt-2">A feed of the latest ideas and changes across all your projects.</p>
      </header>
      <div className="space-y-4">
        {ideas.length > 0 ? (
          ideas.map(idea => {
            const isOverdue = idea.dueDate && !idea.isDone && idea.dueDate < today;
            return (
              <div 
                  key={idea.id} 
                  className={`p-4 rounded-lg border bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700 transition-all ${idea.isDone ? 'opacity-60' : ''}`}
              >
                  <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2.5 flex-wrap">
                          {idea.isPinned && <PinIcon className="w-4 h-4 text-amber-400 shrink-0" title="Pinned item"/>}
                          {idea.isDone && <CheckCircleIcon className="w-4 h-4 text-green-400 shrink-0" title="Done"/>}
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-md ${typeBadgeStyles[idea.type]}`}>{idea.type}</span>
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-md ${priorityStyles[idea.priority]}`}>{idea.priority}</span>
                          <h3 className={`font-semibold text-slate-800 dark:text-gray-100 ${idea.isDone ? 'line-through' : ''}`}>{idea.title}</h3>
                      </div>
                      <span className="text-sm text-slate-400 dark:text-gray-500 flex-shrink-0 ml-4">{new Date(idea.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-end mt-2">
                    <div className="flex-1">
                      {idea.description && (
                          <div className={`text-slate-600 dark:text-gray-400 text-sm mb-2 ${idea.isDone ? 'line-through' : ''}`}>
                            {renderMarkdown(idea.description)}
                          </div>
                      )}
                      <button 
                          onClick={() => onSelectProject(idea.projectId)}
                          className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300"
                      >
                          View in "{getProjectTitle(idea.projectId)}"
                      </button>
                    </div>
                    {idea.dueDate && (
                        <div className={`flex items-center gap-1.5 text-xs px-2 py-0.5 rounded ml-4 shrink-0 ${isOverdue ? 'bg-red-100 text-red-800 dark:bg-red-800/50 dark:text-red-300' : 'bg-slate-100 text-slate-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                            <CalendarIcon className="w-3.5 h-3.5"/>
                            <span>{new Date(idea.dueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })}</span>
                        </div>
                    )}
                  </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-slate-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-slate-300 dark:border-gray-700">
            <p className="text-slate-500 dark:text-gray-400">No recent ideas found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentIdeasView;