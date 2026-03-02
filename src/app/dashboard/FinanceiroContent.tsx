"use client";

import { useState, useEffect } from "react";
import {
  Wallet,
  Plus,
  Minus,
  Eye,
  EyeOff,
  Clock,
  Check,
  X,
} from "lucide-react";

interface CarteiresResponse {
  id: number;
  usuario_id: number;
  saldo: number;
  saldo_pendente: number;
  total_ganho: number;
  total_gasto: number;
}

interface Transacao {
  id: number;
  tipo: string;
  valor: number;
  status: string;
  data_solicitacao: string;
  descricao: string;
  agendamento?: any;
}

interface DadosBancarios {
  id: number;
  chave_pix: string;
  banco_nome: string;
  agencia: string;
  conta: string;
  tipo_conta: string;
  titular_nome: string;
  verificado: boolean;
}

export default function FinanceiroContent() {
  const [carteira, setCarteira] = useState<CarteiresResponse | null>(null);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [dadosBancarios, setDadosBancarios] = useState<DadosBancarios | null>(
    null
  );
  const [mostrarSaldo, setMostrarSaldo] = useState(true);
  const [abaSelecionada, setAbaSelecionada] = useState<
    "resumo" | "transferencias" | "dados"
  >("resumo");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // Modals
  const [showDepositoModal, setShowDepositoModal] = useState(false);
  const [showSaqueModal, setShowSaqueModal] = useState(false);
  const [showDadosModal, setShowDadosModal] = useState(false);

  // Form states
  const [depositoForm, setDepositoForm] = useState({
    valor: "",
    metodo_pagamento: "pix",
  });

  const [saqueForm, setSaqueForm] = useState({
    valor: "",
    chave_pix: "",
  });

  const [dadosForm, setDadosForm] = useState({
    chave_pix: "",
    banco_nome: "",
    banco_codigo: "",
    agencia: "",
    conta: "",
    tipo_conta: "corrente",
    titular_nome: "",
    cpf_cnpj: "",
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      setErro("");

      // Carregar carteira
      const cartRes = await fetch("/api/carteira");
      if (!cartRes.ok) throw new Error("Erro ao carregar carteira");
      const cartData = await cartRes.json();
      setCarteira(cartData);

      // Carregar transações
      const transRes = await fetch("/api/transacao");
      if (transRes.ok) {
        const transData = await transRes.json();
        setTransacoes(transData);
      }

      // Carregar dados bancários
      const dadosRes = await fetch("/api/dados-bancarios");
      if (dadosRes.ok) {
        const dadosData = await dadosRes.json();
        setDadosBancarios(dadosData);
        setDadosForm({
          chave_pix: dadosData.chave_pix || "",
          banco_nome: dadosData.banco_nome || "",
          banco_codigo: dadosData.banco_codigo || "",
          agencia: dadosData.agencia || "",
          conta: dadosData.conta || "",
          tipo_conta: dadosData.tipo_conta || "corrente",
          titular_nome: dadosData.titular_nome || "",
          cpf_cnpj: dadosData.cpf_cnpj || "",
        });
      }
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  const handleDepositar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/transacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "deposito",
          valor: parseFloat(depositoForm.valor),
          metodo_pagamento: depositoForm.metodo_pagamento,
          descricao: `Depósito por ${depositoForm.metodo_pagamento}`,
        }),
      });

      if (!res.ok) {
        const erro = await res.json();
        throw new Error(erro.error || "Erro ao criar depósito");
      }

      setDepositoForm({ valor: "", metodo_pagamento: "pix" });
      setShowDepositoModal(false);
      carregarDados();
      alert("Depósito solicitado com sucesso!");
    } catch (err: any) {
      alert("Erro: " + err.message);
    }
  };

  const handleSacar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!saqueForm.chave_pix) {
        throw new Error("Adicione uma chave PIX para sacar");
      }

      const res = await fetch("/api/transacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "saque",
          valor: parseFloat(saqueForm.valor),
          chave_pix: saqueForm.chave_pix,
          metodo_pagamento: "pix",
          descricao: "Saque PIX",
        }),
      });

      if (!res.ok) {
        const erro = await res.json();
        throw new Error(erro.error || "Erro ao criar saque");
      }

      setSaqueForm({ valor: "", chave_pix: "" });
      setShowSaqueModal(false);
      carregarDados();
      alert("Saque solicitado com sucesso!");
    } catch (err: any) {
      alert("Erro: " + err.message);
    }
  };

  const handleSalvarDados = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = dadosBancarios ? "PUT" : "POST";
      const res = await fetch("/api/dados-bancarios", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosForm),
      });

      if (!res.ok) {
        const erro = await res.json();
        throw new Error(erro.error || "Erro ao salvar dados");
      }

      const dados = await res.json();
      setDadosBancarios(dados);
      setShowDadosModal(false);
      alert("Dados bancários salvos com sucesso!");
    } catch (err: any) {
      alert("Erro: " + err.message);
    }
  };

  if (carregando) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {erro && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {erro}
        </div>
      )}

      {/* Abas */}
      <div className="flex gap-4 mb-8 border-b">
        <button
          onClick={() => setAbaSelecionada("resumo")}
          className={`pb-4 px-4 font-medium ${
            abaSelecionada === "resumo"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
          }`}
        >
          Resumo Financeiro
        </button>
        <button
          onClick={() => setAbaSelecionada("transferencias")}
          className={`pb-4 px-4 font-medium ${
            abaSelecionada === "transferencias"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
          }`}
        >
          Transferências
        </button>
        <button
          onClick={() => setAbaSelecionada("dados")}
          className={`pb-4 px-4 font-medium ${
            abaSelecionada === "dados"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
          }`}
        >
          Dados Bancários
        </button>
      </div>

      {/* Resumo Financeiro */}
      {abaSelecionada === "resumo" && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* Saldo */}
            <div className="bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium opacity-80">
                  Saldo Disponível
                </span>
                <button
                  onClick={() => setMostrarSaldo(!mostrarSaldo)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded"
                >
                  {mostrarSaldo ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              <div className="text-3xl font-bold">
                {mostrarSaldo
                  ? `R$ ${Number(carteira?.saldo || 0).toFixed(2)}`
                  : "R$ ****"}
              </div>
            </div>

            {/* Saldo Pendente */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
              <span className="text-sm text-gray-600 font-medium">
                Saldo Pendente
              </span>
              <div className="text-2xl font-bold text-yellow-600 mt-2">
                R$ {Number(carteira?.saldo_pendente || 0).toFixed(2)}
              </div>
            </div>

            {/* Total Ganho */}
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
              <span className="text-sm text-gray-600 font-medium">
                Total Ganho
              </span>
              <div className="text-2xl font-bold text-green-600 mt-2">
                R$ {Number(carteira?.total_ganho || 0).toFixed(2)}
              </div>
            </div>

            {/* Total Gasto */}
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
              <span className="text-sm text-gray-600 font-medium">
                Total Gasto
              </span>
              <div className="text-2xl font-bold text-red-600 mt-2">
                R$ {Number(carteira?.total_gasto || 0).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setShowDepositoModal(true)}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              <Plus size={20} /> Depositar
            </button>
            <button
              onClick={() => setShowSaqueModal(true)}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              <Minus size={20} /> Sacar
            </button>
          </div>

          {/* Transações Recentes */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Transações Recentes</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transacoes.map((trans) => (
                    <tr key={trans.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          {trans.tipo === "deposito" ? (
                            <Plus className="text-green-600" size={18} />
                          ) : (
                            <Minus className="text-red-600" size={18} />
                          )}
                          <span className="capitalize">{trans.tipo}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        R$ {Number(trans.valor).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-1">
                          {trans.status === "concluido" && (
                            <>
                              <Check size={16} className="text-green-600" />
                              <span className="text-green-600 capitalize">
                                {trans.status}
                              </span>
                            </>
                          )}
                          {trans.status === "pendente" && (
                            <>
                              <Clock size={16} className="text-yellow-600" />
                              <span className="text-yellow-600 capitalize">
                                {trans.status}
                              </span>
                            </>
                          )}
                          {trans.status === "falhado" && (
                            <>
                              <X size={16} className="text-red-600" />
                              <span className="text-red-600 capitalize">
                                {trans.status}
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(trans.data_solicitacao).toLocaleDateString(
                          "pt-BR"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {transacoes.length === 0 && (
                <div className="px-6 py-8 text-center text-gray-500">
                  Nenhuma transação realizada ainda
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Transferências */}
      {abaSelecionada === "transferencias" && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-6">Histórico de Transferências</h2>
          <div className="space-y-4">
            {transacoes
              .filter(
                (t) =>
                  t.tipo === "deposito" ||
                  t.tipo === "saque" ||
                  t.tipo === "pagamento"
              )
              .map((trans) => (
                <div
                  key={trans.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-full ${
                        trans.tipo === "deposito"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >
                      {trans.tipo === "deposito" ? (
                        <Plus
                          className={
                            trans.tipo === "deposito"
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        />
                      ) : (
                        <Minus
                          className={
                            trans.tipo === "deposito"
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium capitalize">{trans.tipo}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(trans.data_solicitacao).toLocaleDateString(
                          "pt-BR"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold text-lg ${
                        trans.tipo === "deposito"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {trans.tipo === "deposito" ? "+" : "-"} R${" "}
                      {Number(trans.valor).toFixed(2)}
                    </p>
                    <span
                      className={`text-sm capitalize ${
                        trans.status === "concluido"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {trans.status}
                    </span>
                  </div>
                </div>
              ))}
            {transacoes.filter(
              (t) =>
                t.tipo === "deposito" ||
                t.tipo === "saque" ||
                t.tipo === "pagamento"
            ).length === 0 && (
              <p className="text-center text-gray-500">
                Nenhuma transferência realizada
              </p>
            )}
          </div>
        </div>
      )}

      {/* Dados Bancários */}
      {abaSelecionada === "dados" && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Dados Bancários</h2>
            <button
              onClick={() => setShowDadosModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              {dadosBancarios ? "Editar" : "Adicionar"}
            </button>
          </div>

          {dadosBancarios ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dadosBancarios.chave_pix && (
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-600 font-medium">Chave PIX</p>
                  <p className="text-lg font-bold mt-2">
                    {dadosBancarios.chave_pix}
                  </p>
                </div>
              )}
              {dadosBancarios.banco_nome && (
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-600 font-medium">Banco</p>
                  <p className="text-lg font-bold mt-2">
                    {dadosBancarios.banco_nome}
                  </p>
                </div>
              )}
              {dadosBancarios.agencia && (
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-600 font-medium">Agência</p>
                  <p className="text-lg font-bold mt-2">
                    {dadosBancarios.agencia}
                  </p>
                </div>
              )}
              {dadosBancarios.conta && (
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-600 font-medium">Conta</p>
                  <p className="text-lg font-bold mt-2">
                    {dadosBancarios.conta}
                  </p>
                </div>
              )}
              {dadosBancarios.tipo_conta && (
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-600 font-medium">
                    Tipo de Conta
                  </p>
                  <p className="text-lg font-bold mt-2 capitalize">
                    {dadosBancarios.tipo_conta}
                  </p>
                </div>
              )}
              {dadosBancarios.titular_nome && (
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-600 font-medium">Titular</p>
                  <p className="text-lg font-bold mt-2">
                    {dadosBancarios.titular_nome}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Wallet className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-600 mb-4">
                Nenhum dado bancário cadastrado
              </p>
              <button
                onClick={() => setShowDadosModal(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition"
              >
                Cadastrar Agora
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal Depósito */}
      {showDepositoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-6">Fazer Depósito</h3>
            <form onSubmit={handleDepositar} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Valor (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="10"
                  required
                  value={depositoForm.valor}
                  onChange={(e) =>
                    setDepositoForm({ ...depositoForm, valor: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Método de Pagamento
                </label>
                <select
                  value={depositoForm.metodo_pagamento}
                  onChange={(e) =>
                    setDepositoForm({
                      ...depositoForm,
                      metodo_pagamento: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="pix">PIX</option>
                  <option value="cartao">Cartão de Crédito</option>
                  <option value="transferencia">Transferência Bancária</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDepositoModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  Depositar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Saque */}
      {showSaqueModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-6">Fazer Saque</h3>
            <form onSubmit={handleSacar} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Valor (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="10"
                  max={carteira?.saldo || 0}
                  required
                  value={saqueForm.valor}
                  onChange={(e) =>
                    setSaqueForm({ ...saqueForm, valor: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Chave PIX
                </label>
                <input
                  type="text"
                  required
                  placeholder="Digite sua chave PIX"
                  value={saqueForm.chave_pix}
                  onChange={(e) =>
                    setSaqueForm({ ...saqueForm, chave_pix: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSaqueModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  Sacar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Dados Bancários */}
      {showDadosModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full my-8">
            <h3 className="text-2xl font-bold mb-6">
              {dadosBancarios ? "Editar Dados Bancários" : "Cadastrar Dados Bancários"}
            </h3>
            <form
              onSubmit={handleSalvarDados}
              className="space-y-4 max-h-96 overflow-y-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Chave PIX *
                  </label>
                  <input
                    type="text"
                    value={dadosForm.chave_pix}
                    onChange={(e) =>
                      setDadosForm({
                        ...dadosForm,
                        chave_pix: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Banco
                  </label>
                  <input
                    type="text"
                    value={dadosForm.banco_nome}
                    onChange={(e) =>
                      setDadosForm({
                        ...dadosForm,
                        banco_nome: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Código Banco
                  </label>
                  <input
                    type="text"
                    value={dadosForm.banco_codigo}
                    onChange={(e) =>
                      setDadosForm({
                        ...dadosForm,
                        banco_codigo: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Agência
                  </label>
                  <input
                    type="text"
                    value={dadosForm.agencia}
                    onChange={(e) =>
                      setDadosForm({
                        ...dadosForm,
                        agencia: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Conta
                  </label>
                  <input
                    type="text"
                    value={dadosForm.conta}
                    onChange={(e) =>
                      setDadosForm({
                        ...dadosForm,
                        conta: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tipo de Conta
                  </label>
                  <select
                    value={dadosForm.tipo_conta}
                    onChange={(e) =>
                      setDadosForm({
                        ...dadosForm,
                        tipo_conta: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="corrente">Corrente</option>
                    <option value="poupanca">Poupança</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Titular
                  </label>
                  <input
                    type="text"
                    value={dadosForm.titular_nome}
                    onChange={(e) =>
                      setDadosForm({
                        ...dadosForm,
                        titular_nome: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    CPF/CNPJ
                  </label>
                  <input
                    type="text"
                    value={dadosForm.cpf_cnpj}
                    onChange={(e) =>
                      setDadosForm({
                        ...dadosForm,
                        cpf_cnpj: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowDadosModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
