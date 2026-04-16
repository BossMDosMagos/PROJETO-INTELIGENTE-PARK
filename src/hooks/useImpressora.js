import { useState, useCallback } from 'react';

/**
 * Hook para gerenciar impressora Bluetooth
 */
export function useImpressoraBluetooth() {
  const [impressora, setImpressora] = useState(null);
  const [conectada, setConectada] = useState(false);
  const [nome, setNome] = useState('');
  const [status, setStatus] = useState('');

  const conectar = useCallback(async () => {
    try {
      setStatus('Procurando impressoras...');
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['00001800-0000-1000-8000-00805f9b34fb', '00001801-0000-1000-8000-00805f9b34fb']
      });
      
      const server = await device.gatt.connect();
      setImpressora(server);
      setNome(device.name || 'Impressora Bluetooth');
      setConectada(true);
      setStatus('Conectada com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao conectar:', error);
      setStatus(`Erro: ${error.message}`);
      setConectada(false);
      return false;
    }
  }, []);

  const desconectar = useCallback(async () => {
    if (impressora?.connected) {
      await impressora.disconnect();
    }
    setImpressora(null);
    setConectada(false);
    setNome('');
    setStatus('Desconectada');
  }, [impressora]);

  const imprimir = useCallback(async (dados) => {
    if (!conectada || !impressora) {
      setStatus('Impressora não conectada');
      return false;
    }

    try {
      setStatus('Imprimindo...');
      const encoder = new TextEncoder();
      const services = await impressora.getPrimaryServices();
      
      for (const service of services) {
        const characteristics = await service.getCharacteristics();
        for (const char of characteristics) {
          if (char.properties.write || char.properties.writeWithoutResponse) {
            await char.writeValue(encoder.encode(dados));
          }
        }
      }
      
      setStatus('Impressão concluída!');
      return true;
    } catch (error) {
      console.error('Erro ao imprimir:', error);
      setStatus(`Erro: ${error.message}`);
      return false;
    }
  }, [conectada, impressora]);

  return {
    impressora,
    conectada,
    nome,
    status,
    conectar,
    desconectar,
    imprimir
  };
}

/**
 * Hook para gerenciar impressora USB
 */
export function useImpressoraUSB() {
  const [impressora, setImpressora] = useState(null);
  const [conectada, setConectada] = useState(false);
  const [nome, setNome] = useState('');
  const [status, setStatus] = useState('');

  const conectar = useCallback(async () => {
    try {
      setStatus('Procurando impressoras USB...');
      const devices = await navigator.usb.getDevices();
      
      if (devices.length === 0) {
        setStatus('Nenhuma impressora USB encontrada');
        return false;
      }

      const device = devices[0];
      await device.open();
      
      if (device.configuration === null) {
        await device.selectConfiguration(1);
      }
      
      await device.claimInterface(0);
      
      setImpressora(device);
      setNome(device.productName || 'Impressora USB');
      setConectada(true);
      setStatus('Conectada com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao conectar:', error);
      setStatus(`Erro: ${error.message}`);
      setConectada(false);
      return false;
    }
  }, []);

  const desconectar = useCallback(async () => {
    if (impressora) {
      try {
        await impressora.releaseInterface(0);
        await impressora.close();
      } catch (e) {
        console.error('Erro ao desconectar:', e);
      }
    }
    setImpressora(null);
    setConectada(false);
    setNome('');
    setStatus('Desconectada');
  }, [impressora]);

  const imprimir = useCallback(async (dados) => {
    if (!conectada || !impressora) {
      setStatus('Impressora não conectada');
      return false;
    }

    try {
      setStatus('Imprimindo...');
      const encoder = new TextEncoder();
      const bytes = encoder.encode(dados);
      
      await impressora.transferOut(1, bytes);
      
      setStatus('Impressão concluída!');
      return true;
    } catch (error) {
      console.error('Erro ao imprimir:', error);
      setStatus(`Erro: ${error.message}`);
      return false;
    }
  }, [conectada, impressora]);

  return {
    impressora,
    conectada,
    nome,
    status,
    conectar,
    desconectar,
    imprimir
  };
}
