import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import NavBar from '@/components/NavBar'
import { Activity, Users, Video, CreditCard } from 'lucide-react'

export default async function AnalyticsPage() {
    const supabase = createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    // Fetch aggregate data
    const { count: workersCount } = await supabase.from('workers').select('*', { count: 'exact', head: true })
    const { count: tasksCount } = await supabase.from('tasks').select('*', { count: 'exact', head: true })
    const { count: clipsCount } = await supabase.from('clips').select('*', { count: 'exact', head: true })
    const { count: pendingClipsCount } = await supabase.from('clips').select('*', { count: 'exact', head: true }).eq('status', 'pending')

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <NavBar />
            <div className="flex-1 p-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
                        <p className="text-muted-foreground mt-1">Overview of marketplace activity and metrics.</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{workersCount || 0}</div>
                                <p className="text-xs text-muted-foreground">Registered on platform</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{tasksCount || 0}</div>
                                <p className="text-xs text-muted-foreground">Available for workers</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Clips Submitted</CardTitle>
                                <Video className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{clipsCount || 0}</div>
                                <p className="text-xs text-muted-foreground">Across all tasks</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{pendingClipsCount || 0}</div>
                                <p className="text-xs text-muted-foreground">Awaiting admin approval</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Placeholder for future charts */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Submission Activity (Coming Soon)</CardTitle>
                            </CardHeader>
                            <CardContent className="pl-2 flex h-[300px] items-center justify-center border-t border-dashed m-6 mt-0">
                                <p className="text-muted-foreground">Chart area</p>
                            </CardContent>
                        </Card>
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Recent Payouts (Coming Soon)</CardTitle>
                            </CardHeader>
                            <CardContent className="flex h-[300px] items-center justify-center border-t border-dashed m-6 mt-0">
                                <p className="text-muted-foreground">Payout list area</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
