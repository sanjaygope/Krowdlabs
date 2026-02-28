import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import NavBar from '@/components/NavBar'

export default async function TasksPage() {
    const supabase = createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <NavBar />
            <div className="flex-1 p-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
                            <p className="text-muted-foreground mt-1">Manage robot training tasks and configurations.</p>
                        </div>
                        <Button>Create Task</Button>
                    </div>

                    {/* Table View */}
                    <Card className="border shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title (EN)</TableHead>
                                    <TableHead>Payout</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tasks?.map((task: any) => (
                                    <TableRow key={task.id}>
                                        <TableCell className="font-medium">{task.title_en}</TableCell>
                                        <TableCell>₹{task.pay_amount}</TableCell>
                                        <TableCell>
                                            <Badge variant={task.status === 'active' ? 'default' : 'secondary'} className={task.status === 'active' ? 'bg-green-500 hover:bg-green-600' : ''}>
                                                {task.status.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{new Date(task.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm">Edit</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {(!tasks || tasks.length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                            No tasks found.
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
