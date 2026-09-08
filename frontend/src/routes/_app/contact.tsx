import { createFileRoute } from '@tanstack/react-router'
import ContactPage from '../../components/ContactPage/ContactPage'

export const Route = createFileRoute('/_app/contact')({
    component: ContactPage,
})