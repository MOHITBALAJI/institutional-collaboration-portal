/**
 * Neural Sound System v1.0
 * Uses Web Audio API to generate synthetic UI sounds (no external assets).
 */
class NeuralSoundSystem {
    private ctx: AudioContext | null = null;

    private async init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            await this.ctx.resume();
        }
    }


    private async createOscillator(freq: number, type: OscillatorType = "sine", duration: number = 0.1) {
        await this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    // --- Neural Sound Palette ---

    /** Soft glass click */
    async click() {
        await this.createOscillator(880, "sine", 0.05);
    }

    /** Subtle hover tick */
    async hover() {
        await this.createOscillator(1200, "sine", 0.02);
    }

    /** Success notification chime */
    async success() {
        await this.init();
        if (!this.ctx) return;
        [440, 554.37, 659.25].forEach((f, i) => {
            this.createOscillator(f, "sine", 0.2);
        });
    }

    /** Warning/Error low tone */
    async error() {
        await this.createOscillator(110, "sawtooth", 0.3);
    }

    /** Scanning data hum */
    async scan() {
        await this.createOscillator(220, "triangle", 0.1);
    }

    /** Neural Sync chime */
    async sync() {
        await this.init();
        if (!this.ctx) return;
        [880, 1320, 1760].forEach((f, i) => {
            setTimeout(() => this.createOscillator(f, "sine", 0.1), i * 50);
        });
    }

}

export const soundSystem = new NeuralSoundSystem();
