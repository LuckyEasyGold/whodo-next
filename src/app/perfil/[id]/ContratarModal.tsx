"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface ContratarModalProps {
  usuario: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ContratarModal({
  usuario,
  isOpen,
  onClose,
  onSuccess,
}: ContratarModalProps) {
  const [etapa, setEtapa] = useState<"servicos" | "dados">("servicos");
  const [servicoSelecionado, setServicoSelecionado] = useState<any>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const [formData, setFormData] = useState({
    data_agendamento: "",
    endereco_servico: "",
    descricao: "",
  });

  const handleSelecionarServico = (servico: any) => {
    setServicoSelecionado(servico);
    setEtapa("dados");
  };

  const handleVoltar = () => {
    setEtapa("servicos");
    setServicoSelecionado(null);
    setFormData({
      data_agendamento: "",
      endereco_servico: "",
      descricao: "",
    });
  };

  const handleAgendar = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro("");

    try {
      // Verificar se usuário está autenticado
      const meRes = await fetch("/api/auth/me");
      if (!meRes.ok) {
        throw new Error(
          "Você precisa estar autenticado. Faça login para continuar."
        );
      }

      // Criar agendamento
      const res = await fetch("/api/agendamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prestador_id: usuario.id,
          servico_id: servicoSelecionado.id,
          data_agendamento: formData.data_agendamento,
          endereco_servico: formData.endereco_servico,
          descricao: formData.descricao,
          valor_total: servicoSelecionado.preco_base,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error || "Erro ao criar agendamento"
        );
      }

      alert("Agendamento solicitado com sucesso! O profissional será notificado.");
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg overflow-hidden max-w-2xl w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-2xl font-bold">Contratar Serviço</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          {erro && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {erro}
            </div>
          )}

          {etapa === "servicos" ? (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Selecione um serviço:
              </h3>
              {usuario.servicos && usuario.servicos.length > 0 ? (
                <div className="space-y-3">
                  {usuario.servicos.map((servico: any) => (
                    <button
                      key={servico.id}
                      onClick={() => handleSelecionarServico(servico)}
                      className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-left transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-lg">
                            {servico.titulo}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {servico.descricao
                              ? servico.descricao.substring(0, 100) + "..."
                              : "Sem descrição"}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            Categoria: {servico.categoria.nome}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-green-600">
                            R$ {parseFloat(servico.preco_base).toFixed(2)}
                          </p>
                          {servico.unidade_medida && (
                            <p className="text-xs text-gray-500">
                              por {servico.unidade_medida}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">
                  Este profissional ainda não publicou nenhum serviço.
                </p>
              )}
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Agende sua sessão com{" "}
                <span className="text-blue-600">{usuario.nome}</span>
              </h3>
              <p className="text-gray-600 mb-4">
                Serviço: <span className="font-semibold">{servicoSelecionado.titulo}</span>
              </p>

              <form onSubmit={handleAgendar} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Data e Hora *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    min={new Date().toISOString().slice(0, 16)}
                    value={formData.data_agendamento}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        data_agendamento: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Local do Serviço
                  </label>
                  <input
                    type="text"
                    placeholder="Endereço ou local do serviço"
                    value={formData.endereco_servico}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        endereco_servico: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Descrição Adicional
                  </label>
                  <textarea
                    placeholder="Descreva detalhes sobre o que você precisa..."
                    value={formData.descricao}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        descricao: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Valor:</strong> R${" "}
                    {parseFloat(servicoSelecionado.preco_base).toFixed(2)}
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleVoltar}
                    className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={carregando}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition"
                  >
                    {carregando ? "Agendando..." : "Confirmar Agendamento"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
