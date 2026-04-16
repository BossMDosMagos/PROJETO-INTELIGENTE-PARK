import Encoder from 'esc-pos-encoder';
import QRCode from 'qrcode';

class BluetoothPrinter {
  constructor() {
    this.device = null;
    this.server = null;
    this.service = null;
    this.characteristic = null;
    this.isConnected = false;
    this.writeSemResposta = false;
    this.storageKeyDeviceId = 'park_bt_device_id';
  }

  async conectarDispositivo(device) {
    this.device = device;

    if (!this.device?.gatt) {
      return {
        sucesso: false,
        mensagem: 'Dispositivo sem GATT BLE. Use conexão USB/Serial para este modelo.'
      };
    }

    this.server = await this.device.gatt.connect();
    console.log('Conectado ao servidor GATT');

    const services = await this.server.getPrimaryServices();
    if (!services.length) {
      throw new Error('Nenhum serviço BLE encontrado');
    }

    let charEscrita = null;
    let serviceSelecionado = null;

    for (const service of services) {
      const chars = await service.getCharacteristics();
      const found = chars.find(
        (c) => c.properties.write || c.properties.writeWithoutResponse
      );
      if (found) {
        charEscrita = found;
        serviceSelecionado = service;
        break;
      }
    }

    if (!charEscrita || !serviceSelecionado) {
      throw new Error('Nenhuma característica de escrita encontrada no BLE');
    }

    this.service = serviceSelecionado;
    this.characteristic = charEscrita;
    this.writeSemResposta = Boolean(charEscrita.properties.writeWithoutResponse);
    this.isConnected = true;

    if (this.device.id) {
      localStorage.setItem(this.storageKeyDeviceId, this.device.id);
    }

    return { sucesso: true, mensagem: `✅ ${this.device.name || 'Impressora térmica'}` };
  }

  // Conectar ao dispositivo Bluetooth
  async conectar() {
    try {
      if (!navigator.bluetooth) {
        return { sucesso: false, mensagem: 'Web Bluetooth não suportado neste navegador' };
      }

      // Solicitar dispositivo Bluetooth
      this.device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          '000018f0-0000-1000-8000-00805f9b34fb',
          '0000ff00-0000-1000-8000-00805f9b34fb',
          '0000ff01-0000-1000-8000-00805f9b34fb',
          '49535343-fe7d-4ae5-8fa9-9fafd205e455',
          '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
          '0000ffe0-0000-1000-8000-00805f9b34fb'
        ],
      });
      return await this.conectarDispositivo(this.device);
    } catch (error) {
      console.error('Erro ao conectar:', error);
      return { sucesso: false, mensagem: `Erro: ${error.message}` };
    }
  }

  async reconectarAutomatico() {
    try {
      if (!navigator.bluetooth?.getDevices) {
        return { sucesso: false, mensagem: 'Reconexão Bluetooth não suportada neste navegador' };
      }

      const devices = await navigator.bluetooth.getDevices();
      if (!devices.length) {
        return { sucesso: false, mensagem: 'Nenhum dispositivo Bluetooth autorizado anteriormente' };
      }

      const ultimoId = localStorage.getItem(this.storageKeyDeviceId);
      const candidatos = ultimoId
        ? [...devices.filter((d) => d.id === ultimoId), ...devices.filter((d) => d.id !== ultimoId)]
        : devices;

      for (const device of candidatos) {
        try {
          return await this.conectarDispositivo(device);
        } catch (erroTentativa) {
          console.warn('Falha ao reconectar dispositivo Bluetooth:', erroTentativa);
        }
      }

      return { sucesso: false, mensagem: 'Não foi possível reconectar automaticamente no Bluetooth' };
    } catch (error) {
      console.error('Erro na reconexão Bluetooth:', error);
      return { sucesso: false, mensagem: `Erro: ${error.message}` };
    }
  }

  // Desconectar
  async desconectar() {
    if (this.device && this.device.gatt.connected) {
      this.device.gatt.disconnect();
      this.isConnected = false;
      this.service = null;
      this.characteristic = null;
      this.writeSemResposta = false;
      this.server = null;
      return { sucesso: true, mensagem: 'Desconectado' };
    }
    return { sucesso: false, mensagem: 'Não conectado' };
  }

  // Enviar dados para impressora
  async enviarDados(dados) {
    if (!this.isConnected || !this.characteristic) {
      return { sucesso: false, mensagem: 'Impressora não conectada' };
    }

    try {
      // Converter dados para Uint8Array se necessário
      let buffer;
      if (dados instanceof Uint8Array) {
        buffer = dados;
      } else if (typeof dados === 'string') {
        buffer = new TextEncoder().encode(dados);
      } else {
        buffer = new Uint8Array(dados);
      }

      // Dividir em chunks pequenos para maior compatibilidade BLE
      const chunkSize = this.writeSemResposta ? 180 : 120;
      for (let i = 0; i < buffer.length; i += chunkSize) {
        const chunk = buffer.slice(i, i + chunkSize);
        if (this.writeSemResposta && this.characteristic.writeValueWithoutResponse) {
          await this.characteristic.writeValueWithoutResponse(chunk);
        } else {
          await this.characteristic.writeValue(chunk);
        }
        // Pequena pausa entre chunks
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      return { sucesso: true, mensagem: 'Impressão enviada' };
    } catch (error) {
      console.error('Erro ao enviar:', error);
      return { sucesso: false, mensagem: `Erro: ${error.message}` };
    }
  }

  // Gerar QR Code como canvas (mais compatível)
  async gerarQRCodeRaster(texto, tamanho) {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = tamanho;
      canvas.height = tamanho;
      
      await QRCode.toCanvas(canvas, texto, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        width: tamanho,
        margin: 1,
        color: { dark: '#000000', light: '#ffffff' }
      });

      // Converter canvas para imageData
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, tamanho, tamanho);
      const data = imageData.data;

      // Converter para raster de pixels preto/branco (1 bit)
      const rasterData = [];
      for (let i = 0; i < data.length; i += 4) {
        // Se pixel é preto (R=0, G=0, B=0), então é 1, senão 0
        const isBlack = data[i] < 128 ? 1 : 0;
        rasterData.push(isBlack);
      }

      return {
        width: tamanho,
        height: tamanho,
        data: new Uint8Array(rasterData),
        imageData: imageData
      };
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      return null;
    }
  }

  // Converter canvas para dados de imagem para impressora
  canvasParaRaster(canvas) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Converter para preto e branco
    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      const bw = gray > 128 ? 255 : 0;
      data[i] = data[i + 1] = data[i + 2] = bw;
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/png');
  }

  // Formatar texto com largura máxima
  formatarTexto(texto, largura = 32, alinhamento = 'left') {
    if (!texto) return '';

    if (texto.length <= largura) {
      if (alinhamento === 'center') {
        const espaco = Math.floor((largura - texto.length) / 2);
        return ' '.repeat(espaco) + texto;
      } else if (alinhamento === 'right') {
        return texto.padStart(largura);
      }
      return texto;
    }

    // Quebrar texto em múltiplas linhas
    const linhas = [];
    for (let i = 0; i < texto.length; i += largura) {
      linhas.push(texto.substring(i, i + largura));
    }
    return linhas.join('\n');
  }

  // ===== MÉTODOS AUXILIARES PARA COMANDOS ESC/POS HEXADECIMAIS =====

  // Remover acentos e caracteres especiais para compatibilidade com impressoras térmicas
  removerAcentos(texto) {
    if (!texto) return '';
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos
      .replace(/[^\x00-\x7F]/g, ''); // Remove caracteres não-ASCII restantes
  }

  // Obter bytes de comando de alinhamento ESC/POS
  obterComandoAlinhamento(alinhamento) {
    // ESC a n - Comando de alinhamento
    // 0x1B 0x61 n onde n: 0=esquerda, 1=centro, 2=direita
    const comandos = {
      'left': [0x1B, 0x61, 0x00],
      'center': [0x1B, 0x61, 0x01],
      'right': [0x1B, 0x61, 0x02]
    };
    return comandos[alinhamento] || comandos['center'];
  }

  // Combinar arrays de bytes
  combinarBytes(...arrays) {
    const tamanhoTotal = arrays.reduce((sum, arr) => sum + arr.length, 0);
    const resultado = new Uint8Array(tamanhoTotal);
    let offset = 0;
    for (const arr of arrays) {
      resultado.set(arr, offset);
      offset += arr.length;
    }
    return resultado;
  }

  // Inserir comando de alinhamento antes do texto
  adicionarTextoComAlinhamento(texto, alinhamento = 'center') {
    const comandoAlign = new Uint8Array(this.obterComandoAlinhamento(alinhamento));
    const textoSemAcentos = this.removerAcentos(texto.trim());
    const textoBytes = new TextEncoder().encode(textoSemAcentos);
    return this.combinarBytes(comandoAlign, textoBytes);
  }

  // Criar seção com alinhamento, tamanho de fonte e texto
  criarSecaoTexto(texto, alinhamento, altura = 1, largura = 1, negrito = false) {
    const partes = [];
    
    // Comando de alinhamento
    partes.push(new Uint8Array(this.obterComandoAlinhamento(alinhamento)));
    
    // Comando de tamanho de fonte: ESC ! n
    // Bits: 0-3 = largura (0-7), 4-7 = altura (0-7)
    const tamanhoN = ((altura - 1) << 4) | (largura - 1);
    partes.push(new Uint8Array([0x1B, 0x21, tamanhoN]));
    
    // Negrito: ESC E n (1 = on, 0 = off)
    if (negrito) {
      partes.push(new Uint8Array([0x1B, 0x45, 0x01]));
    }
    
    // Texto (sem acentos para compatibilidade)
    const textoSemAcentos = this.removerAcentos(texto.trim());
    partes.push(new TextEncoder().encode(textoSemAcentos));
    
    // Desabilitar negrito
    if (negrito) {
      partes.push(new Uint8Array([0x1B, 0x45, 0x00]));
    }
    
    // Nova linha
    partes.push(new Uint8Array([0x0A]));
    
    return this.combinarBytes(...partes);
  }

  // Método de teste de alinhamento (imprime 3 linhas)
  async testarAlinhamento() {
    try {
      const encoder = new Encoder();
      encoder.initialize();

      // Criar array de bytes manualmente
      const ESC = 0x1B;
      const ALIGN_LEFT = [ESC, 0x61, 0x00];
      const ALIGN_CENTER = [ESC, 0x61, 0x01];
      const ALIGN_RIGHT = [ESC, 0x61, 0x02];
      const LF = 0x0A; // Line Feed (nova linha)
      const CUT = [0x1D, 0x56, 0x00]; // Comando de corte

      const linha1 = new TextEncoder().encode('[CENTRALIZADO]');
      const linha2 = new TextEncoder().encode('[ESQUERDA]');
      const linha3 = new TextEncoder().encode('[DIREITA]');

      // Montar sequência de bytes
      const bytes = this.combinarBytes(
        new Uint8Array([...encoder.encode()]), // Initialize
        new Uint8Array([LF, LF]), // 2 linhas em branco
        new Uint8Array(ALIGN_CENTER),
        linha1,
        new Uint8Array([LF, LF]),
        new Uint8Array(ALIGN_LEFT),
        linha2,
        new Uint8Array([LF, LF]),
        new Uint8Array(ALIGN_RIGHT),
        linha3,
        new Uint8Array([LF, LF, LF, LF]),
        new Uint8Array(CUT)
      );

      return await this.enviarDados(bytes);
    } catch (error) {
      console.error('Erro no teste de alinhamento:', error);
      return { sucesso: false, mensagem: `Erro: ${error.message}` };
    }
  }

  obterConfigImpressao(dadosEmpresa) {
    if (typeof dadosEmpresa === 'string') {
      return {
        nomeEmpresa: dadosEmpresa,
        cnpj: '',
        endereco: '',
        telefone: '',
        imprimirCnpj: false,
        imprimirEndereco: false,
        imprimirTelefone: false,
        linhaDivisoria: 24,
        tamanhoQrCode: 150,
        larguraTicket: 32,
        tamanhoFonteNome: { altura: 1, largura: 1 },
        tamanhoFonteDados: { altura: 1, largura: 1 },
        tamanhoFontePlaca: { altura: 2, largura: 2 },
        tamanhoFonteValor: { altura: 2, largura: 2 },
        mostrarModelo: true,
        mostrarCor: true,
        mostrarDatas: true,
        mostrarHoras: true,
        linhasAntesDivisoria: 0,
        linhasDepoisDivisoria: 0,
        linhasAntesQR: 0,
        linhasDepoisQR: 1,
        alinhamentoNome: 'center',
        alinhamentoDados: 'center',
        alinhamentoDivisoria: 'center',
        alinhamentoPlaca: 'center',
        alinhamentoDatas: 'center',
        alinhamentoModeloCor: 'center',
        alinhamentoValor: 'center'
      };
    }

    const config = dadosEmpresa || {};
    return {
      nomeEmpresa: String(config.nomeEmpresa || 'ESTACIONAMENTO').trim(),
      cnpj: String(config.cnpj || '').trim(),
      endereco: String(config.endereco || '').trim(),
      telefone: String(config.telefone || '').trim(),
      imprimirCnpj: Boolean(config.imprimirCnpj),
      imprimirEndereco: Boolean(config.imprimirEndereco),
      imprimirTelefone: Boolean(config.imprimirTelefone),
      linhaDivisoria: Math.max(16, Math.min(32, parseInt(config.linhaDivisoria || 24))),
      tamanhoQrCode: Math.max(80, Math.min(200, parseInt(config.tamanhoQrCode || 150))),
      larguraTicket: Math.max(20, Math.min(40, parseInt(config.larguraTicket || 32))),
      tamanhoFonteNome: {
        altura: Math.max(1, Math.min(3, parseInt(config.tamanhoFonteNome?.altura || 1))),
        largura: Math.max(1, Math.min(3, parseInt(config.tamanhoFonteNome?.largura || 1)))
      },
      tamanhoFonteDados: {
        altura: Math.max(1, Math.min(2, parseInt(config.tamanhoFonteDados?.altura || 1))),
        largura: Math.max(1, Math.min(2, parseInt(config.tamanhoFonteDados?.largura || 1)))
      },
      tamanhoFontePlaca: {
        altura: Math.max(1, Math.min(4, parseInt(config.tamanhoFontePlaca?.altura || 2))),
        largura: Math.max(1, Math.min(4, parseInt(config.tamanhoFontePlaca?.largura || 2)))
      },
      tamanhoFonteValor: {
        altura: Math.max(1, Math.min(4, parseInt(config.tamanhoFonteValor?.altura || 2))),
        largura: Math.max(1, Math.min(4, parseInt(config.tamanhoFonteValor?.largura || 2)))
      },
      mostrarModelo: Boolean(config.mostrarModelo !== false),
      mostrarCor: Boolean(config.mostrarCor !== false),
      mostrarDatas: Boolean(config.mostrarDatas !== false),
      mostrarHoras: Boolean(config.mostrarHoras !== false),
      linhasAntesDivisoria: Math.max(0, Math.min(5, parseInt(config.linhasAntesDivisoria || 0))),
      linhasDepoisDivisoria: Math.max(0, Math.min(5, parseInt(config.linhasDepoisDivisoria || 0))),
      linhasAntesQR: Math.max(0, Math.min(5, parseInt(config.linhasAntesQR || 0))),
      linhasDepoisQR: Math.max(0, Math.min(5, parseInt(config.linhasDepoisQR || 1))),
      alinhamentoNome: ['left', 'center', 'right'].includes(config.alinhamentoNome) ? config.alinhamentoNome : 'center',
      alinhamentoDados: ['left', 'center', 'right'].includes(config.alinhamentoDados) ? config.alinhamentoDados : 'center',
      alinhamentoDivisoria: ['left', 'center', 'right'].includes(config.alinhamentoDivisoria) ? config.alinhamentoDivisoria : 'center',
      alinhamentoPlaca: ['left', 'center', 'right'].includes(config.alinhamentoPlaca) ? config.alinhamentoPlaca : 'center',
      alinhamentoDatas: ['left', 'center', 'right'].includes(config.alinhamentoDatas) ? config.alinhamentoDatas : 'center',
      alinhamentoModeloCor: ['left', 'center', 'right'].includes(config.alinhamentoModeloCor) ? config.alinhamentoModeloCor : 'center',
      alinhamentoValor: ['left', 'center', 'right'].includes(config.alinhamentoValor) ? config.alinhamentoValor : 'center'
    };
  }

  // Gerar recibo de ENTRADA
  async gerarReciboEntrada(veiculo, dadosEmpresa) {
    try {
      const encoder = new Encoder();
      const cfg = this.obterConfigImpressao(dadosEmpresa);
      const veiculoSeguro = {
        id: veiculo?.id ?? Date.now(),
        placa: String(veiculo?.placa || 'SEM-PLACA').trim(),
        modelo: String(veiculo?.modelo || '').trim(),
        cor: String(veiculo?.cor || '').trim(),
        entrada: Number(veiculo?.entrada) || Date.now()
      };
      const divisoria = '-'.repeat(Math.min(cfg.linhaDivisoria, 32));
      const qrPayload = veiculoSeguro.placa || String(veiculoSeguro.id);

      // Array para armazenar todas as partes do recibo
      const partes = [];

      // Inicialização
      encoder.initialize();
      partes.push(new Uint8Array(encoder.encode()));

      // NOME DA EMPRESA
      partes.push(this.criarSecaoTexto(
        cfg.nomeEmpresa.substring(0, 32),
        cfg.alinhamentoNome,
        cfg.tamanhoFonteNome.altura,
        cfg.tamanhoFonteNome.largura,
        true
      ));

      // DADOS DA EMPRESA
      if (cfg.imprimirCnpj && cfg.cnpj) {
        partes.push(this.criarSecaoTexto(
          `CNPJ: ${cfg.cnpj}`.substring(0, 32),
          cfg.alinhamentoDados,
          cfg.tamanhoFonteDados.altura,
          cfg.tamanhoFonteDados.largura,
          false
        ));
      }
      if (cfg.imprimirEndereco && cfg.endereco) {
        partes.push(this.criarSecaoTexto(
          cfg.endereco.substring(0, 32),
          cfg.alinhamentoDados,
          cfg.tamanhoFonteDados.altura,
          cfg.tamanhoFonteDados.largura,
          false
        ));
      }
      if (cfg.imprimirTelefone && cfg.telefone) {
        partes.push(this.criarSecaoTexto(
          `TEL: ${cfg.telefone}`.substring(0, 32),
          cfg.alinhamentoDados,
          cfg.tamanhoFonteDados.altura,
          cfg.tamanhoFonteDados.largura,
          false
        ));
      }

      // Espaçamento antes da divisória
      for (let i = 0; i < cfg.linhasAntesDivisoria; i++) {
        partes.push(new Uint8Array([0x0A]));
      }

      // LINHA DIVISÓRIA
      partes.push(this.criarSecaoTexto(
        divisoria,
        cfg.alinhamentoDivisoria,
        1, 1, false
      ));

      // Espaçamento depois da divisória
      for (let i = 0; i < cfg.linhasDepoisDivisoria; i++) {
        partes.push(new Uint8Array([0x0A]));
      }

      // PLACA
      partes.push(this.criarSecaoTexto(
        veiculoSeguro.placa,
        cfg.alinhamentoPlaca,
        cfg.tamanhoFontePlaca.altura,
        cfg.tamanhoFontePlaca.largura,
        true
      ));

      // DATA E HORAS
      const data = new Date(veiculoSeguro.entrada);
      if (cfg.mostrarDatas) {
        const dataFormatada = data.toLocaleDateString('pt-BR');
        partes.push(this.criarSecaoTexto(
          `DATA: ${dataFormatada}`,
          cfg.alinhamentoDatas,
          1, 1, false
        ));
      }
      if (cfg.mostrarHoras) {
        const horaFormatada = data.toLocaleTimeString('pt-BR');
        partes.push(this.criarSecaoTexto(
          `HORA: ${horaFormatada}`,
          cfg.alinhamentoDatas,
          1, 1, false
        ));
      }

      // MODELO E COR
      if ((cfg.mostrarModelo || cfg.mostrarCor) && (veiculoSeguro.modelo || veiculoSeguro.cor)) {
        partes.push(new Uint8Array([0x0A])); // linha em branco
        let modeloCor = '';
        if (cfg.mostrarModelo && cfg.mostrarCor) {
          modeloCor = `${veiculoSeguro.modelo} - ${veiculoSeguro.cor}`;
        } else if (cfg.mostrarModelo) {
          modeloCor = veiculoSeguro.modelo;
        } else {
          modeloCor = veiculoSeguro.cor;
        }
        partes.push(this.criarSecaoTexto(
          modeloCor.substring(0, 32),
          cfg.alinhamentoModeloCor,
          1, 1, false
        ));
      }

      // Espaçamento antes do QR
      for (let i = 0; i < cfg.linhasAntesQR; i++) {
        partes.push(new Uint8Array([0x0A]));
      }

      // QR CODE (sempre centralizado) - usar encoder para imagem
      const encoderQR = new Encoder();
      encoderQR.align('center');
      const qrRaster = await this.gerarQRCodeRaster(qrPayload, cfg.tamanhoQrCode);
      if (qrRaster && qrRaster.imageData) {
        try {
          encoderQR.image(qrRaster.imageData, qrRaster.width, qrRaster.height);
          partes.push(new Uint8Array(encoderQR.encode()));
        } catch (e) {
          console.warn('Erro ao encodar QR Code como imagem:', e);
          partes.push(this.criarSecaoTexto(
            `PLACA: ${veiculoSeguro.placa}`,
            'center',
            1, 1, false
          ));
        }
      }

      // Espaçamento depois do QR
      for (let i = 0; i < cfg.linhasDepoisQR; i++) {
        partes.push(new Uint8Array([0x0A]));
      }

      // RODAPÉ (sempre centralizado)
      partes.push(this.criarSecaoTexto(
        'Conserve este recibo',
        'center',
        1, 1, false
      ));

      // Comando de corte
      partes.push(new Uint8Array([0x1D, 0x56, 0x00]));

      return this.combinarBytes(...partes);
    } catch (error) {
      console.error('Erro ao gerar recibo de entrada:', error);
      return null;
    }
  }

  // Gerar recibo de SAÍDA
  async gerarReciboSaida(veiculo, dadosEmpresa, permanencia, valor) {
    try {
      const encoder = new Encoder();
      const cfg = this.obterConfigImpressao(dadosEmpresa);
      const veiculoSeguro = {
        id: veiculo?.id ?? Date.now(),
        placa: String(veiculo?.placa || 'SEM-PLACA').trim(),
        modelo: String(veiculo?.modelo || '').trim(),
        cor: String(veiculo?.cor || '').trim(),
        entrada: Number(veiculo?.entrada) || Date.now(),
        saida: Number(veiculo?.saida) || Date.now()
      };
      const divisoria = '-'.repeat(Math.min(cfg.linhaDivisoria, 32));
      const qrPayload = veiculoSeguro.placa || String(veiculoSeguro.id);
      const permanenciaSegura = String(permanencia || '00:00:00');
      const valorSeguro = Number.isFinite(Number(valor)) ? Number(valor) : 0;

      // Array para armazenar todas as partes do recibo
      const partes = [];

      // Inicialização
      encoder.initialize();
      partes.push(new Uint8Array(encoder.encode()));

      // NOME DA EMPRESA
      partes.push(this.criarSecaoTexto(
        cfg.nomeEmpresa.substring(0, 32),
        cfg.alinhamentoNome,
        cfg.tamanhoFonteNome.altura,
        cfg.tamanhoFonteNome.largura,
        true
      ));

      // DADOS DA EMPRESA
      if (cfg.imprimirCnpj && cfg.cnpj) {
        partes.push(this.criarSecaoTexto(
          `CNPJ: ${cfg.cnpj}`.substring(0, 32),
          cfg.alinhamentoDados,
          cfg.tamanhoFonteDados.altura,
          cfg.tamanhoFonteDados.largura,
          false
        ));
      }
      if (cfg.imprimirEndereco && cfg.endereco) {
        partes.push(this.criarSecaoTexto(
          cfg.endereco.substring(0, 32),
          cfg.alinhamentoDados,
          cfg.tamanhoFonteDados.altura,
          cfg.tamanhoFonteDados.largura,
          false
        ));
      }
      if (cfg.imprimirTelefone && cfg.telefone) {
        partes.push(this.criarSecaoTexto(
          `TEL: ${cfg.telefone}`.substring(0, 32),
          cfg.alinhamentoDados,
          cfg.tamanhoFonteDados.altura,
          cfg.tamanhoFonteDados.largura,
          false
        ));
      }

      // Espaçamento antes da divisória
      for (let i = 0; i < cfg.linhasAntesDivisoria; i++) {
        partes.push(new Uint8Array([0x0A]));
      }

      // LINHA DIVISÓRIA
      partes.push(this.criarSecaoTexto(
        divisoria,
        cfg.alinhamentoDivisoria,
        1, 1, false
      ));

      // Espaçamento depois da divisória
      for (let i = 0; i < cfg.linhasDepoisDivisoria; i++) {
        partes.push(new Uint8Array([0x0A]));
      }

      // TIPO DE RECIBO
      partes.push(this.criarSecaoTexto(
        'RECIBO DE SAÍDA',
        cfg.alinhamentoDatas,
        1, 1, false
      ));

      // PLACA
      partes.push(this.criarSecaoTexto(
        veiculoSeguro.placa,
        cfg.alinhamentoPlaca,
        cfg.tamanhoFontePlaca.altura,
        cfg.tamanhoFontePlaca.largura,
        true
      ));

      // DATA E HORAS
      const dataEntrada = new Date(veiculoSeguro.entrada);
      const dataSaida = new Date(veiculoSeguro.saida);
      if (cfg.mostrarDatas) {
        const dataFormatada = dataSaida.toLocaleDateString('pt-BR');
        partes.push(this.criarSecaoTexto(
          `DATA: ${dataFormatada}`,
          cfg.alinhamentoDatas,
          1, 1, false
        ));
      }
      if (cfg.mostrarHoras) {
        const horaEntrada = dataEntrada.toLocaleTimeString('pt-BR');
        const horaSaida = dataSaida.toLocaleTimeString('pt-BR');
        partes.push(this.criarSecaoTexto(
          `ENTRADA: ${horaEntrada}`,
          cfg.alinhamentoDatas,
          1, 1, false
        ));
        partes.push(this.criarSecaoTexto(
          `SAÍDA: ${horaSaida}`,
          cfg.alinhamentoDatas,
          1, 1, false
        ));
      }

      // MODELO E COR
      if ((cfg.mostrarModelo || cfg.mostrarCor) && (veiculoSeguro.modelo || veiculoSeguro.cor)) {
        partes.push(new Uint8Array([0x0A])); // linha em branco
        let modeloCor = '';
        if (cfg.mostrarModelo && cfg.mostrarCor) {
          modeloCor = `${veiculoSeguro.modelo} - ${veiculoSeguro.cor}`;
        } else if (cfg.mostrarModelo) {
          modeloCor = veiculoSeguro.modelo;
        } else {
          modeloCor = veiculoSeguro.cor;
        }
        partes.push(this.criarSecaoTexto(
          modeloCor.substring(0, 32),
          cfg.alinhamentoModeloCor,
          1, 1, false
        ));
      }

      // Espaçamento antes do QR
      for (let i = 0; i < cfg.linhasAntesQR; i++) {
        partes.push(new Uint8Array([0x0A]));
      }

      // QR CODE (sempre centralizado) - usar encoder para imagem
      const encoderQR = new Encoder();
      encoderQR.align('center');
      const qrRaster = await this.gerarQRCodeRaster(qrPayload, cfg.tamanhoQrCode);
      if (qrRaster && qrRaster.imageData) {
        try {
          encoderQR.image(qrRaster.imageData, qrRaster.width, qrRaster.height);
          partes.push(new Uint8Array(encoderQR.encode()));
        } catch (e) {
          console.warn('Erro ao encodar QR Code como imagem:', e);
          partes.push(this.criarSecaoTexto(
            `PLACA: ${veiculoSeguro.placa}`,
            'center',
            1, 1, false
          ));
        }
      }

      // Espaçamento depois do QR
      for (let i = 0; i < cfg.linhasDepoisQR; i++) {
        partes.push(new Uint8Array([0x0A]));
      }

      // SEGUNDA DIVISÓRIA
      partes.push(this.criarSecaoTexto(
        divisoria,
        cfg.alinhamentoDivisoria,
        1, 1, false
      ));

      // TEMPO E VALOR
      partes.push(this.criarSecaoTexto(
        `TEMPO: ${permanenciaSegura}`,
        cfg.alinhamentoValor,
        1, 1, true
      ));
      
      partes.push(this.criarSecaoTexto(
        `R$ ${valorSeguro.toFixed(2)}`,
        cfg.alinhamentoValor,
        cfg.tamanhoFonteValor.altura,
        cfg.tamanhoFonteValor.largura,
        true
      ));

      // RODAPÉ (sempre centralizado)
      partes.push(this.criarSecaoTexto(
        'Obrigado pela preferência!',
        'center',
        1, 1, false
      ));
      partes.push(this.criarSecaoTexto(
        'Volte sempre!',
        'center',
        1, 1, false
      ));

      // Comando de corte
      partes.push(new Uint8Array([0x1D, 0x56, 0x00]));

      return this.combinarBytes(...partes);
    } catch (error) {
      console.error('Erro ao gerar recibo de saída:', error);
      return null;
    }
  }

  // Imprimir recibo de entrada
  async imprimirEntrada(veiculo, nomeEmpresa) {
    const dados = await this.gerarReciboEntrada(veiculo, nomeEmpresa);
    if (!dados) {
      return { sucesso: false, mensagem: 'Erro ao gerar recibo' };
    }
    return await this.enviarDados(dados);
  }

  // Imprimir recibo de saída
  async imprimirSaida(veiculo, nomeEmpresa, permanencia, valor) {
    const dados = await this.gerarReciboSaida(veiculo, nomeEmpresa, permanencia, valor);
    if (!dados) {
      return { sucesso: false, mensagem: 'Erro ao gerar recibo' };
    }
    return await this.enviarDados(dados);
  }
}

export default BluetoothPrinter;
