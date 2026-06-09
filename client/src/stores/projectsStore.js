import { create } from 'zustand';

export const useProjectStore = create((set) => ({
	projects: [],

	setProjects: (data) => {
		set({ projects: data });
	},
}));
