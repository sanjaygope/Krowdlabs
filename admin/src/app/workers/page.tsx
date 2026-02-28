import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import NavBar from '@/components/NavBar'

export default async function WorkersPage() {
    const supabase = createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    const { data: workers, error } = await supabase
        .from('workers')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <NavBar />
            <div className="flex-1 p-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Workers</h1>
                        <p className="text-muted-foreground mt-1">Manage and view all registered platform workers.</p>
                    </div>

                    {/* Table View */}
                    <Card className="border shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Full Name</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>City</TableHead>
                                    <TableHead>Language</TableHead>
                                    <TableHead>Tier / Rating</TableHead>
                                    <TableHead>Joined</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {workers?.map((worker: any) => (
                                    <TableRow key={worker.id}>
                                        <TableCell className="font-medium">{worker.full_name || 'Incomplete Profile'}</TableCell>
                                        <TableCell>{worker.phone}</TableCell>
                                        <TableCell>{worker.city || 'N/A'}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{worker.language.toUpperCase()}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            Tier {worker.tier} • {worker.rating} ★
                                        </TableCell>
                                        <TableCell>{new Date(worker.created_at).toLocaleDateString()}</TableCell>
                                    </TableRow>
                                ))}
                                {(!workers || workers.length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                            No workers found.
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
