import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import NavBar from '@/components/NavBar'

// This will be replaced by actual Supabase fetching
// const MOCK_CLIPS = [
//     { id: '1', workerName: 'Priya Sharma', taskTitle: 'Fold 5 T-Shirts', status: 'pending', duration: '1:12', createdAt: '10 mins ago' },
//     { id: '2', workerName: 'Rahul Khanna', taskTitle: 'Pour Water', status: 'pending', duration: '0:45', createdAt: '25 mins ago' },
//     { id: '3', workerName: 'Sunita Patel', taskTitle: 'Fold 5 T-Shirts', status: 'approved', duration: '1:30', createdAt: '2 hours ago' },
// ]

export default async function Home() {
    const supabase = createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    // Fetch actual data
    const { data: clips, error } = await supabase
        .from('clips')
        .select('*, workers(full_name), tasks(title_en)')
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <NavBar />
            <div className="flex-1 p-8">
                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Review Queue</h1>
                            <p className="text-muted-foreground mt-1">Review and approve videos submitted by workers.</p>
                        </div>
                    </div>

                    {/* Optional Search / Filters can go here */}

                    {/* Table View */}
                    <Card className="border shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Worker</TableHead>
                                    <TableHead>Task</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Submitted</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clips?.map((clip: any) => (
                                    <TableRow key={clip.id}>
                                        <TableCell className="font-medium">{clip.workers?.full_name || 'Unknown'}</TableCell>
                                        <TableCell>{clip.tasks?.title_en || 'Unknown Task'}</TableCell>
                                        <TableCell>0:15</TableCell>
                                        <TableCell>{new Date(clip.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={clip.status === 'pending' ? 'secondary' : 'default'} className={clip.status === 'approved' ? 'bg-green-500 hover:bg-green-600' : clip.status === 'rejected' ? 'bg-red-500 hover:bg-red-600' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'}>
                                                {clip.status.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <a href={`/clips/${clip.id}`}>
                                                <Button variant="outline" size="sm">
                                                    {clip.status === 'pending' ? 'Review' : 'View'}
                                                </Button>
                                            </a>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {(!clips || clips.length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                            No clips in queue.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Card>

                </div>
            </div>
        </div>
    )
}
