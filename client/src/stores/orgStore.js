import { create } from 'zustand';

export const useOrgStore = create((set) => ({
	org: null,

	setOrg: (data) => {
		set({ org: data });
	},

	removeOrg: () => {
		set({ org: null });
	},
}));
