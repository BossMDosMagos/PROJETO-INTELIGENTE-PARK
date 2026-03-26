import { r as reactExports, j as jsxRuntimeExports } from './index-D6J6UaK6.js';
import { c as createLucideIcon, X, A as ArrowLeft, U as User, C as Car, f as AlertTriangle, D as DollarSign, H as History, s as supabaseService, d as audioService, R as RefreshCw, b as CheckCircle } from './App-BYAJEU_2.js';

/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const Calendar = createLucideIcon("Calendar", [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
]);

/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const Check = createLucideIcon("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);

/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const Clock$1 = createLucideIcon("Clock", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }]
]);

/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const Eye = createLucideIcon("Eye", [
  ["path", { d: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z", key: "rwhkz3" }],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);

/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const Pen = createLucideIcon("Pen", [
  ["path", { d: "M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z", key: "5qss01" }]
]);

/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const Phone = createLucideIcon("Phone", [
  [
    "path",
    {
      d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
      key: "foiqr5"
    }
  ]
]);

/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const XCircle = createLucideIcon("XCircle", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
]);

function PaginaDetalhesMensalista({ mensalistaId, onVoltar, onAtualizar }) {
  const [mensalista, setMensalista] = reactExports.useState(null);
  const [carregando, setCarregando] = reactExports.useState(true);
  const [editando, setEditando] = reactExports.useState(false);
  const [formEdit, setFormEdit] = reactExports.useState({});
  const [pagamentos, setPagamentos] = reactExports.useState([]);
  const [carregandoPagamentos, setCarregandoPagamentos] = reactExports.useState(false);
  const [modalPagamento, setModalPagamento] = reactExports.useState(false);
  const [vencimento, setVencimento] = reactExports.useState("");
  const [processando, setProcessando] = reactExports.useState(false);
  const carregarDetalhes = async () => {
    if (!supabaseService.initialized || !mensalistaId) {
      setCarregando(false);
      return;
    }
    setCarregando(true);
    try {
      const resultado = await supabaseService.obterMensalistaDetalhes(mensalistaId);
      if (resultado.sucesso) {
        setMensalista(resultado.dados);
        setFormEdit(resultado.dados);
      }
    } catch (erro) {
      console.error("Erro:", erro);
    } finally {
      setCarregando(false);
    }
  };
  const carregarPagamentos = async () => {
    if (!supabaseService.initialized || !mensalistaId) return;
    setCarregandoPagamentos(true);
    try {
      const resultado = await supabaseService.listarPagamentosMensalista(mensalistaId);
      if (resultado.sucesso) {
        setPagamentos(resultado.dados || []);
      }
    } catch (erro) {
      console.error("Erro:", erro);
    } finally {
      setCarregandoPagamentos(false);
    }
  };
  reactExports.useEffect(() => {
    carregarDetalhes();
    carregarPagamentos();
  }, [mensalistaId]);
  const handleSalvarEdicao = async () => {
    setProcessando(true);
    try {
      const resultado = await supabaseService.editarMensalista(mensalistaId, formEdit);
      if (resultado.sucesso) {
        audioService.sucesso();
        setMensalista(resultado.dados);
        setEditando(false);
        onAtualizar?.();
      } else {
        audioService.erro();
        alert(`Erro: ${resultado.erro}`);
      }
    } finally {
      setProcessando(false);
    }
  };
  const handleRegistrarPagamento = async () => {
    if (!vencimento || vencimento <= 0) {
      alert("Informe um valor válido");
      return;
    }
    setProcessando(true);
    try {
      const resultado = await supabaseService.registrarPagamento(mensalistaId, vencimento, "PIX");
      if (resultado.sucesso) {
        audioService.sucesso();
        setVencimento("");
        setModalPagamento(false);
        await carregarPagamentos();
      } else {
        audioService.erro();
        alert(`Erro: ${resultado.erro}`);
      }
    } finally {
      setProcessando(false);
    }
  };
  const formatarData = (dataString) => {
    if (!dataString) return "-";
    return new Date(dataString).toLocaleDateString("pt-BR");
  };
  const formatarCPF = (cpf) => {
    if (!cpf) return "-";
    const c = String(cpf).replace(/\D/g, "");
    return c.length === 11 ? `${c.slice(0, 3)}.${c.slice(3, 6)}.${c.slice(6, 9)}-${c.slice(9)}` : cpf;
  };
  const formatarTelefone = (tel) => {
    if (!tel) return "-";
    const t = String(tel).replace(/\D/g, "");
    return t.length === 11 ? `(${t.slice(0, 2)}) ${t.slice(2, 7)}-${t.slice(7)}` : tel;
  };
  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
  };
  if (carregando) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400", children: "Carregando detalhes..." })
    ] });
  }
  if (!mensalista) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-500/10 p-4 rounded-full inline-block mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-8 h-8 text-red-500" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-400 font-bold mb-4", children: "Mensalista não encontrado" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
        e.preventDefault();
        onVoltar?.();
      }, className: "px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all", children: "Voltar" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-fade-in-up", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: (e) => {
            e.preventDefault();
            onVoltar?.();
          },
          className: "p-2 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-6 h-6" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-white tracking-tight", children: mensalista.nome }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-slate-400 text-sm flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `w-2 h-2 rounded-full ${mensalista.status === "ATIVO" ? "bg-emerald-500 shadow-[0_0_10px_#10b981]" : "bg-amber-500"}` }),
          mensalista.status
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#1E293B]/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-32 h-32 text-cyan-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6 relative z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-bold text-white flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-5 h-5 text-cyan-400" }),
            "Dados Cadastrais"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setEditando(!editando),
              className: "p-2 hover:bg-white/10 text-cyan-400 rounded-lg transition-colors",
              children: editando ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-5 h-5" })
            }
          )
        ] }),
        !editando ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 text-sm relative z-10", children: [
          mensalista.email && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#0F172A]/50 p-3 rounded-xl border border-slate-700/50 flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-slate-800 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4 text-slate-400" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 text-xs uppercase tracking-wider", children: "E-mail" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-200", children: mensalista.email })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#0F172A]/50 p-3 rounded-xl border border-slate-700/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 text-xs uppercase tracking-wider mb-1", children: "CPF" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-slate-200", children: formatarCPF(mensalista.cpf) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#0F172A]/50 p-3 rounded-xl border border-slate-700/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 text-xs uppercase tracking-wider mb-1", children: "WhatsApp" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-slate-200", children: formatarTelefone(mensalista.whatsapp) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#0F172A]/50 p-4 rounded-xl border border-slate-700/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-3 border-b border-slate-700/50 pb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-slate-800 p-2 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Car, { className: "w-5 h-5 text-violet-400" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-bold", children: "Veículo & Plano" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 text-xs uppercase", children: "Placa" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-bold font-mono text-lg", children: mensalista.placa })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 text-xs uppercase", children: "Renavam" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-mono", children: mensalista.renavam || "-" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 text-xs uppercase", children: "Modelo" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white", children: [
                  mensalista.modelo,
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-500 text-xs", children: [
                    "(",
                    mensalista.cor,
                    ")"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 text-xs uppercase", children: "Tipo" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white", children: mensalista.tipo_veiculo || "Passeio" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 text-xs uppercase font-bold", children: "Vencimento Preferencial" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20", children: [
                "Dia ",
                mensalista.dia_vencimento || "05"
              ] })
            ] })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 animate-fade-in relative z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-slate-500 uppercase font-bold mb-1 block", children: "Nome Completo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                className: "w-full bg-[#0F172A] border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none transition",
                value: formEdit.nome || "",
                onChange: (e) => setFormEdit({ ...formEdit, nome: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-slate-500 uppercase font-bold mb-1 block", children: "CPF" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  className: "w-full bg-[#0F172A] border border-slate-700 rounded-lg p-3 text-white font-mono focus:border-cyan-500 focus:outline-none transition",
                  value: formEdit.cpf || "",
                  onChange: (e) => setFormEdit({ ...formEdit, cpf: e.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-slate-500 uppercase font-bold mb-1 block", children: "WhatsApp" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  className: "w-full bg-[#0F172A] border border-slate-700 rounded-lg p-3 text-white font-mono focus:border-cyan-500 focus:outline-none transition",
                  value: formEdit.whatsapp || "",
                  onChange: (e) => setFormEdit({ ...formEdit, whatsapp: e.target.value })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-slate-500 uppercase font-bold mb-1 block", children: "E-mail" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                className: "w-full bg-[#0F172A] border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none transition",
                value: formEdit.email || "",
                onChange: (e) => setFormEdit({ ...formEdit, email: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-slate-500 uppercase font-bold mb-1 block", children: "Placa" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  className: "w-full bg-[#0F172A] border border-slate-700 rounded-lg p-3 text-white font-mono uppercase focus:border-cyan-500 focus:outline-none transition",
                  value: formEdit.placa || "",
                  onChange: (e) => setFormEdit({ ...formEdit, placa: e.target.value.toUpperCase() })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-slate-500 uppercase font-bold mb-1 block", children: "Renavam" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  className: "w-full bg-[#0F172A] border border-slate-700 rounded-lg p-3 text-white font-mono focus:border-cyan-500 focus:outline-none transition",
                  value: formEdit.renavam || "",
                  onChange: (e) => setFormEdit({ ...formEdit, renavam: e.target.value })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-slate-500 uppercase font-bold mb-1 block", children: "Modelo" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  className: "w-full bg-[#0F172A] border border-slate-700 rounded-lg p-3 text-white uppercase focus:border-cyan-500 focus:outline-none transition",
                  value: formEdit.modelo || "",
                  onChange: (e) => setFormEdit({ ...formEdit, modelo: e.target.value.toUpperCase() })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-slate-500 uppercase font-bold mb-1 block", children: "Cor" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  className: "w-full bg-[#0F172A] border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none transition",
                  value: formEdit.cor || "",
                  onChange: (e) => setFormEdit({ ...formEdit, cor: e.target.value }),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Selecione" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "BRANCO", children: "BRANCO" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "PRETO", children: "PRETO" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "PRATA", children: "PRATA" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "CINZA", children: "CINZA" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "VERMELHO", children: "VERMELHO" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "AZUL", children: "AZUL" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "OUTROS", children: "OUTROS" })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-slate-500 uppercase font-bold mb-1 block", children: "Tipo Veículo" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  className: "w-full bg-[#0F172A] border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none transition",
                  value: formEdit.tipo_veiculo || "Passeio",
                  onChange: (e) => setFormEdit({ ...formEdit, tipo_veiculo: e.target.value }),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Passeio", children: "Passeio" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "SUV/Pick-up", children: "SUV/Pick-up" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Motocicleta", children: "Motocicleta" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-slate-500 uppercase font-bold mb-1 block", children: "Dia Vencimento" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  className: "w-full bg-[#0F172A] border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none transition",
                  value: formEdit.dia_vencimento || "05",
                  onChange: (e) => setFormEdit({ ...formEdit, dia_vencimento: e.target.value }),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "05", children: "Dia 05" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "10", children: "Dia 10" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "15", children: "Dia 15" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "20", children: "Dia 20" })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: handleSalvarEdicao,
              disabled: processando,
              className: "w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 mt-2 transition-all shadow-lg shadow-emerald-900/20 active:scale-95",
              children: processando ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-5 h-5" }),
                "Salvar Alterações"
              ] })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#1E293B]/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-32 h-32 text-violet-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-bold text-white mb-6 flex items-center gap-2 relative z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-5 h-5 text-violet-400" }),
          "Status & Vigência"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 relative z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 bg-[#0F172A]/50 rounded-xl border border-slate-700/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 text-xs uppercase tracking-wider mb-1", children: "Cadastro" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-300 font-semibold", children: formatarData(mensalista.data_cadastro) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 text-xs uppercase tracking-wider mb-1", children: "Status Atual" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${mensalista.status === "ATIVO" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : mensalista.status === "PENDENTE" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-slate-500/10 text-slate-400 border border-slate-500/20"}`, children: mensalista.status })
            ] })
          ] }),
          mensalista.data_vencimento ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-gradient-to-br from-violet-900/20 to-indigo-900/20 rounded-xl border border-violet-500/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-violet-300 text-xs uppercase tracking-wider mb-1 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
              "Vencimento"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-white", children: formatarData(mensalista.data_vencimento) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-violet-400 mt-2", children: "O acesso será bloqueado após esta data." })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-amber-500/10 rounded-xl border border-amber-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-amber-400 text-sm font-medium flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { className: "w-4 h-4" }),
            "Sem vigência ativa"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setModalPagamento(true),
              className: "w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-violet-900/20 border border-white/10 transition-all active:scale-95 group-hover:shadow-violet-900/40",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "w-5 h-5" }),
                "Registrar Pagamento / Renovar"
              ]
            }
          ) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#1E293B]/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-bold text-white mb-6 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "w-5 h-5 text-emerald-400" }),
        "Histórico de Pagamentos"
      ] }),
      carregandoPagamentos ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin w-6 h-6 border-2 border-slate-600 border-t-slate-300 rounded-full mx-auto mb-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 text-sm", children: "Carregando..." })
      ] }) : pagamentos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12 bg-[#0F172A]/30 rounded-xl border border-slate-800/50 border-dashed", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "w-12 h-12 text-slate-700 mx-auto mb-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 text-sm", children: "Nenhum pagamento registrado ainda." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-xl border border-slate-700/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-[#0F172A] border-b border-slate-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-4 text-slate-400 font-medium", children: "Data" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-4 text-slate-400 font-medium", children: "Valor" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-4 text-slate-400 font-medium", children: "Método" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-slate-800", children: pagamentos.map((pag) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-800/30 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-slate-300", children: formatarData(pag.data_pagamento) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 font-bold text-emerald-400 font-mono", children: formatarMoeda(pag.valor) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs font-bold uppercase", children: pag.metodo }) })
        ] }, pag.id)) })
      ] }) })
    ] }),
    modalPagamento && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#1E293B] border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fade-in-up", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-white mb-2", children: "Registrar Pagamento" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400 text-sm mb-6", children: "Informe o valor para registrar o pagamento e renovar a vigência." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-slate-400 uppercase font-bold mb-2 block", children: "Valor (R$)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold", children: "R$" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              value: vencimento,
              onChange: (e) => setVencimento(e.target.value),
              placeholder: "0,00",
              step: "0.01",
              className: "w-full pl-12 pr-4 py-4 bg-[#0F172A] border border-slate-700 rounded-xl text-white text-xl font-mono focus:border-emerald-500 focus:outline-none transition-colors",
              autoFocus: true
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleRegistrarPagamento,
            disabled: processando,
            className: "flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded-xl disabled:opacity-50 shadow-lg shadow-emerald-900/20 transition-all active:scale-95",
            children: processando ? "Processando..." : "Confirmar"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setModalPagamento(false),
            className: "flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition-all active:scale-95",
            children: "Cancelar"
          }
        )
      ] })
    ] }) })
  ] });
}

function AbaSolicitacoesMensalistas() {
  const [mensalistas, setMensalistas] = reactExports.useState([]);
  const [carregando, setCarregando] = reactExports.useState(true);
  const [filtro, setFiltro] = reactExports.useState("PENDENTE");
  const [diasVigencia, setDiasVigencia] = reactExports.useState(30);
  const [confirmando, setConfirmando] = reactExports.useState(null);
  const [processando, setProcessando] = reactExports.useState(null);
  const [mensalistaDetalhes, setMensalistaDetalhes] = reactExports.useState(null);
  const carregarMensalistas = async () => {
    if (!supabaseService.initialized) {
      console.warn("⚠️ Supabase não inicializado");
      return;
    }
    setCarregando(true);
    try {
      const resultado = await supabaseService.listarMensalistas(
        filtro === "TODAS" ? null : filtro
      );
      if (resultado.sucesso) {
        setMensalistas(resultado.dados || []);
      } else {
        console.error("Erro ao carregar:", resultado.erro);
        setMensalistas([]);
      }
    } catch (erro) {
      console.error("Erro:", erro);
      setMensalistas([]);
    } finally {
      setCarregando(false);
    }
  };
  reactExports.useEffect(() => {
    carregarMensalistas();
  }, [filtro]);
  reactExports.useEffect(() => {
    const interval = setInterval(() => {
      carregarMensalistas();
    }, 3e4);
    return () => clearInterval(interval);
  }, [filtro]);
  const handleAtivar = async (mensalista) => {
    setProcessando(mensalista.id);
    try {
      const resultado = await supabaseService.atualizarMensalista(
        mensalista.id,
        "ATIVO",
        diasVigencia,
        // Mantendo dia de vencimento original se existir
        mensalista.dia_vencimento
      );
      if (resultado.sucesso) {
        audioService.sucesso();
        await carregarMensalistas();
        setConfirmando(null);
      } else {
        audioService.erro();
        alert(`Erro: ${resultado.erro}`);
      }
    } catch (erro) {
      console.error("Erro:", erro);
      audioService.erro();
    } finally {
      setProcessando(null);
    }
  };
  const handleInativar = async (mensalista) => {
    setProcessando(mensalista.id);
    try {
      const resultado = await supabaseService.atualizarMensalista(
        mensalista.id,
        "INATIVO",
        0
      );
      if (resultado.sucesso) {
        audioService.sucesso();
        await carregarMensalistas();
      } else {
        audioService.erro();
        alert(`Erro: ${resultado.erro}`);
      }
    } catch (erro) {
      console.error("Erro:", erro);
      audioService.erro();
    } finally {
      setProcessando(null);
    }
  };
  const handleDeletar = async (mensalista) => {
    if (!window.confirm(`Deletar permanentemente ${mensalista.nome}?`)) {
      return;
    }
    setProcessando(mensalista.id);
    try {
      const resultado = await supabaseService.removerMensalista(mensalista.id);
      if (resultado.sucesso) {
        audioService.sucesso();
        await carregarMensalistas();
      } else {
        audioService.erro();
        alert(`Erro: ${resultado.erro}`);
      }
    } catch (erro) {
      console.error("Erro:", erro);
      audioService.erro();
    } finally {
      setProcessando(null);
    }
  };
  const mensalistasFiltrante = filtro === "TODAS" ? mensalistas : mensalistas.filter((m) => (m.status || "PENDENTE") === filtro);
  const contadores = {
    pendentes: mensalistas.filter((m) => (m.status || "PENDENTE") === "PENDENTE").length,
    ativos: mensalistas.filter((m) => (m.status || "PENDENTE") === "ATIVO").length,
    inativos: mensalistas.filter((m) => (m.status || "PENDENTE") === "INATIVO").length,
    total: mensalistas.length
  };
  const formatarData = (dataString) => {
    if (!dataString) return "-";
    return new Date(dataString).toLocaleDateString("pt-BR");
  };
  const formatarCPF = (cpf) => {
    if (!cpf) return "-";
    const c = String(cpf).replace(/\D/g, "");
    return c.length === 11 ? `${c.slice(0, 3)}.${c.slice(3, 6)}.${c.slice(6, 9)}-${c.slice(9)}` : cpf;
  };
  const formatarTelefone = (tel) => {
    if (!tel) return "-";
    const t = String(tel).replace(/\D/g, "");
    return t.length === 11 ? `(${t.slice(0, 2)}) ${t.slice(2, 7)}-${t.slice(7)}` : tel;
  };
  const getBadgeStatus = (status) => {
    const map = {
      "PENDENTE": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "ATIVO": "bg-green-100 text-green-800 border-green-200",
      "INATIVO": "bg-gray-100 text-gray-800 border-gray-200"
    };
    return map[status] || map["PENDENTE"];
  };
  const getIconStatus = (status) => {
    const map = {
      "PENDENTE": /* @__PURE__ */ jsxRuntimeExports.jsx(Clock$1, { className: "w-4 h-4" }),
      "ATIVO": /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { className: "w-4 h-4" }),
      "INATIVO": /* @__PURE__ */ jsxRuntimeExports.jsx(XCircle, { className: "w-4 h-4" })
    };
    return map[status] || map["PENDENTE"];
  };
  if (mensalistaDetalhes) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      PaginaDetalhesMensalista,
      {
        mensalistaId: mensalistaDetalhes,
        onVoltar: () => {
          setMensalistaDetalhes(null);
          carregarMensalistas();
        },
        onAtualizar: carregarMensalistas
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Car, { className: "w-6 h-6 text-blue-600" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Solicitações de Mensalistas" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-yellow-900/20 border-2 border-yellow-700/50 rounded-lg p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase font-bold text-yellow-400", children: "Pendentes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-yellow-300 mt-2", children: contadores.pendentes })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-green-900/20 border-2 border-green-700/50 rounded-lg p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase font-bold text-green-400", children: "Ativos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-green-300 mt-2", children: contadores.ativos })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-800/50 border-2 border-gray-600/50 rounded-lg p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase font-bold text-gray-400", children: "Inativos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-gray-300 mt-2", children: contadores.inativos })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-blue-900/20 border-2 border-blue-700/50 rounded-lg p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase font-bold text-blue-400", children: "Total" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-blue-300 mt-2", children: contadores.total })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap items-center", children: [
      ["PENDENTE", "ATIVO", "INATIVO", "TODAS"].map((status) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setFiltro(status),
          className: `px-4 py-2 rounded-lg font-semibold transition ${filtro === status ? "bg-blue-600 text-white shadow-lg" : "bg-[#1E293B] text-gray-300 hover:bg-[#334155] border border-gray-700"}`,
          children: status
        },
        status
      )),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: carregarMensalistas,
          disabled: carregando,
          className: "ml-auto px-4 py-2 rounded-lg font-semibold transition bg-emerald-500 text-white hover:bg-emerald-600 flex items-center gap-2 disabled:opacity-50",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `w-4 h-4 ${carregando ? "animate-spin" : ""}` }),
            "Recarregar"
          ]
        }
      )
    ] }),
    filtro === "PENDENTE" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-blue-900/20 border-2 border-blue-700/50 rounded-lg p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-semibold text-blue-300 mb-2", children: "Dias de Vigência ao Ativar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: [7, 15, 30, 60, 90].map((dias) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setDiasVigencia(dias),
          className: `px-4 py-2 rounded-lg font-semibold transition ${diasVigencia === dias ? "bg-blue-600 text-white shadow-lg" : "bg-[#1E293B] text-gray-300 border border-blue-700/50 hover:bg-blue-900/30"}`,
          children: [
            dias,
            "d"
          ]
        },
        dias
      )) })
    ] }),
    carregando && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8 bg-gray-50 rounded-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-8 h-8 text-gray-400 mx-auto mb-3 animate-spin" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 font-semibold", children: "Carregando mensalistas..." })
    ] }),
    !carregando && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: mensalistasFiltrante.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12 bg-[#1E293B]/50 rounded-lg border border-gray-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Car, { className: "w-12 h-12 text-gray-500 mx-auto mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 font-semibold", children: "Nenhum mensalista encontrado" })
    ] }) : mensalistasFiltrante.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#1E293B] border border-gray-700 rounded-lg p-4 hover:shadow-lg transition hover:border-blue-500/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-white", children: m.nome }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400 font-mono", children: formatarCPF(m.cpf) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-2 px-3 py-1 rounded-full border ${getBadgeStatus(m.status || "PENDENTE")}`, children: [
            getIconStatus(m.status || "PENDENTE"),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-sm", children: m.status || "PENDENTE" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Car, { className: "w-4 h-4 text-blue-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500", children: "Placa" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold font-mono", children: m.placa || "-" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-4 h-4 text-green-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500", children: "WhatsApp" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold", children: formatarTelefone(m.whatsapp) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4 text-purple-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500", children: "Cadastro" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold", children: formatarData(m.data_cadastro) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock$1, { className: "w-4 h-4 text-amber-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500", children: "Vencimento Pref." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold", children: [
                "Dia ",
                m.dia_vencimento || "05"
              ] })
            ] })
          ] })
        ] }),
        (m.modelo || m.cor || m.tipo_veiculo) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 text-sm text-gray-400 bg-slate-800/50 p-2 rounded-lg border border-slate-700/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "Veículo: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-semibold", children: m.modelo || "-" }),
            " ",
            m.cor && `(${m.cor})`
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "Renavam: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-mono", children: m.renavam || "-" })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t pt-4 flex gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setMensalistaDetalhes(m.id),
            className: "flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" }),
              "Ver Detalhes"
            ]
          }
        ),
        (m.status || "PENDENTE") === "PENDENTE" && confirmando !== m.id && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setConfirmando(m.id), disabled: processando === m.id, className: "flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg disabled:opacity-50", children: "✓ Ativar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDeletar(m), disabled: processando === m.id, className: "flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg disabled:opacity-50", children: "✗ Deletar" })
        ] }),
        confirmando === m.id && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full text-xs text-gray-600 bg-yellow-50 p-2 rounded border border-yellow-200 mb-2", children: [
            "Vigência: ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
              diasVigencia,
              " dias"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleAtivar(m), disabled: processando === m.id, className: "flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg disabled:opacity-50", children: processando === m.id ? "Processando..." : "Confirmar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setConfirmando(null), disabled: processando === m.id, className: "flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 rounded-lg disabled:opacity-50", children: "Cancelar" })
        ] }),
        (m.status || "PENDENTE") === "ATIVO" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleInativar(m), disabled: processando === m.id, className: "flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 rounded-lg disabled:opacity-50", children: "Inativar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDeletar(m), disabled: processando === m.id, className: "flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg disabled:opacity-50", children: "Deletar" })
        ] }),
        (m.status || "PENDENTE") === "INATIVO" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setConfirmando(m.id), disabled: processando === m.id, className: "flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg disabled:opacity-50", children: "Reativar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDeletar(m), disabled: processando === m.id, className: "flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg disabled:opacity-50", children: "Deletar" })
        ] })
      ] })
    ] }, m.id)) })
  ] });
}

export { AbaSolicitacoesMensalistas };
//# sourceMappingURL=AbaSolicitacoesMensalistas-Bn6EjCYB.js.map
