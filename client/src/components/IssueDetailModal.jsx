import { useState, useEffect } from 'react';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { ISSUES_UPDATE_API_URL } from '../utils/constants';
import { STATUS, PRIORITIES } from '../utils/configurations';
import { useUsersStore } from '../stores/usersStore';
import { useAuthStore } from '../stores/authStore';
import { X, Pencil, Trash2, MessageSquare, Send } from 'lucide-react';

const IssueDetailModal = ({ issue, onClose, onUpdated }) => {
    const { users } = useUsersStore();
    const { email } = useAuthStore();
    const [form, setForm] = useState({
        title: issue.title || '',
        description: issue.description || '',
        priority: issue.priority || 'MEDIUM',
        status: issue.status || 'TODO',
        assignee: issue.assignee || '',
    });
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [submittingComment, setSubmittingComment] = useState(false);

    const fetchComments = () => {
        setCommentsLoading(true);
        api.get(`/issue/${issue.id}/comments`)
            .then(res => {
                if (res.data.success) {
                    setComments(res.data.data || []);
                }
            })
            .catch(err => console.error("Failed to fetch comments", err))
            .finally(() => setCommentsLoading(false));
    };

    useEffect(() => {
        fetchComments();
    }, [issue.id]);

    const statusLabels = {
        TODO: 'To Do',
        IN_PROGRESS: 'In Progress',
        IN_REVIEW: 'In Review',
        DONE: 'Done',
    };

    const priorityBadgeClass = {
        URGENT: 'badge badge-urgent',
        HIGH: 'badge badge-high',
        MEDIUM: 'badge badge-medium',
        LOW: 'badge badge-low',
    };

    const handleSave = () => {
        setLoading(true);
        const payload = { ...form };
        if (payload.assignee) {
            payload.assignee = Number(payload.assignee);
        } else {
            payload.assignee = null;
        }

        api.put(`${ISSUES_UPDATE_API_URL}/${issue.id}`, payload)
            .then((res) => {
                if (res.data.success) {
                    toast.success('Task updated!');
                    setEditing(false);
                    if (onUpdated) onUpdated();
                } else {
                    toast.error(res.data.message || 'Update failed');
                }
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || 'Update failed');
            })
            .finally(() => setLoading(false));
    };

    const handleAddComment = () => {
        if (!newComment.trim()) return;
        setSubmittingComment(true);
        api.post(`/issue/${issue.id}/comments`, { text: newComment })
            .then(res => {
                if (res.data.success) {
                    toast.success('Comment added');
                    setNewComment('');
                    fetchComments();
                } else {
                    toast.error(res.data.message || 'Failed to add comment');
                }
            })
            .catch(() => toast.error('Failed to add comment'))
            .finally(() => setSubmittingComment(false));
    };

    const handleDeleteComment = (commentId) => {
        if (!window.confirm("Delete this comment?")) return;
        api.delete(`/issue/${issue.id}/comments/${commentId}`)
            .then(res => {
                if (res.data.success) {
                    toast.success('Comment deleted');
                    fetchComments();
                }
            })
            .catch(() => toast.error('Failed to delete comment'));
    };

    const assigneeObj = users.find(u => String(u.id) === String(form.assignee));
    const displayAssigneeName = assigneeObj ? (assigneeObj.email === email ? 'Me' : assigneeObj.name) : null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
                <div className="modal-header">
                    <div style={{ flex: 1 }}>
                        {issue.slug && (
                            <div className="issue-detail-slug">{issue.slug}</div>
                        )}
                        {editing ? (
                            <input
                                className="input-field"
                                style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '4px', padding: '6px 10px' }}
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                autoFocus
                            />
                        ) : (
                            <div className="issue-detail-title">{form.title}</div>
                        )}
                    </div>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="issue-detail-field">
                        <div className="issue-detail-field-label">Description</div>
                        {editing ? (
                            <textarea
                                className="textarea-field"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="Add a description..."
                            />
                        ) : (
                            <div style={{
                                fontSize: '0.875rem',
                                color: form.description ? 'var(--text-secondary)' : 'var(--text-faint)',
                                lineHeight: 1.6,
                                whiteSpace: 'pre-wrap',
                            }}>
                                {form.description || 'No description provided.'}
                            </div>
                        )}
                    </div>

                    <div className="issue-detail-row">
                        <div className="issue-detail-field">
                            <div className="issue-detail-field-label">Assignee</div>
                            {editing ? (
                                <select
                                    className="select-field"
                                    value={form.assignee || ''}
                                    onChange={(e) => setForm({ ...form, assignee: e.target.value })}
                                >
                                    <option value="">Unassigned</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>{u.email === email ? 'Me' : u.name}</option>
                                    ))}
                                </select>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                                    {displayAssigneeName ? (
                                        <>
                                            <div style={{
                                                width: '24px', height: '24px', borderRadius: '50%',
                                                background: 'var(--accent-muted)', color: 'var(--accent)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: 600, fontSize: '0.7rem'
                                            }}>
                                                {displayAssigneeName.charAt(0).toUpperCase()}
                                            </div>
                                            <span>{displayAssigneeName}</span>
                                        </>
                                    ) : (
                                        <span style={{ color: 'var(--text-faint)', fontStyle: 'italic' }}>Unassigned</span>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="issue-detail-field">
                            <div className="issue-detail-field-label">Status</div>
                            {editing ? (
                                <select
                                    className="select-field"
                                    value={form.status}
                                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                                >
                                    {Object.values(STATUS).map((s) => (
                                        <option key={s} value={s}>{statusLabels[s] || s}</option>
                                    ))}
                                </select>
                            ) : (
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                                    {statusLabels[form.status] || form.status}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="issue-detail-row">
                        <div className="issue-detail-field">
                            <div className="issue-detail-field-label">Priority</div>
                            {editing ? (
                                <select
                                    className="select-field"
                                    value={form.priority}
                                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                                >
                                    {Object.values(PRIORITIES).map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            ) : (
                                <div>
                                    <span className={priorityBadgeClass[form.priority] || 'badge badge-medium'}>
                                        {form.priority}
                                    </span>
                                </div>
                            )}
                        </div>
                        {issue.createdDate && (
                            <div className="issue-detail-field">
                                <div className="issue-detail-field-label">Created</div>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                    {new Date(issue.createdDate).toLocaleDateString('en-US', {
                                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                    })}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="modal-footer" style={{ borderTop: 'none', paddingBottom: '0', marginTop: '10px' }}>
                        {editing ? (
                            <>
                                <button className="btn btn-ghost" onClick={() => {
                                    setEditing(false);
                                    setForm({
                                        title: issue.title || '',
                                        description: issue.description || '',
                                        priority: issue.priority || 'MEDIUM',
                                        status: issue.status || 'TODO',
                                        assignee: issue.assignee || '',
                                    });
                                }}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </>
                        ) : (
                            <button className="btn btn-secondary" onClick={() => setEditing(true)}>
                                <Pencil size={16} /> Edit Details
                            </button>
                        )}
                    </div>

                    {/* COMMENTS SECTION */}
                    {!editing && (
                        <div className="comments-section">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontWeight: 700 }}>
                                <MessageSquare size={18} color="var(--text-secondary)" />
                                Activity & Comments
                            </div>

                            <div className="comment-list">
                                {commentsLoading ? (
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Loading comments...</div>
                                ) : comments.length === 0 ? (
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-faint)', fontStyle: 'italic' }}>No comments yet.</div>
                                ) : (
                                    comments.map(comment => {
                                        const cUser = users.find(u => u.id === comment.userId);
                                        const authorName = cUser ? (cUser.email === email ? 'Me' : cUser.name) : 'Unknown User';
                                        const canDelete = cUser && cUser.email === email;
                                        return (
                                            <div key={comment.id} className="comment-item">
                                                <div className="comment-avatar">
                                                    {authorName.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="comment-content">
                                                    <div className="comment-header">
                                                        <div>
                                                            <span className="comment-author">{authorName}</span>
                                                            <span className="comment-time" style={{ marginLeft: '12px' }}>
                                                                {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                        {canDelete && (
                                                            <button 
                                                                className="btn-ghost" 
                                                                style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-faint)' }}
                                                                onClick={() => handleDeleteComment(comment.id)}
                                                                title="Delete comment"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="comment-text">
                                                        {comment.text}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <div className="comment-input-area">
                                <input
                                    className="input-field"
                                    placeholder="Write a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleAddComment();
                                    }}
                                />
                                <button 
                                    className="btn btn-primary" 
                                    onClick={handleAddComment} 
                                    disabled={submittingComment || !newComment.trim()}
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IssueDetailModal;
