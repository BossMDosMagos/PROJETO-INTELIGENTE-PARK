import React, { useState, useEffect } from 'react';
import { PaginaCadastroMensalista } from './components/PaginaCadastroMensalista';
import { ArrowLeft } from 'lucide-react';

/**
 * Página pública de cadastro de mensalistas
 * Acessada via link enviado pelo WhatsApp
 * Interface simplificada e segura
 */
export function PaginaCadastroPublico({ onVoltar }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header simplificado */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">IP</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">Inteligente Park</h1>
          </div>
          {onVoltar && (
            <button
              onClick={onVoltar}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Voltar</span>
            </button>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Cadastro de Mensalista</h2>
          <p className="text-gray-600">
            Complete o formulário abaixo para se cadastrar como mensalista. 
            Nosso time entrará em contato em breve para finalizar sua ativação.
          </p>
        </div>

        {/* Componente de cadastro */}
        <PaginaCadastroMensalista />
      </div>

      {/* Footer */}
      <div className="bg-gray-100 border-t mt-12">
        <div className="max-w-2xl mx-auto px-4 py-6 text-center text-gray-600 text-sm">
          <p>© 2026 Inteligente Park - Todos os direitos reservados</p>
        </div>
      </div>
    </div>
  );
}
