import api from '../lib/api';
import { useOrgStore } from '../stores/orgStore';
import { useEffect, useState } from 'react';
import { ORG_CREATE_API_URL, ORG_GET_DETAILS_API_URL, ORG_JOIN_API_URL } from '../utils/constants';
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router';
import { Copy, Lightbulb } from 'lucide-react';

const Organisation = () => {
    const { org, setOrg } = useOrgStore();
    const [name, setName] = useState('');
    const [domain, setDomain] = useState('');
    const [joinDomain, setJoinDomain] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const joinHandler = () => {
        if (!joinDomain || !code) {
            toast.error('Please fill in all fields');
            return;
        }
        setLoading(true);
        api.post(ORG_JOIN_API_URL, {
            domain: joinDomain,
            code
        }).then((response) => {
            const data = response.data;
            if (data.success) {
                toast.success('Organisation joined!');
                getDetails();
            }
        }).catch((error) => {
            toast.error(error.response?.data?.message || 'Failed to join');
        }).finally(() => setLoading(false));
    };

    const createHandler = () => {
        if (!name || !domain) {
            toast.error('Please fill in all fields');
            return;
        }
        setLoading(true);
        api.post(ORG_CREATE_API_URL, {
            name,
            domain
        }).then((response) => {
            const data = response.data;
            if (data.success) {
                toast.success('Organisation created!');
                getDetails();
            }
        }).catch((error) => {
            toast.error(error.response?.data?.message || 'Failed to create');
        }).finally(() => setLoading(false));
    };

    const getDetails = () => {
        api.get(ORG_GET_DETAILS_API_URL).then((response) => {
            const data = response.data;
            if (data.success && data.data) {
                setOrg(data.data);
            }
        }).catch(() => {});
    };

    useEffect(() => {
        getDetails();
    }, []);

    if (org) {
        return (
            <div className="page-container">
                <div className="page-header">
                    <div>
                        <div className="page-title">{org.name}</div>
                        <div className="page-subtitle">Organisation overview</div>
                    </div>
                    <button className="btn btn-primary" onClick={() => navigate('/projects')}>
                        Go to Projects →
                    </button>
                </div>

                <div className="org-page-grid">
                    <div className="org-info-card">
                        <div className="org-info-card-label">Organisation</div>
                        <div className="org-info-card-value">{org.name}</div>
                    </div>
                    <div className="org-info-card">
                        <div className="org-info-card-label">Domain</div>
                        <div className="org-info-card-value">{org.domain}</div>
                    </div>
                    <div className="org-code-card">
                        <div>
                            <div className="org-info-card-label">Invite Code</div>
                            <div className="org-code-value" style={{ marginTop: '8px' }}>
                                {org.code === 'Blank' ? '—' : org.code}
                            </div>
                        </div>
                        {org.code !== 'Blank' && (
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        `Join our org on Relay!\nDomain: ${org.domain}\nCode: ${org.code}`
                                    );
                                    toast.success('Invite copied to clipboard!');
                                }}
                            >
                                <Copy size={14} /> Copy Invite
                            </button>
                        )}
                    </div>
                </div>

                {org.code === 'Blank' && (
                    <div style={{
                        marginTop: '20px',
                        padding: '14px 18px',
                        background: 'var(--accent-muted)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <Lightbulb size={18} color="var(--accent)" />
                        Only the organisation admin can see the invite code. Ask your admin to share it.
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="page-container" style={{ maxWidth: '520px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div className="page-title" style={{ fontSize: '1.5rem' }}>Get started with an organisation</div>
                <div className="page-subtitle" style={{ marginTop: '6px' }}>
                    Create a new workspace or join an existing one
                </div>
            </div>

            <div className="card">
                <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px', letterSpacing: '-0.01em' }}>
                    Create Organisation
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
                    Set up a new workspace for your team
                </div>

                <div className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Name</label>
                        <input
                            className="input-field"
                            type="text"
                            placeholder="Acme Inc."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Domain</label>
                        <input
                            className="input-field"
                            type="text"
                            placeholder="acme"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                        />
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={createHandler}
                        disabled={loading}
                        style={{ width: '100%' }}
                    >
                        {loading ? 'Creating...' : 'Create Organisation'}
                    </button>
                </div>
            </div>

            <div className="org-divider">or</div>

            <div className="card">
                <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px', letterSpacing: '-0.01em' }}>
                    Join Organisation
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
                    Got an invite? Enter the details below
                </div>

                <div className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Domain</label>
                        <input
                            className="input-field"
                            type="text"
                            placeholder="acme"
                            value={joinDomain}
                            onChange={(e) => setJoinDomain(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Invite Code</label>
                        <input
                            className="input-field"
                            type="password"
                            placeholder="Paste invite code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                    </div>
                    <button
                        className="btn btn-secondary"
                        onClick={joinHandler}
                        disabled={loading}
                        style={{ width: '100%' }}
                    >
                        {loading ? 'Joining...' : 'Join Organisation'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Organisation;