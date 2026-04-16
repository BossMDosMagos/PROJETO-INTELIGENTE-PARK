import React, { useState } from 'react';
import { Building, MapPin, Phone, Globe, X, AlertCircle, CheckCircle } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { policiaAcessoService } from '../services/policiaAcessoService';
import { audioService } from '../services/audioService';

/**
 * Modal de Cadastro de Unidade (Pátio)
 * 
 * Apenas usuários MASTER podem cadastrar novas unidades
 */
export function ModalCadastroUnidade({ isOpen, onClose, onSucesso }) {
  const [passo, setPasso] = useState(1); // 1 = dados, 2 = confirmação, 3 = sucesso
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    endereco_numero: '',
    endereco_complemento: '',
    cidade: '',
    estado: '',
    cep: '',
    latitude: null,
    longitude: null,
    cnpj: '',
    telefone: '',
    email: '',
    responsavel: '',
    capacidade_total: 50,
    horario_abertura: '08:00',
    horario_fechamento: '18:00',
    aceita_online: true,
    aceita_mensalistas: true,
    status: 'ATIVA'
  });

  const [unidadeCriada, setUnidadeCriada] = useState(null);

  // Verificar permissão
  if (!policiaAcessoService.ehMaster()) {
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setErro('');
  };

  const validarFormulario = () => {
    if (!formData.nome.trim()) {
      setErro('Nome da unidade é obrigatório');
      return false;
    }

    if (!formData.cnpj.trim()) {
      setErro('CNPJ é obrigatório');
      return false;
    }

    if (!validarCNPJ(formData.cnpj)) {
      setErro('CNPJ inválido');
      return false;
    }

    if (!formData.endereco.trim()) {
      setErro('Endereço é obrigatório');
      return false;
    }

    if (!formData.cidade.trim()) {
      setErro('Cidade é obrigatória');
      return false;
    }

    if (!formData.estado || formData.estado.length !== 2) {
      setErro('Estado inválido (use 2 letras)');
      return false;
    }

    if (formData.capacidade_total < 1) {
      setErro('Capacidade deve ser maior que 0');
      return false;
    }

    return true;
  };

  const validarCNPJ = (cnpj) => {
    const apenas = cnpj.replace(/\D/g, '');
    if (apenas.length !== 14) return false;
    
    // Validação simplificada (produção usar biblioteca especializada)
    if (/^(\d)\1{13}$/.test(apenas)) return false;
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      audioService.erro();
      return;
    }

    setPasso(2);
  };

  const handleConfirmar = async () => {
    setCarregando(true);

    try {
      // Inserir unidade no Supabase
      const { data, error } = await supabaseService.client
        .from('unidades')
        .insert([{
          ...formData,
          cnpj: formData.cnpj.replace(/\D/g, ''),
          created_by: policiaAcessoService.usuarioAtual.user_id
        }])
        .select()
        .single();

      if (error) throw error;

      // Registrar auditoria
      await policiaAcessoService.registrarAuditoria(
        'unidades',
        'INSERT',
        data.id,
        {},
        formData,
        `Cadastro de nova unidade: ${formData.nome}`
      );

      setUnidadeCriada(data);
      setPasso(3);
      audioService.sucesso();

      // Chamar callback após 3 segundos
      setTimeout(() => {
        onSucesso?.(data);
        handleFechar();
      }, 3000);

    } catch (erro) {
      audioService.erro();
      setErro(erro.message || 'Erro ao criar unidade');
      setPasso(1);
    } finally {
      setCarregando(false);
    }
  };

  const handleFechar = () => {
    setPasso(1);
    setFormData({
      nome: '',
      endereco: '',
      endereco_numero: '',
      endereco_complemento: '',
      cidade: '',
      estado: '',
      cep: '',
      latitude: null,
      longitude: null,
      cnpj: '',
      telefone: '',
      email: '',
      responsavel: '',
      capacidade_total: 50,
      horario_abertura: '08:00',
      horario_fechamento: '18:00',
      aceita_online: true,
      aceita_mensalistas: true,
      status: 'ATIVA'
    });
    setErro('');
    setUnidadeCriada(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 sticky top-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building className="w-6 h-6" />
            <h2 className="text-2xl font-bold">
              {passo === 1 ? 'Nova Unidade' : passo === 2 ? 'Confirmação' : 'Sucesso'}
            </h2>
          </div>
          <button
            onClick={handleFechar}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition"
            disabled={carregando}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          {/* Passo 1: Formulário */}
          {passo === 1 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {erro && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700">{erro}</p>
                </div>
              )}

              {/* Informações Básicas */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-bold text-blue-900 mb-4">📍 Informações Básicas</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nome da Unidade *
                    </label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      placeholder="Pátio Centro Histórico"
                      className="w-full px-4 py-2 bg-white text-gray-900 border-2 border-blue-300 rounded-lg focus:border-blue-600 focus:outline-none"
                      maxLength="150"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      CNPJ *
                    </label>
                    <input
                      type="text"
                      name="cnpj"
                      value={formData.cnpj}
                      onChange={handleInputChange}
                      placeholder="12.345.678/0001-90"
                      className="w-full px-4 py-2 bg-white text-gray-900 border-2 border-blue-300 rounded-lg focus:border-blue-600 focus:outline-none font-mono"
                      maxLength="18"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Responsável
                    </label>
                    <input
                      type="text"
                      name="responsavel"
                      value={formData.responsavel}
                      onChange={handleInputChange}
                      placeholder="João Silva"
                      className="w-full px-4 py-2 bg-white text-gray-900 border-2 border-blue-300 rounded-lg focus:border-blue-600 focus:outline-none"
                      maxLength="100"
                    />
                  </div>
                </div>
              </div>

              {/* Localização */}
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-bold text-green-900 mb-4">🗺️ Localização</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Endereço *
                    </label>
                    <input
                      type="text"
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleInputChange}
                      placeholder="Rua Principal"
                      className="w-full px-4 py-2 bg-white text-gray-900 border-2 border-green-300 rounded-lg focus:border-green-600 focus:outline-none"
                      maxLength="255"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Número
                      </label>
                      <input
                        type="text"
                        name="endereco_numero"
                        value={formData.endereco_numero}
                        onChange={handleInputChange}
                        placeholder="123"
                        className="w-full px-4 py-2 bg-white text-gray-900 border-2 border-green-300 rounded-lg focus:border-green-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        CEP
                      </label>
                      <input
                        type="text"
                        name="cep"
                        value={formData.cep}
                        onChange={handleInputChange}
                        placeholder="12345-678"
                        className="w-full px-4 py-2 bg-white text-gray-900 border-2 border-green-300 rounded-lg focus:border-green-600 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Estado *
                      </label>
                      <input
                        type="text"
                        name="estado"
                        value={formData.estado}
                        onChange={handleInputChange}
                        placeholder="SP"
                        className="w-full px-4 py-2 bg-white text-gray-900 border-2 border-green-300 rounded-lg focus:border-green-600 focus:outline-none uppercase"
                        maxLength="2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Cidade *
                      </label>
                      <input
                        type="text"
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleInputChange}
                        placeholder="São Paulo"
                        className="w-full px-4 py-2 bg-white text-gray-900 border-2 border-green-300 rounded-lg focus:border-green-600 focus:outline-none"
                        maxLength="100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Complemento
                      </label>
                      <input
                        type="text"
                        name="endereco_complemento"
                        value={formData.endereco_complemento}
                        onChange={handleInputChange}
                        placeholder="Apto 10"
                        className="w-full px-4 py-2 bg-white text-gray-900 border-2 border-green-300 rounded-lg focus:border-green-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contato */}
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-bold text-purple-900 mb-4">📞 Contato</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleInputChange}
                        placeholder="(11) 98765-4321"
                        className="w-full px-4 py-2 bg-white text-gray-900 border-2 border-purple-300 rounded-lg focus:border-purple-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="contato@patio.com.br"
                        className="w-full px-4 py-2 bg-white text-gray-900 border-2 border-purple-300 rounded-lg focus:border-purple-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Configuração Operacional */}
              <div className="bg-amber-50 rounded-lg p-4">
                <h3 className="font-bold text-amber-900 mb-4">⚙️ Configuração</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Capacidade Total *
                      </label>
                      <input
                        type="number"
                        name="capacidade_total"
                        value={formData.capacidade_total}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full px-4 py-2 bg-white text-gray-900 border-2 border-amber-300 rounded-lg focus:border-amber-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Abre às
                      </label>
                      <input
                        type="time"
                        name="horario_abertura"
                        value={formData.horario_abertura}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-white text-gray-900 border-2 border-amber-300 rounded-lg focus:border-amber-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Fecha às
                      </label>
                      <input
                        type="time"
                        name="horario_fechamento"
                        value={formData.horario_fechamento}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-white text-gray-900 border-2 border-amber-300 rounded-lg focus:border-amber-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="aceita_online"
                        checked={formData.aceita_online}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded border-2 border-gray-300"
                      />
                      <span className="text-gray-700 font-semibold">Aceita pagamento online</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="aceita_mensalistas"
                        checked={formData.aceita_mensalistas}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded border-2 border-gray-300"
                      />
                      <span className="text-gray-700 font-semibold">Aceita mensalistas</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleFechar}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-all active:scale-95"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all active:scale-95"
                >
                  Próximo
                </button>
              </div>
            </form>
          )}

          {/* Passo 2: Confirmação */}
          {passo === 2 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <p className="text-gray-700">
                  Você está criando uma nova unidade <strong>{formData.nome}</strong> no sistema.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Localização</p>
                  <p className="font-bold">{formData.endereco}, {formData.cidade} - {formData.estado}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Capacidade</p>
                  <p className="font-bold">{formData.capacidade_total} vagas</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Horário</p>
                  <p className="font-bold">{formData.horario_abertura} - {formData.horario_fechamento}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">CNPJ</p>
                  <p className="font-bold font-mono">{formData.cnpj}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setPasso(1)}
                  disabled={carregando}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-all active:scale-95 disabled:opacity-50"
                >
                  Voltar
                </button>
                <button
                  onClick={handleConfirmar}
                  disabled={carregando}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-lg hover:from-green-700 hover:to-green-800 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {carregando ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Confirmar
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Passo 3: Sucesso */}
          {passo === 3 && (
            <div className="text-center py-8 space-y-4">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 rounded-full p-4">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900">Unidade Criada!</h3>
              
              <p className="text-gray-600">
                <strong>{unidadeCriada?.nome}</strong> foi cadastrada com sucesso no sistema.
              </p>

              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-left">
                <p className="text-sm text-gray-600">ID da Unidade:</p>
                <p className="font-mono text-xs text-gray-700 break-all">{unidadeCriada?.id}</p>
              </div>

              <p className="text-sm text-gray-500 pt-4">
                Modal fechará automaticamente...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
