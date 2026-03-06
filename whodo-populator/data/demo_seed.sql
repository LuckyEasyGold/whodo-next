-- ============================================
-- SEED DE DADOS DO GOOGLE MAPS
-- Gerado em: 2026-03-07 04:02:53
-- Local: Palmas - PR
-- ============================================

BEGIN;

-- Categorias
INSERT INTO categorias (nome, descricao, icone) VALUES
  ('Barbeiro', 'Serviços de Barbeiro', 'fa-barbeiro'),
  ('Cabeleireiro', 'Serviços de Cabeleireiro', 'fa-cabeleireiro'),
  ('Designer Gráfico', 'Serviços de Designer Gráfico', 'fa-designer-grafico'),
  ('Diarista', 'Serviços de Diarista', 'fa-diarista'),
  ('Eletricista', 'Serviços de Eletricista', 'fa-eletricista'),
  ('Encanador', 'Serviços de Encanador', 'fa-encanador'),
  ('Fotógrafo', 'Serviços de Fotógrafo', 'fa-fotografo'),
  ('Jardineiro', 'Serviços de Jardineiro', 'fa-jardineiro'),
  ('Manicure', 'Serviços de Manicure', 'fa-manicure'),
  ('Marceneiro', 'Serviços de Marceneiro', 'fa-marceneiro'),
  ('Mecânico', 'Serviços de Mecânico', 'fa-mecanico'),
  ('Pedreiro', 'Serviços de Pedreiro', 'fa-pedreiro'),
  ('Personal Trainer', 'Serviços de Personal Trainer', 'fa-personal-trainer'),
  ('Pintor', 'Serviços de Pintor', 'fa-pintor'),
  ('Técnico de Informática', 'Serviços de Técnico de Informática', 'fa-tecnico-de-informatica')
ON CONFLICT (nome) DO NOTHING;

-- Profissionais (Usuários)
INSERT INTO usuarios (
  nome, nome_fantasia, email, senha, telefone, tipo,
  especialidade, sobre, avaliacao_media, verificado, disponibilidade,
  endereco, cidade, estado, cep, latitude, longitude,
  website, instagram, foto_perfil, status, email_verificado, created_at
) VALUES (
  'Fernanda Lima Diárias', 'Fernanda Lima Diárias', 'fernandalimadiarias1@whodo.temp', 'd9d4a8b214e1b4ae1f88afbec9a414edd6548a35ebb9c32322d8b748407a9854', '(46) 94444-6666', 'usuario',
  'Diarista', 'Limpeza residencial e comercial, organização de ambientes, lavagem de roupas e passadoria. Referências disponíveis.', 4.8, false, 'Seg-Sáb: 7h às 17h',
  'Rua Rio Grande do Sul, 987 - Jardim Europa, Palmas - PR, 85555-050', 'Palmas', 'PR', '', -26.483, -51.993,
  '', 'lima_limpeza_pr', 'https://randomuser.me/api/portraits/women/52.jpg', 'ativo', false, NOW()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO servicos (
  usuario_id, categoria_id, titulo, descricao, preco_base, cobranca_tipo, status, created_at
) SELECT 
  id, 4, 'Diarista', 'Limpeza residencial e comercial, organização de ambientes, lavagem de roupas e passadoria. Referências disponíveis.', 0, 'A_COMBINAR', 'ativo', NOW()
FROM usuarios WHERE email = 'fernandalimadiarias1@whodo.temp' AND NOT EXISTS (
  SELECT 1 FROM servicos WHERE usuario_id = (SELECT id FROM usuarios WHERE email = 'fernandalimadiarias1@whodo.temp')
);

INSERT INTO usuarios (
  nome, nome_fantasia, email, senha, telefone, tipo,
  especialidade, sobre, avaliacao_media, verificado, disponibilidade,
  endereco, cidade, estado, cep, latitude, longitude,
  website, instagram, foto_perfil, status, email_verificado, created_at
) VALUES (
  'Maria Oliveira Encanamentos', 'Maria Oliveira Encanamentos', 'mariaoliveiraencanamentos2@whodo.temp', 'd9d4a8b214e1b4ae1f88afbec9a414edd6548a35ebb9c32322d8b748407a9854', '(46) 98888-2222', 'usuario',
  'Encanador', 'Serviços de encanamento, desentupimento, instalação de aquecedores e reparos em geral. Garantia de 90 dias em todos os serviços.', 4.9, false, 'Seg-Sáb: 7h às 19h',
  'Av. Brasil, 456 - Jardim América, Palmas - PR, 85555-010', 'Palmas', 'PR', '', -26.486, -51.9885,
  'https://oliveirahidraulica.com.br', 'oliveira_hidraulica', 'https://randomuser.me/api/portraits/women/44.jpg', 'ativo', false, NOW()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO servicos (
  usuario_id, categoria_id, titulo, descricao, preco_base, cobranca_tipo, status, created_at
) SELECT 
  id, 6, 'Encanador', 'Serviços de encanamento, desentupimento, instalação de aquecedores e reparos em geral. Garantia de 90 dias em todos os serviços.', 0, 'A_COMBINAR', 'ativo', NOW()
FROM usuarios WHERE email = 'mariaoliveiraencanamentos2@whodo.temp' AND NOT EXISTS (
  SELECT 1 FROM servicos WHERE usuario_id = (SELECT id FROM usuarios WHERE email = 'mariaoliveiraencanamentos2@whodo.temp')
);

INSERT INTO usuarios (
  nome, nome_fantasia, email, senha, telefone, tipo,
  especialidade, sobre, avaliacao_media, verificado, disponibilidade,
  endereco, cidade, estado, cep, latitude, longitude,
  website, instagram, foto_perfil, status, email_verificado, created_at
) VALUES (
  'Letícia Cardoso Pedreiro', 'Letícia Cardoso Pedreiro', 'leticiacardosopedreiro3@whodo.temp', 'd9d4a8b214e1b4ae1f88afbec9a414edd6548a35ebb9c32322d8b748407a9854', '(46) 97159-3874', 'usuario',
  'Pedreiro', 'Profissional de Pedreiro em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 4.7, false, 'Seg-Sáb: 7h às 19h',
  'Rua Santa Catarina, 641 - Jardim Europa, Palmas - PR, 85555-112', 'Palmas', 'PR', '', -26.479619, -51.985763,
  '', 'letícia_pedreiro_pr', 'https://randomuser.me/api/portraits/women/22.jpg', 'ativo', false, NOW()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO servicos (
  usuario_id, categoria_id, titulo, descricao, preco_base, cobranca_tipo, status, created_at
) SELECT 
  id, 12, 'Pedreiro', 'Profissional de Pedreiro em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 0, 'A_COMBINAR', 'ativo', NOW()
FROM usuarios WHERE email = 'leticiacardosopedreiro3@whodo.temp' AND NOT EXISTS (
  SELECT 1 FROM servicos WHERE usuario_id = (SELECT id FROM usuarios WHERE email = 'leticiacardosopedreiro3@whodo.temp')
);

INSERT INTO usuarios (
  nome, nome_fantasia, email, senha, telefone, tipo,
  especialidade, sobre, avaliacao_media, verificado, disponibilidade,
  endereco, cidade, estado, cep, latitude, longitude,
  website, instagram, foto_perfil, status, email_verificado, created_at
) VALUES (
  'Roberto Silva Eletricista', 'Roberto Silva Eletricista', 'robertosilvaeletricista4@whodo.temp', 'd9d4a8b214e1b4ae1f88afbec9a414edd6548a35ebb9c32322d8b748407a9854', '(46) 95101-7871', 'usuario',
  'Eletricista', 'Profissional de Eletricista em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 4.8, false, 'Seg-Sáb: 7h às 19h',
  'Rua das Flores, 993 - Centro, Palmas - PR, 85555-660', 'Palmas', 'PR', '', -26.490024, -51.983505,
  '', 'roberto_eletricista_pr', 'https://randomuser.me/api/portraits/men/48.jpg', 'ativo', false, NOW()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO servicos (
  usuario_id, categoria_id, titulo, descricao, preco_base, cobranca_tipo, status, created_at
) SELECT 
  id, 5, 'Eletricista', 'Profissional de Eletricista em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 0, 'A_COMBINAR', 'ativo', NOW()
FROM usuarios WHERE email = 'robertosilvaeletricista4@whodo.temp' AND NOT EXISTS (
  SELECT 1 FROM servicos WHERE usuario_id = (SELECT id FROM usuarios WHERE email = 'robertosilvaeletricista4@whodo.temp')
);

INSERT INTO usuarios (
  nome, nome_fantasia, email, senha, telefone, tipo,
  especialidade, sobre, avaliacao_media, verificado, disponibilidade,
  endereco, cidade, estado, cep, latitude, longitude,
  website, instagram, foto_perfil, status, email_verificado, created_at
) VALUES (
  'Bruno Alves Personal', 'Bruno Alves Personal', 'brunoalvespersonal5@whodo.temp', 'd9d4a8b214e1b4ae1f88afbec9a414edd6548a35ebb9c32322d8b748407a9854', '(46) 91111-9999', 'usuario',
  'Personal Trainer', 'Treinamento personalizado, emagrecimento, hipertrofia, preparação física. Atendo em academias ou domicílio.', 4.8, false, 'Seg-Sáb: 6h às 21h',
  'Rua Goiás, 369 - Vila Operária, Palmas - PR, 85555-080', 'Palmas', 'PR', '', -26.4895, -51.9855,
  '', 'alves_fitness', 'https://randomuser.me/api/portraits/men/73.jpg', 'ativo', false, NOW()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO servicos (
  usuario_id, categoria_id, titulo, descricao, preco_base, cobranca_tipo, status, created_at
) SELECT 
  id, 13, 'Personal Trainer', 'Treinamento personalizado, emagrecimento, hipertrofia, preparação física. Atendo em academias ou domicílio.', 0, 'A_COMBINAR', 'ativo', NOW()
FROM usuarios WHERE email = 'brunoalvespersonal5@whodo.temp' AND NOT EXISTS (
  SELECT 1 FROM servicos WHERE usuario_id = (SELECT id FROM usuarios WHERE email = 'brunoalvespersonal5@whodo.temp')
);

INSERT INTO usuarios (
  nome, nome_fantasia, email, senha, telefone, tipo,
  especialidade, sobre, avaliacao_media, verificado, disponibilidade,
  endereco, cidade, estado, cep, latitude, longitude,
  website, instagram, foto_perfil, status, email_verificado, created_at
) VALUES (
  'Rafael Dias Pintor', 'Rafael Dias Pintor', 'rafaeldiaspintor6@whodo.temp', 'd9d4a8b214e1b4ae1f88afbec9a414edd6548a35ebb9c32322d8b748407a9854', '(46) 92004-6303', 'usuario',
  'Pintor', 'Profissional de Pintor em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 5.0, false, 'Seg-Sáb: 7h às 19h',
  'Rua Goiás, 826 - Industrial, Palmas - PR, 85555-116', 'Palmas', 'PR', '', -26.48266, -51.98995,
  '', 'rafael_pintor_pr', 'https://randomuser.me/api/portraits/men/5.jpg', 'ativo', false, NOW()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO servicos (
  usuario_id, categoria_id, titulo, descricao, preco_base, cobranca_tipo, status, created_at
) SELECT 
  id, 14, 'Pintor', 'Profissional de Pintor em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 0, 'A_COMBINAR', 'ativo', NOW()
FROM usuarios WHERE email = 'rafaeldiaspintor6@whodo.temp' AND NOT EXISTS (
  SELECT 1 FROM servicos WHERE usuario_id = (SELECT id FROM usuarios WHERE email = 'rafaeldiaspintor6@whodo.temp')
);

INSERT INTO usuarios (
  nome, nome_fantasia, email, senha, telefone, tipo,
  especialidade, sobre, avaliacao_media, verificado, disponibilidade,
  endereco, cidade, estado, cep, latitude, longitude,
  website, instagram, foto_perfil, status, email_verificado, created_at
) VALUES (
  'Patrícia Rocha Beleza', 'Patrícia Rocha Beleza', 'patriciarochabeleza7@whodo.temp', 'd9d4a8b214e1b4ae1f88afbec9a414edd6548a35ebb9c32322d8b748407a9854', '(46) 90000-0000', 'usuario',
  'Cabeleireiro', 'Cortes femininos e masculinos, coloração, mechas, tratamentos capilares e penteados para eventos.', 4.7, false, 'Ter-Sáb: 9h às 19h',
  'Av. Mato Grosso, 741 - Centro, Palmas - PR, 85555-090', 'Palmas', 'PR', '', -26.4805, -51.9955,
  'https://rochastudio.com.br', 'rocha_studio_beleza', 'https://randomuser.me/api/portraits/women/61.jpg', 'ativo', false, NOW()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO servicos (
  usuario_id, categoria_id, titulo, descricao, preco_base, cobranca_tipo, status, created_at
) SELECT 
  id, 2, 'Cabeleireiro', 'Cortes femininos e masculinos, coloração, mechas, tratamentos capilares e penteados para eventos.', 0, 'A_COMBINAR', 'ativo', NOW()
FROM usuarios WHERE email = 'patriciarochabeleza7@whodo.temp' AND NOT EXISTS (
  SELECT 1 FROM servicos WHERE usuario_id = (SELECT id FROM usuarios WHERE email = 'patriciarochabeleza7@whodo.temp')
);

INSERT INTO usuarios (
  nome, nome_fantasia, email, senha, telefone, tipo,
  especialidade, sobre, avaliacao_media, verificado, disponibilidade,
  endereco, cidade, estado, cep, latitude, longitude,
  website, instagram, foto_perfil, status, email_verificado, created_at
) VALUES (
  'Natália Barbosa Designer Gráfico', 'Natália Barbosa Designer Gráfico', 'nataliabarbosadesignergrafico8@whodo.temp', 'd9d4a8b214e1b4ae1f88afbec9a414edd6548a35ebb9c32322d8b748407a9854', '(46) 96365-7862', 'usuario',
  'Designer Gráfico', 'Profissional de Designer Gráfico em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 4.2, false, 'Seg-Sex: 8h às 18h',
  'Rua Minas Gerais, 229 - Jardim das Palmeiras, Palmas - PR, 85555-109', 'Palmas', 'PR', '', -26.483366, -51.991831,
  '', 'natália_designer gráfico_pr', 'https://randomuser.me/api/portraits/women/38.jpg', 'ativo', false, NOW()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO servicos (
  usuario_id, categoria_id, titulo, descricao, preco_base, cobranca_tipo, status, created_at
) SELECT 
  id, 3, 'Designer Gráfico', 'Profissional de Designer Gráfico em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 0, 'A_COMBINAR', 'ativo', NOW()
FROM usuarios WHERE email = 'nataliabarbosadesignergrafico8@whodo.temp' AND NOT EXISTS (
  SELECT 1 FROM servicos WHERE usuario_id = (SELECT id FROM usuarios WHERE email = 'nataliabarbosadesignergrafico8@whodo.temp')
);

INSERT INTO usuarios (
  nome, nome_fantasia, email, senha, telefone, tipo,
  especialidade, sobre, avaliacao_media, verificado, disponibilidade,
  endereco, cidade, estado, cep, latitude, longitude,
  website, instagram, foto_perfil, status, email_verificado, created_at
) VALUES (
  'Vanessa Castro Marceneiro', 'Vanessa Castro Marceneiro', 'vanessacastromarceneiro9@whodo.temp', 'd9d4a8b214e1b4ae1f88afbec9a414edd6548a35ebb9c32322d8b748407a9854', '(46) 99569-6011', 'usuario',
  'Marceneiro', 'Profissional de Marceneiro em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 4.0, false, 'Agendamento prévio',
  'Av. Mato Grosso, 678 - Vila Operária, Palmas - PR, 85555-180', 'Palmas', 'PR', '', -26.481746, -51.990751,
  'https://vanessamarceneiro.com.br', 'vanessa_marceneiro_pr', 'https://randomuser.me/api/portraits/women/45.jpg', 'ativo', false, NOW()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO servicos (
  usuario_id, categoria_id, titulo, descricao, preco_base, cobranca_tipo, status, created_at
) SELECT 
  id, 10, 'Marceneiro', 'Profissional de Marceneiro em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 0, 'A_COMBINAR', 'ativo', NOW()
FROM usuarios WHERE email = 'vanessacastromarceneiro9@whodo.temp' AND NOT EXISTS (
  SELECT 1 FROM servicos WHERE usuario_id = (SELECT id FROM usuarios WHERE email = 'vanessacastromarceneiro9@whodo.temp')
);

INSERT INTO usuarios (
  nome, nome_fantasia, email, senha, telefone, tipo,
  especialidade, sobre, avaliacao_media, verificado, disponibilidade,
  endereco, cidade, estado, cep, latitude, longitude,
  website, instagram, foto_perfil, status, email_verificado, created_at
) VALUES (
  'Mariana Santos Encanador', 'Mariana Santos Encanador', 'marianasantosencanador10@whodo.temp', 'd9d4a8b214e1b4ae1f88afbec9a414edd6548a35ebb9c32322d8b748407a9854', '(46) 95671-9638', 'usuario',
  'Encanador', 'Profissional de Encanador em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 4.1, false, 'Agendamento prévio',
  'Av. Brasil, 617 - Jardim América, Palmas - PR, 85555-473', 'Palmas', 'PR', '', -26.485596, -51.987933,
  '', 'mariana_encanador_pr', 'https://randomuser.me/api/portraits/women/31.jpg', 'ativo', false, NOW()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO servicos (
  usuario_id, categoria_id, titulo, descricao, preco_base, cobranca_tipo, status, created_at
) SELECT 
  id, 6, 'Encanador', 'Profissional de Encanador em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 0, 'A_COMBINAR', 'ativo', NOW()
FROM usuarios WHERE email = 'marianasantosencanador10@whodo.temp' AND NOT EXISTS (
  SELECT 1 FROM servicos WHERE usuario_id = (SELECT id FROM usuarios WHERE email = 'marianasantosencanador10@whodo.temp')
);

INSERT INTO usuarios (
  nome, nome_fantasia, email, senha, telefone, tipo,
  especialidade, sobre, avaliacao_media, verificado, disponibilidade,
  endereco, cidade, estado, cep, latitude, longitude,
  website, instagram, foto_perfil, status, email_verificado, created_at
) VALUES (
  'Matheus Rodrigues Jardineiro', 'Matheus Rodrigues Jardineiro', 'matheusrodriguesjardineiro11@whodo.temp', 'd9d4a8b214e1b4ae1f88afbec9a414edd6548a35ebb9c32322d8b748407a9854', '(46) 91748-7862', 'usuario',
  'Jardineiro', 'Profissional de Jardineiro em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 4.8, false, 'Agendamento prévio',
  'Av. Curitiba, 376 - Jardim das Palmeiras, Palmas - PR, 85555-530', 'Palmas', 'PR', '', -26.478685, -51.983653,
  '', 'matheus_jardineiro_pr', 'https://randomuser.me/api/portraits/women/74.jpg', 'ativo', false, NOW()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO servicos (
  usuario_id, categoria_id, titulo, descricao, preco_base, cobranca_tipo, status, created_at
) SELECT 
  id, 8, 'Jardineiro', 'Profissional de Jardineiro em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 0, 'A_COMBINAR', 'ativo', NOW()
FROM usuarios WHERE email = 'matheusrodriguesjardineiro11@whodo.temp' AND NOT EXISTS (
  SELECT 1 FROM servicos WHERE usuario_id = (SELECT id FROM usuarios WHERE email = 'matheusrodriguesjardineiro11@whodo.temp')
);

INSERT INTO usuarios (
  nome, nome_fantasia, email, senha, telefone, tipo,
  especialidade, sobre, avaliacao_media, verificado, disponibilidade,
  endereco, cidade, estado, cep, latitude, longitude,
  website, instagram, foto_perfil, status, email_verificado, created_at
) VALUES (
  'Leonardo Ribeiro Mecânico', 'Leonardo Ribeiro Mecânico', 'leonardoribeiromecanico12@whodo.temp', 'd9d4a8b214e1b4ae1f88afbec9a414edd6548a35ebb9c32322d8b748407a9854', '(46) 99089-9750', 'usuario',
  'Mecânico', 'Profissional de Mecânico em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 4.3, false, 'Seg-Sex: 8h às 18h',
  'Rua Paraná, 628 - Centro, Palmas - PR, 85555-204', 'Palmas', 'PR', '', -26.47999, -51.985883,
  '', 'leonardo_mecânico_pr', 'https://randomuser.me/api/portraits/women/14.jpg', 'ativo', false, NOW()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO servicos (
  usuario_id, categoria_id, titulo, descricao, preco_base, cobranca_tipo, status, created_at
) SELECT 
  id, 11, 'Mecânico', 'Profissional de Mecânico em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 0, 'A_COMBINAR', 'ativo', NOW()
FROM usuarios WHERE email = 'leonardoribeiromecanico12@whodo.temp' AND NOT EXISTS (
  SELECT 1 FROM servicos WHERE usuario_id = (SELECT id FROM usuarios WHERE email = 'leonardoribeiromecanico12@whodo.temp')
);

INSERT INTO usuarios (
  nome, nome_fantasia, email, senha, telefone, tipo,
  especialidade, sobre, avaliacao_media, verificado, disponibilidade,
  endereco, cidade, estado, cep, latitude, longitude,
  website, instagram, foto_perfil, status, email_verificado, created_at
) VALUES (
  'Isabela Lima Cabeleireiro', 'Isabela Lima Cabeleireiro', 'isabelalimacabeleireiro13@whodo.temp', 'd9d4a8b214e1b4ae1f88afbec9a414edd6548a35ebb9c32322d8b748407a9854', '(46) 96258-9816', 'usuario',
  'Cabeleireiro', 'Profissional de Cabeleireiro em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 4.8, false, 'Agendamento prévio',
  'Av. Mato Grosso, 839 - Vila Nova, Palmas - PR, 85555-699', 'Palmas', 'PR', '', -26.488503, -51.987463,
  'https://isabelacabeleireiro.com.br', 'isabela_cabeleireiro_pr', 'https://randomuser.me/api/portraits/women/45.jpg', 'ativo', false, NOW()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO servicos (
  usuario_id, categoria_id, titulo, descricao, preco_base, cobranca_tipo, status, created_at
) SELECT 
  id, 2, 'Cabeleireiro', 'Profissional de Cabeleireiro em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 0, 'A_COMBINAR', 'ativo', NOW()
FROM usuarios WHERE email = 'isabelalimacabeleireiro13@whodo.temp' AND NOT EXISTS (
  SELECT 1 FROM servicos WHERE usuario_id = (SELECT id FROM usuarios WHERE email = 'isabelalimacabeleireiro13@whodo.temp')
);

INSERT INTO usuarios (
  nome, nome_fantasia, email, senha, telefone, tipo,
  especialidade, sobre, avaliacao_media, verificado, disponibilidade,
  endereco, cidade, estado, cep, latitude, longitude,
  website, instagram, foto_perfil, status, email_verificado, created_at
) VALUES (
  'André Martins Encanador', 'André Martins Encanador', 'andremartinsencanador14@whodo.temp', 'd9d4a8b214e1b4ae1f88afbec9a414edd6548a35ebb9c32322d8b748407a9854', '(46) 93649-1835', 'usuario',
  'Encanador', 'Profissional de Encanador em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 4.9, false, 'Seg-Sáb: 7h às 19h',
  'Av. Curitiba, 551 - Vila Nova, Palmas - PR, 85555-783', 'Palmas', 'PR', '', -26.482593, -51.995158,
  'https://andréencanador.com.br', 'andré_encanador_pr', 'https://randomuser.me/api/portraits/men/1.jpg', 'ativo', false, NOW()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO servicos (
  usuario_id, categoria_id, titulo, descricao, preco_base, cobranca_tipo, status, created_at
) SELECT 
  id, 6, 'Encanador', 'Profissional de Encanador em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 0, 'A_COMBINAR', 'ativo', NOW()
FROM usuarios WHERE email = 'andremartinsencanador14@whodo.temp' AND NOT EXISTS (
  SELECT 1 FROM servicos WHERE usuario_id = (SELECT id FROM usuarios WHERE email = 'andremartinsencanador14@whodo.temp')
);

INSERT INTO usuarios (
  nome, nome_fantasia, email, senha, telefone, tipo,
  especialidade, sobre, avaliacao_media, verificado, disponibilidade,
  endereco, cidade, estado, cep, latitude, longitude,
  website, instagram, foto_perfil, status, email_verificado, created_at
) VALUES (
  'Carlos Mendes Marcenaria', 'Carlos Mendes Marcenaria', 'carlosmendesmarcenaria15@whodo.temp', 'd9d4a8b214e1b4ae1f88afbec9a414edd6548a35ebb9c32322d8b748407a9854', '(46) 95555-5555', 'usuario',
  'Marceneiro', 'Móveis sob medida, cozinhas planejadas, armários, portas e janelas. Madeira de qualidade e acabamento fino.', 4.9, false, 'Seg-Sex: 8h às 18h',
  'Rua Paraná, 654 - Industrial, Palmas - PR, 85555-040', 'Palmas', 'PR', '', -26.487, -51.987,
  '', 'mendes_moveis', 'https://randomuser.me/api/portraits/men/67.jpg', 'ativo', false, NOW()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO servicos (
  usuario_id, categoria_id, titulo, descricao, preco_base, cobranca_tipo, status, created_at
) SELECT 
  id, 10, 'Marceneiro', 'Móveis sob medida, cozinhas planejadas, armários, portas e janelas. Madeira de qualidade e acabamento fino.', 0, 'A_COMBINAR', 'ativo', NOW()
FROM usuarios WHERE email = 'carlosmendesmarcenaria15@whodo.temp' AND NOT EXISTS (
  SELECT 1 FROM servicos WHERE usuario_id = (SELECT id FROM usuarios WHERE email = 'carlosmendesmarcenaria15@whodo.temp')
);

INSERT INTO usuarios (
  nome, nome_fantasia, email, senha, telefone, tipo,
  especialidade, sobre, avaliacao_media, verificado, disponibilidade,
  endereco, cidade, estado, cep, latitude, longitude,
  website, instagram, foto_perfil, status, email_verificado, created_at
) VALUES (
  'Ricardo Souza Jardins', 'Ricardo Souza Jardins', 'ricardosouzajardins16@whodo.temp', 'd9d4a8b214e1b4ae1f88afbec9a414edd6548a35ebb9c32322d8b748407a9854', '(46) 93333-7777', 'usuario',
  'Jardineiro', 'Paisagismo, manutenção de jardins, poda de árvores, plantio de grama e jardinagem em geral.', 4.7, false, 'Seg-Sáb: 7h às 18h',
  'Av. Curitiba, 147 - Jardim das Palmeiras, Palmas - PR, 85555-060', 'Palmas', 'PR', '', -26.488, -51.986,
  'https://souzajardins.com.br', 'souza_paisagismo', 'https://randomuser.me/api/portraits/men/41.jpg', 'ativo', false, NOW()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO servicos (
  usuario_id, categoria_id, titulo, descricao, preco_base, cobranca_tipo, status, created_at
) SELECT 
  id, 8, 'Jardineiro', 'Paisagismo, manutenção de jardins, poda de árvores, plantio de grama e jardinagem em geral.', 0, 'A_COMBINAR', 'ativo', NOW()
FROM usuarios WHERE email = 'ricardosouzajardins16@whodo.temp' AND NOT EXISTS (
  SELECT 1 FROM servicos WHERE usuario_id = (SELECT id FROM usuarios WHERE email = 'ricardosouzajardins16@whodo.temp')
);

INSERT INTO usuarios (
  nome, nome_fantasia, email, senha, telefone, tipo,
  especialidade, sobre, avaliacao_media, verificado, disponibilidade,
  endereco, cidade, estado, cep, latitude, longitude,
  website, instagram, foto_perfil, status, email_verificado, created_at
) VALUES (
  'Felipe Nascimento Personal Trainer', 'Felipe Nascimento Personal Trainer', 'felipenascimentopersonaltrainer17@whodo.temp', 'd9d4a8b214e1b4ae1f88afbec9a414edd6548a35ebb9c32322d8b748407a9854', '(46) 92161-5560', 'usuario',
  'Personal Trainer', 'Profissional de Personal Trainer em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 4.7, false, 'Seg-Sex: 8h às 18h',
  'Rua Goiás, 959 - Jardim América, Palmas - PR, 85555-366', 'Palmas', 'PR', '', -26.481062, -51.986579,
  '', 'felipe_personal trainer_pr', 'https://randomuser.me/api/portraits/men/81.jpg', 'ativo', false, NOW()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO servicos (
  usuario_id, categoria_id, titulo, descricao, preco_base, cobranca_tipo, status, created_at
) SELECT 
  id, 13, 'Personal Trainer', 'Profissional de Personal Trainer em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 0, 'A_COMBINAR', 'ativo', NOW()
FROM usuarios WHERE email = 'felipenascimentopersonaltrainer17@whodo.temp' AND NOT EXISTS (
  SELECT 1 FROM servicos WHERE usuario_id = (SELECT id FROM usuarios WHERE email = 'felipenascimentopersonaltrainer17@whodo.temp')
);

INSERT INTO usuarios (
  nome, nome_fantasia, email, senha, telefone, tipo,
  especialidade, sobre, avaliacao_media, verificado, disponibilidade,
  endereco, cidade, estado, cep, latitude, longitude,
  website, instagram, foto_perfil, status, email_verificado, created_at
) VALUES (
  'Lucas Oliveira Pedreiro', 'Lucas Oliveira Pedreiro', 'lucasoliveirapedreiro18@whodo.temp', 'd9d4a8b214e1b4ae1f88afbec9a414edd6548a35ebb9c32322d8b748407a9854', '(46) 91183-9754', 'usuario',
  'Pedreiro', 'Profissional de Pedreiro em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 4.5, false, 'Seg-Sex: 8h às 18h',
  'Rua São Paulo, 780 - Vila Nova, Palmas - PR, 85555-212', 'Palmas', 'PR', '', -26.489007, -51.996714,
  'https://lucaspedreiro.com.br', 'lucas_pedreiro_pr', 'https://randomuser.me/api/portraits/women/92.jpg', 'ativo', false, NOW()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO servicos (
  usuario_id, categoria_id, titulo, descricao, preco_base, cobranca_tipo, status, created_at
) SELECT 
  id, 12, 'Pedreiro', 'Profissional de Pedreiro em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 0, 'A_COMBINAR', 'ativo', NOW()
FROM usuarios WHERE email = 'lucasoliveirapedreiro18@whodo.temp' AND NOT EXISTS (
  SELECT 1 FROM servicos WHERE usuario_id = (SELECT id FROM usuarios WHERE email = 'lucasoliveirapedreiro18@whodo.temp')
);

INSERT INTO usuarios (
  nome, nome_fantasia, email, senha, telefone, tipo,
  especialidade, sobre, avaliacao_media, verificado, disponibilidade,
  endereco, cidade, estado, cep, latitude, longitude,
  website, instagram, foto_perfil, status, email_verificado, created_at
) VALUES (
  'Bianca Araújo Manicure', 'Bianca Araújo Manicure', 'biancaaraujomanicure19@whodo.temp', 'd9d4a8b214e1b4ae1f88afbec9a414edd6548a35ebb9c32322d8b748407a9854', '(46) 97508-9901', 'usuario',
  'Manicure', 'Profissional de Manicure em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 4.5, false, 'Seg-Sáb: 7h às 19h',
  'Av. Brasil, 967 - Industrial, Palmas - PR, 85555-819', 'Palmas', 'PR', '', -26.483675, -51.983269,
  'https://biancamanicure.com.br', 'bianca_manicure_pr', 'https://randomuser.me/api/portraits/men/26.jpg', 'ativo', false, NOW()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO servicos (
  usuario_id, categoria_id, titulo, descricao, preco_base, cobranca_tipo, status, created_at
) SELECT 
  id, 9, 'Manicure', 'Profissional de Manicure em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 0, 'A_COMBINAR', 'ativo', NOW()
FROM usuarios WHERE email = 'biancaaraujomanicure19@whodo.temp' AND NOT EXISTS (
  SELECT 1 FROM servicos WHERE usuario_id = (SELECT id FROM usuarios WHERE email = 'biancaaraujomanicure19@whodo.temp')
);

INSERT INTO usuarios (
  nome, nome_fantasia, email, senha, telefone, tipo,
  especialidade, sobre, avaliacao_media, verificado, disponibilidade,
  endereco, cidade, estado, cep, latitude, longitude,
  website, instagram, foto_perfil, status, email_verificado, created_at
) VALUES (
  'Thiago Carvalho Barbeiro', 'Thiago Carvalho Barbeiro', 'thiagocarvalhobarbeiro20@whodo.temp', 'd9d4a8b214e1b4ae1f88afbec9a414edd6548a35ebb9c32322d8b748407a9854', '(46) 91086-4233', 'usuario',
  'Barbeiro', 'Profissional de Barbeiro em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 4.1, false, 'Seg-Sex: 8h às 18h',
  'Rua das Flores, 527 - Jardim Europa, Palmas - PR, 85555-354', 'Palmas', 'PR', '', -26.48337, -51.989778,
  'https://thiagobarbeiro.com.br', 'thiago_barbeiro_pr', 'https://randomuser.me/api/portraits/women/73.jpg', 'ativo', false, NOW()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO servicos (
  usuario_id, categoria_id, titulo, descricao, preco_base, cobranca_tipo, status, created_at
) SELECT 
  id, 1, 'Barbeiro', 'Profissional de Barbeiro em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 0, 'A_COMBINAR', 'ativo', NOW()
FROM usuarios WHERE email = 'thiagocarvalhobarbeiro20@whodo.temp' AND NOT EXISTS (
  SELECT 1 FROM servicos WHERE usuario_id = (SELECT id FROM usuarios WHERE email = 'thiagocarvalhobarbeiro20@whodo.temp')
);

INSERT INTO usuarios (
  nome, nome_fantasia, email, senha, telefone, tipo,
  especialidade, sobre, avaliacao_media, verificado, disponibilidade,
  endereco, cidade, estado, cep, latitude, longitude,
  website, instagram, foto_perfil, status, email_verificado, created_at
) VALUES (
  'Carolina Gomes Eletricista', 'Carolina Gomes Eletricista', 'carolinagomeseletricista21@whodo.temp', 'd9d4a8b214e1b4ae1f88afbec9a414edd6548a35ebb9c32322d8b748407a9854', '(46) 97071-9251', 'usuario',
  'Eletricista', 'Profissional de Eletricista em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 4.0, false, 'Seg-Sex: 8h às 18h',
  'Rua Rio Grande do Sul, 398 - Jardim América, Palmas - PR, 85555-698', 'Palmas', 'PR', '', -26.489052, -51.985425,
  '', 'carolina_eletricista_pr', 'https://randomuser.me/api/portraits/men/97.jpg', 'ativo', false, NOW()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO servicos (
  usuario_id, categoria_id, titulo, descricao, preco_base, cobranca_tipo, status, created_at
) SELECT 
  id, 5, 'Eletricista', 'Profissional de Eletricista em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 0, 'A_COMBINAR', 'ativo', NOW()
FROM usuarios WHERE email = 'carolinagomeseletricista21@whodo.temp' AND NOT EXISTS (
  SELECT 1 FROM servicos WHERE usuario_id = (SELECT id FROM usuarios WHERE email = 'carolinagomeseletricista21@whodo.temp')
);

INSERT INTO usuarios (
  nome, nome_fantasia, email, senha, telefone, tipo,
  especialidade, sobre, avaliacao_media, verificado, disponibilidade,
  endereco, cidade, estado, cep, latitude, longitude,
  website, instagram, foto_perfil, status, email_verificado, created_at
) VALUES (
  'Larissa Costa Diarista', 'Larissa Costa Diarista', 'larissacostadiarista22@whodo.temp', 'd9d4a8b214e1b4ae1f88afbec9a414edd6548a35ebb9c32322d8b748407a9854', '(46) 91919-2832', 'usuario',
  'Diarista', 'Profissional de Diarista em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 4.9, false, 'Seg-Sáb: 7h às 19h',
  'Rua Rio Grande do Sul, 486 - Vila Operária, Palmas - PR, 85555-735', 'Palmas', 'PR', '', -26.480373, -51.991085,
  'https://larissadiarista.com.br', 'larissa_diarista_pr', 'https://randomuser.me/api/portraits/women/89.jpg', 'ativo', false, NOW()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO servicos (
  usuario_id, categoria_id, titulo, descricao, preco_base, cobranca_tipo, status, created_at
) SELECT 
  id, 4, 'Diarista', 'Profissional de Diarista em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 0, 'A_COMBINAR', 'ativo', NOW()
FROM usuarios WHERE email = 'larissacostadiarista22@whodo.temp' AND NOT EXISTS (
  SELECT 1 FROM servicos WHERE usuario_id = (SELECT id FROM usuarios WHERE email = 'larissacostadiarista22@whodo.temp')
);

INSERT INTO usuarios (
  nome, nome_fantasia, email, senha, telefone, tipo,
  especialidade, sobre, avaliacao_media, verificado, disponibilidade,
  endereco, cidade, estado, cep, latitude, longitude,
  website, instagram, foto_perfil, status, email_verificado, created_at
) VALUES (
  'Gabriel Pereira Marceneiro', 'Gabriel Pereira Marceneiro', 'gabrielpereiramarceneiro23@whodo.temp', 'd9d4a8b214e1b4ae1f88afbec9a414edd6548a35ebb9c32322d8b748407a9854', '(46) 99355-4584', 'usuario',
  'Marceneiro', 'Profissional de Marceneiro em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 4.9, false, 'Seg-Sáb: 7h às 19h',
  'Rua Paraná, 316 - Industrial, Palmas - PR, 85555-326', 'Palmas', 'PR', '', -26.478996, -51.992109,
  '', 'gabriel_marceneiro_pr', 'https://randomuser.me/api/portraits/men/62.jpg', 'ativo', false, NOW()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO servicos (
  usuario_id, categoria_id, titulo, descricao, preco_base, cobranca_tipo, status, created_at
) SELECT 
  id, 10, 'Marceneiro', 'Profissional de Marceneiro em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 0, 'A_COMBINAR', 'ativo', NOW()
FROM usuarios WHERE email = 'gabrielpereiramarceneiro23@whodo.temp' AND NOT EXISTS (
  SELECT 1 FROM servicos WHERE usuario_id = (SELECT id FROM usuarios WHERE email = 'gabrielpereiramarceneiro23@whodo.temp')
);

INSERT INTO usuarios (
  nome, nome_fantasia, email, senha, telefone, tipo,
  especialidade, sobre, avaliacao_media, verificado, disponibilidade,
  endereco, cidade, estado, cep, latitude, longitude,
  website, instagram, foto_perfil, status, email_verificado, created_at
) VALUES (
  'João Silva Eletricista', 'João Silva Eletricista', 'joaosilvaeletricista24@whodo.temp', 'd9d4a8b214e1b4ae1f88afbec9a414edd6548a35ebb9c32322d8b748407a9854', '(46) 99999-1111', 'usuario',
  'Eletricista', 'Especialista em instalações elétricas residenciais e comerciais. Mais de 15 anos de experiência. Atendimento 24 horas para emergências.', 4.8, false, 'Seg-Sex: 8h às 18h, Sáb: 8h às 12h',
  'Rua das Flores, 123 - Centro, Palmas - PR, 85555-000', 'Palmas', 'PR', '', -26.4845, -51.9902,
  '', 'js_eletrica', 'https://randomuser.me/api/portraits/men/32.jpg', 'ativo', false, NOW()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO servicos (
  usuario_id, categoria_id, titulo, descricao, preco_base, cobranca_tipo, status, created_at
) SELECT 
  id, 5, 'Eletricista', 'Especialista em instalações elétricas residenciais e comerciais. Mais de 15 anos de experiência. Atendimento 24 horas para emergências.', 0, 'A_COMBINAR', 'ativo', NOW()
FROM usuarios WHERE email = 'joaosilvaeletricista24@whodo.temp' AND NOT EXISTS (
  SELECT 1 FROM servicos WHERE usuario_id = (SELECT id FROM usuarios WHERE email = 'joaosilvaeletricista24@whodo.temp')
);

INSERT INTO usuarios (
  nome, nome_fantasia, email, senha, telefone, tipo,
  especialidade, sobre, avaliacao_media, verificado, disponibilidade,
  endereco, cidade, estado, cep, latitude, longitude,
  website, instagram, foto_perfil, status, email_verificado, created_at
) VALUES (
  'Camila Souza Pintor', 'Camila Souza Pintor', 'camilasouzapintor25@whodo.temp', 'd9d4a8b214e1b4ae1f88afbec9a414edd6548a35ebb9c32322d8b748407a9854', '(46) 96328-1441', 'usuario',
  'Pintor', 'Profissional de Pintor em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 4.6, false, 'Seg-Sáb: 7h às 19h',
  'Rua Minas Gerais, 752 - Jardim Europa, Palmas - PR, 85555-818', 'Palmas', 'PR', '', -26.478486, -51.984784,
  'https://camilapintor.com.br', 'camila_pintor_pr', 'https://randomuser.me/api/portraits/men/32.jpg', 'ativo', false, NOW()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO servicos (
  usuario_id, categoria_id, titulo, descricao, preco_base, cobranca_tipo, status, created_at
) SELECT 
  id, 14, 'Pintor', 'Profissional de Pintor em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 0, 'A_COMBINAR', 'ativo', NOW()
FROM usuarios WHERE email = 'camilasouzapintor25@whodo.temp' AND NOT EXISTS (
  SELECT 1 FROM servicos WHERE usuario_id = (SELECT id FROM usuarios WHERE email = 'camilasouzapintor25@whodo.temp')
);

INSERT INTO usuarios (
  nome, nome_fantasia, email, senha, telefone, tipo,
  especialidade, sobre, avaliacao_media, verificado, disponibilidade,
  endereco, cidade, estado, cep, latitude, longitude,
  website, instagram, foto_perfil, status, email_verificado, created_at
) VALUES (
  'Juliana Martins Fotografia', 'Juliana Martins Fotografia', 'julianamartinsfotografia26@whodo.temp', 'd9d4a8b214e1b4ae1f88afbec9a414edd6548a35ebb9c32322d8b748407a9854', '(46) 92222-8888', 'usuario',
  'Fotógrafo', 'Fotografia de casamentos, aniversários, ensaios e eventos corporativos. Edição profissional incluída.', 4.9, false, 'Agendamento prévio',
  'Rua Santa Catarina, 258 - Centro, Palmas - PR, 85555-070', 'Palmas', 'PR', '', -26.4815, -51.9945,
  'https://jmfotos.com.br', 'jm_fotografia', 'https://randomuser.me/api/portraits/women/35.jpg', 'ativo', false, NOW()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO servicos (
  usuario_id, categoria_id, titulo, descricao, preco_base, cobranca_tipo, status, created_at
) SELECT 
  id, 7, 'Fotógrafo', 'Fotografia de casamentos, aniversários, ensaios e eventos corporativos. Edição profissional incluída.', 0, 'A_COMBINAR', 'ativo', NOW()
FROM usuarios WHERE email = 'julianamartinsfotografia26@whodo.temp' AND NOT EXISTS (
  SELECT 1 FROM servicos WHERE usuario_id = (SELECT id FROM usuarios WHERE email = 'julianamartinsfotografia26@whodo.temp')
);

INSERT INTO usuarios (
  nome, nome_fantasia, email, senha, telefone, tipo,
  especialidade, sobre, avaliacao_media, verificado, disponibilidade,
  endereco, cidade, estado, cep, latitude, longitude,
  website, instagram, foto_perfil, status, email_verificado, created_at
) VALUES (
  'Diego Fernandes Técnico De Informática', 'Diego Fernandes Técnico De Informática', 'diegofernandestecnicodeinformatica27@whodo.temp', 'd9d4a8b214e1b4ae1f88afbec9a414edd6548a35ebb9c32322d8b748407a9854', '(46) 93263-3093', 'usuario',
  'Técnico de Informática', 'Profissional de Técnico de Informática em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 4.4, false, 'Seg-Sáb: 7h às 19h',
  'Rua São Paulo, 728 - Vila Operária, Palmas - PR, 85555-399', 'Palmas', 'PR', '', -26.483011, -51.99417,
  'https://diegotécnico de informática.com.br', 'diego_técnico de informática_pr', 'https://randomuser.me/api/portraits/women/72.jpg', 'ativo', false, NOW()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO servicos (
  usuario_id, categoria_id, titulo, descricao, preco_base, cobranca_tipo, status, created_at
) SELECT 
  id, 15, 'Técnico de Informática', 'Profissional de Técnico de Informática em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 0, 'A_COMBINAR', 'ativo', NOW()
FROM usuarios WHERE email = 'diegofernandestecnicodeinformatica27@whodo.temp' AND NOT EXISTS (
  SELECT 1 FROM servicos WHERE usuario_id = (SELECT id FROM usuarios WHERE email = 'diegofernandestecnicodeinformatica27@whodo.temp')
);

INSERT INTO usuarios (
  nome, nome_fantasia, email, senha, telefone, tipo,
  especialidade, sobre, avaliacao_media, verificado, disponibilidade,
  endereco, cidade, estado, cep, latitude, longitude,
  website, instagram, foto_perfil, status, email_verificado, created_at
) VALUES (
  'Ana Costa Pinturas', 'Ana Costa Pinturas', 'anacostapinturas28@whodo.temp', 'd9d4a8b214e1b4ae1f88afbec9a414edd6548a35ebb9c32322d8b748407a9854', '(46) 96666-4444', 'usuario',
  'Pintor', 'Pintura residencial e comercial, texturas, grafiato, massa corrida. Trabalho limpo e profissional.', 4.6, false, 'Seg-Sáb: 8h às 18h',
  'Rua Minas Gerais, 321 - Centro, Palmas - PR, 85555-030', 'Palmas', 'PR', '', -26.4855, -51.991,
  'https://costapinturas.com', 'costa_pinturas', 'https://randomuser.me/api/portraits/women/28.jpg', 'ativo', false, NOW()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO servicos (
  usuario_id, categoria_id, titulo, descricao, preco_base, cobranca_tipo, status, created_at
) SELECT 
  id, 14, 'Pintor', 'Pintura residencial e comercial, texturas, grafiato, massa corrida. Trabalho limpo e profissional.', 0, 'A_COMBINAR', 'ativo', NOW()
FROM usuarios WHERE email = 'anacostapinturas28@whodo.temp' AND NOT EXISTS (
  SELECT 1 FROM servicos WHERE usuario_id = (SELECT id FROM usuarios WHERE email = 'anacostapinturas28@whodo.temp')
);

INSERT INTO usuarios (
  nome, nome_fantasia, email, senha, telefone, tipo,
  especialidade, sobre, avaliacao_media, verificado, disponibilidade,
  endereco, cidade, estado, cep, latitude, longitude,
  website, instagram, foto_perfil, status, email_verificado, created_at
) VALUES (
  'Pedro Santos Construções', 'Pedro Santos Construções', 'pedrosantosconstrucoes29@whodo.temp', 'd9d4a8b214e1b4ae1f88afbec9a414edd6548a35ebb9c32322d8b748407a9854', '(46) 97777-3333', 'usuario',
  'Pedreiro', 'Construção civil, reformas, acabamentos, pintura e pequenos reparos. Orçamento sem compromisso.', 4.7, false, 'Seg-Sex: 7h às 17h',
  'Rua São Paulo, 789 - Vila Nova, Palmas - PR, 85555-020', 'Palmas', 'PR', '', -26.482, -51.992,
  '', 'santos_reformas_pr', 'https://randomuser.me/api/portraits/men/55.jpg', 'ativo', false, NOW()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO servicos (
  usuario_id, categoria_id, titulo, descricao, preco_base, cobranca_tipo, status, created_at
) SELECT 
  id, 12, 'Pedreiro', 'Construção civil, reformas, acabamentos, pintura e pequenos reparos. Orçamento sem compromisso.', 0, 'A_COMBINAR', 'ativo', NOW()
FROM usuarios WHERE email = 'pedrosantosconstrucoes29@whodo.temp' AND NOT EXISTS (
  SELECT 1 FROM servicos WHERE usuario_id = (SELECT id FROM usuarios WHERE email = 'pedrosantosconstrucoes29@whodo.temp')
);

INSERT INTO usuarios (
  nome, nome_fantasia, email, senha, telefone, tipo,
  especialidade, sobre, avaliacao_media, verificado, disponibilidade,
  endereco, cidade, estado, cep, latitude, longitude,
  website, instagram, foto_perfil, status, email_verificado, created_at
) VALUES (
  'Amanda Almeida Fotógrafo', 'Amanda Almeida Fotógrafo', 'amandaalmeidafotografo30@whodo.temp', 'd9d4a8b214e1b4ae1f88afbec9a414edd6548a35ebb9c32322d8b748407a9854', '(46) 97231-1815', 'usuario',
  'Fotógrafo', 'Profissional de Fotógrafo em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 4.6, false, 'Seg-Sáb: 7h às 19h',
  'Rua Santa Catarina, 196 - Centro, Palmas - PR, 85555-426', 'Palmas', 'PR', '', -26.479342, -51.99687,
  'https://amandafotógrafo.com.br', 'amanda_fotógrafo_pr', 'https://randomuser.me/api/portraits/men/80.jpg', 'ativo', false, NOW()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO servicos (
  usuario_id, categoria_id, titulo, descricao, preco_base, cobranca_tipo, status, created_at
) SELECT 
  id, 7, 'Fotógrafo', 'Profissional de Fotógrafo em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', 0, 'A_COMBINAR', 'ativo', NOW()
FROM usuarios WHERE email = 'amandaalmeidafotografo30@whodo.temp' AND NOT EXISTS (
  SELECT 1 FROM servicos WHERE usuario_id = (SELECT id FROM usuarios WHERE email = 'amandaalmeidafotografo30@whodo.temp')
);


COMMIT;

-- ============================================
-- SEED CONCLUÍDO
-- ============================================