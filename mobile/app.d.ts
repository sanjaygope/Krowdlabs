/// <reference types="nativewind/types" />
import 'react-native';

declare module 'react-native' {
    interface ViewProps {
        className?: string;
    }
    interface TextProps {
        className?: string;
    }
    interface TextInputProps {
        className?: string;
    }
    interface TouchableOpacityProps {
        className?: string;
    }
    export interface _SafeAreaViewProps extends ViewProps {
        className?: string;
    }
}
