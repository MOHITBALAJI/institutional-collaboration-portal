import { useCallback } from 'react';
import { soundSystem } from '@/lib/SoundSystem';

/**
 * Hook to access the Neural Sound System
 */
export function useSound() {
    const playClick = useCallback(() => soundSystem.click(), []);
    const playHover = useCallback(() => soundSystem.hover(), []);
    const playSuccess = useCallback(() => soundSystem.success(), []);
    const playError = useCallback(() => soundSystem.error(), []);
    const playScan = useCallback(() => soundSystem.scan(), []);
    const playSync = useCallback(() => soundSystem.sync(), []);

    return {
        playClick,
        playHover,
        playSuccess,
        playError,
        playScan,
        playSync,
    };
}
