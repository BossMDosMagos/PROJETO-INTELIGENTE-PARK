import Encoder from 'esc-pos-encoder';
import QRCode from 'qrcode';

class USBPrinter {
  constructor() {
    this.device = null;
    this.port = null;
    this.writer = null;
    this.isConnected = false;
    this.tipo = 'usb'; // 'usb' ou 'serial'
    this.interfaceNumber = null;
    this.endpointNumber = null;
    this.storageKeyUSB = 'park_usb_device_info';
    this.storageKeySerial = 'park_serial_port_info';
  }

  salvarUSBInfo(device) {
    const info = {
      vendorId: device?.vendorId,
      productId: device?.productId,
      serialNumber: device?.serialNumber || ''
    };
    localStorage.setItem(this.storageKeyUSB, JSON.stringify(info));
  }

  salvarSerialInfo(port) {
    const info = port?.getInfo ? port.getInfo() : {};
    localStorage.setItem(this.storageKeySerial, JSON.stringify(info || {}));
  }

  async configurarDispositivoUSB(device) {
    this.device = device;

    await this.device.open();

    if (this.device.configuration === null) {
      const configValue = this.device.configurations?.[0]?.configurationValue || 1;
      await this.device.selectConfiguration(configValue);
    }

    const interfaces = this.device.configuration.interfaces;
    let interfaceNum = null;
    let endpointNum = null;

    for (const iface of interfaces) {
      for (const alt of iface.alternates) {
        const endpoint = alt.endpoints?.find((e) => e.direction === 'out');
        if (endpoint) {
          interfaceNum = iface.interfaceNumber;
          endpointNum = endpoint.endpointNumber;
          break;
        }
      }
      if (endpointNum !== null) break;
    }

    if (interfaceNum === null || endpointNum === null) {
      await this.device.close();
      this.device = null;
      return {
        sucesso: false,
        mensagem: 'Dispositivo sem endpoint USB de escrita. Use Tentar Serial.'
      };
    }

    try {
      await this.device.claimInterface(interfaceNum);
    } catch (claimError) {
      try {
        await this.device.selectAlternateInterface(interfaceNum, 0);
        await this.device.claimInterface(interfaceNum);
      } catch (e) {
        await this.device.close();
        this.device = null;
        return {
          sucesso: false,
          mensagem: `Falha ao assumir interface USB (${claimError.message})`
        };
      }
    }

    this.interfaceNumber = interfaceNum;
    this.endpointNumber = endpointNum;
    this.tipo = 'usb';
    this.isConnected = true;
    this.salvarUSBInfo(this.device);

    return {
      sucesso: true,
      mensagem: `✅ ${this.device.productName || 'Impressora USB'}`
    };
  }

  // Conectar via Web USB API
  async conectarUSB() {
    try {
      if (!navigator.usb) {
        return { sucesso: false, mensagem: 'Web USB não suportado neste navegador' };
      }

      // Solicitar dispositivo USB
      const dispositivos = await navigator.usb.requestDevice({
        filters: [
          // Vendedor: Epson
          { vendorId: 0x04b8 },
          // Vendedor: Star Micronics
          { vendorId: 0x0519 },
          // Vendedor: Bematech
          { vendorId: 0x1e23 },
          // Vendedor: Zebra
          { vendorId: 0x14bb },
          // Vendedor: Elgin
          { vendorId: 0x0516 },
          // Genérico - Impressora térmica
          { classCode: 7 } // Printer class
        ]
      });
      return await this.configurarDispositivoUSB(dispositivos);
    } catch (error) {
      console.error('Erro ao conectar USB:', error);
      return {
        sucesso: false,
        mensagem: `Erro: ${error.message}`
      };
    }
  }

  // Conectar via Web Serial API (fallback)
  async conectarSerial() {
    try {
      if (!navigator.serial) {
        return { sucesso: false, mensagem: 'Web Serial não suportado neste navegador' };
      }

      // Solicitar porta serial
      this.port = await navigator.serial.requestPort({
        filters: [
          { usbVendorId: 0x04b8 }, // Epson
          { usbVendorId: 0x0519 }, // Star
          { usbVendorId: 0x1e23 }, // Bematech
          { usbVendorId: 0x14bb }, // Zebra
          { usbVendorId: 0x0516 }  // Elgin
        ]
      });

      if (!this.port) {
        return {
          sucesso: false,
          mensagem: 'Nenhuma porta serial selecionada'
        };
      }

      // Abrir porta com configuração típica para impressoras
      await this.port.open({
        baudRate: 9600,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
        flowControl: 'none'
      });

      this.writer = this.port.writable.getWriter();
      this.tipo = 'serial';
      this.isConnected = true;
      this.salvarSerialInfo(this.port);

      return {
        sucesso: true,
        mensagem: `✅ Porta Serial Conectada`
      };
    } catch (error) {
      console.error('Erro ao conectar Serial:', error);
      return {
        sucesso: false,
        mensagem: `Erro: ${error.message}`
      };
    }
  }

  async reconectarUSBAutomatico() {
    try {
      if (!navigator.usb?.getDevices) {
        return { sucesso: false, mensagem: 'Reconexão USB não suportada neste navegador' };
      }

      const devices = await navigator.usb.getDevices();
      if (!devices.length) {
        return { sucesso: false, mensagem: 'Nenhum dispositivo USB autorizado anteriormente' };
      }

      const salvoBruto = localStorage.getItem(this.storageKeyUSB);
      const salvo = salvoBruto ? JSON.parse(salvoBruto) : null;
      const candidatos = salvo
        ? [
            ...devices.filter((d) => d.vendorId === salvo.vendorId && d.productId === salvo.productId && (salvo.serialNumber ? d.serialNumber === salvo.serialNumber : true)),
            ...devices.filter((d) => !(d.vendorId === salvo.vendorId && d.productId === salvo.productId))
          ]
        : devices;

      for (const device of candidatos) {
        const resultado = await this.configurarDispositivoUSB(device);
        if (resultado.sucesso) {
          return resultado;
        }
      }

      return { sucesso: false, mensagem: 'Não foi possível reconectar automaticamente no USB' };
    } catch (error) {
      console.error('Erro na reconexão USB:', error);
      return { sucesso: false, mensagem: `Erro: ${error.message}` };
    }
  }

  async reconectarSerialAutomatico() {
    try {
      if (!navigator.serial?.getPorts) {
        return { sucesso: false, mensagem: 'Reconexão Serial não suportada neste navegador' };
      }

      const ports = await navigator.serial.getPorts();
      if (!ports.length) {
        return { sucesso: false, mensagem: 'Nenhuma porta serial autorizada anteriormente' };
      }

      const salvoBruto = localStorage.getItem(this.storageKeySerial);
      const salvo = salvoBruto ? JSON.parse(salvoBruto) : null;

      const candidatos = salvo
        ? [
            ...ports.filter((p) => {
              const info = p.getInfo ? p.getInfo() : {};
              return info.usbVendorId === salvo.usbVendorId && info.usbProductId === salvo.usbProductId;
            }),
            ...ports.filter((p) => {
              const info = p.getInfo ? p.getInfo() : {};
              return !(info.usbVendorId === salvo.usbVendorId && info.usbProductId === salvo.usbProductId);
            })
          ]
        : ports;

      for (const port of candidatos) {
        try {
          await port.open({
            baudRate: 9600,
            dataBits: 8,
            stopBits: 1,
            parity: 'none',
            flowControl: 'none'
          });

          this.port = port;
          this.writer = this.port.writable.getWriter();
          this.tipo = 'serial';
          this.isConnected = true;
          this.salvarSerialInfo(this.port);
          return { sucesso: true, mensagem: '✅ Porta Serial Reconectada' };
        } catch (erroPorta) {
          console.warn('Falha ao reconectar porta serial:', erroPorta);
        }
      }

      return { sucesso: false, mensagem: 'Não foi possível reconectar automaticamente na Serial' };
    } catch (error) {
      console.error('Erro na reconexão Serial:', error);
      return { sucesso: false, mensagem: `Erro: ${error.message}` };
    }
  }

  async reconectarAutomatico() {
    const resultadoUSB = await this.reconectarUSBAutomatico();
    if (resultadoUSB.sucesso) return resultadoUSB;

    const resultadoSerial = await this.reconectarSerialAutomatico();
    if (resultadoSerial.sucesso) return resultadoSerial;

    return { sucesso: false, mensagem: 'Nenhuma impressora USB/Serial autorizada para reconexão automática' };
  }

  // Desconectar
  async desconectar() {
    try {
      if (this.tipo === 'usb' && this.device) {
        try {
          if (this.interfaceNumber !== null) {
            await this.device.releaseInterface(this.interfaceNumber);
          }
        } catch (e) {
          console.warn('Erro ao liberar interface:', e);
        }
        await this.device.close();
      } else if (this.tipo === 'serial' && this.writer) {
        await this.writer.close();
        await this.port.close();
      }

      this.isConnected = false;
      this.interfaceNumber = null;
      this.endpointNumber = null;
      this.device = null;
      this.port = null;
      this.writer = null;
      return { sucesso: true, mensagem: 'Desconectado' };
    } catch (error) {
      console.error('Erro ao desconectar:', error);
      return { sucesso: false, mensagem: `Erro: ${error.message}` };
    }
  }

  // Enviar dados para impressora
  async enviarDados(dados) {
    if (!this.isConnected) {
      return { sucesso: false, mensagem: 'Impressora não conectada' };
    }

    try {
      let buffer;
      if (dados instanceof Uint8Array) {
        buffer = dados;
      } else if (typeof dados === 'string') {
        buffer = new TextEncoder().encode(dados);
      } else {
        buffer = new Uint8Array(dados);
      }

      if (this.tipo === 'usb') {
        return await this.enviarUSB(buffer);
      } else if (this.tipo === 'serial') {
        return await this.enviarSerial(buffer);
      }
    } catch (error) {
      console.error('Erro ao enviar:', error);
      return { sucesso: false, mensagem: `Erro: ${error.message}` };
    }
  }

  // Enviar via USB
  async enviarUSB(buffer) {
    try {
      if (!this.device || this.endpointNumber === null) {
        return { sucesso: false, mensagem: 'Nenhum endpoint de saída encontrado' };
      }

      // Dividir em chunks se necessário
      const chunkSize = 64;
      for (let i = 0; i < buffer.length; i += chunkSize) {
        const chunk = buffer.slice(i, i + chunkSize);
        await this.device.transferOut(this.endpointNumber, chunk);
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      return { sucesso: true, mensagem: 'Impressão enviada via USB' };
    } catch (error) {
      console.error('Erro USB transfer:', error);
      return { sucesso: false, mensagem: `Erro: ${error.message}` };
    }
  }

  // Enviar via Serial
  async enviarSerial(buffer) {
    try {
      if (!this.writer) {
        return { sucesso: false, mensagem: 'Writer não disponível' };
      }

      // Dividir em chunks
      const chunkSize = 512;
      for (let i = 0; i < buffer.length; i += chunkSize) {
        const chunk = buffer.slice(i, i + chunkSize);
        await this.writer.write(chunk);
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      return { sucesso: true, mensagem: 'Impressão enviada via Serial' };
    } catch (error) {
      console.error('Erro Serial write:', error);
      return { sucesso: false, mensagem: `Erro: ${error.message}` };
    }
  }

  // Gerar QR Code como raster para impressora térmica
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

      return {
        width: tamanho,
        height: tamanho,
        imageData: imageData
      };
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      return null;
    }
  }

  // Remover acentos e caracteres especiais para compatibilidade com impressoras térmicas
  removerAcentos(texto) {
    if (!texto) return '';
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos
      .replace(/[^\x00-\x7F]/g, ''); // Remove caracteres não-ASCII restantes
  }

  // Formatar texto
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

    const linhas = [];
    for (let i = 0; i < texto.length; i += largura) {
      linhas.push(texto.substring(i, i + largura));
    }
    return linhas.join('\n');
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
        placa: String(veiculo?.placa || 'SEM-PLACA'),
        modelo: String(veiculo?.modelo || ''),
        cor: String(veiculo?.cor || ''),
        entrada: Number(veiculo?.entrada) || Date.now()
      };
      const divisoria = '-'.repeat(cfg.linhaDivisoria);
      const qrPayload = veiculoSeguro.placa || String(veiculoSeguro.id);

      encoder.initialize();

      // NOME DA EMPRESA com tamanho e alinhamento configurável
      encoder.align(cfg.alinhamentoNome);
      encoder.size(cfg.tamanhoFonteNome.altura, cfg.tamanhoFonteNome.largura);
      encoder.bold(true);
      encoder.text(this.removerAcentos(cfg.nomeEmpresa));
      encoder.bold(false);
      encoder.newline();

      // DADOS DA EMPRESA com tamanho e alinhamento configurável
      encoder.align(cfg.alinhamentoDados);
      encoder.size(cfg.tamanhoFonteDados.altura, cfg.tamanhoFonteDados.largura);
      if (cfg.imprimirCnpj && cfg.cnpj) {
        encoder.text(this.removerAcentos(`CNPJ: ${cfg.cnpj}`));
        encoder.newline();
      }
      if (cfg.imprimirEndereco && cfg.endereco) {
        encoder.text(this.removerAcentos(cfg.endereco));
        encoder.newline();
      }
      if (cfg.imprimirTelefone && cfg.telefone) {
        encoder.text(this.removerAcentos(`TEL: ${cfg.telefone}`));
        encoder.newline();
      }

      // Espaçamento antes da divisória
      for (let i = 0; i < cfg.linhasAntesDivisoria; i++) {
        encoder.newline();
      }

      // LINHA DIVISÓRIA com alinhamento configurável
      encoder.align(cfg.alinhamentoDivisoria);
      encoder.size(1, 1);
      encoder.text(this.removerAcentos(divisoria));
      encoder.newline();

      // Espaçamento depois da divisória
      for (let i = 0; i < cfg.linhasDepoisDivisoria; i++) {
        encoder.newline();
      }

      // PLACA com tamanho e alinhamento configurável
      encoder.align(cfg.alinhamentoPlaca);
      encoder.size(cfg.tamanhoFontePlaca.altura, cfg.tamanhoFontePlaca.largura);
      encoder.bold(true);
      encoder.text(this.removerAcentos(veiculoSeguro.placa));
      encoder.bold(false);
      encoder.newline();

      // DATA E HORAS com alinhamento configurável
      encoder.align(cfg.alinhamentoDatas);
      encoder.size(1, 1);
      const data = new Date(veiculoSeguro.entrada);
      if (cfg.mostrarDatas) {
        const dataFormatada = data.toLocaleDateString('pt-BR');
        encoder.text(this.removerAcentos(`DATA: ${dataFormatada}`));
        encoder.newline();
      }
      if (cfg.mostrarHoras) {
        const horaFormatada = data.toLocaleTimeString('pt-BR');
        encoder.text(this.removerAcentos(`HORA: ${horaFormatada}`));
        encoder.newline();
      }

      // MODELO E COR com alinhamento configurável
      if ((cfg.mostrarModelo || cfg.mostrarCor) && (veiculoSeguro.modelo || veiculoSeguro.cor)) {
        encoder.align(cfg.alinhamentoModeloCor);
        encoder.newline();
        let modeloCor = '';
        if (cfg.mostrarModelo && cfg.mostrarCor) {
          modeloCor = `${veiculoSeguro.modelo} - ${veiculoSeguro.cor}`;
        } else if (cfg.mostrarModelo) {
          modeloCor = veiculoSeguro.modelo;
        } else {
          modeloCor = veiculoSeguro.cor;
        }
        encoder.text(this.removerAcentos(modeloCor.substring(0, cfg.larguraTicket)));
        encoder.newline();
      }

      // Espaçamento antes do QR
      for (let i = 0; i < cfg.linhasAntesQR; i++) {
        encoder.newline();
      }

      // QR CODE (sempre centralizado)
      encoder.align('center');
      const qrRaster = await this.gerarQRCodeRaster(qrPayload, cfg.tamanhoQrCode);
      if (qrRaster && qrRaster.imageData) {
        try {
          encoder.image(qrRaster.imageData, qrRaster.width, qrRaster.height);
        } catch (e) {
          console.warn('Erro ao encodar QR Code como imagem:', e);
          encoder.text(this.removerAcentos(`PLACA: ${veiculoSeguro.placa}`));
        }
      }

      // Espaçamento depois do QR
      for (let i = 0; i < cfg.linhasDepoisQR; i++) {
        encoder.newline();
      }

      // RODAPÉ (sempre centralizado)
      encoder.align('center');
      encoder.size(1, 1);
      encoder.text(this.removerAcentos('Conserve este recibo'));
      encoder.newline();

      encoder.cut();

      return encoder.encode();
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
        placa: String(veiculo?.placa || 'SEM-PLACA'),
        modelo: String(veiculo?.modelo || ''),
        cor: String(veiculo?.cor || ''),
        entrada: Number(veiculo?.entrada) || Date.now(),
        saida: Number(veiculo?.saida) || Date.now()
      };
      const divisoria = '-'.repeat(cfg.linhaDivisoria);
      const qrPayload = veiculoSeguro.placa || String(veiculoSeguro.id);
      const permanenciaSegura = String(permanencia || '00:00:00');
      const valorSeguro = Number.isFinite(Number(valor)) ? Number(valor) : 0;

      encoder.initialize();

      // NOME DA EMPRESA com tamanho e alinhamento configurável
      encoder.align(cfg.alinhamentoNome);
      encoder.size(cfg.tamanhoFonteNome.altura, cfg.tamanhoFonteNome.largura);
      encoder.bold(true);
      encoder.text(this.removerAcentos(cfg.nomeEmpresa));
      encoder.bold(false);
      encoder.newline();

      // DADOS DA EMPRESA com tamanho e alinhamento configurável
      encoder.align(cfg.alinhamentoDados);
      encoder.size(cfg.tamanhoFonteDados.altura, cfg.tamanhoFonteDados.largura);
      if (cfg.imprimirCnpj && cfg.cnpj) {
        encoder.text(this.removerAcentos(`CNPJ: ${cfg.cnpj}`));
        encoder.newline();
      }
      if (cfg.imprimirEndereco && cfg.endereco) {
        encoder.text(this.removerAcentos(cfg.endereco));
        encoder.newline();
      }
      if (cfg.imprimirTelefone && cfg.telefone) {
        encoder.text(this.removerAcentos(`TEL: ${cfg.telefone}`));
        encoder.newline();
      }

      // Espaçamento antes da divisória
      for (let i = 0; i < cfg.linhasAntesDivisoria; i++) {
        encoder.newline();
      }

      // LINHA DIVISÓRIA com alinhamento configurável
      encoder.align(cfg.alinhamentoDivisoria);
      encoder.size(1, 1);
      encoder.text(this.removerAcentos(divisoria));
      encoder.newline();

      // Espaçamento depois da divisória
      for (let i = 0; i < cfg.linhasDepoisDivisoria; i++) {
        encoder.newline();
      }

      // TIPO DE RECIBO com alinhamento da data
      encoder.align(cfg.alinhamentoDatas);
      encoder.size(1, 1);
      encoder.text(this.removerAcentos('RECIBO DE SAIDA'));
      encoder.newline();

      // PLACA com tamanho e alinhamento configurável
      encoder.align(cfg.alinhamentoPlaca);
      encoder.size(cfg.tamanhoFontePlaca.altura, cfg.tamanhoFontePlaca.largura);
      encoder.bold(true);
      encoder.text(this.removerAcentos(veiculoSeguro.placa));
      encoder.bold(false);
      encoder.newline();

      // DATA E HORAS com alinhamento configurável
      encoder.align(cfg.alinhamentoDatas);
      encoder.size(1, 1);
      const dataEntrada = new Date(veiculoSeguro.entrada);
      const dataSaida = new Date(veiculoSeguro.saida);
      if (cfg.mostrarDatas) {
        const dataFormatada = dataSaida.toLocaleDateString('pt-BR');
        encoder.text(this.removerAcentos(`DATA: ${dataFormatada}`));
        encoder.newline();
      }
      if (cfg.mostrarHoras) {
        const horaEntrada = dataEntrada.toLocaleTimeString('pt-BR');
        const horaSaida = dataSaida.toLocaleTimeString('pt-BR');
        encoder.text(this.removerAcentos(`ENTRADA: ${horaEntrada}`));
        encoder.newline();
        encoder.text(this.removerAcentos(`SAIDA: ${horaSaida}`));
        encoder.newline();
      }

      // MODELO E COR com alinhamento configurável
      if ((cfg.mostrarModelo || cfg.mostrarCor) && (veiculoSeguro.modelo || veiculoSeguro.cor)) {
        encoder.align(cfg.alinhamentoModeloCor);
        encoder.newline();
        let modeloCor = '';
        if (cfg.mostrarModelo && cfg.mostrarCor) {
          modeloCor = `${veiculoSeguro.modelo} - ${veiculoSeguro.cor}`;
        } else if (cfg.mostrarModelo) {
          modeloCor = veiculoSeguro.modelo;
        } else {
          modeloCor = veiculoSeguro.cor;
        }
        encoder.text(this.removerAcentos(modeloCor.substring(0, cfg.larguraTicket)));
        encoder.newline();
      }

      // Espaçamento antes do QR
      for (let i = 0; i < cfg.linhasAntesQR; i++) {
        encoder.newline();
      }

      // QR CODE (sempre centralizado)
      encoder.align('center');
      const qrRaster = await this.gerarQRCodeRaster(qrPayload, cfg.tamanhoQrCode);
      if (qrRaster && qrRaster.imageData) {
        try {
          encoder.image(qrRaster.imageData, qrRaster.width, qrRaster.height);
        } catch (e) {
          console.warn('Erro ao encodar QR Code como imagem:', e);
          encoder.text(this.removerAcentos(`PLACA: ${veiculoSeguro.placa}`));
        }
      }

      // Espaçamento depois do QR
      for (let i = 0; i < cfg.linhasDepoisQR; i++) {
        encoder.newline();
      }

      // SEGUNDA DIVISÓRIA com alinhamento configurável
      encoder.align(cfg.alinhamentoDivisoria);
      encoder.size(1, 1);
      encoder.text(this.removerAcentos(divisoria));
      encoder.newline();

      // TEMPO E VALOR com alinhamento configurável
      encoder.align(cfg.alinhamentoValor);
      encoder.size(1, 1);
      encoder.bold(true);
      encoder.text(this.removerAcentos(`TEMPO: ${permanenciaSegura}`));
      encoder.newline();
      
      encoder.size(cfg.tamanhoFonteValor.altura, cfg.tamanhoFonteValor.largura);
      encoder.bold(true);
      encoder.text(this.removerAcentos(`R$ ${valorSeguro.toFixed(2)}`));
      encoder.bold(false);
      encoder.newline();

      // RODAPÉ (sempre centralizado)
      encoder.align('center');
      encoder.size(1, 1);
      encoder.text(this.removerAcentos('Obrigado pela preferencia!'));
      encoder.newline();
      encoder.text(this.removerAcentos('Volte sempre!'));
      encoder.newline();

      encoder.cut();

      return encoder.encode();
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

export default USBPrinter;
