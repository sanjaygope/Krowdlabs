import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    const supabase = await createClient()

    // 1. Mark Clip as Approved
    const { error: updateError } = await supabase
        .from('clips')
        .update({ status: 'approved' })
        .eq('id', params.id)

    if (updateError) {
        console.error('Failed to approve clip:', updateError)
        return new Response('Error approving clip', { status: 500 })
    }

    // 2. Simulate Razorpay Payout (Insert into Payments)
    // First fetch the clip and task to know how much to pay the worker, and their push token
    const { data: clipData } = await supabase
        .from('clips')
        .select('worker_id, task_id, tasks(pay_amount, title_en), workers(push_token)')
        .eq('id', params.id)
        .single()

    if (clipData && clipData.worker_id) {
        // Simulated arbitrary Razorpay Ref ID
        const fakeUpiRef = `rzp_test_payout_${Math.random().toString(36).substring(7)}`

        const amountToPay = clipData.tasks?.pay_amount || 600

        const { error: paymentError } = await supabase
            .from('payments')
            .insert({
                worker_id: clipData.worker_id,
                clip_id: params.id,
                amount: amountToPay,
                status: 'completed',
                upi_ref: fakeUpiRef
            })

        if (paymentError) {
            console.error('Error simulating payment record:', paymentError)
            // In a real app we might not want to fail the approval entirely if payment fails, 
            // but instead mark the payment as "failed" to retry later.
        } else {
            // 3. Send Push Notification to Worker
            const pushToken = clipData.workers?.push_token;
            if (pushToken) {
                const message = {
                    to: pushToken,
                    sound: 'default',
                    title: 'Payment Received! 💸',
                    body: `Your video for "${clipData.tasks?.title_en || 'a task'}" was approved. ₹${amountToPay} has been added to your earnings.`,
                    data: { route: '/(app)/earnings' },
                };

                try {
                    await fetch('https://exp.host/--/api/v2/push/send', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Accept-encoding': 'gzip, deflate',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(message),
                    });
                } catch (pushErr) {
                    console.error("Failed to send push notification:", pushErr);
                }
            }
        }
    }

    // Redirect back to queue or refresh page
    redirect('/')
}
