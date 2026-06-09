import { create } from 'zustand';

function parseJwt(token) {
	try {
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
		}).join(''));
		return JSON.parse(jsonPayload);
	} catch (e) {
		return null;
	}
}

const initialToken = localStorage.getItem('token');
const initialEmail = initialToken ? parseJwt(initialToken)?.sub : null;

export const useAuthStore = create((set) => ({
	token: initialToken,
    email: initialEmail,

	login: (token) => {
		localStorage.setItem('token', token);
        const payload = parseJwt(token);
		set({ token, email: payload?.sub || null });
	},

	logout: () => {
		localStorage.removeItem('token');
		set({ token: null, email: null });
	},
}));
