import { createFileRoute } from '@tanstack/react-router'
import ScenariosListPage from '../../../components/ScenariosListPage/ScenariosListPage'

export const Route = createFileRoute('/_app/scenarios/')({
    component: ScenariosListPage,
})
