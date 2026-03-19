🧠 CONTEXTO GERAL

Você está trabalhando em uma plataforma de intermediação de serviços chamada WhoDo.
O sistema já possui:

Usuários (clientes e prestadores)

Agendamentos (Agendamento)

Carteira (Carteira)

Transações (Transacao)

Integração com pagamento (Mercado Pago + webhook)

Sistema de chat (ou estrutura preparada)

Status de agendamento parcialmente implementados

Seu objetivo é completar o fluxo direto de contratação e execução do serviço, iniciando no PASSO 6 da FASE FINANCEIRA, garantindo rastreabilidade, consistência e integração com o sistema de pagamento (escrow).

🎯 OBJETIVO

Implementar o fluxo completo de negociação, aprovação, pagamento, execução e finalização de um serviço, com:

Estados bem definidos

Ações para cliente e prestador

Integração com pagamento (escrow)

Auditoria completa

Comunicação contínua via chat

🔄 FLUXO COMPLETO DO CONTRATO
1. CRIAÇÃO DO AGENDAMENTO (INÍCIO DO CONTRATO)

O contrato se inicia quando:

O cliente:

Agenda um serviço pré-definido OU

Solicita um orçamento

Criar/garantir os seguintes campos no Agendamento:

status

cliente_id

prestador_id

servico_id (opcional)

descricao

data_sugerida

valor (nullable)

orcamento_aprovado (boolean)

concluido_prestador (boolean)

concluido_cliente (boolean)

Status inicial:

pendente
2. AÇÃO DO PRESTADOR

Na tela /dashboard/agendamentos/[id], implementar:

Botões para o prestador:

✅ Aceitar Pedido

🔄 Sugerir Nova Data

❌ Recusar

💬 Abrir Chat

Regras:

Se aceitar:

status = aceito

Se sugerir nova data:

status = aguardando_cliente

Se recusar:

status = recusado
3. ORÇAMENTO (SE NECESSÁRIO)

Se o serviço não tiver valor definido:

Prestador pode criar um orçamento:

valor

descricao

condicoes

Novo status:

orcamento_enviado

Cliente pode:

✅ Aprovar orçamento

❌ Recusar

💬 Negociar via chat

Se aprovado:

orcamento_aprovado = true
status = aguardando_pagamento
4. PAGAMENTO (ESCROW)

Só liberar pagamento se:

status = aguardando_pagamento
Cliente:

Botão:

💰 Pagar (Pix/Cartão ou Carteira)

Regras:

Se pagar com carteira:

mover saldo → bloqueado

Se pagar com gateway:

aguardar webhook

registrar:

crédito

débito (escrow)

Após pagamento confirmado:

status = confirmado
5. EXECUÇÃO DO SERVIÇO

Durante esse período:

Chat liberado

Tudo deve ser registrado (mensagens vinculadas ao agendamento)

6. FINALIZAÇÃO
Prestador:

Botão:

✔️ Marcar como concluído

concluido_prestador = true
status = aguardando_confirmacao_cliente
Cliente:

Botão:

✔️ Confirmar conclusão

concluido_cliente = true
status = concluido
7. LIBERAÇÃO DO PAGAMENTO

Após:

status = concluido

Executar:

Calcular comissão (ex: 4%)

Transferir:

96% → carteira do prestador

4% → conta da plataforma

Registrar tudo em Transacao

💬 CHAT (DISPONÍVEL EM TODO O FLUXO)

Deve estar disponível em todos os status

Sempre vinculado ao agendamento_id

Não bloqueia nenhuma ação

🔍 AUDITORIA

Garantir que tudo fique registrado:

Mudanças de status

Pagamentos

Liberação de valores

Mensagens

Aprovações

Criar (se necessário):

Tabela:

HistoricoAgendamento
- id
- agendamento_id
- acao
- user_id
- timestamp
- metadata (json)
⚠️ REGRAS CRÍTICAS

❌ Não permitir pagamento antes da aprovação do prestador

❌ Não liberar dinheiro antes da confirmação do cliente

❌ Não permitir conclusão sem ambas as partes

✅ Tudo deve ser reversível até o pagamento (exceto após execução)

✅ Tudo deve ser auditável

📌 FOCO DA IMPLEMENTAÇÃO

Prioridade imediata:

Tela /dashboard/agendamentos/[id]

Botões por tipo de usuário

Controle de status

Integração com pagamento

Fluxo de conclusão

Auditoria básica

RESULTADO ESPERADO

Um fluxo onde:

O contrato nasce no agendamento

Evolui com ações controladas

O pagamento fica seguro (escrow)

O serviço é validado pelas duas partes

O sistema garante confiança e rastreabilidade total🧠 CONTEXTO GERAL

Você está trabalhando em uma plataforma de intermediação de serviços chamada WhoDo.
O sistema já possui:

Usuários (clientes e prestadores)

Agendamentos (Agendamento)

Carteira (Carteira)

Transações (Transacao)

Integração com pagamento (Mercado Pago + webhook)

Sistema de chat (ou estrutura preparada)

Status de agendamento parcialmente implementados

Seu objetivo é completar o fluxo direto de contratação e execução do serviço, iniciando no PASSO 6 da FASE FINANCEIRA, garantindo rastreabilidade, consistência e integração com o sistema de pagamento (escrow).

🎯 OBJETIVO

Implementar o fluxo completo de negociação, aprovação, pagamento, execução e finalização de um serviço, com:

Estados bem definidos

Ações para cliente e prestador

Integração com pagamento (escrow)

Auditoria completa

Comunicação contínua via chat

🔄 FLUXO COMPLETO DO CONTRATO
1. CRIAÇÃO DO AGENDAMENTO (INÍCIO DO CONTRATO)

O contrato se inicia quando:

O cliente:

Agenda um serviço pré-definido OU

Solicita um orçamento

Criar/garantir os seguintes campos no Agendamento:

status

cliente_id

prestador_id

servico_id (opcional)

descricao

data_sugerida

valor (nullable)

orcamento_aprovado (boolean)

concluido_prestador (boolean)

concluido_cliente (boolean)

Status inicial:

pendente
2. AÇÃO DO PRESTADOR

Na tela /dashboard/agendamentos/[id], implementar:

Botões para o prestador:

✅ Aceitar Pedido

🔄 Sugerir Nova Data

❌ Recusar

💬 Abrir Chat

Regras:

Se aceitar:

status = aceito

Se sugerir nova data:

status = aguardando_cliente

Se recusar:

status = recusado
3. ORÇAMENTO (SE NECESSÁRIO)

Se o serviço não tiver valor definido:

Prestador pode criar um orçamento:

valor

descricao

condicoes

Novo status:

orcamento_enviado

Cliente pode:

✅ Aprovar orçamento

❌ Recusar

💬 Negociar via chat

Se aprovado:

orcamento_aprovado = true
status = aguardando_pagamento
4. PAGAMENTO (ESCROW)

Só liberar pagamento se:

status = aguardando_pagamento
Cliente:

Botão:

💰 Pagar (Pix/Cartão ou Carteira)

Regras:

Se pagar com carteira:

mover saldo → bloqueado

Se pagar com gateway:

aguardar webhook

registrar:

crédito

débito (escrow)

Após pagamento confirmado:

status = confirmado
5. EXECUÇÃO DO SERVIÇO

Durante esse período:

Chat liberado

Tudo deve ser registrado (mensagens vinculadas ao agendamento)

6. FINALIZAÇÃO
Prestador:

Botão:

✔️ Marcar como concluído

concluido_prestador = true
status = aguardando_confirmacao_cliente
Cliente:

Botão:

✔️ Confirmar conclusão

concluido_cliente = true
status = concluido
7. LIBERAÇÃO DO PAGAMENTO

Após:

status = concluido

Executar:

Calcular comissão (ex: 4%)

Transferir:

96% → carteira do prestador

4% → conta da plataforma

Registrar tudo em Transacao

💬 CHAT (DISPONÍVEL EM TODO O FLUXO)

Deve estar disponível em todos os status

Sempre vinculado ao agendamento_id

Não bloqueia nenhuma ação

🔍 AUDITORIA

Garantir que tudo fique registrado:

Mudanças de status

Pagamentos

Liberação de valores

Mensagens

Aprovações

Criar (se necessário):

Tabela:

HistoricoAgendamento
- id
- agendamento_id
- acao
- user_id
- timestamp
- metadata (json)
⚠️ REGRAS CRÍTICAS

❌ Não permitir pagamento antes da aprovação do prestador

❌ Não liberar dinheiro antes da confirmação do cliente

❌ Não permitir conclusão sem ambas as partes

✅ Tudo deve ser reversível até o pagamento (exceto após execução)

✅ Tudo deve ser auditável

📌 FOCO DA IMPLEMENTAÇÃO

Prioridade imediata:

Tela /dashboard/agendamentos/[id]

Botões por tipo de usuário

Controle de status

Integração com pagamento

Fluxo de conclusão

Auditoria básica

RESULTADO ESPERADO

Um fluxo onde:

O contrato nasce no agendamento

Evolui com ações controladas

O pagamento fica seguro (escrow)

O serviço é validado pelas duas partes

O sistema garante confiança e rastreabilidade total