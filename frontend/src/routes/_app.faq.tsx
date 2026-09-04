import { createFileRoute } from '@tanstack/react-router'
import HelpPage from '../components/HelpPage/HelpPage'

export const Route = createFileRoute('/_app/faq')({
  component: HelpPage,
})