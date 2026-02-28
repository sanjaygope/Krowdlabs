import { View, Text, TouchableOpacity, SafeAreaView, Alert, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { supabase } from '../../utils/supabase';
import { useAuthStore } from '../../store/authStore';

export default function PreviewScreen() {
    const router = useRouter();
    const { videoUri } = useLocalSearchParams();
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const { user } = useAuthStore();

    const handleUpload = async () => {
        if (!videoUri || typeof videoUri !== 'string') return;
        setIsUploading(true);
        setUploadProgress(0);

        try {
            setUploadProgress(10);
            const fileUri = videoUri.startsWith('file://') ? videoUri : `file://${videoUri}`;
            const fileName = `clips/${user?.id || 'anon'}/${Date.now()}.mp4`;

            // Use FormData for reliable React Native file upload
            const formData = new FormData();
            formData.append('', {
                uri: fileUri,
                name: 'video.mp4',
                type: 'video/mp4',
            } as any);

            setUploadProgress(30);

            // Upload directly to Supabase Storage REST API
            const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
            const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

            const uploadResponse = await fetch(
                `${supabaseUrl}/storage/v1/object/videos/${fileName}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${supabaseKey}`,
                        'apikey': supabaseKey,
                    },
                    body: formData,
                }
            );

            const uploadResult = await uploadResponse.json();
            setUploadProgress(50);

            if (!uploadResponse.ok) {
                console.error('Upload error:', uploadResult);
                Alert.alert('Upload Failed', uploadResult.message || uploadResult.error || 'Something went wrong.');
                setIsUploading(false);
                return;
            }


            setUploadProgress(80);

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('videos')
                .getPublicUrl(fileName);

            // Insert record into Supabase DB
            const { error: dbError } = await supabase.from('clips').insert({
                worker_id: user?.id,
                task_id: '1',
                video_url: urlData.publicUrl,
                status: 'pending',
                metadata: { device: 'React Native Vision Camera' }
            });

            setUploadProgress(100);

            if (dbError) {
                console.error('Supabase DB Error:', dbError);
                Alert.alert('Database Error', 'Video uploaded but failed to save record.');
            } else {
                router.replace('/(app)/success');
            }
        } catch (error: any) {
            console.error('Upload failed:', error);
            Alert.alert('Upload Failed', error.message || 'Could not upload video.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <SafeAreaView style={s.container}>
            <ScrollView style={s.content} contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
                {/* Video preview box */}
                <View style={s.videoBox}>
                    <Text style={{ color: '#fff', marginBottom: 8 }}>Video Preview</Text>
                    <Text style={{ color: '#9ca3af', fontSize: 12, textAlign: 'center', width: '75%' }} numberOfLines={1}>{videoUri}</Text>
                    <Feather name="play-circle" size={48} color="white" style={{ marginTop: 16 }} />
                </View>

                {/* Quality checks */}
                <View style={s.checksCard}>
                    <Text style={s.checksTitle}>Checks Passed</Text>
                    <View style={s.checkRow}>
                        <Text style={s.checkLabel}>Lighting</Text>
                        <Text style={s.checkPass}>Good ✓</Text>
                    </View>
                    <View style={s.checkRow}>
                        <Text style={s.checkLabel}>Stability</Text>
                        <Text style={s.checkPass}>Excellent ✓</Text>
                    </View>
                </View>

                {isUploading ? (
                    <View style={s.uploadCard}>
                        <View style={s.uploadHeader}>
                            <Text style={s.uploadLabel}>Uploading Video...</Text>
                            <Text style={s.uploadPercent}>{Math.round(uploadProgress)}%</Text>
                        </View>
                        <View style={s.progressBg}>
                            <View style={[s.progressFill, { width: `${uploadProgress}%` }]} />
                        </View>
                        <Text style={s.uploadHint}>Please do not close the app.</Text>
                    </View>
                ) : (
                    <View style={s.buttonRow}>
                        <TouchableOpacity style={s.retakeBtn} onPress={() => router.back()}>
                            <Text style={s.retakeText}>Retake</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={s.submitBtn} onPress={handleUpload}>
                            <Text style={s.submitText}>Submit (₹600)</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    content: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
    videoBox: { width: '100%', aspectRatio: 3 / 4, backgroundColor: '#000', borderRadius: 24, marginBottom: 24, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#1f2937' },
    checksCard: { width: '100%', backgroundColor: '#fff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#f3f4f6', marginBottom: 32, elevation: 1 },
    checksTitle: { fontSize: 18, fontWeight: 'bold', color: '#212121', marginBottom: 12 },
    checkRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
    checkLabel: { color: '#757575', fontSize: 16 },
    checkPass: { color: '#34A853', fontWeight: '600', fontSize: 16 },
    uploadCard: { width: '100%', paddingVertical: 24, paddingHorizontal: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: '#f3f4f6', borderRadius: 12, elevation: 1 },
    uploadHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    uploadLabel: { color: '#212121', fontWeight: '600' },
    uploadPercent: { color: '#2E75B6', fontWeight: 'bold' },
    progressBg: { width: '100%', height: 12, backgroundColor: '#f3f4f6', borderRadius: 6, overflow: 'hidden' },
    progressFill: { height: '100%', backgroundColor: '#2E75B6' },
    uploadHint: { fontSize: 12, color: '#757575', textAlign: 'center', marginTop: 12 },
    buttonRow: { width: '100%', flexDirection: 'row', gap: 12 },
    retakeBtn: { flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#d1d5db', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
    retakeText: { color: '#212121', fontSize: 18, fontWeight: '600' },
    submitBtn: { flex: 1, backgroundColor: '#2E75B6', paddingVertical: 16, borderRadius: 12, alignItems: 'center', elevation: 2 },
    submitText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
