import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function ClipDetail({ params }: { params: { id: string } }) {
    const { id } = await params;
    const supabase = createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    const { data: clip, error } = await supabase
        .from('clips')
        .select('*, workers(*), tasks(*)')
        .eq('id', id)
        .single()

    if (!clip || error) {
        return (
            <div className="p-8">
                <p>Clip not found.</p>
                <Link href="/">
                    <Button variant="outline" className="mt-4">Back to Queue</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto space-y-6">

                <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Queue
                </Link>

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Review Submission</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Submitted on {new Date(clip.created_at).toLocaleString()}</p>
                    </div>
                    <Badge variant={clip.status === 'pending' ? 'secondary' : 'default'} className={clip.status === 'approved' ? 'bg-green-500 hover:bg-green-600' : clip.status === 'rejected' ? 'bg-red-500 hover:bg-red-600' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'}>
                        {clip.status.toUpperCase()}
                    </Badge>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {/* Left Col: Video Player */}
                    <Card className="col-span-2 overflow-hidden bg-black/5 border-none shadow-sm aspect-video relative flex items-center justify-center">
                        <video
                            src={clip.video_url}
                            controls
                            className="w-full h-full object-contain bg-black"
                            poster="/placeholder-video.jpg"
                        >
                            Your browser does not support the video tag.
                        </video>
                    </Card>

                    {/* Right Col: Details & Actions */}
                    <div className="space-y-6">
                        <Card className="p-5 space-y-4 shadow-sm">
                            <div>
                                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Task</h3>
                                <p className="font-medium text-lg">{clip.tasks?.title_en || 'Unknown Task'}</p>
                            </div>

                            <div>
                                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Worker</h3>
                                <p className="font-medium">{clip.workers?.full_name || 'Unknown'}</p>
                                <p className="text-sm text-muted-foreground">{clip.workers?.phone || 'No Phone'}</p>
                                <p className="text-sm text-muted-foreground">Tier {clip.workers?.tier || '1'} • Rating: {clip.workers?.rating || 'N/A'}</p>
                            </div>

                            <div>
                                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Device Metadata</h3>
                                <pre className="text-xs bg-muted p-2 rounded-md overflow-auto max-h-24">
                                    {JSON.stringify(clip.metadata, null, 2)}
                                </pre>
                            </div>
                        </Card>

                        {clip.status === 'pending' && (
                            <Card className="p-5 space-y-3 shadow-sm border-primary/20 bg-primary/5">
                                <h3 className="font-medium">Actions</h3>
                                <form action={`/clips/${clip.id}/approve`} method="POST">
                                    <Button className="w-full bg-green-600 hover:bg-green-700">Approve & Pay</Button>
                                </form>
                                <form action={`/clips/${clip.id}/reject`} method="POST">
                                    <Button variant="destructive" className="w-full">Reject</Button>
                                </form>
                            </Card>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}
