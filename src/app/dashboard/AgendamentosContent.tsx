"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  DollarSign,
  Check,
  X,
  AlertCircle,
} from "lucide-react";

interface Agendamento {
  id: number;
  cliente_id: number;
  prestador_id: number;
  servico_id: number;
  status: string;
  data_agendamento: string;
  data_conclusao: string | null;
  descricao: string | null;
  endereco_servico: string | null;
  valor_total: number;
  valor_pago: boolean;
  avaliacao_feita: boolean;
  motivo_cancelamento: string | null;
  cliente: {
    id: number;
    nome: string;
    foto_perfil: string | null;
    avaliacao_media: number;
  };
  prestador: {
    id: number;
    nome: string;
    foto_perfil: string | null;
    avaliacao_media: number;
  };
  servico: {
    id: number;
    titulo: string;
    descricao: string | null;
  };
}

interface Usuario {
  id: number;
  tipo?: string;
}

export default function AgendamentosContent() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [tipoView, setTipoView] = useState<"cliente" | "prestador">(
    "cliente"
  );
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [showDetalhesModal, setShowDetalhesModal] = useState<Agendamento | null>(
    null
  );
  const [showAcaoModal, setShowAcaoModal] = useState<Agendamento | null>(null);
  const [acao, setAcao] = useState<"confirmar" | "concluir" | "cancelar" | null>(
    null
  );
  const [motivoCancelamento, setMotivoCancelamento] = useState("");

  useEffect(() => {
    carregarDados();
  }, [tipoView, filtroStatus]);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      setErro("");

      // Obter usuário atual
      const meRes = await fetch("/api/auth/me");
      if (meRes.ok) {
        const meData = await meRes.json();
        setUsuario(meData);
      }

      // Carregar agendamentos
      const tipo = tipoView === "prestador" ? "prestador" : "cliente";
      const agendRes = await fetch(`/api/agendamento?tipo=${tipo}`);
      if (!agendRes.ok) throw new Error("Erro ao carregar agendamentos");

      let agendData = await agendRes.json();

      // Filtrar por status se não for "todos"
      if (filtroStatus !== "todos") {
        agendData = agendData.filter(
          (a: Agendamento) => a.status === filtroStatus
        );
      }

      setAgendamentos(agendData);
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  const handleConfirmarAgendamento = async (agendamentoId: number) => {
    try {
      const res = await fetch(`/api/agendamento/${agendamentoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "confirmado" }),
      });

      if (!res.ok) throw new Error("Erro ao confirmar agendamento");

      setShowAcaoModal(null);
      setAcao(null);
      carregarDados();
      alert("Agendamento confirmado!");
    } catch (err: any) {
      alert("Erro: " + err.message);
    }
  };

  const handleConcluirAgendamento = async (agendamentoId: number) => {
    try {
      const res = await fetch(`/api/agendamento/${agendamentoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "concluido",
          data_conclusao: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Erro ao concluir agendamento");

      setShowAcaoModal(null);
      setAcao(null);
      carregarDados();
      alert("Agendamento concluído!");
    } catch (err: any) {
      alert("Erro: " + err.message);
    }
  };

  const handleCancelarAgendamento = async (agendamentoId: number) => {
    try {
      const res = await fetch(`/api/agendamento/${agendamentoId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          motivo_cancelamento: motivoCancelamento,
        }),
      });

      if (!res.ok) throw new Error("Erro ao cancelar agendamento");

      setShowAcaoModal(null);
      setAcao(null);
      setMotivoCancelamento("");
      carregarDados();
      alert("Agendamento cancelado!");
    } catch (err: any) {
      alert("Erro: " + err.message);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: { [key: string]: string } = {
      pendente: "bg-yellow-100 text-yellow-800",
      confirmado: "bg-blue-100 text-blue-800",
      concluido: "bg-green-100 text-green-800",
      cancelado: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b">
        <button
          onClick={() => setTipoView("cliente")}
          className={`pb-4 px-4 font-medium ${tipoView === "cliente"
            ? "border-b-2 border-blue-500 text-blue-600"
            : "text-gray-600"
            }`}
        >
          Meus Agendamentos (Cliente)
        </button>
        <button
          onClick={() => setTipoView("prestador")}
          className={`pb-4 px-4 font-medium ${tipoView === "prestador"
            ? "border-b-2 border-blue-500 text-blue-600"
            : "text-gray-600"
            }`}
        >
          Agendamentos Recebidos (Prestador)
        </button>
      </div>

      {/* Filtros */}
      <div className="mb-6">
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="todos">Todos os Status</option>
          <option value="pendente">Pendente</option>
          <option value="confirmado">Confirmado</option>
          <option value="concluido">Concluído</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      {/* Lista de Agendamentos */}
      <div className="space-y-4">
        {agendamentos.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Calendar className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600">
              {tipoView === "cliente"
                ? "Você ainda não tem agendamentos"
                : "Você ainda não recebeu agendamentos"}
            </p>
          </div>
        ) : (
          agendamentos.map((agendamento) => (
            <div
              key={agendamento.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition border-l-4 border-blue-500 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      {agendamento.servico.titulo}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <img
                        src={
                          tipoView === "cliente"
                            ? agendamento.prestador?.foto_perfil ||
                            "https://randomuser.me/api/portraits/lego/1.jpg"
                            : agendamento.cliente?.foto_perfil ||
                            "https://randomuser.me/api/portraits/lego/1.jpg"
                        }
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">
                          {tipoView === "cliente"
                            ? agendamento.prestador?.nome
                            : agendamento.cliente?.nome}
                        </p>
                        <p className="text-sm text-gray-600">
                          ⭐{" "}
                          {Number(tipoView === "cliente"
                            ? agendamento.prestador?.avaliacao_media ?? 0
                            : agendamento.cliente?.avaliacao_media ?? 0
                          ).toFixed(1)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusBadge(
                      agendamento.status
                    )}`}
                  >
                    {agendamento.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar size={16} />
                    <span>
                      {formatarData(agendamento.data_agendamento)}
                    </span>
                  </div>

                  {agendamento.endereco_servico && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin size={16} />
                      <span>{agendamento.endereco_servico}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-gray-700">
                    <DollarSign size={16} />
                    <span>R$ {Number(agendamento.valor_total).toFixed(2)}</span>
                  </div>

                  {agendamento.descricao && (
                    <div className="col-span-1 md:col-span-2">
                      <p className="text-gray-600">
                        <strong>Descrição:</strong> {agendamento.descricao}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => setShowDetalhesModal(agendamento)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    Ver Detalhes
                  </button>

                  {tipoView === "prestador" &&
                    agendamento.status === "pendente" && (
                      <>
                        <button
                          onClick={() => {
                            setShowAcaoModal(agendamento);
                            setAcao("confirmar");
                          }}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
                        >
                          <Check size={16} /> Confirmar
                        </button>
                        <button
                          onClick={() => {
                            setShowAcaoModal(agendamento);
                            setAcao("cancelar");
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
                        >
                          <X size={16} /> Recusar
                        </button>
                      </>
                    )}

                  {tipoView === "prestador" &&
                    agendamento.status === "confirmado" && (
                      <button
                        onClick={() => {
                          setShowAcaoModal(agendamento);
                          setAcao("concluir");
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                      >
                        Marcar como Concluído
                      </button>
                    )}

                  {tipoView === "cliente" &&
                    (agendamento.status === "pendente" ||
                      agendamento.status === "confirmado") && (
                      <button
                        onClick={() => {
                          setShowAcaoModal(agendamento);
                          setAcao("cancelar");
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
                      >
                        <X size={16} /> Cancelar Agendamento
                      </button>
                    )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Detalhes */}
      {showDetalhesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
            <h3 className="text-2xl font-bold mb-6">Detalhes do Agendamento</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Serviço</p>
                  <p className="text-lg font-medium">
                    {showDetalhesModal.servico.titulo}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusBadge(
                      showDetalhesModal.status
                    )}`}
                  >
                    {showDetalhesModal.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Profissional</p>
                  <p className="text-lg font-medium">
                    {tipoView === "cliente"
                      ? showDetalhesModal.prestador.nome
                      : showDetalhesModal.cliente.nome}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Data</p>
                  <p className="text-lg font-medium">
                    {formatarData(showDetalhesModal.data_agendamento)}
                  </p>
                </div>
              </div>

              {showDetalhesModal.endereco_servico && (
                <div>
                  <p className="text-sm text-gray-600">Local do Serviço</p>
                  <p className="text-lg font-medium">
                    {showDetalhesModal.endereco_servico}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-600">Valor</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {Number(showDetalhesModal.valor_total).toFixed(2)}
                </p>
              </div>

              {showDetalhesModal.descricao && (
                <div>
                  <p className="text-sm text-gray-600">Descrição</p>
                  <p className="text-base">
                    {showDetalhesModal.descricao}
                  </p>
                </div>
              )}

              {showDetalhesModal.motivo_cancelamento && (
                <div className="bg-red-50 border border-red-200 rounded p-4">
                  <p className="text-sm text-gray-600">
                    Motivo do Cancelamento
                  </p>
                  <p className="text-base text-red-700">
                    {showDetalhesModal.motivo_cancelamento}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-6 border-t">
              <button
                onClick={() => setShowDetalhesModal(null)}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ação */}
      {showAcaoModal && acao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="mb-6">
              {acao === "confirmar" && (
                <>
                  <h3 className="text-2xl font-bold mb-2">
                    Confirmar Agendamento?
                  </h3>
                  <p className="text-gray-600">
                    Você irá confirmar a data e horário com o cliente.
                  </p>
                </>
              )}
              {acao === "concluir" && (
                <>
                  <h3 className="text-2xl font-bold mb-2">
                    Marcar como Concluído?
                  </h3>
                  <p className="text-gray-600">
                    Confirme que o serviço foi realizado e o cliente poderá avaliar.
                  </p>
                </>
              )}
              {acao === "cancelar" && (
                <>
                  <h3 className="text-2xl font-bold mb-2">
                    Cancelar Agendamento?
                  </h3>
                  <p className="text-gray-600 mb-4">
                    O cliente será notificado sobre o cancelamento.
                  </p>
                  <textarea
                    placeholder="Motivo do cancelamento (opcional)"
                    value={motivoCancelamento}
                    onChange={(e) => setMotivoCancelamento(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    rows={3}
                  />
                </>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAcaoModal(null);
                  setAcao(null);
                  setMotivoCancelamento("");
                }}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Voltar
              </button>
              <button
                onClick={() => {
                  if (acao === "confirmar") {
                    handleConfirmarAgendamento(showAcaoModal.id);
                  } else if (acao === "concluir") {
                    handleConcluirAgendamento(showAcaoModal.id);
                  } else if (acao === "cancelar") {
                    handleCancelarAgendamento(showAcaoModal.id);
                  }
                }}
                className={`flex-1 text-white px-4 py-2 rounded-lg font-medium transition ${acao === "cancelar"
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
                  }`}
              >
                {acao === "confirmar" && "Confirmar"}
                {acao === "concluir" && "Concluir"}
                {acao === "cancelar" && "Cancelar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
