import { createFileRoute } from '@tanstack/react-router'
import ScenarioPlayPage from '../../../components/ScenarioPlayPage/ScenarioPlayPage'

export const Route = createFileRoute('/_app/scenarios/$slug')({
    component: ScenarioPlayPage,
})