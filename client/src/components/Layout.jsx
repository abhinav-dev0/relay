import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div className="page-layout">
            <Navbar />
            <main className="page-main">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
