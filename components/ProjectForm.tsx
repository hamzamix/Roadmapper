import React, { useState, useRef } from 'react';
import { Project } from '../types';
import { UploadCloudIcon, XIcon } from './Icons';

interface ProjectFormProps {
  onSubmit: (data: Omit<Project, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  initialData?: Omit<Project, 'id' | 'createdAt'> | Project | null;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [logo, setLogo] = useState<string | null>(initialData?.logo || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLogo(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({ title, description, logo });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="logo" className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
          Project Logo (Optional)
        </label>
        <div 
          className="mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          {logo ? (
            <div className="relative group">
              <img src={logo} alt="Project logo preview" className="h-24 w-24 object-cover rounded-md" />
              <button 
                type="button" 
                onClick={handleRemoveLogo}
                className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove logo"
              >
                  <XIcon className="w-4 h-4"/>
              </button>
            </div>
          ) : (
            <div className="space-y-1 text-center">
              <UploadCloudIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-gray-400"/>
              <p className="text-sm text-slate-500 dark:text-gray-400">
                <span className="font-semibold text-indigo-500 dark:text-indigo-400">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-slate-400 dark:text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          )}
          <input
            id="logo-upload"
            name="logo-upload"
            type="file"
            accept="image/*"
            className="sr-only"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>
      </div>
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
          Project Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-md px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          placeholder="e.g. Q4 Marketing Campaign"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-md px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          placeholder="A brief description of the project"
        />
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
          {initialData?.title ? 'Save Changes' : 'Save Project'}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;