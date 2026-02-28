import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function TaskDetail() {
    const router = useRouter();
    const { id = '1', title = 'Fold 5 T-Shirts', amount = '600' } = useLocalSearchParams();

    return (
        <SafeAreaView style={s.container}>
            <View style={s.header}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 8 }}>
                    <Feather name="arrow-left" size={24} color="#212121" />
                </TouchableOpacity>
                <Text style={s.headerTitle}>Task Details</Text>
            </View>

            <ScrollView style={s.scroll}>
                <View style={s.card}>
                    <Text style={s.taskTitle}>{title}</Text>
                    <Text style={s.taskDuration}>Duration: ~15 minutes</Text>
                    <View style={s.earnBadge}>
                        <Text style={s.earnText}>Earn ₹{amount}</Text>
                    </View>
                </View>

                <Text style={s.sectionTitle}>Instructions</Text>
                <View style={s.card}>
                    <View style={s.instrRow}>
                        <Text style={s.instrNum}>1.</Text>
                        <Text style={s.instrText}>Gather 5 different t-shirts (different colors/sizes preferred)</Text>
                    </View>
                    <View style={s.instrRow}>
                        <Text style={s.instrNum}>2.</Text>
                        <Text style={s.instrText}>Lay each shirt flat on a table or bed</Text>
                    </View>
                    <View style={s.instrRow}>
                        <Text style={s.instrNum}>3.</Text>
                        <Text style={s.instrText}>Fold each shirt using your normal method. Ensure hands remain visible!</Text>
                    </View>
                </View>

                <Text style={s.sectionTitle}>Quality Checklist</Text>
                <View style={s.card}>
                    <View style={s.checkItem}>
                        <Feather name="sun" size={20} color="#34A853" style={{ marginRight: 12 }} />
                        <Text style={s.checkText}>Good lighting (windows or bright lights)</Text>
                    </View>
                    <View style={s.checkItem}>
                        <Feather name="crosshair" size={20} color="#34A853" style={{ marginRight: 12 }} />
                        <Text style={s.checkText}>Hands visible in frame</Text>
                    </View>
                    <View style={s.checkItem}>
                        <Feather name="smartphone" size={20} color="#34A853" style={{ marginRight: 12 }} />
                        <Text style={s.checkText}>Phone stable (chest mount or propped)</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={s.bottomBar}>
                <TouchableOpacity
                    style={s.recordBtn}
                    onPress={() => router.push({ pathname: '/(app)/camera', params: { taskId: id } })}
                >
                    <Feather name="video" size={20} color="white" style={{ marginRight: 8 }} />
                    <Text style={s.recordText}>Start Recording</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    header: { paddingHorizontal: 16, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f3f4f6', backgroundColor: '#fff', elevation: 1 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#212121' },
    scroll: { flex: 1, paddingHorizontal: 24, paddingTop: 24, marginBottom: 96 },
    card: { backgroundColor: '#fff', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#f3f4f6', marginBottom: 24, elevation: 1 },
    taskTitle: { fontSize: 24, fontWeight: 'bold', color: '#212121', marginBottom: 4 },
    taskDuration: { color: '#757575', fontSize: 16, marginBottom: 16 },
    earnBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(52,168,83,0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
    earnText: { color: '#34A853', fontWeight: 'bold', fontSize: 18 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#212121', marginBottom: 16 },
    instrRow: { flexDirection: 'row', marginBottom: 12 },
    instrNum: { color: '#2E75B6', fontWeight: 'bold', marginRight: 8 },
    instrText: { color: '#212121', fontSize: 16, flex: 1 },
    checkItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    checkText: { color: '#212121', fontSize: 16 },
    bottomBar: { position: 'absolute', bottom: 0, width: '100%', paddingHorizontal: 24, paddingVertical: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f3f4f6', elevation: 4 },
    recordBtn: { backgroundColor: '#2E75B6', width: '100%', paddingVertical: 16, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
    recordText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
