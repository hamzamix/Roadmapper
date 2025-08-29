import React from 'react';
import { Project } from '../types';
import { FolderIcon, TrashIcon, UnarchiveIcon } from './Icons';

interface ArchiveViewProps {
  projects: Project[];
  onSelectProject: (id: string) => void;
  onUnarchiveProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
}

const ArchiveView: React.FC<ArchiveViewProps> = ({ projects, onSelectProject, onUnarchiveProject, onDeleteProject }) => {
  const handleDeleteClick = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    if(window.confirm(`Are you sure you want to permanently delete "${project.title}"? This action cannot be undone.`)) {
        onDeleteProject(project.id);
    }
  }

  const handleUnarchiveClick = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    onUnarchiveProject(projectId);
  }

  return (
    <div className="animate-fade-in">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Archived Projects</h1>
        <p className="text-slate-500 dark:text-gray-400 mt-2">View and manage projects that have been archived.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className="bg-slate-50 dark:bg-gray-800/50 p-6 rounded-lg border border-slate-200 dark:border-gray-700 hover:border-slate-300 dark:hover:border-gray-600 cursor-pointer transition-all group flex flex-col"
            >
              <div className="flex items-center mb-4">
                {project.logo ? (
                   <img src={project.logo} alt={project.title} className="w-8 h-8 mr-3 rounded-md object-cover opacity-50" />
                ) : (
                  <div className="w-8 h-8 mr-3 rounded-md bg-slate-100 dark:bg-gray-700/50 flex items-center justify-center">
                      <FolderIcon className="w-5 h-5 text-slate-400 dark:text-gray-500" />
                  </div>
                )}
                <h2 className="text-xl font-semibold text-slate-500 dark:text-gray-400 truncate">{project.title}</h2>
              </div>
              <p className="text-slate-400 dark:text-gray-500 text-sm line-clamp-3 mb-4 flex-grow">{project.description}</p>
              <div className="mt-auto pt-4 border-t border-slate-200 dark:border-gray-700/50 flex justify-between items-center">
                <p className="text-xs text-slate-400 dark:text-gray-500">Archived</p>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={(e) => handleUnarchiveClick(e, project.id)}
                        className="p-1.5 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                        title="Unarchive Project"
                    >
                        <UnarchiveIcon className="w-4 h-4"/>
                    </button>
                    <button
                        onClick={(e) => handleDeleteClick(e, project)}
                        className="p-1.5 text-red-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-500/20 rounded-md transition-colors"
                        title="Delete Permanently"
                    >
                         <TrashIcon className="w-4 h-4"/>
                    </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-slate-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-slate-300 dark:border-gray-700">
              <p className="text-slate-500 dark:text-gray-400">No archived projects found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchiveView;