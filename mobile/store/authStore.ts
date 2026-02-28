import { create } from 'zustand';
import { supabase } from '../utils/supabase';

// Real Auth Store connected to Supabase workers table
interface AuthState {
    user: any | null;
    isLoading: boolean;
    login: (phone: string, uid: string) => Promise<void>;
    completeSetup: (profileData: any) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: false,
    login: async (phone: string, uid: string) => {
        set({ isLoading: true });
        try {
            console.log('DEBUG STORE: Querying Supabase for phone:', phone);
            // Check if worker exists in Supabase
            const { data, error } = await supabase
                .from('workers')
                .select('*')
                .eq('phone', phone)
                .single();

            console.log('DEBUG STORE: Supabase response - data:', JSON.stringify(data), 'error:', JSON.stringify(error));

            if (error && error.code === 'PGRST116') {
                // Not found - New User (needs setup)
                console.log('DEBUG STORE: New user, redirecting to setup');
                set({
                    user: { id: uid, phone, isNewUser: true },
                    isLoading: false
                });
            } else if (data) {
                // Existing user
                console.log('DEBUG STORE: Existing user found');
                set({ user: data, isLoading: false });
            } else {
                set({ isLoading: false });
                console.error("Login Error:", error);
            }
        } catch (error) {
            set({ isLoading: false });
            console.error('DEBUG STORE: Catch error:', error);
        }
    },
    completeSetup: async (profileData: any) => {
        set({ isLoading: true });
        const { id, phone, name, city, upi_id, language } = profileData;
        try {
            const { data, error } = await supabase
                .from('workers')
                .insert({
                    // Let Supabase auto-generate the UUID id
                    firebase_uid: id, // Store Firebase UID separately
                    phone,
                    full_name: name,
                    city,
                    upi_id,
                    language,
                    tier: 1,
                    rating: 5.0
                })
                .select()
                .single();

            if (data) {
                set({ user: data, isLoading: false });
            } else {
                set({ isLoading: false });
                console.error("Setup Error:", error);
            }
        } catch (error) {
            set({ isLoading: false });
            console.error(error);
        }
    },
    logout: () => set({ user: null }),
}));
