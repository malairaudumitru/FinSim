import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import NotFoundPage from '../components/NotFoundPage/NotFoundPage'
export const Route = createRootRoute({
    component: () => (
        <>
            <Outlet />
            <TanStackRouterDevtools />
        </>
    ),
    notFoundComponent: NotFoundPage,
})