import { useState } from 'react';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { ISSUES_CREATE_API_URL } from '../utils/constants';
import { STATUS, PRIORITIES } from '../utils/configurations';
import { X, User } from 'lucide-react';
import { useUsersStore } from '../stores/usersStore';

const CreateIssue = ({ projectId, onClose, onCreated }) => {
    const { users } = useUsersStore();
    const [issue, setIssue] = useState({
        projectId: Number(projectId),
        title: '',
        description: '',
        priority: 'MEDIUM',
        status: 'TODO',
        assignee: '', // New field
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!issue.title.trim()) {
            toast.error('Title is required');
            return;
        }
        setLoading(true);
        
        const payload = { ...issue };
        if (payload.assignee) {
            payload.assignee = Number(payload.assignee);
        } else {
            payload.assignee = null;
        }

        api.post(ISSUES_CREATE_API_URL, payload)
            .then((res) => {
                if (res.data.success) {
                    toast.success('Task created!');
                    if (onCreated) onCreated();
                } else {
                    toast.error(res.data.message || 'Failed to create task');
                }
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || 'Failed to create task');
            })
            .finally(() => setLoading(false));
    };

    const statusLabels = {
        TODO: 'To Do',
        IN_PROGRESS: 'In Progress',
        IN_REVIEW: 'In Review',
        DONE: 'Done',
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title">Create Task</div>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="form-label">Title</label>
                            <input
                                className="input-field"
                                type="text"
                                placeholder="What needs to be done?"
                                value={issue.title}
                                onChange={(e) => setIssue({ ...issue, title: e.target.value })}
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                className="textarea-field"
                                placeholder="Add more details..."
                                value={issue.description}
                                onChange={(e) => setIssue({ ...issue, description: e.target.value })}
                            />
                        </div>

                        <div className="issue-detail-row">
                            <div className="form-group">
                                <label className="form-label">Assignee</label>
                                <select
                                    className="select-field"
                                    value={issue.assignee}
                                    onChange={(e) => setIssue({ ...issue, assignee: e.target.value })}
                                >
                                    <option value="">Unassigned</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Priority</label>
                                <select
                                    className="select-field"
                                    value={issue.priority}
                                    onChange={(e) => setIssue({ ...issue, priority: e.target.value })}
                                >
                                    {Object.values(PRIORITIES).map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group" style={{ width: '48%' }}>
                            <label className="form-label">Status</label>
                            <select
                                className="select-field"
                                value={issue.status}
                                onChange={(e) => setIssue({ ...issue, status: e.target.value })}
                            >
                                {Object.values(STATUS).map((s) => (
                                    <option key={s} value={s}>{statusLabels[s] || s}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-ghost" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateIssue;
