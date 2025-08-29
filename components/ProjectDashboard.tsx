import React, { useState } from 'react';
import { Project, RoadmapItem, RoadmapItemType, RoadmapItemPriority } from '../types';
import { FolderIcon, PlusIcon, SearchIcon, PinIcon } from './Icons';
import Modal from './Modal';
import ProjectForm from './ProjectForm';

interface ProjectDashboardProps {
  projects: (Project & { latestIdea: RoadmapItem | null })[];
  onSelectProject: (id: string) => void;
  onAddProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
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
  // Truncate the original text and replace newlines to work with line-clamp
  const truncatedText = (text.length > 150 ? text.substring(0, 150) + '...' : text).replace(/\n/g, ' ');
  
  const regex = /(\*\*(.*?)\*\*)|(\*(.*?)\*)|(\[(.*?)\]\((https?:\/\/[^\s)]+)\))/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const match of truncatedText.matchAll(regex)) {
    const index = match.index || 0;
    const [fullMatch, , bold, , italic, linkText, linkUrl] = match;

    if (index > lastIndex) {
      parts.push(truncatedText.substring(lastIndex, index));
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

  if (lastIndex < truncatedText.length) {
    parts.push(truncatedText.substring(lastIndex));
  }

  return <>{parts}</>;
};


const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ projects, onSelectProject, onAddProject }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProjectSubmit = (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    onAddProject(projectData);
    setIsModalOpen(false);
  };
  
  return (
    <>
      <div className="animate-fade-in">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">All Projects</h1>
          <p className="text-slate-500 dark:text-gray-400 mt-2">Manage your projects or create a new one to get started.</p>
        </header>

        <div className="mb-6 flex justify-between items-center gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-md pl-10 pr-4 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-indigo-500 transition-colors shrink-0"
          >
            <PlusIcon className="w-5 h-5" />
            Add New Project
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => onSelectProject(project.id)}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-slate-200 dark:border-gray-700 hover:border-slate-300 dark:hover:border-gray-600 hover:bg-slate-50 dark:hover:bg-gray-800/60 cursor-pointer transition-all group flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {project.logo ? (
                         <img src={project.logo} alt={project.title} className="w-8 h-8 rounded-md object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-md bg-slate-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                            <FolderIcon className="w-5 h-5 text-slate-400 dark:text-gray-400" />
                        </div>
                      )}
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-white truncate">{project.title}</h2>
                    </div>
                </div>
                <p className="text-slate-500 dark:text-gray-400 text-sm line-clamp-3 mb-4 flex-grow">{project.description}</p>
                <div className="mt-auto pt-4 border-t border-slate-200 dark:border-gray-700">
                  <div>
                    {project.latestIdea ? (
                      <>
                        <p className="text-xs text-slate-400 dark:text-gray-500 mb-2 font-medium tracking-wider uppercase">Latest Update</p>
                        <div className="flex items-center gap-2 flex-wrap">
                           {project.latestIdea.isPinned && (
                              <PinIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" title="Pinned item" />
                          )}
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-md ${typeBadgeStyles[project.latestIdea.type]}`}>
                            {project.latestIdea.type}
                          </span>
                           <span className={`px-2 py-0.5 text-xs font-semibold rounded-md ${priorityStyles[project.latestIdea.priority]}`}>
                            {project.latestIdea.priority}
                          </span>
                          <p className="text-sm text-slate-700 dark:text-gray-300 truncate flex-1 min-w-0">{project.latestIdea.title}</p>
                        </div>
                        {project.latestIdea.description && (
                          <div className="mt-2 text-sm text-slate-500 dark:text-gray-400 line-clamp-2">
                            {renderMarkdown(project.latestIdea.description)}
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-slate-500 dark:text-gray-500 italic pt-2">No ideas yet.</p>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 dark:text-gray-500 mt-4">Created: {new Date(project.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-slate-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-slate-300 dark:border-gray-700">
                <p className="text-slate-500 dark:text-gray-400">No projects found.</p>
                <button onClick={() => setIsModalOpen(true)} className="mt-4 text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 font-semibold">Create one now</button>
            </div>
          )}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Project">
        <ProjectForm onSubmit={handleProjectSubmit} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
};

export default ProjectDashboard;