import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const RECENT_TRANSACTIONS = [
    { id: '1', task: 'Fold 5 T-Shirts', date: 'Oct 24, 2023', amount: 600, status: 'paid' },
    { id: '2', task: 'Pour Water into Cups', date: 'Oct 23, 2023', amount: 400, status: 'paid' },
    { id: '3', task: 'Wipe Kitchen Top', date: 'Oct 23, 2023', amount: 200, status: 'pending' },
];

export default function EarningsScreen() {
    const { user } = useAuthStore();
    const router = useRouter();
    const { t } = useTranslation('common');

    const totalEarned = RECENT_TRANSACTIONS.filter(tx => tx.status === 'paid').reduce((sum, tx) => sum + tx.amount, 0);
    const pendingAmount = RECENT_TRANSACTIONS.filter(tx => tx.status === 'pending').reduce((sum, tx) => sum + tx.amount, 0);

    return (
        <SafeAreaView style={s.container}>
            <View style={s.header}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
                    <Feather name="arrow-left" size={24} color="#1E293B" />
                </TouchableOpacity>
                <Text style={s.headerTitle}>{t('myEarnings')}</Text>
            </View>

            <ScrollView style={s.scroll}>
                {/* Balance card */}
                <View style={s.balanceCard}>
                    <Text style={s.balanceLabel}>{t('totalAvailableBalance')}</Text>
                    <Text style={s.balanceAmount}>₹{totalEarned}</Text>
                    <TouchableOpacity style={s.withdrawBtn}>
                        <Text style={s.withdrawText}>{t('withdrawToUpi')}</Text>
                    </TouchableOpacity>
                </View>

                {/* Pending card */}
                <View style={s.pendingCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <View style={s.pendingIcon}>
                            <Feather name="clock" size={20} color="#CA8A04" />
                        </View>
                        <Text style={s.pendingLabel}>{t('pendingReview')}</Text>
                    </View>
                    <Text style={s.pendingAmount}>₹{pendingAmount}</Text>
                </View>

                <Text style={s.sectionTitle}>{t('recentTransactions')}</Text>

                {RECENT_TRANSACTIONS.map((tx) => (
                    <View key={tx.id} style={s.txCard}>
                        <View style={{ flex: 1 }}>
                            <Text style={s.txTask}>{tx.task}</Text>
                            <Text style={s.txDate}>{tx.date}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={s.txAmount}>₹{tx.amount}</Text>
                            {tx.status === 'paid' ? (
                                <View style={s.paidBadge}><Text style={s.paidText}>{t('paid')}</Text></View>
                            ) : (
                                <View style={s.pendBadge}><Text style={s.pendText}>{t('pending')}</Text></View>
                            )}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    header: { paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', elevation: 1 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 16, color: '#212121' },
    scroll: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
    balanceCard: { backgroundColor: '#2E75B6', borderRadius: 24, padding: 24, marginBottom: 16, elevation: 4 },
    balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 16, fontWeight: '500', marginBottom: 4 },
    balanceAmount: { color: '#fff', fontSize: 40, fontWeight: '800', marginBottom: 24 },
    withdrawBtn: { backgroundColor: '#fff', borderRadius: 12, paddingVertical: 12, alignItems: 'center', width: '100%' },
    withdrawText: { color: '#2E75B6', fontWeight: 'bold', fontSize: 16 },
    pendingCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#f3f4f6', borderRadius: 16, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, elevation: 1 },
    pendingIcon: { backgroundColor: '#fef3c7', padding: 8, borderRadius: 999 },
    pendingLabel: { color: '#757575', fontWeight: '500' },
    pendingAmount: { fontSize: 20, fontWeight: 'bold', color: '#212121' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#212121', marginBottom: 16 },
    txCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#fafafa', elevation: 1 },
    txTask: { fontSize: 16, fontWeight: 'bold', color: '#212121', marginBottom: 4 },
    txDate: { fontSize: 14, color: '#757575' },
    txAmount: { fontSize: 18, fontWeight: 'bold', color: '#212121', marginBottom: 4 },
    paidBadge: { backgroundColor: 'rgba(52,168,83,0.1)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    paidText: { color: '#34A853', fontSize: 12 },
    pendBadge: { backgroundColor: '#fef3c7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    pendText: { color: '#CA8A04', fontSize: 12 },
});
