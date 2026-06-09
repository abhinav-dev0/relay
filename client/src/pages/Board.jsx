import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import Kanban from '../components/Kanban';
import CreateIssue from '../components/CreateIssue';
import { ArrowLeft, Plus } from 'lucide-react';
import api from '../lib/api';
import { TENANT_USERS_API_URL } from '../utils/constants';
import { useProjectStore } from '../stores/projectsStore';
import { useUsersStore } from '../stores/usersStore';

const Board = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [showCreateIssue, setShowCreateIssue] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const { setUsers } = useUsersStore();
    const { projects } = useProjectStore();

    const currentProject = projects.find(p => String(p.id) === String(projectId));
    const projectName = currentProject ? currentProject.name : 'Board';

    useEffect(() => {
        // Fetch all tenant users when board loads so we can resolve assignee IDs
        api.get(TENANT_USERS_API_URL).then(res => {
            if (res.data.success) {
                setUsers(res.data.data || []);
            }
        }).catch(err => console.error("Failed to fetch tenant users", err));
    }, [setUsers]);

    const handleIssueCreated = useCallback(() => {
        setShowCreateIssue(false);
        setRefreshKey(k => k + 1);
    }, []);

    return (
        <div className="board-page">
            <div className="board-header">
                <div className="board-header-left">
                    <button
                        className="board-header-back"
                        onClick={() => navigate('/projects')}
                        title="Back to projects"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <div className="board-title">{projectName}</div>
                    </div>
                </div>
                <button className="btn btn-primary" onClick={() => setShowCreateIssue(true)}>
                    <Plus size={18} /> Create Task
                </button>
            </div>

            <Kanban projectId={projectId} refreshKey={refreshKey} />

            {showCreateIssue && (
                <CreateIssue
                    projectId={projectId}
                    onClose={() => setShowCreateIssue(false)}
                    onCreated={handleIssueCreated}
                />
            )}
        </div>
    );
};

export default Board;