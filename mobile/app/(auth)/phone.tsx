import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import firebaseAuth from '@react-native-firebase/auth';

export default function PhoneAuth() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationId, setVerificationId] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSendingOTP, setIsSendingOTP] = useState(false);
    const [confirmResult, setConfirmResult] = useState<any>(null);
    const { login, isLoading } = useAuthStore();

    const handleSendOTP = async () => {
        if (phoneNumber.length < 10) {
            setErrorMessage('Please enter a valid 10-digit phone number');
            return;
        }
        setErrorMessage('');
        setIsSendingOTP(true);
        try {
            const formattedPhone = `+91${phoneNumber}`;
            const confirmation = await firebaseAuth().signInWithPhoneNumber(formattedPhone);
            setConfirmResult(confirmation);
            setVerificationId('sent');
        } catch (error: any) {
            setErrorMessage(error.message || 'Error sending OTP');
        } finally {
            setIsSendingOTP(false);
        }
    };

    const handleVerifyCode = async () => {
        if (verificationCode.length !== 6) {
            setErrorMessage('Please enter the 6-digit OTP code');
            return;
        }
        setErrorMessage('');
        try {
            if (!confirmResult) {
                setErrorMessage('No valid OTP session found');
                return;
            }
            console.log('DEBUG: Confirming OTP...');
            const userCredential = await confirmResult.confirm(verificationCode);
            console.log('DEBUG: OTP confirmed');
            const fbUser = userCredential?.user;
            if (fbUser && fbUser.phoneNumber) {
                console.log('DEBUG: Calling login()...');
                await login(fbUser.phoneNumber, fbUser.uid);
                console.log('DEBUG: login() completed');
            } else {
                setErrorMessage('Authentication missing phone number or user data');
            }
        } catch (error: any) {
            console.log('DEBUG: Verify error:', error);
            setErrorMessage(error.message || 'Invalid verification code');
        }
    };

    return (
        <SafeAreaView style={s.container}>
            <View style={s.content}>
                {!verificationId ? (
                    <>
                        <Text style={s.title}>Enter your phone</Text>
                        <Text style={s.subtitle}>We'll send you an OTP to verify your account.</Text>
                        <View style={s.inputRow}>
                            <Text style={s.countryCode}>+91</Text>
                            <View style={s.divider} />
                            <TextInput
                                style={s.input}
                                keyboardType="phone-pad"
                                placeholder="98765 43210"
                                placeholderTextColor="#9ca3af"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                maxLength={10}
                                autoFocus
                            />
                        </View>
                    </>
                ) : (
                    <>
                        <Text style={s.title}>Enter OTP</Text>
                        <Text style={s.subtitle}>Sent to +91 {phoneNumber}</Text>
                        <View style={s.otpBox}>
                            <TextInput
                                style={s.otpInput}
                                keyboardType="number-pad"
                                placeholder="------"
                                placeholderTextColor="#9ca3af"
                                value={verificationCode}
                                onChangeText={setVerificationCode}
                                maxLength={6}
                                autoFocus
                            />
                        </View>
                    </>
                )}

                {errorMessage ? <Text style={s.error}>{errorMessage}</Text> : null}

                <View style={{ flex: 1 }} />

                <TouchableOpacity
                    style={[s.button, (isLoading || isSendingOTP) && { opacity: 0.7 }]}
                    onPress={verificationId ? handleVerifyCode : handleSendOTP}
                    disabled={isLoading || isSendingOTP}
                >
                    {isLoading || isSendingOTP ? (
                        <ActivityIndicator color="#ffffff" />
                    ) : (
                        <Text style={s.buttonText}>
                            {verificationId ? 'Verify OTP' : 'Send OTP'}
                        </Text>
                    )}
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
    inputRow: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 4, flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    countryCode: { color: '#212121', fontSize: 18, fontWeight: '500', marginRight: 12 },
    divider: { width: 1, height: 32, backgroundColor: '#e5e7eb', marginRight: 12 },
    input: { flex: 1, height: 48, fontSize: 18, color: '#212121' },
    otpBox: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 4, marginBottom: 16 },
    otpInput: { width: '100%', height: 48, fontSize: 18, color: '#212121', textAlign: 'center', letterSpacing: 10 },
    error: { color: '#EA4335', fontSize: 14, marginBottom: 16 },
    button: { backgroundColor: '#2E75B6', width: '100%', paddingVertical: 16, borderRadius: 12, alignItems: 'center', elevation: 2 },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
