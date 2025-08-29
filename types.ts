export enum RoadmapItemType {
  Add = 'Add',
  Edit = 'Edit',
  Remove = 'Remove',
}

export enum RoadmapItemPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Urgent = 'Urgent',
}

export interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  logo?: string | null;
}

export interface RoadmapItem {
  id: string;
  projectId: string;
  type: keyof typeof RoadmapItemType;
  title: string;
  description: string;
  createdAt: string;
  priority: keyof typeof RoadmapItemPriority;
  isPinned: boolean;
  isDone: boolean;
  isArchived: boolean;
  dueDate?: string | null;
}