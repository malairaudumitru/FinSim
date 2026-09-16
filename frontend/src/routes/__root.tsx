import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import NotFoundPage from '../components/NotFoundPage/NotFoundPage'
import { ErrorModalProvider } from '../shared/ErrorModalContext/ErrorModalProvider'
export const Route = createRootRoute({
    component: () => (
        <ErrorModalProvider>
            <Outlet />
            <TanStackRouterDevtools />
        </ErrorModalProvider>
    ),
    notFoundComponent: NotFoundPage,
})