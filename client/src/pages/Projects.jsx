import { useState, useEffect } from 'react';
import { useProjectStore } from '../stores/projectsStore';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { PROJECTS_CREATE_API_URL, PROJECTS_GET_ALL_API_URL } from '../utils/constants';
import { useNavigate } from 'react-router';
import { FolderGit2, Plus, ArrowRight, ClipboardList } from 'lucide-react';

const Projects = () => {
    const { projects, setProjects } = useProjectStore();
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchProjects = () => {
        api.get(PROJECTS_GET_ALL_API_URL).then(res => {
            if (res.data.success) {
                setProjects(res.data.data || []);
            } else {
                toast.error(res.data.message);
            }
        }).catch(err => {
            console.error(err);
            toast.error('Failed to load projects');
        });
    };

    const createProject = () => {
        if (!projectName) {
            toast.error('Project name is required');
            return;
        }
        setLoading(true);
        api.post(PROJECTS_CREATE_API_URL, {
            name: projectName,
            description: projectDescription
        }).then(res => {
            if (res.data.success) {
                toast.success('Project created!');
                setProjectName('');
                setProjectDescription('');
                setShowForm(false);
                fetchProjects();
            } else {
                toast.error(res.data.message);
            }
        }).catch(err => {
            console.error(err);
            toast.error('Failed to create project');
        }).finally(() => setLoading(false));
    };

    const getSlug = (name) => {
        return name ? name.substring(0, 3).toUpperCase() : '???';
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <div className="page-title">Projects</div>
                    <div className="page-subtitle">{projects.length} project{projects.length !== 1 ? 's' : ''}</div>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                    <Plus size={18} /> New Project
                </button>
            </div>

            <div className="projects-grid">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="project-card"
                        onClick={() => navigate(`/board/${project.id}`)}
                    >
                        <div className="project-card-header">
                            <div className="project-card-icon">
                                <FolderGit2 size={24} strokeWidth={1.5} />
                            </div>
                            <div className="project-card-name">{project.name}</div>
                        </div>
                        {project.description && (
                            <div className="project-card-desc">{project.description}</div>
                        )}
                        <div className="project-card-footer">
                            <span className="project-card-slug">{getSlug(project.name)}-*</span>
                            <span className="project-card-arrow"><ArrowRight size={18} /></span>
                        </div>
                    </div>
                ))}

                {/* Create new project card */}
                {!showForm ? (
                    <div className="create-project-card">
                        <button className="create-project-trigger" onClick={() => setShowForm(true)}>
                            <Plus size={20} /> Create a project
                        </button>
                    </div>
                ) : (
                    <div className="create-project-card" style={{ borderStyle: 'solid', borderColor: 'var(--accent)' }}>
                        <div style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '8px' }}>
                            New Project
                        </div>
                        <div className="form-group">
                            <label className="form-label">Name</label>
                            <input
                                className="input-field"
                                type="text"
                                placeholder="My Project"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <input
                                className="input-field"
                                type="text"
                                placeholder="What is this project about?"
                                value={projectDescription}
                                onChange={(e) => setProjectDescription(e.target.value)}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={createProject}
                                disabled={loading}
                                style={{ flex: 1 }}
                            >
                                {loading ? 'Creating...' : 'Create'}
                            </button>
                            <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => { setShowForm(false); setProjectName(''); setProjectDescription(''); }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {projects.length === 0 && !showForm && (
                <div className="empty-state" style={{ marginTop: '40px' }}>
                    <div className="empty-state-icon"><ClipboardList size={48} strokeWidth={1} /></div>
                    <div className="empty-state-text">No projects yet</div>
                    <div className="empty-state-sub">Create your first project to start tracking work.</div>
                </div>
            )}
        </div>
    );
};

export default Projects;