import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NavBar() {
    return (
        <div className="bg-white border-b px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
                <Link href="/" className="font-bold text-xl tracking-tight">RobotApp Admin</Link>
                <div className="flex gap-4">
                    <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary">Review Queue</Link>
                    <Link href="/workers" className="text-sm font-medium text-muted-foreground hover:text-primary">Workers</Link>
                    <Link href="/tasks" className="text-sm font-medium text-muted-foreground hover:text-primary">Tasks</Link>
                    <Link href="/analytics" className="text-sm font-medium text-muted-foreground hover:text-primary">Analytics</Link>
                </div>
            </div>
            <div className="flex gap-4">
                <form action="/auth/signout" method="post">
                    <Button variant="outline" size="sm">Sign Out</Button>
                </form>
            </div>
        </div>
    )
}
