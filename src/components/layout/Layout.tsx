import Footer from "./Footer";
import Header from "./Header";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }) => {
    return (
        <div>
            <Header />
            <main>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;