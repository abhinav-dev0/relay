import { useState, useEffect } from "react";
import {
    DndContext,
    closestCorners,
    useDraggable,
    useDroppable,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { STATUS } from '../utils/configurations';
import { ISSUES_GET_BY_PROJECT_API_URL, ISSUES_UPDATE_API_URL } from '../utils/constants';
import api from '../lib/api';
import toast from 'react-hot-toast';
import IssueDetailModal from './IssueDetailModal';
import { useUsersStore } from '../stores/usersStore';
import { useAuthStore } from '../stores/authStore';

const STATUS_CONFIG = {
    TODO: { label: 'To Do', color: '#6B7280' },
    IN_PROGRESS: { label: 'In Progress', color: '#3B82F6' },
    IN_REVIEW: { label: 'In Review', color: '#8B5CF6' },
    DONE: { label: 'Done', color: '#10B981' },
};

const PRIORITY_BADGE = {
    URGENT: 'badge badge-urgent',
    HIGH: 'badge badge-high',
    MEDIUM: 'badge badge-medium',
    LOW: 'badge badge-low',
};

function IssueCard({ issue, onClick }) {
    const { users } = useUsersStore();
    const email = useAuthStore(state => state.email);
    const assignee = users.find(u => u.id === issue.assignee);
    const assigneeName = assignee ? (assignee.email === email ? 'Me' : assignee.name) : null;

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
    } = useDraggable({
        id: String(issue.id),
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.3 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            className={`issue-card ${isDragging ? 'dragging' : ''}`}
            style={style}
            {...listeners}
            {...attributes}
        >
            <div className="issue-card-clickarea" onClick={() => onClick(issue)}>
                {issue.slug && (
                    <div className="issue-card-slug">{issue.slug}</div>
                )}
                <div className="issue-card-title">{issue.title}</div>
                {issue.description && (
                    <div className="issue-card-desc-preview">
                        {issue.description.length > 60
                            ? issue.description.substring(0, 60) + '...'
                            : issue.description}
                    </div>
                )}
            </div>
            <div className="issue-card-meta">
                <span className={PRIORITY_BADGE[issue.priority] || 'badge badge-medium'}>
                    {issue.priority}
                </span>
                {assigneeName && (
                    <div className="issue-card-assignee" title={`Assigned to ${assigneeName}`}>
                        <div className="issue-card-assignee-avatar">
                            {assigneeName.charAt(0).toUpperCase()}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function BoardColumn({ id, config, issues, onCardClick }) {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div className="board-column">
            <div className="board-column-header">
                <div className="board-column-title">
                    <div className="board-column-dot" style={{ background: config.color }} />
                    {config.label}
                </div>
                <span className="board-column-count">{issues.length}</span>
            </div>
            <div
                ref={setNodeRef}
                className={`board-column-body ${isOver ? 'drag-over' : ''}`}
            >
                {issues.length === 0 ? (
                    <div className="board-column-empty">
                        No tasks
                    </div>
                ) : (
                    issues.map((issue) => (
                        <IssueCard
                            key={issue.id}
                            issue={issue}
                            onClick={onCardClick}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default function Kanban({ projectId, refreshKey }) {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIssue, setSelectedIssue] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const fetchIssues = () => {
        if (!projectId) return;
        setLoading(true);
        api.get(`${ISSUES_GET_BY_PROJECT_API_URL}?projectId=${projectId}`)
            .then((res) => {
                if (res.data.success) {
                    setIssues(res.data.data || []);
                }
            })
            .catch((err) => {
                console.error('Failed to fetch issues:', err);
                toast.error('Failed to load tasks');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchIssues();
    }, [projectId, refreshKey]);

    function handleDragEnd(event) {
        const issueId = event.active.id;
        const newStatus = event.over?.id;

        if (!newStatus) return;

        const issue = issues.find((i) => String(i.id) === issueId);
        if (!issue || issue.status === newStatus) return;

        // Optimistic update
        setIssues((prev) =>
            prev.map((i) =>
                String(i.id) === issueId ? { ...i, status: newStatus } : i
            )
        );

        // Persist to server
        api.put(`${ISSUES_UPDATE_API_URL}/${issue.id}`, { status: newStatus })
            .then((res) => {
                if (!res.data.success) {
                    setIssues((prev) =>
                        prev.map((i) =>
                            String(i.id) === issueId ? { ...i, status: issue.status } : i
                        )
                    );
                    toast.error('Failed to update status');
                }
            })
            .catch(() => {
                setIssues((prev) =>
                    prev.map((i) =>
                        String(i.id) === issueId ? { ...i, status: issue.status } : i
                    )
                );
                toast.error('Failed to update status');
            });
    }

    const handleCardClick = (issue) => {
        setSelectedIssue(issue);
    };

    const handleIssueUpdated = () => {
        setSelectedIssue(null);
        fetchIssues();
    };

    if (loading) {
        return (
            <div className="board-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <span>Loading tasks...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragEnd={handleDragEnd}
            >
                <div className="board-container">
                    {Object.entries(STATUS).map(([key, status]) => {
                        const config = STATUS_CONFIG[status] || { label: status, color: '#6B7280' };
                        const columnIssues = issues.filter((i) => i.status === status);
                        return (
                            <BoardColumn
                                key={status}
                                id={status}
                                config={config}
                                issues={columnIssues}
                                onCardClick={handleCardClick}
                            />
                        );
                    })}
                </div>
            </DndContext>

            {selectedIssue && (
                <IssueDetailModal
                    issue={selectedIssue}
                    onClose={() => setSelectedIssue(null)}
                    onUpdated={handleIssueUpdated}
                />
            )}
        </>
    );
}