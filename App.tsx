import React, { useState, useMemo, useEffect } from 'react';
import { Project, RoadmapItem } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import Sidebar from './components/Sidebar';
import ProjectDashboard from './components/ProjectDashboard';
import ProjectView from './components/ProjectView';
import RecentIdeasView from './components/RecentIdeasView';

// Seed data for initial setup
const seedProjects: Project[] = [
  { id: 'proj-1', title: 'Website Redesign', description: 'Complete overhaul of the corporate website.', createdAt: '2023-10-01T10:00:00Z', logo: null },
  { id: 'proj-2', title: 'Mobile App Launch', description: 'Develop and launch the new mobile application for iOS and Android.', createdAt: '2023-11-15T14:30:00Z', logo: null },
];

const seedRoadmapItems: RoadmapItem[] = [
  { id: 'item-1', projectId: 'proj-1', type: 'Add', title: 'Implement new design system', description: 'Integrate the new Figma design system into the frontend codebase.', createdAt: '2023-10-05T09:00:00Z', priority: 'High', isPinned: false, isDone: false, isArchived: false, dueDate: '2024-08-15' },
  { id: 'item-2', projectId: 'proj-1', type: 'Edit', title: 'Refactor authentication flow', description: 'Update the user login and registration process for better UX.', createdAt: '2023-10-10T11:00:00Z', priority: 'Medium', isPinned: false, isDone: true, isArchived: false, dueDate: '2024-07-20' },
  { id: 'item-3', projectId: 'proj-2', type: 'Add', title: 'Setup CI/CD pipeline', description: 'Create a continuous integration and deployment pipeline for both mobile platforms.', createdAt: '2023-11-20T16:00:00Z', priority: 'Urgent', isPinned: true, isDone: false, isArchived: false, dueDate: null },
  { id: 'item-4', projectId: 'proj-1', type: 'Remove', title: 'Legacy IE11 support', description: 'Drop support for Internet Explorer 11 as per the new browser support policy.', createdAt: '2023-10-12T15:00:00Z', priority: 'Low', isPinned: false, isDone: false, isArchived: true, dueDate: null },
];

type ActiveView = 'projects' | 'recent';

const App: React.FC = () => {
  const [projects, setProjects] = useLocalStorage<Project[]>('projects', seedProjects);
  const [roadmapItems, setRoadmapItems] = useLocalStorage<RoadmapItem[]>('roadmapItems', seedRoadmapItems);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>('projects');
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'dark');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const handleSelectView = (view: ActiveView) => {
    setSelectedProjectId(null);
    setActiveView(view);
  };

  const handleSelectProject = (id: string | null) => {
    setSelectedProjectId(id);
  };

  const handleAddProject = (project: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProjects([...projects, newProject]);
    setSelectedProjectId(newProject.id);
    setActiveView('projects');
  };

  const handleUpdateProject = (updatedProjectData: Omit<Project, 'id' | 'createdAt'>) => {
      setProjects(projects.map(p => p.id === selectedProjectId ? { ...p, ...updatedProjectData } : p));
  };
  
  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
    setRoadmapItems(roadmapItems.filter(item => item.projectId !== id));
    if (selectedProjectId === id) {
      setSelectedProjectId(null);
    }
  };

  const handleAddRoadmapItem = (item: Omit<RoadmapItem, 'id' | 'createdAt' | 'isDone' | 'isArchived'>) => {
    const newItem: RoadmapItem = {
      ...item,
      id: `item-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isDone: false,
      isArchived: false,
    };
    setRoadmapItems([...roadmapItems, newItem]);
  };
  
  const handleUpdateRoadmapItem = (updatedItem: RoadmapItem) => {
    setRoadmapItems(roadmapItems.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const handleArchiveRoadmapItem = (id: string) => {
    setRoadmapItems(roadmapItems.map(item => item.id === id ? { ...item, isArchived: true } : item));
  };

  const handleUnarchiveRoadmapItem = (id: string) => {
    setRoadmapItems(roadmapItems.map(item => item.id === id ? { ...item, isArchived: false } : item));
  };

  const handleToggleDone = (id: string) => {
    setRoadmapItems(roadmapItems.map(item => item.id === id ? { ...item, isDone: !item.isDone } : item));
  };

  const selectedProject = useMemo(() => {
    return projects.find(p => p.id === selectedProjectId) || null;
  }, [projects, selectedProjectId]);

  const projectRoadmapItems = useMemo(() => {
    // Pass all items, including archived, to ProjectView for local filtering
    return roadmapItems.filter(item => item.projectId === selectedProjectId);
  }, [roadmapItems, selectedProjectId]);

  const recentIdeas = useMemo(() => {
    return [...roadmapItems]
        .filter(item => !item.isArchived)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10);
  }, [roadmapItems]);

  const projectsWithLatestIdea = useMemo(() => {
    return projects.map(project => {
      const projectItems = roadmapItems
        .filter(item => item.projectId === project.id && !item.isArchived)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return {
        ...project,
        latestIdea: projectItems[0] || null,
      };
    });
  }, [projects, roadmapItems]);
  
  const renderContent = () => {
    if (selectedProject) {
      return (
        <ProjectView
          key={selectedProject.id}
          project={selectedProject}
          roadmapItems={projectRoadmapItems}
          onAddItem={handleAddRoadmapItem}
          onUpdateItem={handleUpdateRoadmapItem}
          onArchiveItem={handleArchiveRoadmapItem}
          onUnarchiveItem={handleUnarchiveRoadmapItem}
          onToggleDone={handleToggleDone}
          onUpdateProject={handleUpdateProject}
          onDeleteProject={handleDeleteProject}
          onBack={() => handleSelectProject(null)}
        />
      );
    }
    
    switch (activeView) {
      case 'projects':
        return (
          <ProjectDashboard
            projects={projectsWithLatestIdea}
            onSelectProject={handleSelectProject}
            onAddProject={handleAddProject}
          />
        );
      case 'recent':
        return <RecentIdeasView ideas={recentIdeas} projects={projects} onSelectProject={handleSelectProject} />;
      default:
        return null;
    }
  };


  return (
    <div className="flex h-screen bg-slate-50 dark:bg-gray-900 text-slate-800 dark:text-gray-300 font-sans">
      <Sidebar
        onSelectView={handleSelectView}
        activeView={activeView}
        theme={theme}
        setTheme={setTheme}
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;