import { Outlet } from '@tanstack/react-router'
import Navbar from './Navbar/Navbar'
import Footer from './Footer/Footer'

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