import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    const supabase = createClient()

    const { error } = await supabase
        .from('clips')
        .update({ status: 'rejected' })
        .eq('id', params.id)

    if (error) {
        console.error('Failed to reject clip:', error)
        return new Response('Error rejecting clip', { status: 500 })
    }

    // Redirect back to queue or refresh page
    redirect('/')
}
