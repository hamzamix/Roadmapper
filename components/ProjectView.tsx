import React, { useState, useMemo } from 'react';
import { Project, RoadmapItem, RoadmapItemType, RoadmapItemPriority } from '../types';
import RoadmapItemCard from './RoadmapItemCard';
import { PlusCircleIcon, SearchIcon, TrashIcon, FolderIcon, EditIcon, ArrowLeftIcon } from './Icons';
import Modal from './Modal';
import RoadmapItemForm from './RoadmapItemForm';
import ProjectForm from './ProjectForm';

interface ProjectViewProps {
  project: Project;
  roadmapItems: RoadmapItem[];
  onAddItem: (item: Omit<RoadmapItem, 'id' | 'createdAt' | 'isDone' | 'isArchived'>) => void;
  onUpdateItem: (item: RoadmapItem) => void;
  onArchiveItem: (id: string) => void;
  onUnarchiveItem: (id: string) => void;
  onToggleDone: (id: string) => void;
  onUpdateProject: (data: Omit<Project, 'id' | 'createdAt'>) => void;
  onDeleteProject: (id: string) => void;
  onBack: () => void;
}

type ItemFilter = 'All' | keyof typeof RoadmapItemType | 'Archived';
type SortOption = 'date' | 'priority' | 'name' | 'dueDate';

const ProjectView: React.FC<ProjectViewProps> = ({ project, roadmapItems, onAddItem, onUpdateItem, onArchiveItem, onUnarchiveItem, onToggleDone, onUpdateProject, onDeleteProject, onBack }) => {
  const [filter, setFilter] = useState<ItemFilter>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RoadmapItem | null>(null);

  const handleOpenItemModal = (item: RoadmapItem | null = null) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };
  
  const handleCloseItemModal = () => {
    setIsItemModalOpen(false);
    setEditingItem(null);
  }

  const handleItemFormSubmit = (data: Omit<RoadmapItem, 'id' | 'createdAt' | 'projectId' | 'isDone' | 'isArchived'>) => {
    if (editingItem) {
      onUpdateItem({ ...editingItem, ...data });
    } else {
      onAddItem({ ...data, projectId: project.id });
    }
    handleCloseItemModal();
  };
  
  const handleProjectFormSubmit = (data: Omit<Project, 'id' | 'createdAt'>) => {
      onUpdateProject(data);
      setIsProjectModalOpen(false);
  }

  const handleDeleteProjectConfirm = () => {
    if(window.confirm(`Are you sure you want to delete the project "${project.title}" and all its ideas?`)) {
        onDeleteProject(project.id);
    }
  }

  const filteredAndSortedItems = useMemo(() => {
    const priorityOrder: { [key in keyof typeof RoadmapItemPriority]: number } = {
        [RoadmapItemPriority.Urgent]: 4,
        [RoadmapItemPriority.High]: 3,
        [RoadmapItemPriority.Medium]: 2,
        [RoadmapItemPriority.Low]: 1,
    };

    return roadmapItems
      .filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              item.description.toLowerCase().includes(searchTerm.toLowerCase());
        if (!matchesSearch) return false;

        if (filter === 'Archived') {
            return item.isArchived;
        }

        if (item.isArchived) {
            return false;
        }
        
        return filter === 'All' || item.type === filter;
      })
      .sort((a, b) => {
        if (a.isDone !== b.isDone) {
          return a.isDone ? 1 : -1;
        }
        if (a.isPinned !== b.isPinned) {
          return a.isPinned ? -1 : 1;
        }
        
        switch (sortBy) {
            case 'priority':
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            case 'name':
                return a.title.localeCompare(b.title);
            case 'dueDate':
                const dateA = a.dueDate ? new Date(a.dueDate) : null;
                const dateB = b.dueDate ? new Date(b.dueDate) : null;
                if (!dateA && !dateB) return 0;
                if (!dateA) return 1;
                if (!dateB) return -1;
                return dateA.getTime() - dateB.getTime();
            case 'date':
            default:
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
  }, [roadmapItems, filter, searchTerm, sortBy]);

  const filterOptions: ItemFilter[] = ['All', 'Add', 'Edit', 'Remove', 'Archived'];

  return (
    <>
      <div className="animate-fade-in">
        <header className="mb-8">
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-4 group">
                <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to All Projects
            </button>
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-center gap-4">
                {project.logo ? (
                     <img src={project.logo} alt={project.title} className="w-16 h-16 rounded-lg object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-gray-800 flex items-center justify-center">
                        <FolderIcon className="w-8 h-8 text-slate-400 dark:text-gray-400" />
                    </div>
                )}
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{project.title}</h1>
                    <p className="text-slate-500 dark:text-gray-400 mt-2">{project.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                    onClick={() => setIsProjectModalOpen(true)}
                    className="p-2 bg-slate-200/50 dark:bg-gray-700/50 text-slate-600 dark:text-gray-300 rounded-md hover:bg-slate-200 dark:hover:bg-gray-700 hover:text-slate-800 dark:hover:text-white transition-colors"
                    title="Edit Project"
                >
                    <EditIcon className="w-5 h-5"/>
                </button>
                <button
                    onClick={handleDeleteProjectConfirm}
                    className="p-2 bg-red-500/10 dark:bg-red-600/20 text-red-600 dark:text-red-400 rounded-md hover:bg-red-500/20 dark:hover:bg-red-600/40 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                    title="Delete Project"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
        </header>

        <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex-1 w-full md:w-auto">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search ideas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-md pl-10 pr-4 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
            <div>
                <label htmlFor="sort-by" className="sr-only">Sort by</label>
                <select 
                    id="sort-by"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="bg-white dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition h-full"
                >
                    <option value="date">Sort by Date</option>
                    <option value="priority">Sort by Priority</option>
                    <option value="name">Sort by Name</option>
                    <option value="dueDate">Sort by Due Date</option>
                </select>
            </div>
            <div className="bg-slate-100 dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-md p-1 flex">
              {filterOptions.map(opt => (
                <button
                  key={opt}
                  onClick={() => setFilter(opt)}
                  className={`px-3 py-1 text-sm font-medium rounded ${
                    filter === opt ? 'bg-indigo-600 text-white' : 'text-slate-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700'
                  } transition-colors`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <button
              onClick={() => handleOpenItemModal()}
              className="flex items-center gap-2 bg-indigo-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-indigo-500 transition-colors"
            >
              <PlusCircleIcon className="w-5 h-5" />
              Add Idea
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredAndSortedItems.length > 0 ? (
            filteredAndSortedItems.map(item => (
              <RoadmapItemCard 
                key={item.id} 
                item={item} 
                onEdit={() => handleOpenItemModal(item)} 
                onArchive={() => onArchiveItem(item.id)}
                onUnarchive={() => onUnarchiveItem(item.id)}
                onToggleDone={() => onToggleDone(item.id)}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-slate-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-slate-300 dark:border-gray-700">
                <p className="text-slate-500 dark:text-gray-400">No roadmap ideas found for this project.</p>
                <button onClick={() => handleOpenItemModal()} className="mt-4 text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 font-semibold">Add your first idea</button>
            </div>
          )}
        </div>
      </div>
      <Modal isOpen={isItemModalOpen} onClose={handleCloseItemModal} title={editingItem ? 'Edit Idea' : 'Add New Idea'}>
          <RoadmapItemForm
            onSubmit={handleItemFormSubmit}
            onCancel={handleCloseItemModal}
            initialData={editingItem}
          />
      </Modal>
      <Modal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} title="Edit Project">
          <ProjectForm
            onSubmit={handleProjectFormSubmit}
            onCancel={() => setIsProjectModalOpen(false)}
            initialData={project}
          />
      </Modal>
    </>
  );
};

export default ProjectView;