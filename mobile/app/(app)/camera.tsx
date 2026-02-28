import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Accelerometer, AccelerometerMeasurement } from 'expo-sensors';

export default function CameraScreen() {
    const router = useRouter();
    const device = useCameraDevice('back');
    const { hasPermission, requestPermission } = useCameraPermission();
    const camera = useRef<Camera>(null);

    const [isRecording, setIsRecording] = useState(false);
    const [videoUri, setVideoUri] = useState<string | null>(null);
    const [isStable, setIsStable] = useState(true);

    useEffect(() => {
        Accelerometer.setUpdateInterval(500);
        const subscription = Accelerometer.addListener((data: AccelerometerMeasurement) => {
            const magnitude = Math.sqrt(data.x * data.x + data.y * data.y + data.z * data.z);
            const stable = magnitude > 0.9 && magnitude < 1.15;
            setIsStable(stable);
        });
        return () => subscription.remove();
    }, []);

    if (!hasPermission) {
        return (
            <View style={s.centerBlack}>
                <Text style={s.whiteText}>Camera permission is required to record tasks.</Text>
                <TouchableOpacity style={s.permBtn} onPress={requestPermission}>
                    <Text style={s.whiteBold}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (device == null) {
        return (
            <View style={s.centerBlack}>
                <Text style={s.whiteText}>No back camera available...</Text>
            </View>
        );
    }

    const handleRecord = async () => {
        if (!camera.current) return;
        if (isRecording) {
            await camera.current.stopRecording();
            setIsRecording(false);
        } else {
            if (!isStable) {
                console.log("Cannot start recording while unstable.");
                return;
            }
            setIsRecording(true);
            camera.current.startRecording({
                videoCodec: 'h264',
                onRecordingFinished: (video) => {
                    setVideoUri(video.path);
                    router.push({ pathname: '/(app)/preview', params: { videoUri: video.path } });
                },
                onRecordingError: (error) => console.error('Recording Error:', error),
            });
        }
    };

    return (
        <View style={s.flex1Black}>
            <Camera
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                video={true}
                audio={false}
            />

            {/* Top bar */}
            <View style={s.topBar}>
                <TouchableOpacity onPress={() => router.back()} style={s.closeBtn}>
                    <Feather name="x" size={24} color="white" />
                </TouchableOpacity>
                {isRecording && (
                    <View style={s.recBadge}>
                        <View style={s.recDot} />
                        <Text style={s.whiteBold}>REC</Text>
                    </View>
                )}
            </View>

            {/* Guide overlays */}
            <View style={s.guidesRow}>
                <View style={[s.guidePill, { backgroundColor: isStable ? 'rgba(52,168,83,0.8)' : 'rgba(234,67,53,0.8)' }]}>
                    <Text style={s.guideText}>{isStable ? '✓ Stable' : '⚠️ Hold Steady'}</Text>
                </View>
                <View style={[s.guidePill, { backgroundColor: 'rgba(52,168,83,0.8)' }]}>
                    <Text style={s.guideText}>☀️ Good Light</Text>
                </View>
            </View>

            {/* Record button */}
            <View style={s.recordArea}>
                <TouchableOpacity
                    onPress={handleRecord}
                    disabled={!isStable && !isRecording}
                    style={[s.recordBtn, {
                        borderColor: isRecording ? '#ef4444' : (!isStable ? '#6b7280' : '#ffffff'),
                        opacity: !isStable && !isRecording ? 0.5 : 1,
                    }]}
                >
                    <View style={[
                        isRecording ? s.recordInnerStop : s.recordInnerCircle,
                        { backgroundColor: isRecording ? '#ef4444' : (!isStable ? '#6b7280' : '#ef4444') }
                    ]} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const s = StyleSheet.create({
    flex1Black: { flex: 1, backgroundColor: '#000' },
    centerBlack: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', paddingHorizontal: 24 },
    whiteText: { color: '#fff', fontSize: 16, textAlign: 'center', marginBottom: 24 },
    whiteBold: { color: '#fff', fontWeight: 'bold' },
    permBtn: { backgroundColor: '#2E75B6', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
    topBar: { position: 'absolute', top: 48, width: '100%', paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 },
    closeBtn: { padding: 8, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 999 },
    recBadge: { backgroundColor: 'rgba(239,68,68,0.8)', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 999, flexDirection: 'row', alignItems: 'center' },
    recDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff', marginRight: 8 },
    guidesRow: { position: 'absolute', bottom: 160, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 12 },
    guidePill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, flexDirection: 'row', alignItems: 'center' },
    guideText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    recordArea: { position: 'absolute', bottom: 48, width: '100%', alignItems: 'center', zIndex: 10 },
    recordBtn: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 4 },
    recordInnerCircle: { width: 64, height: 64, borderRadius: 32 },
    recordInnerStop: { width: 32, height: 32, borderRadius: 6 },
});
