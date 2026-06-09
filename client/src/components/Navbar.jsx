import { useNavigate, useLocation } from 'react-router';
import { useAuthStore } from '../stores/authStore';
import { useOrgStore } from '../stores/orgStore';
import { useUsersStore } from '../stores/usersStore';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const logout = useAuthStore((state) => state.logout);
    const email = useAuthStore((state) => state.email);
    const token = useAuthStore((state) => state.token);
    const { org } = useOrgStore();
    const { users } = useUsersStore();

    const currentUser = users.find(u => u.email === email);
    const displayName = currentUser ? currentUser.name : (email ? email.split('@')[0] : 'Member');

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname.startsWith(path) ? 'navbar-link active' : 'navbar-link';

    return (
        <nav className="navbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                <div className="navbar-brand" onClick={() => navigate('/')}>
                    <img src="/relay-logo.png" alt="Relay Logo" style={{ width: '28px', height: '28px' }} />
                    <span>Relay</span>
                </div>

                {token && (
                    <div className="navbar-links">
                        <span className={isActive('/tenant')} onClick={() => navigate('/tenant')}>
                            Organisation
                        </span>
                        <span className={isActive('/projects')} onClick={() => navigate('/projects')}>
                            Projects
                        </span>
                    </div>
                )}
            </div>

            {token && (
                <div className="navbar-actions">
                    {org && (
                        <span className="navbar-org-badge">
                            {org.name}
                        </span>
                    )}
                    
                    <div className="navbar-user-container">
                        <div className="navbar-user-avatar">
                            <User size={20} strokeWidth={2.5} />
                        </div>
                        <span className="navbar-user-name">{displayName}</span>
                    </div>

                    <button className="btn btn-ghost btn-sm" onClick={handleLogout} title="Logout">
                        <LogOut size={18} />
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
