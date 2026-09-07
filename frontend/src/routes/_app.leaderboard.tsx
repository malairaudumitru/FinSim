import { createFileRoute } from '@tanstack/react-router'
import LeaderboardPage from '../components/LeaderboardPage/LeaderboardPage.tsx'

export const Route = createFileRoute('/_app/leaderboard')({
    component: LeaderboardPage,
})