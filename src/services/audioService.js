/**
 * Serviço de Áudio - Bips e Alertas Sonoros
 */

class AudioService {
  constructor() {
    this.audioContext = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    
    try {
      // Criar contexto de áudio na primeira interação
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API não suportado', e);
    }
  }

  /**
   * Bip simples (2000Hz, 100ms)
   */
  bip(duracao = 100) {
    if (!this.audioContext) this.init();
    if (!this.audioContext) return; // Sem áudio disponível

    try {
      const ctx = this.audioContext;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = 2000;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duracao / 1000);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duracao / 1000);
    } catch (e) {
      console.warn('Erro ao tocar bip', e);
    }
  }

  /**
   * Bip duplo para sucesso
   */
  sucesso() {
    this.bip(150);
    setTimeout(() => this.bip(150), 200);
  }

  /**
   * Bip triplo para erro
   */
  erro() {
    this.bip(100);
    setTimeout(() => this.bip(100), 120);
    setTimeout(() => this.bip(100), 240);
  }

  /**
   * Alerta sonoro para mensalista ativo
   */
  alertaMensalista() {
    // Dois bips altos
    if (!this.audioContext) this.init();
    if (!this.audioContext) return;

    try {
      const ctx = this.audioContext;
      
      for (let i = 0; i < 2; i++) {
        setTimeout(() => {
          const oscillator = ctx.createOscillator();
          const gainNode = ctx.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(ctx.destination);

          oscillator.frequency.value = 1500;
          oscillator.type = 'sine';

          gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.2);
        }, i * 250);
      }
    } catch (e) {
      console.warn('Erro ao tocar alerta', e);
    }
  }
}

export const audioService = new AudioService();
