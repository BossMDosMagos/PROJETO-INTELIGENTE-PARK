import { r as reactExports, j as jsxRuntimeExports } from './index-B_A3Hknt.js';
import { c as createLucideIcon, C as Car, a as AlertCircle, b as CheckCircle, s as supabaseService, d as audioService, m as mensalistaService } from './App-DLthjJE9.js';

/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const ArrowRight = createLucideIcon("ArrowRight", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
]);

function PaginaCadastroMensalista() {
  const [passo, setPasso] = reactExports.useState(1);
  const [carregando, setCarregando] = reactExports.useState(false);
  const [erro, setErro] = reactExports.useState("");
  const [sucesso, setSucesso] = reactExports.useState(false);
  const [mensalistaEnviado, setMensalistaEnviado] = reactExports.useState(null);
  const [config, setConfig] = reactExports.useState({
    nomeEmpresa: "Command Park",
    logoUrl: null
  });
  reactExports.useEffect(() => {
    const carregarConfig = async () => {
      try {
        if (supabaseService.isOnline) {
          const { sucesso: sucesso2, dados } = await supabaseService.obterConfiguracoes();
          if (sucesso2 && dados) {
            setConfig({
              nomeEmpresa: dados.nome_empresa || "Command Park",
              logoUrl: dados.logo_url || null
            });
            return;
          }
        }
        const savedConfig = localStorage.getItem("park-config");
        if (savedConfig) {
          const parsed = JSON.parse(savedConfig);
          setConfig({
            nomeEmpresa: parsed.nomeEmpresa || "Command Park",
            logoUrl: parsed.logoUrl || null
          });
        }
      } catch (error) {
        console.error("Erro ao carregar config:", error);
      }
    };
    carregarConfig();
  }, []);
  const [formData, setFormData] = reactExports.useState({
    nome: "",
    cpf: "",
    whatsapp: "",
    email: "",
    // Novo campo
    placa: "",
    renavam: "",
    // Novo campo
    modelo: "",
    cor: "",
    // Novo campo (seleção)
    tipoVeiculo: "Passeio",
    // Novo campo (seleção)
    diaVencimento: "05"
    // Novo campo (seleção)
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let novoValor = value;
    if (name === "placa") {
      novoValor = value.toUpperCase();
    }
    if (name === "renavam") {
      novoValor = value.replace(/\D/g, "").slice(0, 11);
    }
    if (name === "modelo") {
      novoValor = value.toUpperCase();
    }
    if (name === "nome") {
      novoValor = value.toUpperCase();
    }
    if (name === "cpf") {
      novoValor = value.replace(/\D/g, "").slice(0, 11);
    }
    if (name === "whatsapp") {
      novoValor = value.replace(/\D/g, "").slice(0, 11);
    }
    setFormData((prev) => ({
      ...prev,
      [name]: novoValor
    }));
    setErro("");
  };
  const validarPasso1 = () => {
    if (!formData.nome.trim()) {
      setErro("Nome é obrigatório");
      return false;
    }
    if (!formData.cpf || formData.cpf.length !== 11) {
      setErro("CPF deve ter 11 dígitos");
      return false;
    }
    if (!mensalistaService.validarCPF(formData.cpf)) {
      setErro("CPF inválido");
      return false;
    }
    if (!formData.whatsapp || formData.whatsapp.length !== 11) {
      setErro("WhatsApp deve ter 11 dígitos (com DDD)");
      return false;
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErro("E-mail inválido");
      return false;
    }
    return true;
  };
  const validarPasso2 = () => {
    if (!formData.placa || formData.placa.length < 7) {
      setErro("Placa do veículo inválida (Mínimo 7 caracteres)");
      return false;
    }
    if (!formData.renavam || formData.renavam.length !== 11) {
      setErro("Renavam deve ter 11 dígitos numéricos");
      return false;
    }
    if (!formData.modelo.trim()) {
      setErro("Marca/Modelo é obrigatório");
      return false;
    }
    if (!formData.cor) {
      setErro("Selecione a cor do veículo");
      return false;
    }
    return true;
  };
  const proximoPasso = () => {
    if (passo === 1) {
      if (validarPasso1()) {
        setPasso(2);
        setErro("");
      } else {
        audioService.erro();
      }
    }
  };
  const voltarPasso = () => {
    if (passo === 2) {
      setPasso(1);
      setErro("");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarPasso2()) {
      audioService.erro();
      return;
    }
    setCarregando(true);
    try {
      const resultado = await mensalistaService.criar(formData);
      if (resultado.sucesso) {
        audioService.sucesso();
        setMensalistaEnviado(resultado.mensalista);
        setSucesso(true);
        setPasso(3);
        setFormData({
          nome: "",
          cpf: "",
          whatsapp: "",
          placa: "",
          modelo: "",
          cor: ""
        });
      } else {
        audioService.erro();
        setErro(resultado.erro);
      }
    } catch (error) {
      console.error("Erro ao enviar cadastro:", error);
      audioService.erro();
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };
  const formatarCPF = (cpf) => {
    if (!cpf || cpf.length !== 11) return cpf;
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;
  };
  const formatarTelefone = (tel) => {
    if (!tel || tel.length !== 11) return tel;
    return `(${tel.slice(0, 2)}) ${tel.slice(2, 7)}-${tel.slice(7)}`;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-[#020617] flex items-center justify-center p-4 relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/20 rounded-full blur-[120px]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/20 rounded-full blur-[120px]" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-lg relative z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative inline-block mb-6 group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-1 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-28 h-28 bg-[#0F172A] rounded-2xl flex items-center justify-center border border-slate-700/50 shadow-2xl overflow-hidden p-4", children: config.logoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: config.logoUrl,
              alt: "Logo Empresa",
              className: "w-full h-full object-contain"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Car, { className: "w-12 h-12 text-cyan-400" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight mb-2", children: config.nomeEmpresa || "Command Park" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cyan-400/80 font-medium tracking-wide uppercase text-sm", children: "Sistema de Cadastramento Seguro" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#1E293B]/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden", children: [
        passo < 3 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex w-full h-1.5 bg-slate-800", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `h-full bg-cyan-500 transition-all duration-500 ${passo === 1 ? "w-1/2" : "w-full"}`
          }
        ) }),
        passo === 1 && /* PASSO 1: DADOS PESSOAIS */
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-white mb-2", children: "Dados Pessoais" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400 text-sm leading-relaxed", children: "Informe seus dados para contato e identificação." })
          ] }),
          erro && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 animate-shake", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { className: "w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-400 font-medium text-sm", children: erro })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1", children: "Nome Completo *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  name: "nome",
                  value: formData.nome,
                  onChange: handleInputChange,
                  placeholder: "SEU NOME COMPLETO",
                  className: "w-full px-4 py-3.5 bg-[#0F172A] text-white border border-slate-700 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition placeholder-slate-600",
                  maxLength: "60"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1", children: "CPF *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  name: "cpf",
                  value: formData.cpf,
                  onChange: handleInputChange,
                  placeholder: "000.000.000-00",
                  className: "w-full px-4 py-3.5 bg-[#0F172A] text-white border border-slate-700 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition font-mono placeholder-slate-600",
                  maxLength: "11"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mt-1 ml-1", children: formData.cpf ? formatarCPF(formData.cpf) : "Apenas números" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1", children: "WhatsApp *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  name: "whatsapp",
                  value: formData.whatsapp,
                  onChange: handleInputChange,
                  placeholder: "(00) 00000-0000",
                  className: "w-full px-4 py-3.5 bg-[#0F172A] text-white border border-slate-700 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition font-mono placeholder-slate-600",
                  maxLength: "11"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mt-1 ml-1", children: formData.whatsapp ? formatarTelefone(formData.whatsapp) : "DDD + Número" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1", children: "E-mail (Opcional)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "email",
                  name: "email",
                  value: formData.email,
                  onChange: handleInputChange,
                  placeholder: "seu.email@exemplo.com",
                  className: "w-full px-4 py-3.5 bg-[#0F172A] text-white border border-slate-700 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition placeholder-slate-600"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: proximoPasso,
                className: "w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 rounded-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 mt-8 shadow-lg border border-white/10",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Continuar" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-5 h-5" })
                ]
              }
            )
          ] })
        ] }),
        passo === 2 && /* PASSO 2: DADOS DO VEÍCULO */
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-white mb-2", children: "Dados do Veículo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400 text-sm leading-relaxed", children: "Qual veículo você vai estacionar?" })
          ] }),
          erro && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 animate-shake", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { className: "w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-400 font-medium text-sm", children: erro })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1", children: "Placa *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    name: "placa",
                    value: formData.placa,
                    onChange: handleInputChange,
                    placeholder: "ABC-1234",
                    className: "w-full px-4 py-3.5 bg-[#0F172A] text-white border border-slate-700 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition font-mono text-lg tracking-widest placeholder-slate-600 uppercase",
                    maxLength: "8"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1", children: "Renavam *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    name: "renavam",
                    value: formData.renavam,
                    onChange: handleInputChange,
                    placeholder: "00000000000",
                    className: "w-full px-4 py-3.5 bg-[#0F172A] text-white border border-slate-700 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition font-mono placeholder-slate-600",
                    maxLength: "11"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1", children: "Marca / Modelo *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  name: "modelo",
                  value: formData.modelo,
                  onChange: handleInputChange,
                  placeholder: "Ex: Toyota Corolla",
                  className: "w-full px-4 py-3.5 bg-[#0F172A] text-white border border-slate-700 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition placeholder-slate-600 uppercase",
                  maxLength: "40"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1", children: "Cor *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    name: "cor",
                    value: formData.cor,
                    onChange: handleInputChange,
                    className: "w-full px-4 py-3.5 bg-[#0F172A] text-white border border-slate-700 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Selecione" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "BRANCO", children: "Branco" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "PRETO", children: "Preto" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "PRATA", children: "Prata" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "CINZA", children: "Cinza" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "VERMELHO", children: "Vermelho" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "AZUL", children: "Azul" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "OUTROS", children: "Outros" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1", children: "Tipo *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    name: "tipoVeiculo",
                    value: formData.tipoVeiculo,
                    onChange: handleInputChange,
                    className: "w-full px-4 py-3.5 bg-[#0F172A] text-white border border-slate-700 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Passeio", children: "Passeio" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "SUV/Pick-up", children: "SUV/Pick-up" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Motocicleta", children: "Motocicleta" })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1", children: "Vencimento Preferencial *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2", children: ["05", "10", "15", "20"].map((dia) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setFormData((prev) => ({ ...prev, diaVencimento: dia })),
                  className: `py-3 rounded-xl border font-bold transition-all ${formData.diaVencimento === dia ? "bg-cyan-600 border-cyan-500 text-white shadow-lg shadow-cyan-900/30" : "bg-[#0F172A] border-slate-700 text-slate-400 hover:border-slate-500"}`,
                  children: [
                    "Dia ",
                    dia
                  ]
                },
                dia
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-800/50 rounded-xl p-4 border border-slate-700 mt-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-bold text-slate-400 uppercase mb-3 border-b border-slate-700 pb-2", children: "Resumo do Cadastro" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: "Nome:" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: formData.nome })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: "Veículo:" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white", children: [
                    formData.modelo,
                    " (",
                    formData.cor,
                    ")"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: "Placa:" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cyan-400 font-mono font-bold", children: formData.placa })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: "Vencimento:" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white", children: [
                    "Dia ",
                    formData.diaVencimento
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-8", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: voltarPasso,
                  className: "px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition border border-slate-700",
                  children: "Voltar"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "submit",
                  disabled: carregando,
                  className: "flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-violet-900/20 border border-white/10",
                  children: carregando ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Processando..." })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Finalizar Cadastro" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { className: "w-5 h-5" })
                  ] })
                }
              )
            ] })
          ] })
        ] }),
        passo === 3 && /* PASSO 3: CONFIRMAÇÃO */
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50 shadow-lg shadow-green-500/30 animate-scaleIn", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { className: "w-10 h-10 text-green-400" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-white mb-3", children: "Cadastro Enviado!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-slate-300 mb-8 leading-relaxed", children: [
            "Seus dados foram recebidos com sucesso.",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cyan-400 font-semibold block mt-2", children: "Aguarde a ativação pelo administrador do pátio." })
          ] }),
          mensalistaEnviado && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-800/50 rounded-xl p-4 mb-8 text-left border border-slate-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-400 mb-1", children: [
              "Nome: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: mensalistaEnviado.nome })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-400 mb-1", children: [
              "Placa: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-mono", children: mensalistaEnviado.placa })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-400", children: [
              "Protocolo: ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-cyan-400 font-mono", children: [
                "#",
                mensalistaEnviado.id?.slice(0, 8)
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => window.location.reload(),
              className: "w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 rounded-xl transition-all border border-white/10",
              children: "Novo Cadastro"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mt-12 space-y-3 opacity-60 hover:opacity-100 transition-opacity", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cyan-400 font-bold text-xs", children: "CP" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-300 font-bold tracking-tight", children: "Command Park" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 text-[10px] uppercase tracking-widest", children: "Tecnologia de Gestão Inteligente" })
      ] })
    ] })
  ] });
}

export { PaginaCadastroMensalista };
//# sourceMappingURL=PaginaCadastroMensalista-CdPHTOtF.js.map
