import { j as jsxRuntimeExports } from './index-D6J6UaK6.js';
import { PaginaCadastroMensalista } from './PaginaCadastroMensalista-BwDD-kQs.js';
import { A as ArrowLeft } from './App-BYAJEU_2.js';

function PaginaCadastroPublico({ onVoltar }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-blue-100", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white border-b sticky top-0 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto px-4 py-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-bold text-lg", children: "CP" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-gray-800", children: "Command Park" })
      ] }),
      onVoltar && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: onVoltar,
          className: "flex items-center gap-2 text-gray-600 hover:text-gray-900 transition",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-5 h-5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Voltar" })
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto p-4 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-gray-800 mb-2", children: "Cadastro de Mensalista" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600", children: "Complete o formulário abaixo para se cadastrar como mensalista. Nosso time entrará em contato em breve para finalizar sua ativação." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PaginaCadastroMensalista, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gray-100 border-t mt-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl mx-auto px-4 py-6 text-center text-gray-600 text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "© 2026 Command Park - Todos os direitos reservados" }) }) })
  ] });
}

export { PaginaCadastroPublico };
//# sourceMappingURL=PaginaCadastroPublico-CHY1Iem8.js.map
