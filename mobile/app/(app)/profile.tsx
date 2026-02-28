import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function ProfileScreen() {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const { t, i18n } = useTranslation('common');

    const handleLogout = () => {
        logout();
        router.replace('/(auth)/welcome');
    };

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'hi' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <SafeAreaView style={s.container}>
            <View style={s.header}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
                    <Feather name="arrow-left" size={24} color="#1E293B" />
                </TouchableOpacity>
                <Text style={s.headerTitle}>{t('profileAndSettings')}</Text>
            </View>

            <ScrollView style={s.scroll}>
                <View style={s.avatarSection}>
                    <View style={s.avatar}>
                        <Feather name="user" size={40} color="#2563EB" />
                    </View>
                    <Text style={s.name}>{user?.full_name || user?.name || 'Worker'}</Text>
                    <Text style={s.phone}>+91 {user?.phone || '9999999999'}</Text>
                    <View style={s.tierBadge}>
                        <Text style={s.tierText}>Tier {user?.tier || 1} • {t('verified')}</Text>
                    </View>
                </View>

                <Text style={s.sectionTitle}>{t('personalInfo')}</Text>
                <View style={s.infoCard}>
                    <Text style={s.infoLabel}>{t('fullName')}</Text>
                    <TextInput value={user?.full_name || user?.name} style={s.infoValue} editable={false} />
                </View>
                <View style={s.infoCard}>
                    <Text style={s.infoLabel}>{t('city')}</Text>
                    <TextInput value={user?.city || 'Mumbai'} style={s.infoValue} editable={false} />
                </View>

                <Text style={[s.sectionTitle, { marginTop: 16 }]}>{t('paymentDetails')}</Text>
                <View style={[s.infoCard, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                    <View style={{ flex: 1 }}>
                        <Text style={s.infoLabel}>{t('upiId')}</Text>
                        <TextInput value={`${user?.phone}@upi`} style={s.infoValue} editable={false} />
                    </View>
                    <TouchableOpacity style={s.editBtn}>
                        <Text style={s.editText}>{t('edit')}</Text>
                    </TouchableOpacity>
                </View>

                <Text style={[s.sectionTitle, { marginTop: 16 }]}>{t('preferences')}</Text>
                <TouchableOpacity style={s.prefRow} onPress={toggleLanguage}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <Feather name="globe" size={20} color="#64748B" />
                        <Text style={s.prefLabel}>{t('language')}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text style={s.prefValue}>{i18n.language === 'en' ? 'English' : 'हिंदी'}</Text>
                        <Feather name="chevron-right" size={20} color="#CBD5E1" />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={s.prefRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <Feather name="bell" size={20} color="#64748B" />
                        <Text style={s.prefLabel}>{t('notifications')}</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color="#CBD5E1" />
                </TouchableOpacity>

                <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
                    <Feather name="log-out" size={20} color="#EF4444" />
                    <Text style={s.logoutText}>{t('logOut')}</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    header: { paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', elevation: 1 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 16, color: '#212121' },
    scroll: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
    avatarSection: { alignItems: 'center', marginBottom: 32 },
    avatar: { width: 96, height: 96, backgroundColor: 'rgba(46,117,182,0.2)', borderRadius: 48, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    name: { fontSize: 24, fontWeight: 'bold', color: '#212121' },
    phone: { color: '#757575', marginTop: 4 },
    tierBadge: { backgroundColor: 'rgba(52,168,83,0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, marginTop: 12 },
    tierText: { color: '#34A853', fontSize: 12, fontWeight: 'bold' },
    sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#757575', marginLeft: 4, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
    infoCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#f3f4f6', borderRadius: 12, padding: 16, marginBottom: 8, elevation: 1 },
    infoLabel: { fontSize: 12, color: '#757575', marginBottom: 4 },
    infoValue: { fontSize: 16, fontWeight: '500', color: '#212121', padding: 0 },
    editBtn: { backgroundColor: '#f3f4f6', padding: 8, borderRadius: 8 },
    editText: { fontSize: 14, fontWeight: '600', color: '#2E75B6' },
    prefRow: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#f3f4f6', borderRadius: 12, padding: 16, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 1 },
    prefLabel: { fontSize: 16, fontWeight: '500', color: '#212121' },
    prefValue: { fontSize: 14, color: '#757575' },
    logoutBtn: { borderWidth: 1, borderColor: '#fecaca', backgroundColor: '#fef2f2', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 48, flexDirection: 'row', justifyContent: 'center', gap: 8 },
    logoutText: { color: '#EF4444', fontWeight: 'bold', fontSize: 16 },
});
