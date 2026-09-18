import { Outlet } from '@tanstack/react-router'
import Navbar from '../Navbar/Navbar.tsx'
import Footer from '../Footer/Footer.tsx'

function AppLayout() {
    return (
        <div className="page">
            <Navbar />
            <main className="page-main">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default AppLayout