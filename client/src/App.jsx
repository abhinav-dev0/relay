import { BrowserRouter, Routes, Route } from 'react-router';
import Home from './pages/Home';
import Board from './pages/Board';
import Organisation from './pages/Organisation';
import { Toaster } from 'react-hot-toast';
import Projects from './pages/Projects';
import Layout from './components/Layout';

const App = () => {
    return (
        <>
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        background: '#18181b',
                        color: '#fafafa',
                        border: '1px solid #27272a',
                        fontSize: '0.875rem',
                    },
                }}
            />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/tenant" element={<Layout><Organisation /></Layout>} />
                    <Route path="/projects" element={<Layout><Projects /></Layout>} />
                    <Route path="/board/:projectId" element={<Layout><Board /></Layout>} />
                    <Route path="*" element={
                        <Layout>
                            <div className="empty-state" style={{ minHeight: '60vh' }}>
                                <div className="empty-state-icon">🔍</div>
                                <div className="empty-state-text">404 — Page not found</div>
                                <div className="empty-state-sub">The page you're looking for doesn't exist.</div>
                            </div>
                        </Layout>
                    } />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App