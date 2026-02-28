import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Switch, ActivityIndicator, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';

export default function ProfileSetup() {
    const router = useRouter();
    const { user, completeSetup, isLoading } = useAuthStore();

    const [name, setName] = useState(user?.name || '');
    const [city, setCity] = useState('');
    const [upiId, setUpiId] = useState('');
    const [isHindi, setIsHindi] = useState(false);

    const handleFinish = async () => {
        if (!user || !user.id || !user.phone) {
            console.error("Missing user basic auth data");
            return;
        }
        await completeSetup({
            id: user.id,
            phone: user.phone,
            name,
            city,
            upi_id: upiId,
            language: isHindi ? 'hi' : 'en'
        });
        router.replace('/(app)/home');
    };

    return (
        <SafeAreaView style={s.container}>
            <View style={s.content}>
                <Text style={s.title}>Complete Profile</Text>
                <Text style={s.subtitle}>We need a few more details to send you payments.</Text>

                <View style={s.fieldGroup}>
                    <Text style={s.label}>Full Name</Text>
                    <TextInput style={s.input} placeholder="Priya Sharma" placeholderTextColor="#9ca3af" value={name} onChangeText={setName} />
                </View>

                <View style={s.fieldGroup}>
                    <Text style={s.label}>City</Text>
                    <TextInput style={s.input} placeholder="Bangalore" placeholderTextColor="#9ca3af" value={city} onChangeText={setCity} />
                </View>

                <View style={s.fieldGroup}>
                    <Text style={s.label}>UPI ID (For Payments)</Text>
                    <TextInput style={s.input} placeholder="name@okaxis" placeholderTextColor="#9ca3af" value={upiId} onChangeText={setUpiId} autoCapitalize="none" />
                </View>

                <View style={s.langRow}>
                    <Text style={s.langLabel}>Use Hindi Language?</Text>
                    <Switch value={isHindi} onValueChange={setIsHindi} trackColor={{ false: '#767577', true: '#34A853' }} thumbColor="#f4f3f4" />
                </View>

                <View style={{ flex: 1 }} />

                <TouchableOpacity
                    style={[s.button, (!name || !city || !upiId || isLoading) && { opacity: 0.5 }]}
                    onPress={handleFinish}
                    disabled={!name || !city || !upiId || isLoading}
                >
                    {isLoading ? <ActivityIndicator color="#ffffff" /> : <Text style={s.buttonText}>Save Profile</Text>}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    content: { flex: 1, paddingVertical: 40, paddingHorizontal: 24 },
    title: { fontSize: 30, fontWeight: 'bold', color: '#212121', marginBottom: 8 },
    subtitle: { color: '#757575', fontSize: 16, marginBottom: 32 },
    fieldGroup: { marginBottom: 24 },
    label: { color: '#212121', fontWeight: '500', marginBottom: 8 },
    input: { width: '100%', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 16, height: 48, fontSize: 18, color: '#212121' },
    langRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, padding: 16, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#f3f4f6' },
    langLabel: { color: '#212121', fontWeight: '500', fontSize: 18 },
    button: { backgroundColor: '#2E75B6', width: '100%', paddingVertical: 16, borderRadius: 12, alignItems: 'center', elevation: 2 },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
