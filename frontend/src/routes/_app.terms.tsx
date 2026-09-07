import { createFileRoute } from '@tanstack/react-router'
import TermsPage from '../components/TermsPage/TermsPage'

export const Route = createFileRoute('/_app/terms')({
  component: TermsPage,
})