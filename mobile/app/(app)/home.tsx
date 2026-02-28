import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

const MOCK_TASKS = [
    { id: '1', title_en: 'Fold 5 T-Shirts', title_hi: '5 टी-शर्ट मोड़ें', pay_amount: 600, duration: '~15 mins' },
    { id: '2', title_en: 'Pour Water into Cups', title_hi: 'कप में पानी डालें', pay_amount: 400, duration: '~10 mins' },
    { id: '3', title_en: 'Wipe Kitchen Top', title_hi: 'रसोई का स्लैब पोंछें', pay_amount: 800, duration: '~20 mins' },
];

export default function Home() {
    const { user } = useAuthStore();
    const router = useRouter();
    const { t, i18n } = useTranslation('common');

    return (
        <SafeAreaView style={s.container}>
            {/* Header */}
            <View style={s.header}>
                <View>
                    <Text style={s.greeting}>{t('namaste')},</Text>
                    <Text style={s.userName}>{user?.full_name || user?.name || 'Worker'}!</Text>
                </View>
                <View style={s.headerRight}>
                    <TouchableOpacity style={s.avatarBtn} onPress={() => router.push('/(app)/profile')}>
                        <Text style={{ fontSize: 20 }}>👨🏽‍🦱</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={s.earningsBtn} onPress={() => router.push('/(app)/earnings')}>
                        <Text style={s.earningsLabel}>{t('todayEarnings')}</Text>
                        <Text style={s.earningsAmount}>₹1,200</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={s.scroll}>
                <Text style={s.sectionTitle}>{t('availableTasks')}</Text>

                {MOCK_TASKS.map((task) => (
                    <View key={task.id} style={s.taskCard}>
                        <View style={s.taskRow}>
                            <View style={{ flex: 1, marginRight: 16 }}>
                                <Text style={s.taskTitle}>{i18n.language === 'en' ? task.title_en : task.title_hi}</Text>
                            </View>
                            <View style={s.payBox}>
                                <Text style={s.payAmount}>₹{task.pay_amount}</Text>
                                <Text style={s.payDuration}>{task.duration}</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={s.startBtn}
                            onPress={() => router.push({ pathname: '/(app)/task/[id]', params: { id: task.id, title: i18n.language === 'en' ? task.title_en : task.title_hi, amount: task.pay_amount } })}
                        >
                            <Text style={s.startBtnText}>{t('startTask')}</Text>
                        </TouchableOpacity>
                    </View>
                ))}

                <View style={s.progressCard}>
                    <Text style={s.progressLabel}>{t('myProgress')}</Text>
                    <Text style={s.progressValue}>{t('youHaveNClips', { count: 2 })}</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    header: { paddingHorizontal: 24, paddingVertical: 24, paddingBottom: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    greeting: { color: '#757575', fontSize: 14, marginBottom: 4 },
    userName: { color: '#212121', fontSize: 24, fontWeight: 'bold' },
    headerRight: { flexDirection: 'row', gap: 12, alignItems: 'center' },
    avatarBtn: { backgroundColor: '#f3f4f6', padding: 12, borderRadius: 999 },
    earningsBtn: { alignItems: 'flex-end', backgroundColor: 'rgba(52,168,83,0.1)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
    earningsLabel: { color: '#34A853', fontSize: 12, fontWeight: '600', marginBottom: 4 },
    earningsAmount: { color: '#34A853', fontSize: 18, fontWeight: 'bold' },
    scroll: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#212121', marginBottom: 16, marginLeft: 8 },
    taskCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#fafafa', elevation: 1 },
    taskRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, width: '100%' },
    taskTitle: { fontSize: 18, fontWeight: 'bold', color: '#212121' },
    payBox: { alignItems: 'flex-end', justifyContent: 'center', backgroundColor: '#fafafa', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
    payAmount: { fontSize: 20, fontWeight: 'bold', color: '#212121' },
    payDuration: { fontSize: 12, color: '#757575', marginTop: 4 },
    startBtn: { width: '100%', backgroundColor: 'rgba(46,117,182,0.1)', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
    startBtnText: { color: '#2E75B6', fontWeight: '600', fontSize: 16 },
    progressCard: { marginTop: 24, marginBottom: 48, backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center', elevation: 1 },
    progressLabel: { color: '#757575', marginBottom: 8 },
    progressValue: { textAlign: 'center', color: '#212121', fontWeight: '500' },
});
