import { createFileRoute } from '@tanstack/react-router'
import AboutPage from '../components/AboutPage/AboutPage'

export const Route = createFileRoute('/_app/about')({
  component: AboutPage,
})