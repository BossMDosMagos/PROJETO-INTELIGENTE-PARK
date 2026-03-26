import { r as reactExports, j as jsxRuntimeExports } from './index-D6J6UaK6.js';
import { c as createLucideIcon, L as LogIn, a as AlertCircle, U as User, e as Lock, s as supabaseService } from './App-BYAJEU_2.js';

/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const Loader2 = createLucideIcon("Loader2", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);

function PaginaLogin({ onLoginSuccess }) {
  const [operador, setOperador] = reactExports.useState("");
  const [senha, setSenha] = reactExports.useState("");
  const [carregando, setCarregando] = reactExports.useState(false);
  const [erro, setErro] = reactExports.useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    if (!operador.trim()) {
      setErro("Operador é obrigatório");
      return;
    }
    if (!senha.trim()) {
      setErro("Senha é obrigatória");
      return;
    }
    setCarregando(true);
    try {
      if (!supabaseService.initialized) {
        const supabaseUrl = "https://pumbsmawfbzaczklxeog.supabase.co";
        const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1bWJzbWF3ZmJ6YWN6a2x4ZW9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NTIzODgsImV4cCI6MjA4ODIyODM4OH0.aNx8DCffzuxc7S6yEACCDuS2byuQf8SQzzSfJPA3RQI";
        if (!supabaseUrl || !supabaseAnonKey) ;
        console.log("🔑 Inicializando Supabase...");
        const Init = await supabaseService.initialize(supabaseUrl, supabaseAnonKey);
        if (!Init) {
          setErro("Erro ao conectar com Supabase");
          setCarregando(false);
          return;
        }
      }
      console.log("🔐 Tentando login com operador:", operador);
      const resultado = await supabaseService.login(operador, senha);
      if (resultado.sucesso) {
        console.log("✅ Login bem-sucedido!");
        if (onLoginSuccess) {
          const user = supabaseService.obterUsuarioAtual();
          onLoginSuccess(user);
        }
      } else {
        setErro(resultado.erro || "Erro ao fazer login");
      }
    } catch (err) {
      console.error("❌ Erro:", err);
      setErro("Erro: " + err.message);
    } finally {
      setCarregando(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "w-8 h-8 text-indigo-600", "aria-hidden": "true" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Inteligente Park" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 text-sm", children: "Sistema de Gestão de Estacionamento" })
    ] }),
    erro && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3",
        role: "alert",
        "aria-live": "polite",
        "aria-atomic": "true",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { className: "w-5 h-5 text-red-600 flex-shrink-0 mt-0.5", "aria-hidden": "true" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-800", children: erro })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", noValidate: true, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "operador-input", className: "block text-sm font-medium text-gray-700 mb-2", children: [
          "Operador ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#dc2626" }, children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "absolute left-3 top-3 w-5 h-5 text-gray-400", "aria-hidden": "true" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "operador-input",
              type: "text",
              value: operador,
              onChange: (e) => setOperador(e.target.value),
              placeholder: "master, admin, supervisor ou operador",
              className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900",
              disabled: carregando,
              required: true,
              "aria-required": "true",
              "aria-invalid": !!erro && !operador,
              "aria-label": "Campo de operador"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "senha-input", className: "block text-sm font-medium text-gray-700 mb-2", children: [
          "Senha ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#dc2626" }, children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-3 top-3 w-5 h-5 text-gray-400", "aria-hidden": "true" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "senha-input",
              type: "password",
              value: senha,
              onChange: (e) => setSenha(e.target.value),
              placeholder: "••••••••",
              className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900",
              disabled: carregando,
              required: true,
              "aria-required": "true",
              "aria-invalid": !!erro && !senha,
              "aria-label": "Campo de senha"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "submit",
          disabled: carregando,
          className: `w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${carregando ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700"}`,
          "aria-busy": carregando,
          children: carregando ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { className: "w-5 h-5 animate-spin", "aria-hidden": "true" }),
            "Entrando..."
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "w-5 h-5", "aria-hidden": "true" }),
            "Entrar"
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 p-3 bg-blue-50 rounded-lg text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-blue-900 mb-2", children: "👤 Teste:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-blue-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Operador:" }),
        " master"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-blue-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Senha:" }),
        " Senha@123"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 text-center mt-4", children: "Sistema v1.0" })
  ] }) });
}

export { PaginaLogin, PaginaLogin as default };
//# sourceMappingURL=PaginaLogin-BXSScGZh.js.map
