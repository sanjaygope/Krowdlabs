import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function SuccessScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={s.container}>
            <View style={s.content}>
                <View style={s.iconCircle}>
                    <Text style={{ fontSize: 64 }}>🎉</Text>
                </View>

                <Text style={s.title}>Submitted Successfully!</Text>
                <Text style={s.subtitle}>
                    Your video is now under review. We will notify you via push notification once it's approved and payment is initiated!
                </Text>

                <TouchableOpacity style={s.button} onPress={() => router.replace('/(app)/home')}>
                    <Text style={s.buttonText}>Back to Home</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
    iconCircle: { width: '100%', aspectRatio: 1, backgroundColor: 'rgba(52,168,83,0.1)', borderRadius: 999, alignItems: 'center', justifyContent: 'center', marginBottom: 32, maxWidth: 250 },
    title: { fontSize: 30, fontWeight: 'bold', color: '#212121', textAlign: 'center', marginBottom: 16 },
    subtitle: { fontSize: 18, color: '#757575', textAlign: 'center', marginBottom: 40, paddingHorizontal: 16 },
    button: { backgroundColor: '#2E75B6', width: '100%', paddingVertical: 16, borderRadius: 12, alignItems: 'center', elevation: 2 },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
