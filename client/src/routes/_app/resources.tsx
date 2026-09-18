import { createFileRoute } from '@tanstack/react-router'
import ResourcesPage from '../../components/ResourcesPage/ResourcesPage'

export const Route = createFileRoute('/_app/resources')({
  component: ResourcesPage,
})
