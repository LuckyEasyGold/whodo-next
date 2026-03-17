--
-- PostgreSQL database dump
--

\restrict snDjiTtm0C01yCaiaexuv4kUfFSbn0wYXB1GQ5mXPgv98B5buglTQLgnkGdXIVJ

-- Dumped from database version 17.8 (6108b59)
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.usuarios DROP CONSTRAINT IF EXISTS usuarios_patrocinador_id_fkey;
ALTER TABLE IF EXISTS ONLY public.transacoes DROP CONSTRAINT IF EXISTS transacoes_carteira_id_fkey;
ALTER TABLE IF EXISTS ONLY public.transacoes DROP CONSTRAINT IF EXISTS transacoes_agendamento_id_fkey;
ALTER TABLE IF EXISTS ONLY public.solicitacoes DROP CONSTRAINT IF EXISTS solicitacoes_servico_id_fkey;
ALTER TABLE IF EXISTS ONLY public.solicitacoes DROP CONSTRAINT IF EXISTS solicitacoes_prestador_id_fkey;
ALTER TABLE IF EXISTS ONLY public.solicitacoes DROP CONSTRAINT IF EXISTS solicitacoes_cliente_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sessions DROP CONSTRAINT IF EXISTS "sessions_userId_fkey";
ALTER TABLE IF EXISTS ONLY public.servicos DROP CONSTRAINT IF EXISTS servicos_usuario_id_fkey;
ALTER TABLE IF EXISTS ONLY public.servicos DROP CONSTRAINT IF EXISTS servicos_categoria_id_fkey;
ALTER TABLE IF EXISTS ONLY public.seguidores DROP CONSTRAINT IF EXISTS seguidores_seguidor_id_fkey;
ALTER TABLE IF EXISTS ONLY public.seguidores DROP CONSTRAINT IF EXISTS seguidores_seguido_id_fkey;
ALTER TABLE IF EXISTS ONLY public.portfolio_media DROP CONSTRAINT IF EXISTS portfolio_media_usuario_id_fkey;
ALTER TABLE IF EXISTS ONLY public.portfolio_media DROP CONSTRAINT IF EXISTS portfolio_media_album_id_fkey;
ALTER TABLE IF EXISTS ONLY public.portfolio_comentarios DROP CONSTRAINT IF EXISTS portfolio_comentarios_usuario_id_fkey;
ALTER TABLE IF EXISTS ONLY public.portfolio_comentarios DROP CONSTRAINT IF EXISTS portfolio_comentarios_media_id_fkey;
ALTER TABLE IF EXISTS ONLY public.portfolio_albums DROP CONSTRAINT IF EXISTS portfolio_albums_usuario_id_fkey;
ALTER TABLE IF EXISTS ONLY public.orcamentos DROP CONSTRAINT IF EXISTS orcamentos_solicitacao_id_fkey;
ALTER TABLE IF EXISTS ONLY public.orcamentos DROP CONSTRAINT IF EXISTS orcamentos_prestador_id_fkey;
ALTER TABLE IF EXISTS ONLY public.notificacoes DROP CONSTRAINT IF EXISTS notificacoes_usuario_id_fkey;
ALTER TABLE IF EXISTS ONLY public.mensagens DROP CONSTRAINT IF EXISTS mensagens_solicitacao_id_fkey;
ALTER TABLE IF EXISTS ONLY public.mensagens DROP CONSTRAINT IF EXISTS mensagens_remetente_id_fkey;
ALTER TABLE IF EXISTS ONLY public.mensagens DROP CONSTRAINT IF EXISTS mensagens_destinatario_id_fkey;
ALTER TABLE IF EXISTS ONLY public.postagens DROP CONSTRAINT IF EXISTS fk_postagens_autor;
ALTER TABLE IF EXISTS ONLY public.curtidas DROP CONSTRAINT IF EXISTS fk_curtidas_usuario;
ALTER TABLE IF EXISTS ONLY public.curtidas DROP CONSTRAINT IF EXISTS fk_curtidas_postagem;
ALTER TABLE IF EXISTS ONLY public.compartilhamentos DROP CONSTRAINT IF EXISTS fk_compartilhamentos_usuario;
ALTER TABLE IF EXISTS ONLY public.compartilhamentos DROP CONSTRAINT IF EXISTS fk_compartilhamentos_postagem;
ALTER TABLE IF EXISTS ONLY public.comentarios DROP CONSTRAINT IF EXISTS fk_comentarios_usuario;
ALTER TABLE IF EXISTS ONLY public.comentarios DROP CONSTRAINT IF EXISTS fk_comentarios_postagem;
ALTER TABLE IF EXISTS ONLY public.dados_bancarios DROP CONSTRAINT IF EXISTS dados_bancarios_usuario_id_fkey;
ALTER TABLE IF EXISTS ONLY public.carteiras DROP CONSTRAINT IF EXISTS carteiras_usuario_id_fkey;
ALTER TABLE IF EXISTS ONLY public.avaliacoes DROP CONSTRAINT IF EXISTS avaliacoes_servico_id_fkey;
ALTER TABLE IF EXISTS ONLY public.avaliacoes DROP CONSTRAINT IF EXISTS avaliacoes_prestador_id_fkey;
ALTER TABLE IF EXISTS ONLY public.avaliacoes DROP CONSTRAINT IF EXISTS avaliacoes_cliente_id_fkey;
ALTER TABLE IF EXISTS ONLY public.agendamentos DROP CONSTRAINT IF EXISTS agendamentos_servico_id_fkey;
ALTER TABLE IF EXISTS ONLY public.agendamentos DROP CONSTRAINT IF EXISTS agendamentos_prestador_id_fkey;
ALTER TABLE IF EXISTS ONLY public.agendamentos DROP CONSTRAINT IF EXISTS agendamentos_cliente_id_fkey;
ALTER TABLE IF EXISTS ONLY public.accounts DROP CONSTRAINT IF EXISTS "accounts_userId_fkey";
DROP INDEX IF EXISTS public.verification_tokens_token_key;
DROP INDEX IF EXISTS public.verification_tokens_identifier_token_key;
DROP INDEX IF EXISTS public.usuarios_email_key;
DROP INDEX IF EXISTS public.usuarios_documento_key;
DROP INDEX IF EXISTS public."sessions_sessionToken_key";
DROP INDEX IF EXISTS public.seguidores_seguidor_id_seguido_id_key;
DROP INDEX IF EXISTS public.idx_postagens_created;
DROP INDEX IF EXISTS public.idx_postagens_autor;
DROP INDEX IF EXISTS public.idx_curtidas_postagem;
DROP INDEX IF EXISTS public.idx_comentarios_postagem;
DROP INDEX IF EXISTS public.dados_bancarios_usuario_id_key;
DROP INDEX IF EXISTS public.carteiras_usuario_id_key;
DROP INDEX IF EXISTS public."accounts_provider_providerAccountId_key";
ALTER TABLE IF EXISTS ONLY public.usuarios DROP CONSTRAINT IF EXISTS usuarios_pkey;
ALTER TABLE IF EXISTS ONLY public.compartilhamentos DROP CONSTRAINT IF EXISTS unique_usuario_postagem_share;
ALTER TABLE IF EXISTS ONLY public.curtidas DROP CONSTRAINT IF EXISTS unique_usuario_postagem;
ALTER TABLE IF EXISTS ONLY public.transacoes DROP CONSTRAINT IF EXISTS transacoes_pkey;
ALTER TABLE IF EXISTS ONLY public.solicitacoes DROP CONSTRAINT IF EXISTS solicitacoes_pkey;
ALTER TABLE IF EXISTS ONLY public.sessions DROP CONSTRAINT IF EXISTS sessions_pkey;
ALTER TABLE IF EXISTS ONLY public.servicos DROP CONSTRAINT IF EXISTS servicos_pkey;
ALTER TABLE IF EXISTS ONLY public.seguidores DROP CONSTRAINT IF EXISTS seguidores_pkey;
ALTER TABLE IF EXISTS ONLY public.postagens DROP CONSTRAINT IF EXISTS postagens_pkey;
ALTER TABLE IF EXISTS ONLY public.portfolio_media DROP CONSTRAINT IF EXISTS portfolio_media_pkey;
ALTER TABLE IF EXISTS ONLY public.portfolio_comentarios DROP CONSTRAINT IF EXISTS portfolio_comentarios_pkey;
ALTER TABLE IF EXISTS ONLY public.portfolio_albums DROP CONSTRAINT IF EXISTS portfolio_albums_pkey;
ALTER TABLE IF EXISTS ONLY public.orcamentos DROP CONSTRAINT IF EXISTS orcamentos_pkey;
ALTER TABLE IF EXISTS ONLY public.notificacoes DROP CONSTRAINT IF EXISTS notificacoes_pkey;
ALTER TABLE IF EXISTS ONLY public.mensagens DROP CONSTRAINT IF EXISTS mensagens_pkey;
ALTER TABLE IF EXISTS ONLY public.dados_bancarios DROP CONSTRAINT IF EXISTS dados_bancarios_pkey;
ALTER TABLE IF EXISTS ONLY public.curtidas DROP CONSTRAINT IF EXISTS curtidas_pkey;
ALTER TABLE IF EXISTS ONLY public.compartilhamentos DROP CONSTRAINT IF EXISTS compartilhamentos_pkey;
ALTER TABLE IF EXISTS ONLY public.comentarios DROP CONSTRAINT IF EXISTS comentarios_pkey;
ALTER TABLE IF EXISTS ONLY public.categorias DROP CONSTRAINT IF EXISTS categorias_pkey;
ALTER TABLE IF EXISTS ONLY public.carteiras DROP CONSTRAINT IF EXISTS carteiras_pkey;
ALTER TABLE IF EXISTS ONLY public.avaliacoes DROP CONSTRAINT IF EXISTS avaliacoes_pkey;
ALTER TABLE IF EXISTS ONLY public.agendamentos DROP CONSTRAINT IF EXISTS agendamentos_pkey;
ALTER TABLE IF EXISTS ONLY public.accounts DROP CONSTRAINT IF EXISTS accounts_pkey;
ALTER TABLE IF EXISTS public.usuarios ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.transacoes ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.solicitacoes ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.servicos ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.seguidores ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.postagens ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.portfolio_media ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.portfolio_comentarios ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.portfolio_albums ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.orcamentos ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.notificacoes ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.mensagens ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.dados_bancarios ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.curtidas ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.compartilhamentos ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.comentarios ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.categorias ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.carteiras ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.avaliacoes ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.agendamentos ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS public.verification_tokens;
DROP SEQUENCE IF EXISTS public.usuarios_id_seq;
DROP TABLE IF EXISTS public.usuarios;
DROP SEQUENCE IF EXISTS public.transacoes_id_seq;
DROP TABLE IF EXISTS public.transacoes;
DROP SEQUENCE IF EXISTS public.solicitacoes_id_seq;
DROP TABLE IF EXISTS public.solicitacoes;
DROP TABLE IF EXISTS public.sessions;
DROP SEQUENCE IF EXISTS public.servicos_id_seq;
DROP TABLE IF EXISTS public.servicos;
DROP SEQUENCE IF EXISTS public.seguidores_id_seq;
DROP TABLE IF EXISTS public.seguidores;
DROP SEQUENCE IF EXISTS public.postagens_id_seq;
DROP TABLE IF EXISTS public.postagens;
DROP SEQUENCE IF EXISTS public.portfolio_media_id_seq;
DROP TABLE IF EXISTS public.portfolio_media;
DROP SEQUENCE IF EXISTS public.portfolio_comentarios_id_seq;
DROP TABLE IF EXISTS public.portfolio_comentarios;
DROP SEQUENCE IF EXISTS public.portfolio_albums_id_seq;
DROP TABLE IF EXISTS public.portfolio_albums;
DROP SEQUENCE IF EXISTS public.orcamentos_id_seq;
DROP TABLE IF EXISTS public.orcamentos;
DROP SEQUENCE IF EXISTS public.notificacoes_id_seq;
DROP TABLE IF EXISTS public.notificacoes;
DROP SEQUENCE IF EXISTS public.mensagens_id_seq;
DROP TABLE IF EXISTS public.mensagens;
DROP SEQUENCE IF EXISTS public.dados_bancarios_id_seq;
DROP TABLE IF EXISTS public.dados_bancarios;
DROP SEQUENCE IF EXISTS public.curtidas_id_seq;
DROP TABLE IF EXISTS public.curtidas;
DROP SEQUENCE IF EXISTS public.compartilhamentos_id_seq;
DROP TABLE IF EXISTS public.compartilhamentos;
DROP SEQUENCE IF EXISTS public.comentarios_id_seq;
DROP TABLE IF EXISTS public.comentarios;
DROP SEQUENCE IF EXISTS public.categorias_id_seq;
DROP TABLE IF EXISTS public.categorias;
DROP SEQUENCE IF EXISTS public.carteiras_id_seq;
DROP TABLE IF EXISTS public.carteiras;
DROP SEQUENCE IF EXISTS public.avaliacoes_id_seq;
DROP TABLE IF EXISTS public.avaliacoes;
DROP SEQUENCE IF EXISTS public.agendamentos_id_seq;
DROP TABLE IF EXISTS public.agendamentos;
DROP TABLE IF EXISTS public.accounts;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.accounts (
    id text NOT NULL,
    "userId" integer NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


--
-- Name: agendamentos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.agendamentos (
    id integer NOT NULL,
    cliente_id integer NOT NULL,
    prestador_id integer NOT NULL,
    servico_id integer NOT NULL,
    solicitacao_id integer,
    status character varying(30) DEFAULT 'pendente'::character varying NOT NULL,
    data_agendamento timestamp(3) without time zone NOT NULL,
    data_conclusao timestamp(3) without time zone,
    descricao text,
    endereco_servico character varying(255),
    valor_total numeric(10,2) NOT NULL,
    valor_pago boolean DEFAULT false NOT NULL,
    avaliacao_feita boolean DEFAULT false NOT NULL,
    motivo_cancelamento text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: agendamentos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.agendamentos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: agendamentos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.agendamentos_id_seq OWNED BY public.agendamentos.id;


--
-- Name: avaliacoes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.avaliacoes (
    id integer NOT NULL,
    cliente_id integer NOT NULL,
    prestador_id integer NOT NULL,
    servico_id integer NOT NULL,
    agendamento_id integer,
    nota numeric(2,1) NOT NULL,
    comentario text,
    resposta_prestador text,
    data_avaliacao timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: avaliacoes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.avaliacoes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: avaliacoes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.avaliacoes_id_seq OWNED BY public.avaliacoes.id;


--
-- Name: carteiras; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.carteiras (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    saldo numeric(12,2) DEFAULT 0 NOT NULL,
    saldo_pendente numeric(12,2) DEFAULT 0 NOT NULL,
    total_ganho numeric(12,2) DEFAULT 0 NOT NULL,
    total_gasto numeric(12,2) DEFAULT 0 NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: carteiras_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.carteiras_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: carteiras_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.carteiras_id_seq OWNED BY public.carteiras.id;


--
-- Name: categorias; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categorias (
    id integer NOT NULL,
    nome character varying(100) NOT NULL,
    descricao text,
    icone character varying(50),
    imagem character varying(255)
);


--
-- Name: categorias_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categorias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categorias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categorias_id_seq OWNED BY public.categorias.id;


--
-- Name: comentarios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comentarios (
    id integer NOT NULL,
    texto text NOT NULL,
    "usuarioId" integer NOT NULL,
    "postagemId" integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: comentarios_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comentarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comentarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comentarios_id_seq OWNED BY public.comentarios.id;


--
-- Name: compartilhamentos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.compartilhamentos (
    id integer NOT NULL,
    "usuarioId" integer NOT NULL,
    "postagemId" integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: compartilhamentos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.compartilhamentos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: compartilhamentos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.compartilhamentos_id_seq OWNED BY public.compartilhamentos.id;


--
-- Name: curtidas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.curtidas (
    id integer NOT NULL,
    "usuarioId" integer NOT NULL,
    "postagemId" integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: curtidas_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.curtidas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: curtidas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.curtidas_id_seq OWNED BY public.curtidas.id;


--
-- Name: dados_bancarios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dados_bancarios (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    chave_pix character varying(255),
    banco_nome character varying(100),
    banco_codigo character varying(10),
    agencia character varying(20),
    conta character varying(20),
    tipo_conta character varying(30),
    titular_nome character varying(255),
    cpf_cnpj character varying(20),
    verificado boolean DEFAULT false NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: dados_bancarios_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.dados_bancarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dados_bancarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.dados_bancarios_id_seq OWNED BY public.dados_bancarios.id;


--
-- Name: mensagens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mensagens (
    id integer NOT NULL,
    remetente_id integer NOT NULL,
    destinatario_id integer NOT NULL,
    conteudo text NOT NULL,
    lida boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    solicitacao_id integer
);


--
-- Name: mensagens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.mensagens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: mensagens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.mensagens_id_seq OWNED BY public.mensagens.id;


--
-- Name: notificacoes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notificacoes (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    tipo character varying(50) NOT NULL,
    titulo character varying(255) NOT NULL,
    mensagem text,
    lida boolean DEFAULT false NOT NULL,
    link character varying(255),
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: notificacoes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notificacoes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notificacoes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notificacoes_id_seq OWNED BY public.notificacoes.id;


--
-- Name: orcamentos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orcamentos (
    id integer NOT NULL,
    solicitacao_id integer NOT NULL,
    prestador_id integer NOT NULL,
    valor numeric(10,2) NOT NULL,
    descricao text,
    prazo_estimado character varying(50),
    status character varying(30) DEFAULT 'enviado'::character varying NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: orcamentos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orcamentos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: orcamentos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orcamentos_id_seq OWNED BY public.orcamentos.id;


--
-- Name: portfolio_albums; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.portfolio_albums (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    nome character varying(255) NOT NULL,
    descricao text,
    capa_url character varying(255),
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: portfolio_albums_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.portfolio_albums_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: portfolio_albums_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.portfolio_albums_id_seq OWNED BY public.portfolio_albums.id;


--
-- Name: portfolio_comentarios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.portfolio_comentarios (
    id integer NOT NULL,
    texto text NOT NULL,
    usuario_id integer NOT NULL,
    media_id integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: portfolio_comentarios_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.portfolio_comentarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: portfolio_comentarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.portfolio_comentarios_id_seq OWNED BY public.portfolio_comentarios.id;


--
-- Name: portfolio_media; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.portfolio_media (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    album_id integer,
    url character varying(255) NOT NULL,
    tipo character varying(20) DEFAULT 'imagem'::character varying NOT NULL,
    titulo character varying(255),
    descricao text,
    citacao text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: portfolio_media_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.portfolio_media_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: portfolio_media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.portfolio_media_id_seq OWNED BY public.portfolio_media.id;


--
-- Name: postagens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.postagens (
    id integer NOT NULL,
    "autorId" integer NOT NULL,
    conteudo text NOT NULL,
    imagem character varying(255),
    publico boolean DEFAULT true,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: postagens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.postagens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: postagens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.postagens_id_seq OWNED BY public.postagens.id;


--
-- Name: seguidores; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.seguidores (
    id integer NOT NULL,
    seguidor_id integer NOT NULL,
    seguido_id integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: seguidores_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.seguidores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: seguidores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.seguidores_id_seq OWNED BY public.seguidores.id;


--
-- Name: servicos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.servicos (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    categoria_id integer NOT NULL,
    titulo character varying(255) NOT NULL,
    descricao text,
    preco_base numeric(10,2) DEFAULT 0 NOT NULL,
    unidade_medida character varying(50),
    destaque boolean DEFAULT false NOT NULL,
    status character varying(20) DEFAULT 'ativo'::character varying NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    cobranca_tipo character varying(20) DEFAULT 'FIXO'::character varying NOT NULL,
    tempo_estimado character varying(50)
);


--
-- Name: servicos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.servicos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: servicos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.servicos_id_seq OWNED BY public.servicos.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" integer NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


--
-- Name: solicitacoes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.solicitacoes (
    id integer NOT NULL,
    cliente_id integer NOT NULL,
    servico_id integer,
    descricao text,
    status character varying(30) DEFAULT 'pendente'::character varying NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    prestador_id integer
);


--
-- Name: solicitacoes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.solicitacoes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: solicitacoes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.solicitacoes_id_seq OWNED BY public.solicitacoes.id;


--
-- Name: transacoes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.transacoes (
    id integer NOT NULL,
    carteira_id integer NOT NULL,
    agendamento_id integer,
    tipo character varying(30) NOT NULL,
    valor numeric(12,2) NOT NULL,
    status character varying(30) DEFAULT 'pendente'::character varying NOT NULL,
    data_solicitacao timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    data_processamento timestamp(3) without time zone,
    descricao text,
    chave_pix character varying(255),
    banco_agencia character varying(50),
    banco_conta character varying(50),
    tipo_conta character varying(30),
    metodo_pagamento character varying(30),
    comprovante_url character varying(255),
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: transacoes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.transacoes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: transacoes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.transacoes_id_seq OWNED BY public.transacoes.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nome character varying(100) NOT NULL,
    nome_fantasia character varying(100),
    email character varying(100) NOT NULL,
    senha character varying(255),
    telefone character varying(20),
    documento character varying(20),
    tipo character varying(20) DEFAULT 'usuario'::character varying NOT NULL,
    foto_perfil character varying(255),
    especialidade character varying(255),
    sobre text,
    avaliacao_media numeric(3,2) DEFAULT 0 NOT NULL,
    verificado boolean DEFAULT false NOT NULL,
    disponibilidade character varying(255),
    endereco character varying(255),
    cidade character varying(100),
    estado character varying(2),
    cep character varying(10),
    latitude numeric(10,8),
    longitude numeric(11,8),
    website character varying(255),
    linkedin character varying(255),
    facebook character varying(255),
    instagram character varying(255),
    youtube character varying(255),
    tiktok character varying(255),
    kwai character varying(255),
    perfil_academico character varying(255),
    status character varying(20) DEFAULT 'ativo'::character varying NOT NULL,
    email_verificado boolean DEFAULT false NOT NULL,
    token_verificacao character varying(255),
    patrocinador_id integer,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    "emailVerified" timestamp(3) without time zone,
    reset_token character varying(255),
    reset_token_expires timestamp(3) without time zone
);


--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: verification_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.verification_tokens (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


--
-- Name: agendamentos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agendamentos ALTER COLUMN id SET DEFAULT nextval('public.agendamentos_id_seq'::regclass);


--
-- Name: avaliacoes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.avaliacoes ALTER COLUMN id SET DEFAULT nextval('public.avaliacoes_id_seq'::regclass);


--
-- Name: carteiras id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carteiras ALTER COLUMN id SET DEFAULT nextval('public.carteiras_id_seq'::regclass);


--
-- Name: categorias id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categorias ALTER COLUMN id SET DEFAULT nextval('public.categorias_id_seq'::regclass);


--
-- Name: comentarios id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comentarios ALTER COLUMN id SET DEFAULT nextval('public.comentarios_id_seq'::regclass);


--
-- Name: compartilhamentos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compartilhamentos ALTER COLUMN id SET DEFAULT nextval('public.compartilhamentos_id_seq'::regclass);


--
-- Name: curtidas id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.curtidas ALTER COLUMN id SET DEFAULT nextval('public.curtidas_id_seq'::regclass);


--
-- Name: dados_bancarios id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dados_bancarios ALTER COLUMN id SET DEFAULT nextval('public.dados_bancarios_id_seq'::regclass);


--
-- Name: mensagens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mensagens ALTER COLUMN id SET DEFAULT nextval('public.mensagens_id_seq'::regclass);


--
-- Name: notificacoes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notificacoes ALTER COLUMN id SET DEFAULT nextval('public.notificacoes_id_seq'::regclass);


--
-- Name: orcamentos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orcamentos ALTER COLUMN id SET DEFAULT nextval('public.orcamentos_id_seq'::regclass);


--
-- Name: portfolio_albums id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portfolio_albums ALTER COLUMN id SET DEFAULT nextval('public.portfolio_albums_id_seq'::regclass);


--
-- Name: portfolio_comentarios id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portfolio_comentarios ALTER COLUMN id SET DEFAULT nextval('public.portfolio_comentarios_id_seq'::regclass);


--
-- Name: portfolio_media id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portfolio_media ALTER COLUMN id SET DEFAULT nextval('public.portfolio_media_id_seq'::regclass);


--
-- Name: postagens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.postagens ALTER COLUMN id SET DEFAULT nextval('public.postagens_id_seq'::regclass);


--
-- Name: seguidores id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seguidores ALTER COLUMN id SET DEFAULT nextval('public.seguidores_id_seq'::regclass);


--
-- Name: servicos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.servicos ALTER COLUMN id SET DEFAULT nextval('public.servicos_id_seq'::regclass);


--
-- Name: solicitacoes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solicitacoes ALTER COLUMN id SET DEFAULT nextval('public.solicitacoes_id_seq'::regclass);


--
-- Name: transacoes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transacoes ALTER COLUMN id SET DEFAULT nextval('public.transacoes_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.accounts (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
\.


--
-- Data for Name: agendamentos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.agendamentos (id, cliente_id, prestador_id, servico_id, solicitacao_id, status, data_agendamento, data_conclusao, descricao, endereco_servico, valor_total, valor_pago, avaliacao_feita, motivo_cancelamento, created_at, updated_at) FROM stdin;
1	12	6	4	\N	confirmado	2026-03-07 11:48:00	\N	te passo o endereço me avise quando estiver perto	na minha casa	250.00	f	f	\N	2026-03-06 14:48:33.503	2026-03-15 14:45:34.636
\.


--
-- Data for Name: avaliacoes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.avaliacoes (id, cliente_id, prestador_id, servico_id, agendamento_id, nota, comentario, resposta_prestador, data_avaliacao) FROM stdin;
1	12	6	4	\N	5.0	Fotos maravilhosas! Fernanda tem um olhar incrível para composição.	\N	2026-03-06 14:05:12.795
2	12	11	2	\N	5.0	Ana é muito profissional e detalhista. Instalação perfeita!	\N	2026-03-06 14:05:12.794
4	12	10	9	\N	5.0	Casa ficou brilhando! Juliana é muito organizada e eficiente.	\N	2026-03-06 14:05:12.795
3	12	8	5	\N	5.0	Excelente profissional! Chegou no horário e fez um trabalho impecável. Super recomendo!	\N	2026-03-06 14:05:12.794
5	12	8	8	\N	4.5	Resolveu o problema rapidamente. Preço justo e trabalho de qualidade.	\N	2026-03-06 14:05:12.794
6	12	7	3	\N	4.5	Pintura ficou linda! Roberto é muito cuidadoso com os acabamentos.	\N	2026-03-06 14:05:12.794
7	62	12	10	\N	5.0	entrego o orçamento dentro do esperado e entrgou o produto antes do prazo contratado, além defornecer suporte e ensinar tudo que precisa saber sobre o aplicativo	\N	2026-03-08 01:09:53.379
\.


--
-- Data for Name: carteiras; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.carteiras (id, usuario_id, saldo, saldo_pendente, total_ganho, total_gasto, updated_at, created_at) FROM stdin;
2	12	0.00	100.00	0.00	0.00	2026-03-06 14:30:18.466	2026-03-06 14:29:56.574
3	47	0.00	0.00	0.00	0.00	2026-03-07 05:54:02.981	2026-03-07 05:54:02.981
4	45	0.00	0.00	0.00	0.00	2026-03-07 12:05:01.107	2026-03-07 12:05:01.107
6	13	0.00	0.00	0.00	0.00	2026-03-08 01:14:47.543	2026-03-08 01:14:47.543
5	48	0.00	1000.00	0.00	0.00	2026-03-08 15:08:24.876	2026-03-07 12:32:14.768
7	49	0.00	0.00	0.00	0.00	2026-03-09 15:59:04.206	2026-03-09 15:59:04.206
8	71	0.00	0.00	0.00	0.00	2026-03-09 22:54:32.032	2026-03-09 22:54:32.032
\.


--
-- Data for Name: categorias; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categorias (id, nome, descricao, icone, imagem) FROM stdin;
1	Eletricista	Instalações e reparos elétricos	fa-bolt	https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400
2	Marceneiro	Móveis sob medida e reparos	fa-hammer	https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400
3	Pedreiro	Construção e reformas	fa-hard-hat	https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400
4	Diarista	Limpeza e organização de ambientes	fa-broom	https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400
5	Fotógrafo	Fotografia profissional para eventos	fa-camera	https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=400
6	Jardineiro	Paisagismo e manutenção de jardins	fa-leaf	https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400
7	Pintor	Pintura residencial e comercial	fa-paint-roller	https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400
8	Designer Gráfico	Design de logos, banners e materiais visuais	fa-palette	https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400
9	Personal Trainer	Treinamento físico personalizado	fa-dumbbell	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400
10	Encanador	Serviços de encanamento e hidráulica	fa-wrench	https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400
11	Barbeiro	Serviços de Barbeiro	fa-barbeiro	\N
12	Cabeleireiro	Serviços de Cabeleireiro	fa-cabeleireiro	\N
13	Manicure	Serviços de Manicure	fa-manicure	\N
14	Mecânico	Serviços de Mecânico	fa-mecânico	\N
15	Técnico de Informática	Serviços de Técnico de Informática	fa-técnico-de-informática	\N
\.


--
-- Data for Name: comentarios; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.comentarios (id, texto, "usuarioId", "postagemId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: compartilhamentos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.compartilhamentos (id, "usuarioId", "postagemId", "createdAt") FROM stdin;
\.


--
-- Data for Name: curtidas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.curtidas (id, "usuarioId", "postagemId", "createdAt") FROM stdin;
\.


--
-- Data for Name: dados_bancarios; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.dados_bancarios (id, usuario_id, chave_pix, banco_nome, banco_codigo, agencia, conta, tipo_conta, titular_nome, cpf_cnpj, verificado, updated_at, created_at) FROM stdin;
2	47	95403850910	caixa economica				corrente	vinicius ribeiro ramos	95403850910	f	2026-03-09 18:48:01.742	2026-03-09 18:48:01.742
\.


--
-- Data for Name: mensagens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.mensagens (id, remetente_id, destinatario_id, conteudo, lida, created_at, solicitacao_id) FROM stdin;
2	12	10	Olá! Gostaria de agendar o serviço "Faxina Completa". Qual seria a sua disponibilidade?	f	2026-03-06 22:46:38.003	2
3	13	12	Olá! Tenho interesse no serviço "criação de sites". Poderia me informar mais detalhes e valor?	t	2026-03-06 23:05:14.38	3
4	13	12	e se ouder me dar um retorno no meu whats eu agradeço o numeor é 5555-5555	t	2026-03-06 23:05:49.543	3
5	12	13	opa tudo bom, se puder me adiaantar sobre oque é sua demanda	t	2026-03-06 23:32:11.428	3
7	47	11	Ola	f	2026-03-07 05:18:22.001	6
12	55	28	Boa tarde	f	2026-03-07 16:07:49.714	10
13	55	28	Tudo bem?	f	2026-03-07 16:08:07.073	10
14	55	28	Estou com um problema de vazamento no registro da caixa de água!	f	2026-03-07 16:08:37.872	10
15	55	8	Boa tarde, tudo bem?	f	2026-03-07 16:09:38.561	11
16	55	8	Estou com um problema de vazamento do registro da minha caixa de água em casa.	f	2026-03-07 16:10:07.828	11
17	55	16	Boa tarde, tudo bem?	f	2026-03-07 16:14:10.875	12
18	55	16	Estou com um problema de va	f	2026-03-07 16:14:42.471	12
19	55	16	Vazamento no registro da minha caixa de água.	f	2026-03-07 16:15:35.11	12
21	47	13	Oi	t	2026-03-07 18:12:03.025	13
23	13	47	Olá! Tenho interesse no serviço "Desenvolver Sites Web". Poderia me informar mais detalhes e valor?	t	2026-03-07 18:14:52.002	14
24	13	47	Vamos fechar negócio	t	2026-03-07 18:15:07.596	14
6	47	12	quer um aplicativo para monitorar o onibus da cidade de palmas pr em tempo real	t	2026-03-07 04:35:09.668	4
20	47	12	Hi	t	2026-03-07 18:11:49.652	4
8	45	12	Teste de Mensagem	t	2026-03-07 11:59:48.741	8
9	45	12	Claudio R Ramos	t	2026-03-07 12:00:07.376	8
26	12	45	Agora recebi	t	2026-03-07 19:38:24.857	8
27	12	14	oi	f	2026-03-07 19:44:09.565	16
28	12	65	Seja bem vindo Yago	f	2026-03-07 22:01:00.876	17
10	47	48	Olá! Tenho interesse no serviço "Criação de agentes de IA". Poderia me informar mais detalhes e valor?	t	2026-03-07 12:34:26.22	9
11	47	48	Deu certo?	t	2026-03-07 12:34:38.24	9
25	47	48	Agora é pra receber uma notificação	t	2026-03-07 18:36:24.136	9
29	48	47	Olá! Tenho interesse no serviço "Desenvolver Sites Web". Poderia me informar mais detalhes e valor?	t	2026-03-08 14:55:19.845	18
22	13	47	Oi	t	2026-03-07 18:14:24.831	13
30	47	48	vai estudar e faz vc mesmo	t	2026-03-08 16:30:17.968	18
31	48	47	Teste	t	2026-03-08 19:12:36.789	18
1	12	6	Olá! Gostaria de agendar o serviço "Ensaio Fotográfico". Qual seria a sua disponibilidade?	t	2026-03-06 22:42:45.368	1
\.


--
-- Data for Name: notificacoes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notificacoes (id, usuario_id, tipo, titulo, mensagem, lida, link, created_at) FROM stdin;
2	8	servico	Nova solicitação de serviço	Você recebeu uma nova solicitação de orçamento para Instalação de Torneira.	f	\N	2026-03-06 14:05:12.864
7	10	solicitacao	Nova solicitação de serviço!	Você recebeu uma nova solicitação para "Faxina Completa"	f	/dashboard/mensagens?conversa=2	2026-03-06 22:46:38.246
13	48	novo_seguidor	Novo Seguidor!	vinicius ribeiro ramos começou a seguir você.	f	/perfil/47	2026-03-07 12:34:15.475
14	48	solicitacao	Nova solicitação de serviço!	Você recebeu uma nova solicitação para "Criação de agentes de IA"	f	/dashboard/mensagens?conversa=9	2026-03-07 12:34:26.482
15	50	novo_seguidor	Novo Seguidor!	vinicius ribeiro ramos começou a seguir você.	f	/perfil/47	2026-03-07 15:47:36.269
16	51	novo_seguidor	Novo Seguidor!	vinicius ribeiro ramos começou a seguir você.	f	/perfil/47	2026-03-07 15:47:56.549
17	52	novo_seguidor	Novo Seguidor!	vinicius ribeiro ramos começou a seguir você.	f	/perfil/47	2026-03-07 15:48:40.134
18	53	novo_seguidor	Novo Seguidor!	vinicius ribeiro ramos começou a seguir você.	f	/perfil/47	2026-03-07 16:05:34.83
19	54	novo_seguidor	Novo Seguidor!	vinicius ribeiro ramos começou a seguir você.	f	/perfil/47	2026-03-07 16:05:55.231
20	55	novo_seguidor	Novo Seguidor!	vinicius ribeiro ramos começou a seguir você.	f	/perfil/47	2026-03-07 16:25:55.175
21	56	novo_seguidor	Novo Seguidor!	vinicius ribeiro ramos começou a seguir você.	f	/perfil/47	2026-03-07 16:26:12.838
22	57	novo_seguidor	Novo Seguidor!	vinicius ribeiro ramos começou a seguir você.	f	/perfil/47	2026-03-07 16:26:28.374
23	58	novo_seguidor	Novo Seguidor!	vinicius ribeiro ramos começou a seguir você.	f	/perfil/47	2026-03-07 16:26:42.033
24	59	novo_seguidor	Novo Seguidor!	vinicius ribeiro ramos começou a seguir você.	f	/perfil/47	2026-03-07 16:26:56.565
25	60	novo_seguidor	Novo Seguidor!	vinicius ribeiro ramos começou a seguir você.	f	/perfil/47	2026-03-07 16:55:55.238
26	61	novo_seguidor	Novo Seguidor!	vinicius ribeiro ramos começou a seguir você.	f	/perfil/47	2026-03-07 16:56:15.18
10	13	novo_seguidor	Novo Seguidor!	Vinicius Ribeiro Ramos começou a seguir você.	t	/perfil/12	2026-03-07 04:54:39.351
27	47	solicitacao	Nova solicitação de serviço!	Você recebeu uma nova solicitação para "Desenvolver Sites Web"	t	/dashboard/mensagens?conversa=14	2026-03-07 18:14:52.236
28	63	novo_seguidor	Novo Seguidor!	vinicius ribeiro ramos começou a seguir você.	f	/perfil/47	2026-03-07 18:29:38.848
12	12	novo_seguidor	Novo Seguidor!	CLAUDIO RIBEIRO RAMOS começou a seguir você.	t	/perfil/45	2026-03-07 12:05:36.524
30	45	novo_seguidor	Novo Seguidor!	vinicius ribeiro ramos começou a seguir você.	t	/perfil/47	2026-03-07 19:34:13.999
9	12	solicitacao	Nova solicitação de serviço!	Você recebeu uma nova solicitação para "criação de sites"	t	/dashboard/mensagens?conversa=4	2026-03-07 04:35:09.917
31	45	novo_seguidor	Novo Seguidor!	Vinicius Ribeiro Ramos começou a seguir você.	t	/perfil/12	2026-03-07 19:36:46.507
32	45	mensagem	Mensagem de Vinicius Ribeiro Ramos	Agora recebi	t	/dashboard/mensagens?conversa=8	2026-03-07 19:38:25.658
33	14	mensagem	Mensagem de Vinicius Ribeiro Ramos	oi	f	/dashboard/mensagens?conversa=16	2026-03-07 19:44:09.916
8	12	solicitacao	Nova solicitação de serviço!	Você recebeu uma nova solicitação para "criação de sites"	t	/dashboard/mensagens?conversa=3	2026-03-06 23:05:14.619
4	12	novo_deposito	Depósito Solicitado	Sua solicitação de deposito de R$ 100.00 foi recebida e está sendo processada.	t	/dashboard/financeiro	2026-03-06 14:30:18.548
11	12	novo_seguidor	Novo Seguidor!	vinicius ribeiro ramos começou a seguir você.	t	/perfil/47	2026-03-07 05:54:47.514
3	12	sistema	Bem-vindo ao WhoDo!	Sua conta foi criada com sucesso. Explore profissionais próximos de você!	t	\N	2026-03-06 14:05:12.864
34	65	novo_seguidor	Novo Seguidor!	Vinicius Ribeiro Ramos começou a seguir você.	f	/perfil/12	2026-03-07 22:00:38.929
35	65	mensagem	Mensagem de Vinicius Ribeiro Ramos	Seja bem vindo Yago	f	/dashboard/mensagens?conversa=17	2026-03-07 22:01:01.665
36	67	novo_seguidor	Novo Seguidor!	TecWareWhodo! começou a seguir você.	f	/perfil/62	2026-03-08 01:01:26.777
38	45	novo_seguidor	Novo Seguidor!	Gabriel Ramos começou a seguir você.	f	/perfil/48	2026-03-08 14:52:20.776
39	68	novo_seguidor	Novo Seguidor!	vinicius ribeiro ramos começou a seguir você.	f	/perfil/47	2026-03-08 14:53:49.781
29	48	mensagem	Mensagem de vinicius ribeiro ramos	Agora é pra receber uma notificação	t	/dashboard/mensagens?conversa=9	2026-03-07 18:36:25.029
42	48	novo_deposito	Depósito Solicitado	Sua solicitação de deposito de R$ 1000.00 foi recebida e está sendo processada.	f	/dashboard/financeiro	2026-03-08 15:08:25.108
41	47	solicitacao	Nova solicitação de serviço!	Você recebeu uma nova solicitação para "Desenvolver Sites Web"	t	/dashboard/mensagens?conversa=18	2026-03-08 14:55:20.092
40	47	novo_seguidor	Novo Seguidor!	Gabriel Ramos começou a seguir você.	t	/perfil/48	2026-03-08 14:54:36.967
43	48	mensagem	Mensagem de vinicius ribeiro ramos	vai estudar e faz vc mesmo	t	/dashboard/mensagens?conversa=18	2026-03-08 16:30:18.883
44	47	mensagem	Mensagem de Gabriel Ramos	Teste	t	/dashboard/mensagens?conversa=18	2026-03-08 19:12:37.604
50	47	novo_seguidor	Novo Seguidor!	pedro começou a seguir você.	t	/perfil/13	2026-03-09 10:26:28.99
49	47	novo_seguidor	Novo Seguidor!	pedro começou a seguir você.	t	/perfil/13	2026-03-09 10:26:25.704
48	47	novo_seguidor	Novo Seguidor!	pedro começou a seguir você.	t	/perfil/13	2026-03-09 10:26:23.212
47	47	novo_seguidor	Novo Seguidor!	pedro começou a seguir você.	t	/perfil/13	2026-03-09 10:26:20.815
46	47	novo_seguidor	Novo Seguidor!	pedro começou a seguir você.	t	/perfil/13	2026-03-09 10:26:18.287
45	47	novo_seguidor	Novo Seguidor!	pedro começou a seguir você.	t	/perfil/13	2026-03-09 10:26:16.079
51	15	novo_seguidor	Novo Seguidor!	vinicius ribeiro ramos começou a seguir você.	f	/perfil/47	2026-03-09 18:49:47.743
52	15	novo_seguidor	Novo Seguidor!	vinicius ribeiro ramos começou a seguir você.	f	/perfil/47	2026-03-09 18:49:54.11
53	8	novo_seguidor	Novo Seguidor!	pedro começou a seguir você.	f	/perfil/13	2026-03-11 00:59:58.496
37	12	nova_avaliacao	Nova Avaliação!	TecWareWhodo! deixou uma avaliação de 5 estrelas no seu serviço criação de sites.	t	/dashboard/avaliacoes	2026-03-08 01:09:55.016
54	73	novo_seguidor	Novo Seguidor!	Vinicius Ribeiro Ramos começou a seguir você.	f	/perfil/12	2026-03-13 17:47:51.599
6	6	solicitacao	Nova solicitação de serviço!	Você recebeu uma nova solicitação para "Ensaio Fotográfico"	t	/dashboard/mensagens?conversa=1	2026-03-06 22:42:45.622
5	6	novo_agendamento	Novo Agendamento	Vinicius Ramos solicitou um agendamento para Ensaio Fotográfico	t	/dashboard/agendamentos/1	2026-03-06 14:48:34.766
55	12	novo_seguidor	Novo Seguidor!	Fernanda Costa começou a seguir você.	t	/perfil/6	2026-03-15 16:32:00.996
56	6	novo_seguidor	Novo Seguidor!	Vinicius Ribeiro Ramos começou a seguir você.	f	/perfil/12	2026-03-15 16:34:49.465
\.


--
-- Data for Name: orcamentos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orcamentos (id, solicitacao_id, prestador_id, valor, descricao, prazo_estimado, status, created_at) FROM stdin;
\.


--
-- Data for Name: portfolio_albums; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.portfolio_albums (id, usuario_id, nome, descricao, capa_url, created_at, updated_at) FROM stdin;
9	13	algo que tem que  aparecer aqui	ainda sim algo que tem que aparecer aqui	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/portfolio/13-1773064092943-Video_em_Portugues_com_Locutor.mp4	2026-03-09 13:33:29.782	2026-03-09 13:48:16.387
10	12	whodo	tela do whodo	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/portfolio/12-1773284162785-WhatsApp-Image-2026-03-06-at-18.38.33-1-.jpeg	2026-03-12 02:55:43.979	2026-03-12 02:56:03.747
4	12	site newsdrop.net.br	Site de publicação de notícias com editorial integrado.\n🌐 Website: newsdrop.net.br	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/portfolio/12-1772808030386-site-newsdrop1.png	2026-03-06 14:33:43.835	2026-03-06 14:40:54.885
5	46	Obras	Aqui umas pouco de serviços realizados	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/portfolio/46-1772846205389-maninho2.png	2026-03-07 01:16:25.437	2026-03-07 01:17:05.517
6	48	Teste	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan felis at purus tincidunt, quis auctor sem lobortis. Praesent sapien risus, dictum sit amet congue sit amet, sollicitudin vitae turpis. Suspendisse varius diam id arcu dapibus, in tincidunt neque iaculis. Proin mauris magna, hendrerit eget arcu vitae, tincidunt consequat lorem. Suspendisse sodales diam fringilla arcu fermentum cursus. Sed ornare pellentesque sem, sit amet finibus nunc bibendum non. Sed vehicula condimentum vehicula. Etiam egestas lorem ac urna euismod, eu suscipit nisl fermentum. Sed a odio nec risus ornare posuere. Nulla a leo ut orci blandit semper. Donec quis sapien sed sapien suscipit auctor eget eget justo. Curabitur placerat tincidunt quam, non mattis velit.	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/portfolio/48-1772886783628-meme05.jpg	2026-03-07 12:29:57.446	2026-03-07 12:33:18.419
7	54	Personalizados	\N	\N	2026-03-07 16:09:56.369	2026-03-07 16:09:56.369
8	47	site newsdrop	O NewsDrop nasceu da necessidade de um espaço dedicado à reflexão sobre educação, cultura, artes e esportes como pilares fundamentais para o desenvolvimento humano e social.\n\nNossa missão é oferecer conteúdo de qualidade que informe, inspire e promova o debate sobre temas essenciais para a construção de uma sociedade mais justa, criativa e educada.	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/portfolio/47-1772900640233-site-newsdrop6.png	2026-03-07 16:23:43.884	2026-03-07 16:25:02.039
\.


--
-- Data for Name: portfolio_comentarios; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.portfolio_comentarios (id, texto, usuario_id, media_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: portfolio_media; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.portfolio_media (id, usuario_id, album_id, url, tipo, titulo, descricao, citacao, created_at) FROM stdin;
3	12	4	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/portfolio/12-1772808028345-site-newsdrop4.png	imagem	\N	\N	\N	2026-03-06 14:40:28.512
4	12	4	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/portfolio/12-1772808028976-site-newsdrop3.png	imagem	\N	\N	\N	2026-03-06 14:40:29.224
6	12	4	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/portfolio/12-1772808030386-site-newsdrop1.png	imagem	\N	\N	\N	2026-03-06 14:40:30.702
1	12	4	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/portfolio/12-1772808024299-site-newsdrop6.png	imagem	Tela inicial no site	Aqui teremoas noticias criadas pelos editores, acesso a links de aplicativo uteis e acesso as publicações dos editores	"ficou muito bom o visual do site" Ana Cristina.	2026-03-06 14:40:26.77
5	12	4	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/portfolio/12-1772808029688-site-newsdrop2.png	imagem	Tela de login para os editores	Aqui quem quiser ser editor no site pode fazer um cadstro que assim que for aprovado, pode publicar	"Era o que eu queria um lugar para dar voz as minhas criações" - Jornalista independente"	2026-03-06 14:40:29.918
2	12	4	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/portfolio/12-1772808027682-site-newsdrop5.png	imagem	Matéria acessada	assim é o layout da materia escolhida na pagina inicial	"Bem limpa e fácil de ler" - leitor	2026-03-06 14:40:27.88
7	46	5	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/portfolio/46-1772846204305-maninho4.png	imagem	\N	\N	\N	2026-03-07 01:16:44.592
8	46	5	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/portfolio/46-1772846205389-maninho2.png	imagem	\N	\N	\N	2026-03-07 01:16:45.657
9	46	5	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/portfolio/46-1772846206109-maninho1.png	imagem	\N	\N	\N	2026-03-07 01:16:46.309
11	48	6	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/portfolio/48-1772886782264-alpha-spirt.jpg	imagem	\N	\N	\N	2026-03-07 12:33:02.492
12	48	6	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/portfolio/48-1772886782949-meme02.jpg	imagem	\N	\N	\N	2026-03-07 12:33:03.17
13	48	6	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/portfolio/48-1772886783628-meme05.jpg	imagem	\N	\N	\N	2026-03-07 12:33:04.838
14	48	6	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/portfolio/48-1772886785295-meme08.jpg	imagem	\N	\N	\N	2026-03-07 12:33:05.495
10	48	6	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/portfolio/48-1772886781237-1671823942886.jpg	imagem	Anita Quadrupede	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan felis at purus tincidunt, quis auctor sem lobortis. Praesent sapien risus, dictum sit amet congue sit amet, sollicitudin vitae turpis. Suspendisse varius diam id arcu dapibus, in tincidunt neque iaculis. Proin mauris magna, hendrerit eget arcu vitae, tincidunt consequat lorem. Suspendisse sodales diam fringilla arcu fermentum cursus. Sed ornare pellentesque sem, sit amet finibus nunc bibendum non. Sed vehicula condimentum vehicula. Etiam egestas lorem ac urna euismod, eu suscipit nisl fermentum. Sed a odio nec risus ornare posuere. Nulla a leo ut orci blandit semper. Donec quis sapien sed sapien suscipit auctor eget eget justo. Curabitur placerat tincidunt quam, non mattis velit.\n\n	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan felis at purus tincidunt, quis auctor sem lobortis. Praesent sapien risus, dictum sit amet congue sit amet, sollicitudin vitae turpis. Suspendisse varius diam id arcu dapibus, in tincidunt neque iaculis. Proin mauris magna, hendrerit eget arcu vitae, tincidunt consequat lorem. Suspendisse sodales diam fringilla arcu fermentum cursus. Sed ornare pellentesque sem, sit amet finibus nunc bibendum non. Sed vehicula condimentum vehicula. Etiam egestas lorem ac urna euismod, eu suscipit nisl fermentum. Sed a odio nec risus ornare posuere. Nulla a leo ut orci blandit semper. Donec quis sapien sed sapien suscipit auctor eget eget justo. Curabitur placerat tincidunt quam, non mattis velit.\n\n	2026-03-07 12:33:01.458
16	47	8	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/portfolio/47-1772900640233-site-newsdrop6.png	imagem	\N	\N	\N	2026-03-07 16:24:00.68
17	47	8	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/portfolio/47-1772900668085-site-newsdrop5.png	imagem	\N	\N	\N	2026-03-07 16:24:28.347
18	47	8	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/portfolio/47-1772900668921-site-newsdrop4.png	imagem	\N	\N	\N	2026-03-07 16:24:29.142
19	47	8	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/portfolio/47-1772900669602-site-newsdrop3.png	imagem	\N	\N	\N	2026-03-07 16:24:29.911
20	47	8	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/portfolio/47-1772900670370-site-newsdrop2.png	imagem	\N	\N	\N	2026-03-07 16:24:30.933
21	47	8	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/portfolio/47-1772900671393-site-newsdrop1.png	imagem	\N	\N	\N	2026-03-07 16:24:31.629
23	12	10	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/portfolio/12-1773284162785-WhatsApp-Image-2026-03-06-at-18.38.33-1-.jpeg	imagem	\N	\N	\N	2026-03-12 02:56:03.393
24	12	10	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/portfolio/12-1773284233251-Sua_rotina_muito_mais_simples_version_1.png	imagem	\N	\N	\N	2026-03-12 02:57:13.826
\.


--
-- Data for Name: postagens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.postagens (id, "autorId", conteudo, imagem, publico, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: seguidores; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.seguidores (id, seguidor_id, seguido_id, created_at) FROM stdin;
1	12	13	2026-03-07 04:54:38.87
2	47	12	2026-03-07 05:54:47.052
3	45	12	2026-03-07 12:05:36.056
4	47	48	2026-03-07 12:34:14.803
5	47	50	2026-03-07 15:47:35.792
6	47	51	2026-03-07 15:47:56.089
7	47	52	2026-03-07 15:48:39.903
8	47	53	2026-03-07 16:05:34.368
9	47	54	2026-03-07 16:05:55.004
10	47	55	2026-03-07 16:25:54.713
11	47	56	2026-03-07 16:26:12.605
12	47	57	2026-03-07 16:26:28.141
13	47	58	2026-03-07 16:26:41.799
14	47	59	2026-03-07 16:26:56.332
15	47	60	2026-03-07 16:55:54.739
16	47	61	2026-03-07 16:56:14.947
17	47	63	2026-03-07 18:29:38.37
18	47	45	2026-03-07 19:34:13.489
19	12	45	2026-03-07 19:36:46.033
20	12	65	2026-03-07 22:00:38.469
21	62	67	2026-03-08 01:01:26.311
22	48	45	2026-03-08 14:52:20.288
23	47	68	2026-03-08 14:53:49.329
24	48	47	2026-03-08 14:54:36.738
32	47	15	2026-03-09 18:49:53.879
34	12	73	2026-03-13 17:47:51.119
35	6	12	2026-03-15 16:32:00.681
36	12	6	2026-03-15 16:34:48.99
\.


--
-- Data for Name: servicos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.servicos (id, usuario_id, categoria_id, titulo, descricao, preco_base, unidade_medida, destaque, status, created_at, updated_at, cobranca_tipo, tempo_estimado) FROM stdin;
6	9	2	Móvel Sob Medida	Projeto e fabricação de móveis personalizados em MDF ou madeira maciça.	800.00	a partir de	f	ativo	2026-03-06 14:05:12.732	2026-03-06 14:05:12.732	FIXO	\N
3	7	7	Pintura de Quarto	Pintura completa de quarto incluindo teto. Inclui massa corrida.	350.00	por cômodo	t	ativo	2026-03-06 14:05:12.732	2026-03-06 14:05:12.732	FIXO	\N
2	11	1	Instalação de Tomadas	Instalação de tomadas simples e especiais (ar-condicionado, chuveiro).	60.00	por ponto	t	ativo	2026-03-06 14:05:12.732	2026-03-06 14:05:12.732	FIXO	\N
4	6	5	Ensaio Fotográfico	Ensaio fotográfico externo ou em estúdio com 50 fotos editadas.	250.00	por sessão	t	ativo	2026-03-06 14:05:12.732	2026-03-06 14:05:12.732	FIXO	\N
5	8	10	Instalação de Torneira	Instalação completa de torneiras e misturadores em pias e lavatórios.	80.00	por unidade	t	ativo	2026-03-06 14:05:12.732	2026-03-06 14:05:12.732	FIXO	\N
7	11	1	Troca de Disjuntores	Substituição de disjuntores e balanceamento do quadro elétrico.	150.00	por quadro	f	ativo	2026-03-06 14:05:12.732	2026-03-06 14:05:12.732	FIXO	\N
8	8	10	Desentupimento de Pia	Desentupimento profissional com equipamento especializado. Sem quebrar pisos.	120.00	por serviço	f	ativo	2026-03-06 14:05:12.732	2026-03-06 14:05:12.732	FIXO	\N
9	10	4	Faxina Completa	Limpeza completa do imóvel incluindo vidros, banheiros e cozinha.	180.00	por diária	t	ativo	2026-03-06 14:05:12.732	2026-03-06 14:05:12.732	FIXO	\N
10	12	8	criação de sites	o valor e tempo de execução depende da complexidade do serviço solicitado, mas paginas simples em um diapode ser feito com esse valor inicial	100.00	\N	f	ativo	2026-03-06 14:25:07.223	2026-03-06 14:25:07.223	ORCAMENTO	5 dias
11	15	4	Diarista	Limpeza residencial e comercial, organização de ambientes, lavagem de roupas e passadoria. Referências disponíveis.	0.00	\N	f	ativo	2026-03-06 20:31:05.67	2026-03-06 20:31:05.67	ORCAMENTO	\N
12	16	10	Encanador	Serviços de encanamento, desentupimento, instalação de aquecedores e reparos em geral. Garantia de 90 dias em todos os serviços.	0.00	\N	f	ativo	2026-03-06 20:31:05.796	2026-03-06 20:31:05.796	ORCAMENTO	\N
13	17	3	Pedreiro	Profissional de Pedreiro em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	0.00	\N	f	ativo	2026-03-06 20:31:05.896	2026-03-06 20:31:05.896	ORCAMENTO	\N
14	18	1	Eletricista	Profissional de Eletricista em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	0.00	\N	f	ativo	2026-03-06 20:31:05.983	2026-03-06 20:31:05.983	ORCAMENTO	\N
15	19	9	Personal Trainer	Treinamento personalizado, emagrecimento, hipertrofia, preparação física. Atendo em academias ou domicílio.	0.00	\N	f	ativo	2026-03-06 20:31:06.097	2026-03-06 20:31:06.097	ORCAMENTO	\N
16	20	7	Pintor	Profissional de Pintor em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	0.00	\N	f	ativo	2026-03-06 20:31:06.193	2026-03-06 20:31:06.193	ORCAMENTO	\N
17	21	12	Cabeleireiro	Cortes femininos e masculinos, coloração, mechas, tratamentos capilares e penteados para eventos.	0.00	\N	f	ativo	2026-03-06 20:31:06.29	2026-03-06 20:31:06.29	ORCAMENTO	\N
18	22	8	Designer Gráfico	Profissional de Designer Gráfico em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	0.00	\N	f	ativo	2026-03-06 20:31:06.391	2026-03-06 20:31:06.391	ORCAMENTO	\N
19	23	2	Marceneiro	Profissional de Marceneiro em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	0.00	\N	f	ativo	2026-03-06 20:31:06.493	2026-03-06 20:31:06.493	ORCAMENTO	\N
20	24	10	Encanador	Profissional de Encanador em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	0.00	\N	f	ativo	2026-03-06 20:31:06.594	2026-03-06 20:31:06.594	ORCAMENTO	\N
21	25	6	Jardineiro	Profissional de Jardineiro em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	0.00	\N	f	ativo	2026-03-06 20:31:06.693	2026-03-06 20:31:06.693	ORCAMENTO	\N
22	26	14	Mecânico	Profissional de Mecânico em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	0.00	\N	f	ativo	2026-03-06 20:31:06.786	2026-03-06 20:31:06.786	ORCAMENTO	\N
23	27	12	Cabeleireiro	Profissional de Cabeleireiro em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	0.00	\N	f	ativo	2026-03-06 20:31:06.902	2026-03-06 20:31:06.902	ORCAMENTO	\N
24	28	10	Encanador	Profissional de Encanador em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	0.00	\N	f	ativo	2026-03-06 20:31:06.988	2026-03-06 20:31:06.988	ORCAMENTO	\N
25	29	2	Marceneiro	Móveis sob medida, cozinhas planejadas, armários, portas e janelas. Madeira de qualidade e acabamento fino.	0.00	\N	f	ativo	2026-03-06 20:31:07.084	2026-03-06 20:31:07.084	ORCAMENTO	\N
26	30	6	Jardineiro	Paisagismo, manutenção de jardins, poda de árvores, plantio de grama e jardinagem em geral.	0.00	\N	f	ativo	2026-03-06 20:31:07.176	2026-03-06 20:31:07.176	ORCAMENTO	\N
27	31	9	Personal Trainer	Profissional de Personal Trainer em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	0.00	\N	f	ativo	2026-03-06 20:31:07.298	2026-03-06 20:31:07.298	ORCAMENTO	\N
28	32	3	Pedreiro	Profissional de Pedreiro em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	0.00	\N	f	ativo	2026-03-06 20:31:07.385	2026-03-06 20:31:07.385	ORCAMENTO	\N
29	33	13	Manicure	Profissional de Manicure em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	0.00	\N	f	ativo	2026-03-06 20:31:07.472	2026-03-06 20:31:07.472	ORCAMENTO	\N
30	34	11	Barbeiro	Profissional de Barbeiro em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	0.00	\N	f	ativo	2026-03-06 20:31:07.562	2026-03-06 20:31:07.562	ORCAMENTO	\N
31	35	1	Eletricista	Profissional de Eletricista em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	0.00	\N	f	ativo	2026-03-06 20:31:07.668	2026-03-06 20:31:07.668	ORCAMENTO	\N
32	36	4	Diarista	Profissional de Diarista em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	0.00	\N	f	ativo	2026-03-06 20:31:07.76	2026-03-06 20:31:07.76	ORCAMENTO	\N
33	37	2	Marceneiro	Profissional de Marceneiro em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	0.00	\N	f	ativo	2026-03-06 20:31:07.857	2026-03-06 20:31:07.857	ORCAMENTO	\N
34	38	1	Eletricista	Especialista em instalações elétricas residenciais e comerciais. Mais de 15 anos de experiência. Atendimento 24 horas para emergências.	0.00	\N	f	ativo	2026-03-06 20:31:07.956	2026-03-06 20:31:07.956	ORCAMENTO	\N
35	39	7	Pintor	Profissional de Pintor em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	0.00	\N	f	ativo	2026-03-06 20:31:08.054	2026-03-06 20:31:08.054	ORCAMENTO	\N
36	40	5	Fotógrafo	Fotografia de casamentos, aniversários, ensaios e eventos corporativos. Edição profissional incluída.	0.00	\N	f	ativo	2026-03-06 20:31:08.153	2026-03-06 20:31:08.153	ORCAMENTO	\N
37	41	15	Técnico de Informática	Profissional de Técnico de Informática em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	0.00	\N	f	ativo	2026-03-06 20:31:08.245	2026-03-06 20:31:08.245	ORCAMENTO	\N
38	42	7	Pintor	Pintura residencial e comercial, texturas, grafiato, massa corrida. Trabalho limpo e profissional.	0.00	\N	f	ativo	2026-03-06 20:31:08.343	2026-03-06 20:31:08.343	ORCAMENTO	\N
39	43	3	Pedreiro	Construção civil, reformas, acabamentos, pintura e pequenos reparos. Orçamento sem compromisso.	0.00	\N	f	ativo	2026-03-06 20:31:08.43	2026-03-06 20:31:08.43	ORCAMENTO	\N
40	44	5	Fotógrafo	Profissional de Fotógrafa em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	0.00	\N	f	ativo	2026-03-06 20:31:08.519	2026-03-06 20:31:08.519	ORCAMENTO	\N
41	46	3	Serviço por empreitada	o valor por dia, mas o valor depende do serviço contratado	300.00	\N	f	ativo	2026-03-07 01:18:24.612	2026-03-07 01:18:24.612	ORCAMENTO	
42	13	14	facço tudo	sou marido de aluguel, se o teu marido não faz eu faço, tenhoa ferramente sei usar usao bem e tenho tempo e experiencia	50.00	\N	f	ativo	2026-03-07 03:07:08.824	2026-03-07 03:07:08.824	FIXO	224 horas
43	48	15	Criação de agentes de IA	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan felis at purus tincidunt, quis auctor sem lobortis. Praesent sapien risus, dictum sit amet congue sit amet, sollicitudin vitae turpis. Suspendisse varius diam id arcu dapibus, in tincidunt neque iaculis. Proin mauris magna, hendrerit eget arcu vitae, tincidunt consequat lorem. Suspendisse sodales diam fringilla arcu fermentum cursus. Sed ornare pellentesque sem, sit amet finibus nunc bibendum non. Sed vehicula condimentum vehicula. Etiam egestas lorem ac urna euismod, eu suscipit nisl fermentum. Sed a odio nec risus ornare posuere. Nulla a leo ut orci blandit semper. Donec quis sapien sed sapien suscipit auctor eget eget justo. Curabitur placerat tincidunt quam, non mattis velit.\n\n	200.00	\N	f	ativo	2026-03-07 12:31:24.765	2026-03-07 12:31:24.765	ORCAMENTO	
44	54	8	CANECAS PERSONALIZADAS 		35.00	\N	f	ativo	2026-03-07 16:08:55.914	2026-03-07 16:08:55.914	ORCAMENTO	
45	54	8	Camiseta personalizada 		35.00	\N	f	ativo	2026-03-07 16:09:30.81	2026-03-07 16:09:30.81	ORCAMENTO	
46	47	15	Desenvolver Sites Web	O serviço depende do tipo de contratação e o orcamento pode variar dependendo doque foi solicitado. meu whatsapp 42991532962	100.00	\N	f	ativo	2026-03-07 16:23:18.71	2026-03-07 16:23:18.71	ORCAMENTO	3 dias
47	65	1	Instalação de sistema de segurança 		50.00	\N	f	ativo	2026-03-07 19:34:24.438	2026-03-07 19:34:24.438	ORCAMENTO	Depende do que deseja instalar 
48	49	15	Revisão/Correção de trabalhos acadêmicos (TCC, artigos, relatórios)	Revisão de trabalhos acadêmicos com foco em: correção gramatical e ortográfica, melhoria da clareza e fluidez do texto, ajustes de coesão e organização dos parágrafos, identificação de repetições e inconsistências.\nTrabalho em: trabalhos universitários, artigos científicos, relatórios acadêmicos, TCC e monografias.\n\nO valor final varia de acordo com o tamanho e complexidade do material.	50.00	\N	f	ativo	2026-03-10 02:54:11.992	2026-03-10 02:54:11.992	ORCAMENTO	1 a 3 dias dependendo do tamanho do trabalho
49	49	15	Formatação de trabalhos acadêmicos nas normas ABNT	Inclui: ajuste de margens e espaçamento, padronização de títulos e subtítulos, formatação de citações, organização de referências, formatação de capa e sumário, etc.	60.00	\N	f	ativo	2026-03-10 03:17:07.954	2026-03-10 03:17:07.954	ORCAMENTO	1 a 3 dias dependendo do tamanho do trabalho
50	49	15	Organização e padronização de referências acadêmicas	Serviço inclui: ajuste de citações no texto, padronização da lista de referências, correção de erros comuns em citações, organização de referências conforme norma solicitada	34.98	\N	f	ativo	2026-03-10 03:39:37.645	2026-03-10 03:39:37.645	ORCAMENTO	1 a 3 dias dependendo do tamanho do trabalho
51	49	15	Resumo e síntese de artigos científicos	O resumo pode incluir: objetivo do estudo, metodologia, principais resultados, conclusão dos autores	50.00	\N	f	ativo	2026-03-10 03:41:10.995	2026-03-10 03:41:10.995	ORCAMENTO	1 a 2 dias dependendo do tamanho do trabalho
52	13	6	Corte de grama	Em um dia para áreas de até 300m2	100.00	\N	f	ativo	2026-03-11 01:01:46.057	2026-03-11 01:01:46.057	FIXO	12
53	12	15	formatação de computador	O servicço de formatação  normalmente demora 4 horas, mas o trabalho de backup pu  cópia de seguranção pode demorar um pouco depedendo da quantidade de dados a serem salvos.	100.00	\N	f	ativo	2026-03-12 02:59:41.941	2026-03-12 02:59:41.941	FIXO	4 horas
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sessions (id, "sessionToken", "userId", expires) FROM stdin;
\.


--
-- Data for Name: solicitacoes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.solicitacoes (id, cliente_id, servico_id, descricao, status, created_at, prestador_id) FROM stdin;
1	12	4	Olá! Gostaria de agendar o serviço "Ensaio Fotográfico". Qual seria a sua disponibilidade?	pendente	2026-03-06 22:42:45.099	\N
2	12	9	Olá! Gostaria de agendar o serviço "Faxina Completa". Qual seria a sua disponibilidade?	pendente	2026-03-06 22:46:37.758	\N
3	13	10	Olá! Tenho interesse no serviço "criação de sites". Poderia me informar mais detalhes e valor?	pendente	2026-03-06 23:05:14.141	\N
4	47	10	quer um aplicativo para monitorar o onibus da cidade de palmas pr em tempo real	pendente	2026-03-07 04:35:09.401	\N
5	12	42	Contato direto via perfil	pendente	2026-03-07 04:54:43.414	\N
6	47	2	Contato direto via perfil	pendente	2026-03-07 05:18:11.528	\N
7	47	5	Contato direto via perfil	pendente	2026-03-07 05:28:29.575	\N
8	45	10	Contato direto via perfil	pendente	2026-03-07 11:56:36.592	\N
9	47	43	Olá! Tenho interesse no serviço "Criação de agentes de IA". Poderia me informar mais detalhes e valor?	pendente	2026-03-07 12:34:25.964	\N
10	55	24	Contato direto via perfil	pendente	2026-03-07 16:07:40.265	\N
11	55	5	Contato direto via perfil	pendente	2026-03-07 16:09:26.982	\N
12	55	12	Contato direto via perfil	pendente	2026-03-07 16:13:58.247	\N
13	47	42	Contato direto via perfil	pendente	2026-03-07 18:11:58.38	\N
14	13	46	Olá! Tenho interesse no serviço "Desenvolver Sites Web". Poderia me informar mais detalhes e valor?	pendente	2026-03-07 18:14:51.768	\N
15	45	46	Contato direto via perfil	pendente	2026-03-07 19:37:18.735	\N
16	12	\N	Mensagem direta iniciada pelo perfil	pendente	2026-03-07 19:43:13.457	14
17	12	47	Contato direto via perfil	pendente	2026-03-07 22:00:49.821	\N
18	48	46	Olá! Tenho interesse no serviço "Desenvolver Sites Web". Poderia me informar mais detalhes e valor?	pendente	2026-03-08 14:55:19.609	\N
19	48	10	Contato direto via perfil	pendente	2026-03-08 15:10:35.308	\N
20	47	11	Mensagem direta iniciada pelo perfil	pendente	2026-03-09 18:49:03.459	15
21	13	3	Mensagem direta iniciada pelo perfil	pendente	2026-03-11 00:59:38.883	7
\.


--
-- Data for Name: transacoes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.transacoes (id, carteira_id, agendamento_id, tipo, valor, status, data_solicitacao, data_processamento, descricao, chave_pix, banco_agencia, banco_conta, tipo_conta, metodo_pagamento, comprovante_url, updated_at) FROM stdin;
2	2	\N	deposito	100.00	pendente	2026-03-06 14:30:18.409	\N	Depósito por pix	\N	\N	\N	\N	pix	\N	2026-03-06 14:30:18.409
3	5	\N	deposito	1000.00	pendente	2026-03-08 15:08:24.637	\N	Depósito por pix	\N	\N	\N	\N	pix	\N	2026-03-08 15:08:24.637
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.usuarios (id, nome, nome_fantasia, email, senha, telefone, documento, tipo, foto_perfil, especialidade, sobre, avaliacao_media, verificado, disponibilidade, endereco, cidade, estado, cep, latitude, longitude, website, linkedin, facebook, instagram, youtube, tiktok, kwai, perfil_academico, status, email_verificado, token_verificacao, patrocinador_id, created_at, updated_at, "emailVerified", reset_token, reset_token_expires) FROM stdin;
10	Juliana Ferreira	\N	juliana@whodo.com	$2b$10$YF8ACtuF7i3iARaf4dAmj.s6qMj70ZcdaLysLP.VdZgJgZI6K6H0G	(43) 99999-1004	\N	usuario	https://randomuser.me/api/portraits/women/65.jpg	Diarista Profissional	Serviço de limpeza completo com produtos de qualidade. Pontual e organizada.	4.70	f	Seg-Sex 8h-16h	\N	Palmas	PR	\N	-26.48200000	-51.99200000	\N	\N	\N	\N	\N	\N	\N	\N	ativo	t	\N	\N	2026-03-06 14:05:12.58	2026-03-06 14:05:12.58	\N	\N	\N
11	Ana Santos	\N	ana@whodo.com	$2b$10$YF8ACtuF7i3iARaf4dAmj.s6qMj70ZcdaLysLP.VdZgJgZI6K6H0G	(43) 99999-1002	\N	usuario	https://randomuser.me/api/portraits/women/44.jpg	Eletricista Industrial	Técnica em eletrotécnica com certificação NR10. Atendo residências e empresas.	4.90	t	Seg-Sáb 7h-17h	\N	Palmas	PR	\N	-26.48600000	-51.98800000	\N	\N	\N	\N	\N	\N	\N	\N	ativo	t	\N	\N	2026-03-06 14:05:12.58	2026-03-06 14:05:12.58	\N	\N	\N
14	Renanq	\N	divine.swallow.phrb@hidingmail.com	$2b$10$ePnbAemoNw9LsFVIIrXoFu5ODFUdeduDsjuRvSnDftisrGqVLl0q6	43984020851	\N	usuario	\N	\N	\N	0.00	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-06 16:44:36.554	2026-03-06 16:44:36.554	\N	\N	\N
15	Fernanda Lima Diárias	Fernanda Lima Diárias	fernandalimadiarias1@whodo.temp	$2b$10$TJXXJHlk4ZqhfwN34LY4s.c1fB0oxb/czAGll89u/hgOXc/A3y7HS	(46) 94444-6666	\N	usuario	https://randomuser.me/api/portraits/women/52.jpg	Diarista	Limpeza residencial e comercial, organização de ambientes, lavagem de roupas e passadoria. Referências disponíveis.	4.80	f	Seg-Sáb: 7h às 17h	Rua Rio Grande do Sul, 987 - Jardim Europa	Palmas	PR	\N	-26.48300000	-51.99300000	\N	\N	\N	lima_limpeza_pr	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-06 20:31:05.496	2026-03-06 20:31:05.496	\N	\N	\N
16	Maria Oliveira Encanamentos	Maria Oliveira Encanamentos	mariaoliveiraencanamentos2@whodo.temp	$2b$10$TJXXJHlk4ZqhfwN34LY4s.c1fB0oxb/czAGll89u/hgOXc/A3y7HS	(46) 98888-2222	\N	usuario	https://randomuser.me/api/portraits/women/44.jpg	Encanador	Serviços de encanamento, desentupimento, instalação de aquecedores e reparos em geral. Garantia de 90 dias em todos os serviços.	4.90	f	Seg-Sáb: 7h às 19h	Av. Brasil, 456 - Jardim América	Palmas	PR	\N	-26.48600000	-51.98850000	https://oliveirahidraulica.com.br	\N	\N	oliveira_hidraulica	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-06 20:31:05.765	2026-03-06 20:31:05.765	\N	\N	\N
17	Letícia Cardoso Pedreiro	Letícia Cardoso Pedreiro	leticiacardosopedreiro3@whodo.temp	$2b$10$TJXXJHlk4ZqhfwN34LY4s.c1fB0oxb/czAGll89u/hgOXc/A3y7HS	(46) 97159-3874	\N	usuario	https://randomuser.me/api/portraits/women/22.jpg	Pedreiro	Profissional de Pedreiro em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	4.70	f	Seg-Sáb: 7h às 19h	Rua Santa Catarina, 641 - Jardim Europa	Palmas	PR	\N	-26.47961900	-51.98576300	\N	\N	\N	leticia_pedreiro_pr	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-06 20:31:05.862	2026-03-06 20:31:05.862	\N	\N	\N
18	Roberto Silva Eletricista	Roberto Silva Eletricista	robertosilvaeletricista4@whodo.temp	$2b$10$TJXXJHlk4ZqhfwN34LY4s.c1fB0oxb/czAGll89u/hgOXc/A3y7HS	(46) 95101-7871	\N	usuario	https://randomuser.me/api/portraits/men/48.jpg	Eletricista	Profissional de Eletricista em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	4.80	f	Seg-Sáb: 7h às 19h	Rua das Flores, 993 - Centro	Palmas	PR	\N	-26.49002400	-51.98350500	\N	\N	\N	roberto_eletricista_pr	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-06 20:31:05.951	2026-03-06 20:31:05.951	\N	\N	\N
19	Bruno Alves Personal	Bruno Alves Personal	brunoalvespersonal5@whodo.temp	$2b$10$TJXXJHlk4ZqhfwN34LY4s.c1fB0oxb/czAGll89u/hgOXc/A3y7HS	(46) 91111-9999	\N	usuario	https://randomuser.me/api/portraits/men/73.jpg	Personal Trainer	Treinamento personalizado, emagrecimento, hipertrofia, preparação física. Atendo em academias ou domicílio.	4.80	f	Seg-Sáb: 6h às 21h	Rua Goiás, 369 - Vila Operária	Palmas	PR	\N	-26.48950000	-51.98550000	\N	\N	\N	alves_fitness	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-06 20:31:06.058	2026-03-06 20:31:06.058	\N	\N	\N
20	Rafael Dias Pintor	Rafael Dias Pintor	rafaeldiaspintor6@whodo.temp	$2b$10$TJXXJHlk4ZqhfwN34LY4s.c1fB0oxb/czAGll89u/hgOXc/A3y7HS	(46) 92004-6303	\N	usuario	https://randomuser.me/api/portraits/men/5.jpg	Pintor	Profissional de Pintor em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	5.00	f	Seg-Sáb: 7h às 19h	Rua Goiás, 826 - Industrial	Palmas	PR	\N	-26.48266000	-51.98995000	\N	\N	\N	rafael_pintor_pr	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-06 20:31:06.157	2026-03-06 20:31:06.157	\N	\N	\N
21	Patrícia Rocha Beleza	Patrícia Rocha Beleza	patriciarochabeleza7@whodo.temp	$2b$10$TJXXJHlk4ZqhfwN34LY4s.c1fB0oxb/czAGll89u/hgOXc/A3y7HS	(46) 90000-0000	\N	usuario	https://randomuser.me/api/portraits/women/61.jpg	Cabeleireiro	Cortes femininos e masculinos, coloração, mechas, tratamentos capilares e penteados para eventos.	4.70	f	Ter-Sáb: 9h às 19h	Av. Mato Grosso, 741 - Centro	Palmas	PR	\N	-26.48050000	-51.99550000	https://rochastudio.com.br	\N	\N	rocha_studio_beleza	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-06 20:31:06.261	2026-03-06 20:31:06.261	\N	\N	\N
22	Natália Barbosa Designer Gráfico	Natália Barbosa Designer Gráfico	nataliabarbosadesignergrafico8@whodo.temp	$2b$10$TJXXJHlk4ZqhfwN34LY4s.c1fB0oxb/czAGll89u/hgOXc/A3y7HS	(46) 96365-7862	\N	usuario	https://randomuser.me/api/portraits/women/38.jpg	Designer Gráfico	Profissional de Designer Gráfico em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	4.20	f	Seg-Sex: 8h às 18h	Rua Minas Gerais, 229 - Jardim das Palmeiras	Palmas	PR	\N	-26.48336600	-51.99183100	\N	\N	\N	natalia_designer_pr	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-06 20:31:06.364	2026-03-06 20:31:06.364	\N	\N	\N
23	Vanessa Castro Marceneiro	Vanessa Castro Marceneiro	vanessacastromarceneiro9@whodo.temp	$2b$10$TJXXJHlk4ZqhfwN34LY4s.c1fB0oxb/czAGll89u/hgOXc/A3y7HS	(46) 99569-6011	\N	usuario	https://randomuser.me/api/portraits/women/45.jpg	Marceneiro	Profissional de Marceneiro em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	4.00	f	Agendamento prévio	Av. Mato Grosso, 678 - Vila Operária	Palmas	PR	\N	-26.48174600	-51.99075100	https://vanessamarceneiro.com.br	\N	\N	vanessa_marceneiro_pr	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-06 20:31:06.457	2026-03-06 20:31:06.457	\N	\N	\N
6	Fernanda Costa	\N	fernanda@whodo.com	$2b$10$YF8ACtuF7i3iARaf4dAmj.s6qMj70ZcdaLysLP.VdZgJgZI6K6H0G	(43) 99999-1006	\N	usuario	https://randomuser.me/api/portraits/women/33.jpg	Fotógrafa de Eventos	Casamentos, aniversários e ensaios fotográficos. Equipamento profissional Canon.	4.90	t	Todos os dias sob agendamento	\N	Palmas	PR	\N	-26.48800000	-51.98500000	\N	\N	\N	\N	\N	\N	\N	\N	ativo	t	\N	\N	2026-03-06 14:05:12.58	2026-03-06 14:05:12.58	\N	\N	\N
7	Roberto Lima	\N	roberto@whodo.com	$2b$10$YF8ACtuF7i3iARaf4dAmj.s6qMj70ZcdaLysLP.VdZgJgZI6K6H0G	(43) 99999-1003	\N	usuario	https://randomuser.me/api/portraits/men/55.jpg	Pintor de Interiores	Especialista em pintura decorativa, textura e efeitos especiais. Trabalho limpo e pontual.	4.60	t	Seg-Sex 8h-17h	\N	Guarapuava	PR	\N	-25.39000000	-51.45600000	\N	\N	\N	\N	\N	\N	\N	\N	ativo	t	\N	\N	2026-03-06 14:05:12.58	2026-03-06 14:05:12.58	\N	\N	\N
8	Carlos Oliveira	\N	carlos@whodo.com	$2b$10$YF8ACtuF7i3iARaf4dAmj.s6qMj70ZcdaLysLP.VdZgJgZI6K6H0G	(43) 99999-1001	\N	usuario	https://randomuser.me/api/portraits/men/32.jpg	Encanador Residencial	Mais de 10 anos de experiência em encanamento residencial e industrial. Trabalho com instalação e manutenção.	4.80	t	Seg-Sex 8h-18h	\N	Palmas	PR	\N	-26.48400000	-51.99000000	\N	\N	\N	\N	\N	\N	\N	\N	ativo	t	\N	\N	2026-03-06 14:05:12.58	2026-03-06 14:05:12.58	\N	\N	\N
9	Marcos Silva	\N	marcos@whodo.com	$2b$10$YF8ACtuF7i3iARaf4dAmj.s6qMj70ZcdaLysLP.VdZgJgZI6K6H0G	(43) 99999-1005	\N	usuario	https://randomuser.me/api/portraits/men/75.jpg	Marceneiro e Carpinteiro	Fabricação de móveis sob medida, restauração e reparos. Madeira de qualidade garantida.	4.50	t	Seg-Sex 8h-18h, Sáb 8h-12h	\N	Guarapuava	PR	\N	-25.38800000	-51.45800000	\N	\N	\N	\N	\N	\N	\N	\N	ativo	t	\N	\N	2026-03-06 14:05:12.58	2026-03-06 14:05:12.58	\N	\N	\N
24	Mariana Santos Encanador	Mariana Santos Encanador	marianasantosencanador10@whodo.temp	$2b$10$TJXXJHlk4ZqhfwN34LY4s.c1fB0oxb/czAGll89u/hgOXc/A3y7HS	(46) 95671-9638	\N	usuario	https://randomuser.me/api/portraits/women/31.jpg	Encanador	Profissional de Encanador em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	4.10	f	Agendamento prévio	Av. Brasil, 617 - Jardim América	Palmas	PR	\N	-26.48559600	-51.98793300	\N	\N	\N	mariana_encanador_pr	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-06 20:31:06.554	2026-03-06 20:31:06.554	\N	\N	\N
25	Matheus Rodrigues Jardineiro	Matheus Rodrigues Jardineiro	matheusrodriguesjardineiro11@whodo.temp	$2b$10$TJXXJHlk4ZqhfwN34LY4s.c1fB0oxb/czAGll89u/hgOXc/A3y7HS	(46) 91748-7862	\N	usuario	https://randomuser.me/api/portraits/men/74.jpg	Jardineiro	Profissional de Jardineiro em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	4.80	f	Agendamento prévio	Av. Curitiba, 376 - Jardim das Palmeiras	Palmas	PR	\N	-26.47868500	-51.98365300	\N	\N	\N	matheus_jardineiro_pr	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-06 20:31:06.663	2026-03-06 20:31:06.663	\N	\N	\N
26	Leonardo Ribeiro Mecânico	Leonardo Ribeiro Mecânico	leonardoribeiromecanico12@whodo.temp	$2b$10$TJXXJHlk4ZqhfwN34LY4s.c1fB0oxb/czAGll89u/hgOXc/A3y7HS	(46) 99089-9750	\N	usuario	https://randomuser.me/api/portraits/men/14.jpg	Mecânico	Profissional de Mecânico em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	4.30	f	Seg-Sex: 8h às 18h	Rua Paraná, 628 - Centro	Palmas	PR	\N	-26.47999000	-51.98588300	\N	\N	\N	leonardo_mecanico_pr	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-06 20:31:06.748	2026-03-06 20:31:06.748	\N	\N	\N
27	Isabela Lima Cabeleireiro	Isabela Lima Cabeleireiro	isabelalimacabeleireiro13@whodo.temp	$2b$10$TJXXJHlk4ZqhfwN34LY4s.c1fB0oxb/czAGll89u/hgOXc/A3y7HS	(46) 96258-9816	\N	usuario	https://randomuser.me/api/portraits/women/45.jpg	Cabeleireiro	Profissional de Cabeleireiro em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	4.80	f	Agendamento prévio	Av. Mato Grosso, 839 - Vila Nova	Palmas	PR	\N	-26.48850300	-51.98746300	https://isabelacabeleireiro.com.br	\N	\N	isabela_cabeleireiro_pr	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-06 20:31:06.856	2026-03-06 20:31:06.856	\N	\N	\N
28	André Martins Encanador	André Martins Encanador	andremartinsencanador14@whodo.temp	$2b$10$TJXXJHlk4ZqhfwN34LY4s.c1fB0oxb/czAGll89u/hgOXc/A3y7HS	(46) 93649-1835	\N	usuario	https://randomuser.me/api/portraits/men/1.jpg	Encanador	Profissional de Encanador em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	4.90	f	Seg-Sáb: 7h às 19h	Av. Curitiba, 551 - Vila Nova	Palmas	PR	\N	-26.48259300	-51.99515800	\N	\N	\N	andre_encanador_pr	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-06 20:31:06.958	2026-03-06 20:31:06.958	\N	\N	\N
29	Carlos Mendes Marcenaria	Carlos Mendes Marcenaria	carlosmendesmarcenaria15@whodo.temp	$2b$10$TJXXJHlk4ZqhfwN34LY4s.c1fB0oxb/czAGll89u/hgOXc/A3y7HS	(46) 95555-5555	\N	usuario	https://randomuser.me/api/portraits/men/67.jpg	Marceneiro	Móveis sob medida, cozinhas planejadas, armários, portas e janelas. Madeira de qualidade e acabamento fino.	4.90	f	Seg-Sex: 8h às 18h	Rua Paraná, 654 - Industrial	Palmas	PR	\N	-26.48700000	-51.98700000	\N	\N	\N	mendes_moveis	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-06 20:31:07.053	2026-03-06 20:31:07.053	\N	\N	\N
30	Ricardo Souza Jardins	Ricardo Souza Jardins	ricardosouzajardins16@whodo.temp	$2b$10$TJXXJHlk4ZqhfwN34LY4s.c1fB0oxb/czAGll89u/hgOXc/A3y7HS	(46) 93333-7777	\N	usuario	https://randomuser.me/api/portraits/men/41.jpg	Jardineiro	Paisagismo, manutenção de jardins, poda de árvores, plantio de grama e jardinagem em geral.	4.70	f	Seg-Sáb: 7h às 18h	Av. Curitiba, 147 - Jardim das Palmeiras	Palmas	PR	\N	-26.48800000	-51.98600000	https://souzajardins.com.br	\N	\N	souza_paisagismo	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-06 20:31:07.142	2026-03-06 20:31:07.142	\N	\N	\N
31	Felipe Nascimento Personal Trainer	Felipe Nascimento Personal Trainer	felipenascimentopersonaltrainer17@whodo.temp	$2b$10$TJXXJHlk4ZqhfwN34LY4s.c1fB0oxb/czAGll89u/hgOXc/A3y7HS	(46) 92161-5560	\N	usuario	https://randomuser.me/api/portraits/men/81.jpg	Personal Trainer	Profissional de Personal Trainer em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	4.70	f	Seg-Sex: 8h às 18h	Rua Goiás, 959 - Jardim América	Palmas	PR	\N	-26.48106200	-51.98657900	\N	\N	\N	felipe_personaltrainer_pr	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-06 20:31:07.261	2026-03-06 20:31:07.261	\N	\N	\N
32	Lucas Oliveira Pedreiro	Lucas Oliveira Pedreiro	lucasoliveirapedreiro18@whodo.temp	$2b$10$TJXXJHlk4ZqhfwN34LY4s.c1fB0oxb/czAGll89u/hgOXc/A3y7HS	(46) 91183-9754	\N	usuario	https://randomuser.me/api/portraits/men/92.jpg	Pedreiro	Profissional de Pedreiro em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	4.50	f	Seg-Sex: 8h às 18h	Rua São Paulo, 780 - Vila Nova	Palmas	PR	\N	-26.48900700	-51.99671400	\N	\N	\N	lucas_pedreiro_pr	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-06 20:31:07.355	2026-03-06 20:31:07.355	\N	\N	\N
33	Bianca Araújo Manicure	Bianca Araújo Manicure	biancaaraujomanicure19@whodo.temp	$2b$10$TJXXJHlk4ZqhfwN34LY4s.c1fB0oxb/czAGll89u/hgOXc/A3y7HS	(46) 97508-9901	\N	usuario	https://randomuser.me/api/portraits/women/26.jpg	Manicure	Profissional de Manicure em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	4.50	f	Seg-Sáb: 7h às 19h	Av. Brasil, 967 - Industrial	Palmas	PR	\N	-26.48367500	-51.98326900	\N	\N	\N	bianca_manicure_pr	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-06 20:31:07.443	2026-03-06 20:31:07.443	\N	\N	\N
34	Thiago Carvalho Barbeiro	Thiago Carvalho Barbeiro	thiagocarvalhobarbeiro20@whodo.temp	$2b$10$TJXXJHlk4ZqhfwN34LY4s.c1fB0oxb/czAGll89u/hgOXc/A3y7HS	(46) 91086-4233	\N	usuario	https://randomuser.me/api/portraits/men/73.jpg	Barbeiro	Profissional de Barbeiro em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	4.10	f	Seg-Sex: 8h às 18h	Rua das Flores, 527 - Jardim Europa	Palmas	PR	\N	-26.48337000	-51.98977800	\N	\N	\N	thiago_barbeiro_pr	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-06 20:31:07.532	2026-03-06 20:31:07.532	\N	\N	\N
35	Carolina Gomes Eletricista	Carolina Gomes Eletricista	carolinagomeseletricista21@whodo.temp	$2b$10$TJXXJHlk4ZqhfwN34LY4s.c1fB0oxb/czAGll89u/hgOXc/A3y7HS	(46) 97071-9251	\N	usuario	https://randomuser.me/api/portraits/women/97.jpg	Eletricista	Profissional de Eletricista em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	4.00	f	Seg-Sex: 8h às 18h	Rua Rio Grande do Sul, 398 - Jardim América	Palmas	PR	\N	-26.48905200	-51.98542500	\N	\N	\N	carolina_eletricista_pr	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-06 20:31:07.625	2026-03-06 20:31:07.625	\N	\N	\N
36	Larissa Costa Diarista	Larissa Costa Diarista	larissacostadiarista22@whodo.temp	$2b$10$TJXXJHlk4ZqhfwN34LY4s.c1fB0oxb/czAGll89u/hgOXc/A3y7HS	(46) 91919-2832	\N	usuario	https://randomuser.me/api/portraits/women/89.jpg	Diarista	Profissional de Diarista em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	4.90	f	Seg-Sáb: 7h às 19h	Rua Rio Grande do Sul, 486 - Vila Operária	Palmas	PR	\N	-26.48037300	-51.99108500	\N	\N	\N	larissa_diarista_pr	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-06 20:31:07.73	2026-03-06 20:31:07.73	\N	\N	\N
37	Gabriel Pereira Marceneiro	Gabriel Pereira Marceneiro	gabrielpereiramarceneiro23@whodo.temp	$2b$10$TJXXJHlk4ZqhfwN34LY4s.c1fB0oxb/czAGll89u/hgOXc/A3y7HS	(46) 99355-4584	\N	usuario	https://randomuser.me/api/portraits/men/62.jpg	Marceneiro	Profissional de Marceneiro em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	4.90	f	Seg-Sáb: 7h às 19h	Rua Paraná, 316 - Industrial	Palmas	PR	\N	-26.47899600	-51.99210900	\N	\N	\N	gabriel_marceneiro_pr	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-06 20:31:07.827	2026-03-06 20:31:07.827	\N	\N	\N
38	João Silva Eletricista	João Silva Eletricista	joaosilvaeletricista24@whodo.temp	$2b$10$TJXXJHlk4ZqhfwN34LY4s.c1fB0oxb/czAGll89u/hgOXc/A3y7HS	(46) 99999-1111	\N	usuario	https://randomuser.me/api/portraits/men/32.jpg	Eletricista	Especialista em instalações elétricas residenciais e comerciais. Mais de 15 anos de experiência. Atendimento 24 horas para emergências.	4.80	f	Seg-Sex: 8h às 18h, Sáb: 8h às 12h	Rua das Flores, 123 - Centro	Palmas	PR	\N	-26.48450000	-51.99020000	\N	\N	\N	js_eletrica	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-06 20:31:07.918	2026-03-06 20:31:07.918	\N	\N	\N
39	Camila Souza Pintor	Camila Souza Pintor	camilasouzapintor25@whodo.temp	$2b$10$TJXXJHlk4ZqhfwN34LY4s.c1fB0oxb/czAGll89u/hgOXc/A3y7HS	(46) 96328-1441	\N	usuario	https://randomuser.me/api/portraits/men/32.jpg	Pintor	Profissional de Pintor em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	4.60	f	Seg-Sáb: 7h às 19h	Rua Minas Gerais, 752 - Jardim Europa	Palmas	PR	\N	-26.47848600	-51.98478400	\N	\N	\N	camila_pintor_pr	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-06 20:31:08.017	2026-03-06 20:31:08.017	\N	\N	\N
40	Juliana Martins Fotografia	Juliana Martins Fotografia	julianamartinsfotografia26@whodo.temp	$2b$10$TJXXJHlk4ZqhfwN34LY4s.c1fB0oxb/czAGll89u/hgOXc/A3y7HS	(46) 92222-8888	\N	usuario	https://randomuser.me/api/portraits/women/35.jpg	Fotógrafo	Fotografia de casamentos, aniversários, ensaios e eventos corporativos. Edição profissional incluída.	4.90	f	Agendamento prévio	Rua Santa Catarina, 258 - Centro	Palmas	PR	\N	-26.48150000	-51.99450000	https://jmfotos.com.br	\N	\N	jm_fotografia	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-06 20:31:08.121	2026-03-06 20:31:08.121	\N	\N	\N
41	Diego Fernandes Técnico	Diego Fernandes Técnico	diegofernandestecnico27@whodo.temp	$2b$10$TJXXJHlk4ZqhfwN34LY4s.c1fB0oxb/czAGll89u/hgOXc/A3y7HS	(46) 93263-3093	\N	usuario	https://randomuser.me/api/portraits/men/72.jpg	Técnico de Informática	Profissional de Técnico de Informática em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	4.40	f	Seg-Sáb: 7h às 19h	Rua São Paulo, 728 - Vila Operária	Palmas	PR	\N	-26.48301100	-51.99417000	\N	\N	\N	diego_tecnico_pr	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-06 20:31:08.214	2026-03-06 20:31:08.214	\N	\N	\N
42	Ana Costa Pinturas	Ana Costa Pinturas	anacostapinturas28@whodo.temp	$2b$10$TJXXJHlk4ZqhfwN34LY4s.c1fB0oxb/czAGll89u/hgOXc/A3y7HS	(46) 96666-4444	\N	usuario	https://randomuser.me/api/portraits/women/28.jpg	Pintor	Pintura residencial e comercial, texturas, grafiato, massa corrida. Trabalho limpo e profissional.	4.60	f	Seg-Sáb: 8h às 18h	Rua Minas Gerais, 321 - Centro	Palmas	PR	\N	-26.48550000	-51.99100000	https://costapinturas.com	\N	\N	costa_pinturas	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-06 20:31:08.311	2026-03-06 20:31:08.311	\N	\N	\N
43	Pedro Santos Construções	Pedro Santos Construções	pedrosantosconstrucoes29@whodo.temp	$2b$10$TJXXJHlk4ZqhfwN34LY4s.c1fB0oxb/czAGll89u/hgOXc/A3y7HS	(46) 97777-3333	\N	usuario	https://randomuser.me/api/portraits/men/55.jpg	Pedreiro	Construção civil, reformas, acabamentos, pintura e pequenos reparos. Orçamento sem compromisso.	4.70	f	Seg-Sex: 7h às 17h	Rua São Paulo, 789 - Vila Nova	Palmas	PR	\N	-26.48200000	-51.99200000	\N	\N	\N	santos_reformas_pr	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-06 20:31:08.401	2026-03-06 20:31:08.401	\N	\N	\N
44	Amanda Almeida Fotógrafa	Amanda Almeida Fotógrafa	amandaalmeidafotografa30@whodo.temp	$2b$10$TJXXJHlk4ZqhfwN34LY4s.c1fB0oxb/czAGll89u/hgOXc/A3y7HS	(46) 97231-1815	\N	usuario	https://randomuser.me/api/portraits/women/80.jpg	Fotógrafo	Profissional de Fotógrafa em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.	4.60	f	Seg-Sáb: 7h às 19h	Rua Santa Catarina, 196 - Centro	Palmas	PR	\N	-26.47934200	-51.99687000	\N	\N	\N	amanda_fotografa_pr	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-06 20:31:08.49	2026-03-06 20:31:08.49	\N	\N	\N
45	CLAUDIO RIBEIRO RAMOS	CLAUDIO RIBEIRO RAMOS	valexguziel@gmail.com	$2b$10$QTo3qzst.zo4CKpkR71Li.5G9/R26davBiEm3.1KyZLzRFhVAHps.	43999049426	\N	usuario	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/profile/45-1772885053870-ClaudioInta.png	Técnico em Mecânica	Mecânico meia boca, especialista em fazer gambiarra estilo Mcguiver	0.00	f	Horário Comercial	Rua Roma, 700	Londrina	PR	86046-110	-23.35074310	-51.14225760	\N	\N	\N	\N	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-07 00:10:38.26	2026-03-07 12:04:14.816	\N	\N	\N
48	Gabriel Ramos	\N	gabrielzimmramos@gmail.com	\N	\N	\N	usuario	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/profile/48-1772886442640-labinho.webp	Desenvolvedor	\N	0.00	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	ativo	t	\N	\N	2026-03-07 12:24:35.27	2026-03-08 18:22:38.264	\N	\N	\N
46	Maninho Pedreiro e Acabamentos	Maninho	maninho@whodo.com	$2b$10$euyjN7YIpVwPlBVwKKVuC.ujolAwxtTJdfIV5zsDT4Wv6Z3YL5nt2	469882063781	\N	usuario	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/profile/46-1772846158529-maninho.png	Pedreiro	Pedreiro experiente, o melhor em acabamentos na região	0.00	f	Seg a Sex das 08:00 as 18:00hs	Avenida Marechal Deodoro, 543,  São José	Palmas	PR	85691-082	-26.48386800	-51.98881200	\N	\N	\N	\N	https://www.youtube.com/channel/UC_4MtW7ae8cQ7JckN9knahg	\N	\N	\N	ativo	f	\N	\N	2026-03-07 01:01:48.92	2026-03-07 01:16:01.088	\N	\N	\N
50	DEIVID DAVI SILVA DE LIMA	\N	silvadavid3297@gmail.com	$2b$10$.iUp39OkiInUZ5YLbvLFuu.Kf/Sfqhh.MVVrUqYrM6C7vlzeqBm/e	46988053759	\N	usuario	\N	\N	\N	0.00	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-07 15:45:43.925	2026-03-07 15:45:43.925	\N	\N	\N
51	NALISSA CRUZ DA SILVA	\N	NALISSACSILVA@GMAIL.COM	$2b$10$uQ2PgHhZHFbooys8Gz8VoOz3vgSRo3r4NTxwS9KrxbnBDhoZpmqBO	46984048632	\N	usuario	\N	\N	\N	0.00	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-07 15:47:00.719	2026-03-07 15:47:00.719	\N	\N	\N
52	nalissa silva	\N	nalissa123456@gmail.com	\N	\N	\N	usuario	https://lh3.googleusercontent.com/a/ACg8ocJ0bO4xOGgYj6ti-jkie1X-T0V2UGu1nlLJM2s5Y3WKnowLI7Y=s96-c	\N	\N	0.00	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	ativo	t	\N	\N	2026-03-07 15:47:50.773	2026-03-07 15:47:50.773	\N	\N	\N
54	Danieli Graf serbena	\N	dannigraf@hotmail.com	$2b$10$xzsrw0cd6v3kykoEeTYnZu6ZRVj7gr2/kQFgwaWYTJHGAD1hDtSkG	46999082906	\N	usuario	\N	\N	\N	0.00	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-07 16:04:49.371	2026-03-07 16:04:49.371	\N	\N	\N
55	Melany Fortunati dos Santos 	\N	mellfortunati4@gmail.com	$2b$10$gAe1a5LQdWcWzZYEfyyWYOS1CDNm53IIxBVSFvR9dTGXujnRF1QF.	46999347288	\N	usuario	\N	\N	\N	0.00	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-07 16:06:24.193	2026-03-07 16:06:24.193	\N	\N	\N
53	Daiana Correa de Souza	Daiana Correa de Souza	daianacsouza741@gmail.com	$2b$10$YwYvoLIDg8jrY/NaN2bPUOmHF324zBsB6vzhx5VgwdXeHwaarO1iG	46999417564	09247472938	usuario	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/profile/53-1772899528075-20260208_154657.jpg	\N	\N	0.00	f	\N	Armelindo Lazaretto	Palmas	PR	85692450	-26.48386800	-51.98881200	\N	\N	\N	\N	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-07 16:03:24.214	2026-03-07 16:06:58.189	\N	\N	\N
56	Camila de Oliveira Padilha	\N	camilapadilha16@gmail.com	$2b$10$.FdVtX25CcTeVBVPpUo.1eLqzAEfNmPLLSRKqwJ2ENQ2SskXjjtw2	46999415510	06062103933	usuario	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/profile/56-1772899875753-IMG_20250726_225212_351.jpg	\N	\N	0.00	f	\N	Rua Orvalina de Oliveira Mello 	Palmas 	PR	\N	-26.49018820	-51.99325950	\N	\N	\N	\N	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-07 16:09:20.389	2026-03-07 16:11:16.63	\N	\N	\N
57	Danieli Pacheco 	Dani	danielyduarte61@gmail.com	$2b$10$OA0edLy0CD0IswcMChfixuOCcmU8U7tu2LW..OkCJog46Uiw7kIgm	\N	\N	usuario	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/profile/57-1772899884097-IMG_1554.jpeg	\N	\N	0.00	f	\N	\N	Clevelândia	PR	85530000	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-07 16:09:41.123	2026-03-07 16:11:24.274	\N	\N	\N
12	Vinicius Ribeiro Ramos	Vinicius	vinicius@whodo.com	$2b$10$YF8ACtuF7i3iARaf4dAmj.s6qMj70ZcdaLysLP.VdZgJgZI6K6H0G	42991532962	95403850910	usuario	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/profile/12-1772806997307-eu-de-novo-256x384.png	\N	Sou profissional com mais de 15 anos de experiência em gestão de operações, processos e equipes, atuando em ambientes públicos e privados com foco em eficiência, indicadores e melhoria contínua. Minha trajetória é marcada pela união entre visão estratégica e execução técnica.\r\n\r\nEmpreendedorismo e Tecnologia\r\nAtualmente, sou Founder do WhoDo, uma startup incubada em Palmas/PR. Na plataforma, aplico minha expertise em processos para estruturar um ecossistema de serviços inovador, que integra:\r\n\r\nFintech & Incentivos: Implementação de rentabilização de saldo e sistemas de Marketing Multinível (MMN) em 4 níveis.\r\n\r\nDesenvolvimento Full-Stack: Arquitetura técnica utilizando TypeScript, JavaScript e React.\r\n\r\nEscalabilidade Operacional: Modelagem de crescimento baseada em hierarquia de suporte e eficiência de atendimento.\r\n\r\nTrajetória em Gestão de Operações\r\nAtuei como Gestor de Frotas, Manutenção Patrimonial e Compras em uma regional responsável por 13 cidades, coordenando indicadores críticos como prazo de execução e nível de serviço. Conduzi reduções relevantes de custos, incluindo:\r\n\r\nEficiência Logística: Redução do tempo médio de parada de veículos de 25 para 3 dias.\r\n\r\nGestão Financeira: Economia direta de 12,5% em despesas de manutenção.\r\n\r\nExcelência: Atuação em unidade premiada com o PNQS (Prêmio Nacional da Qualidade em Saneamento).\r\n\r\nDomínio Técnico\r\nIntegro gestão estratégica à aplicação prática de soluções digitais, com domínio em:\r\n\r\nDesenvolvimento: JavaScript, TypeScript, React, Python e Ruby on Rails (em evolução).\r\n\r\nDados e Automação: Excel Avançado, Macros, VB e análise orientada a indicadores.\r\n\r\nBusco oportunidades que desafiem minha capacidade de liderar transformações digitais e otimizar operações complexas através da tecnologia.\r\n\r\nPortfólio: \r\nhttps://newsdrop.net.br\r\nhttps://whodo.newsdrop.net.br\r\nhttps://newsdrop.net.br/TarifaZero/\r\nGitHub: https://github.com/LuckyEasyGold	5.00	f	\N	Rua Coronel Rutílio de Sá Ribas - Cascatinha	Palmas	PR	85690127	-26.48386800	-51.98881200	https://www.newsdrop.net.br	https://www.linkedin.com/in/vinicius-ribeiro-ramos-99528529/	https://www.facebook.com/viniciusribeiroramos.ramos.1	viniciusribramos	https://www.youtube.com/@ViniciusRibRamos	\N	\N	\N	ativo	t	\N	\N	2026-03-06 14:05:12.677	2026-03-08 01:09:54.783	\N	\N	\N
59	Jonathan Oliveira Ricardo 	\N	jonathanpuffr@gmail.com	$2b$10$JWMQ2BBI8kumTgxfVXpYXOoJKVVWKGHferaHN7qRqjsOOHc6jcPCO	46999286334	\N	usuario	\N	\N	\N	0.00	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-07 16:14:49.118	2026-03-07 16:14:49.118	\N	\N	\N
47	vinicius ribeiro ramos	vinicius	viniciusribramos@gmail.com	\N	42991532962	\N	usuario	https://lh3.googleusercontent.com/a/ACg8ocIXJ4T3GjQKEkBA8jJ7tfLV6PqojO7GfO3LkkMotvOJ4679z8p5=s96-c	Desenvolvedor se Sites e Aplicativos	Empreendedor em Tecnologia | Gestão Estratégica e Processos | Desenvolvimento Web (JavaScript, React) | Fundador do Projeto Whodo\r\n\r\nSou profissional com mais de 15 anos de experiência em gestão de operações, processos e equipes, atuando em ambientes públicos e privados com foco em eficiência, indicadores e melhoria contínua. Minha trajetória é marcada pela união entre visão estratégica e execução técnica.\r\n\r\n🚀 Empreendedorismo e Tecnologia\r\nAtualmente, sou Founder do WhoDo, uma startup incubada em Palmas/PR. Na plataforma, aplico minha expertise em processos para estruturar um ecossistema de serviços inovador, que integra:\r\n\r\nFintech & Incentivos: Implementação de rentabilização de saldo e sistemas de Marketing Multinível (MMN) em 4 níveis.\r\n\r\nDesenvolvimento Full-Stack: Arquitetura técnica utilizando TypeScript, JavaScript e React.\r\n\r\nEscalabilidade Operacional: Modelagem de crescimento baseada em hierarquia de suporte e eficiência de atendimento.\r\n\r\n📊 Trajetória em Gestão de Operações\r\nAtuei como Gestor de Frotas, Manutenção Patrimonial e Compras em uma regional responsável por 13 cidades, coordenando indicadores críticos como prazo de execução e nível de serviço. Conduzi reduções relevantes de custos, incluindo:\r\n\r\nEficiência Logística: Redução do tempo médio de parada de veículos de 25 para 3 dias.\r\n\r\n💰Gestão Financeira: Economia direta de 12,5% em despesas de manutenção.\r\n\r\n🏆Excelência: Atuação em unidade premiada com o PNQS (Prêmio Nacional da Qualidade em Saneamento).\r\n\r\n💻Domínio Técnico\r\nIntegro gestão estratégica à aplicação prática de soluções digitais, com domínio em:\r\n\r\nDesenvolvimento: JavaScript, TypeScript, React, Python e Ruby on Rails (em evolução).\r\n\r\nDados e Automação: Excel Avançado, Macros, VB e análise orientada a indicadores.\r\n\r\nBusco oportunidades que desafiem minha capacidade de liderar transformações digitais e otimizar operações complexas através da tecnologia.\r\n\r\nPortfólio:\r\n 🌐 https://newsdrop.net.br \r\n 🌐 https://whodo.newsdrop.net.br \r\n 🌐https://newsdrop.net.br/TarifaZero/ \r\n 💻 GitHub: https://github.com/LuckyEasyGold	0.00	f	24h	Rua Coronel Rutílio de Sá Ribas - Cascatinha	Palmas	PR	85690127	-26.48386800	-51.98881200	https://www.newsdrop.net.br	https://www.linkedin.com/in/vinicius-ribeiro-ramos-99528529/	https://www.facebook.com/viniciusribeiroramos.ramos.1	@viniciusribramos	https://www.youtube.com/@ViniciusRibRamos	\N	\N	\N	ativo	t	\N	\N	2026-03-07 04:03:37.251	2026-03-09 10:23:14.189	\N	\N	\N
58	CATIA ROSEMARA BOMBONATTO	flor de Lotus	catia.bombonatto@gmail.com	$2b$10$Qg9SURTNgc3dfjskAn84pOjStOfAC4Xub0pkwHe/UIwU2AKzmVmwK	46999750663	59.414.354/0001-25	usuario	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/profile/58-1772900628819-52498.jpg	Terapias	Somos uma loja focada em artigos religiosos,especializadas em terapias alternativas,Reiki, cartomancia entre outros atendimentos,venha conhecer nossa loja e agende seu horário.	0.00	f	Artigos Religiosos	Rua Professor Vergílio Ferreira - Santa Cruz	Palmas	PR	85692002	-26.48386800	-51.98881200	\N	\N	\N	@lotus.artigosreligiosos	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-07 16:14:13.696	2026-03-07 16:23:49.287	\N	\N	\N
60	Ana Richard 	\N	anarichard76@hotmail.com	$2b$10$O5CQQhRScFW4KWEzlN9Ns.4Xaq7o91cSGSm.wxSzQ9Sem.RgpEIDa	46988230126	\N	usuario	\N	\N	\N	0.00	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-07 16:40:09.892	2026-03-07 16:40:09.892	\N	\N	\N
61	Ana Richard 	\N	anarichard76@gmail.com	$2b$10$IJomtj5zVBKY/ATZ6KDE8uCZhcC2ywsTOgsAcoBupJM4/6qUg7K0q	46988230126	\N	usuario	\N	\N	\N	0.00	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-07 16:44:50.732	2026-03-07 16:44:50.732	\N	\N	\N
62	TecWareWhodo!	\N	sadmin@whodo.app	$2b$12$y/4CAHNC9ArxN/IITndC3OHejyfinRyL3BdOeEBhHC4m/mDfOfIUC	\N	\N	super_admin	\N	\N	\N	0.00	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	ativo	t	\N	\N	2026-03-07 17:07:03.369	2026-03-07 17:21:02.925	\N	\N	\N
63	Guilherme Francisco Zabott 	\N	gzabott.eng@gmail.com	$2b$10$asyBHXnLV6jQnxg8FH7FvuD8GFQxN41dQ2Bgkny.s3uOkZbbRF2xG	46999128309	\N	usuario	\N	\N	\N	0.00	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	ativo	f	9b82f313-aa43-451f-9d35-cd0de9420666	\N	2026-03-07 18:09:26.702	2026-03-07 18:09:26.702	\N	\N	\N
64	Test Bot	\N	testbot@example.com	$2b$10$0i.GpaXrOhjIfia7WTv4ceNp/bwO2/dX3mAWPGwaewIb6MiyrDi.i	\N	\N	usuario	\N	\N	\N	0.00	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	ativo	f	0bf11c97-7a3f-4320-a5d0-f97cbc690c09	\N	2026-03-07 19:18:22.469	2026-03-07 19:18:22.469	\N	\N	\N
65	Yago Silva	Yago Silva	yagosilva1810@gmail.com	$2b$10$9Us5l76Dse0SosSKBran0ubkntP3j2I/YRFv8V48bIoZZ6NwXhsMm	46999197323	10042129923	usuario	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/profile/65-1772912008436-1000801907.jpg	Instalador de sistema de segurança	\N	0.00	f	Seg a sábado das 19 as 22 da noite e no sábado o dia inteiro 	Rua Dos Carajás Número 36	Palmas	PR	85555000	-26.48386800	-51.98881200	\N	\N	\N	\N	\N	\N	\N	\N	ativo	f	11a93f7c-d178-4e21-afc0-671e8d1b84bc	\N	2026-03-07 19:31:25.076	2026-03-07 19:33:30.016	\N	\N	\N
66	Edna Ferreira da Silva	\N	ednarochaite@gmail.com	$2b$10$jHNEmBmNrj81wFsySu3BIOV.9Ja3GSAhXnnWshtu6ZC7Nwj3DbnMm	(42) 99993-7401	\N	usuario	\N	\N	\N	0.00	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	ativo	f	a78f8030-54f9-4292-81c3-2a15579e8764	\N	2026-03-07 22:13:34.702	2026-03-07 22:13:34.702	\N	\N	\N
67	Erica Fernanda dos Santos neufeld	\N	Ericaneufeldnanda@gmail.com	$2b$10$NbyQkYwhYIHntS8N0FvkeO.k6tqom4MkqIJEDeTyAhHETNixp6oXW	46999272683	\N	usuario	\N	\N	\N	0.00	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	ativo	f	16e591d0-62d2-4488-93bf-f700ec3f7cf6	\N	2026-03-07 23:39:34.895	2026-03-07 23:39:34.895	\N	\N	\N
68	Daiane Portela De Lara Ramos	\N	dhaianylara19@gmail.com	$2b$10$4xLqzMEUSV3Epg8DgqA.TOiRB6vHfS5FoAvsw197FXt/UQw8j/ZFe	46999708970	\N	usuario	\N	\N	\N	0.00	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	ativo	f	262a6c2b-2a52-4947-894e-a702e364f7d0	\N	2026-03-08 12:59:23.739	2026-03-08 12:59:23.739	\N	\N	\N
69	Pedro Henrique Souza Meneguzzo	Pedro Henrique Fotógrafo	phsmeneguzzo@hotmail.com	$2b$10$dSgosV6XvjyRe6wlmGhNTOZPLfiaJehO8i.HOA5jZacJLURYluNmO	46999039881	11157424937	usuario	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/profile/69-1772994965466-187296e3-0340-4082-b181-05db4f7da44a.jpeg	Fotógrafo e Videomaker profissional, designer profissional	Tenho 4 anos na área, ja fiz vários casamentos, aniversários, fotografia esportiva entre outros 	0.00	f	Sábado e domingo dia inteiro	Rua Coronel João Pimpão - Centro 1346	Palmas	PR	85690031	-26.48386800	-51.98881200	\N	\N	\N	@pedrohenriquefilms_	\N	\N	\N	\N	ativo	f	288a0a52-b887-4b55-9571-f813763912a9	\N	2026-03-08 18:32:06.403	2026-03-08 18:36:54.439	\N	\N	\N
49	Yasmin Araujo da Silva 	Yasmin	yasmin08araujozebra@gmail.com	$2b$10$fwh3ig/Ng0gYga0snfQCOetRBK9SJeBT2XCyWQlm4YIUjPiSjJ7La	46999826124	\N	usuario	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/profile/49-1773054617556-1000140629.jpg	Revisor	Revisão e apoio de trabalhos acadêmicos (TCC e artigos). Estudante da área da saúde com experiência em pesquisa acadêmica e elaboração de trabalhos científicos. Ofereço apoio para estudantes que precisam revisar, organizar ou desenvolver seus trabalhos acadêmicos.\r\nPosso ajudar com revisão de texto, organização de referências, formatação de trabalhos e estruturação de TCC, artigos e projetos de pesquisa.\r\nAtendimento online, com foco em deixar o trabalho mais claro, organizado e adequado às normas acadêmicas.\r\nCaso tenha dúvidas ou precise de ajuda com seu trabalho, pode entrar em contato.	0.00	f	Disponível para atendimento online durante a semana e finais de semana.	\N	Palmas	PR	85555000	\N	\N	\N	\N	\N	\N	\N	\N	\N	https://lattes.cnpq.br/2658205660340090	ativo	f	\N	\N	2026-03-07 13:50:05.877	2026-03-09 15:58:54.97	\N	\N	\N
70	Eder Silveira	\N	www.edinhosilveira.5@gmail.com	$2b$10$XruDN1wMyzHjcVK7W8iS8ORRn4/kOfjodhCkGUJ7ErMDoXqjCDm.a	46999086207	\N	usuario	\N	\N	\N	0.00	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	ativo	f	418da530-e495-450e-89a0-c295bcd3ea05	\N	2026-03-09 20:30:29.17	2026-03-09 20:30:29.17	\N	\N	\N
71	eduardo luiz	\N	eduardoalba0@hotmail.com	$2b$10$GxYsQJV1q.34CmUHFWjSieCZSybvUkzGPOQ4lVqCWNrejxnLPXfSe	46991054638	\N	usuario	\N	\N	\N	0.00	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	ativo	f	599ef5a6-219a-466b-b904-21988af2291d	\N	2026-03-09 22:53:45.51	2026-03-09 22:53:45.51	\N	\N	\N
72	BRUNO DA SILVA DE ANDRADE	\N	bruno7772005@gmail.com	$2b$10$DlO4smciIywHnAqhKwMMZeyTom5kwZ.qwPM3Y8ibyv1s0BqMEK2Sq	4699119757	\N	usuario	\N	\N	\N	0.00	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	ativo	f	256a41ec-36de-4a35-b8fd-1db178019d2d	\N	2026-03-09 23:53:42.498	2026-03-09 23:53:42.498	\N	\N	\N
13	pedro	Estagiario deAuxiliar de ajudante de escravo	pedro@whodo.com	$2b$10$8eXsGU4sEQS1lq7vLb7xR.ODjW..nBNTU6WeUdZcrHZC/rHa/4R8m	42 991532962	\N	usuario	https://sybwkfkjmbvfgwmqlxhq.supabase.co/storage/v1/object/public/whodo-images/profile/13-1773244181692-grace1.jpg	Testador do Sistema	Estagiario deAuxiliar de ajudante de escravo\r\nSou um bot criado para verificar se as funções na pagina estão cumprindo o que precisa	0.00	f	24h	Rua Coronel Rutílio de Sá Ribas - Cascatinha	Palmas	PR	85690127	-26.48386800	-51.98881200	\N	\N	\N	\N	\N	\N	\N	\N	ativo	f	\N	\N	2026-03-06 14:14:36.737	2026-03-11 15:49:43.076	\N	\N	\N
73	Cristiano Ronaldo	\N	contato@cr7.com	$2b$10$WLPBm295vD6DP5XbgR1XDujn5ersTMSA6mlXawduVSxnabUtrIyri	111111111	\N	usuario	\N	\N	\N	0.00	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	ativo	f	975be982-8091-42c3-b37a-0134a96fffa7	\N	2026-03-13 17:26:46.731	2026-03-13 17:26:46.731	\N	\N	\N
\.


--
-- Data for Name: verification_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.verification_tokens (identifier, token, expires) FROM stdin;
\.


--
-- Name: agendamentos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.agendamentos_id_seq', 1, true);


--
-- Name: avaliacoes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.avaliacoes_id_seq', 7, true);


--
-- Name: carteiras_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.carteiras_id_seq', 8, true);


--
-- Name: categorias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categorias_id_seq', 15, true);


--
-- Name: comentarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.comentarios_id_seq', 1, false);


--
-- Name: compartilhamentos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.compartilhamentos_id_seq', 1, false);


--
-- Name: curtidas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.curtidas_id_seq', 1, false);


--
-- Name: dados_bancarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.dados_bancarios_id_seq', 2, true);


--
-- Name: mensagens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.mensagens_id_seq', 31, true);


--
-- Name: notificacoes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.notificacoes_id_seq', 56, true);


--
-- Name: orcamentos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orcamentos_id_seq', 1, false);


--
-- Name: portfolio_albums_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.portfolio_albums_id_seq', 10, true);


--
-- Name: portfolio_comentarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.portfolio_comentarios_id_seq', 1, false);


--
-- Name: portfolio_media_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.portfolio_media_id_seq', 24, true);


--
-- Name: postagens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.postagens_id_seq', 1, false);


--
-- Name: seguidores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.seguidores_id_seq', 36, true);


--
-- Name: servicos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.servicos_id_seq', 53, true);


--
-- Name: solicitacoes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.solicitacoes_id_seq', 21, true);


--
-- Name: transacoes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.transacoes_id_seq', 3, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 73, true);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: agendamentos agendamentos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agendamentos
    ADD CONSTRAINT agendamentos_pkey PRIMARY KEY (id);


--
-- Name: avaliacoes avaliacoes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.avaliacoes
    ADD CONSTRAINT avaliacoes_pkey PRIMARY KEY (id);


--
-- Name: carteiras carteiras_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carteiras
    ADD CONSTRAINT carteiras_pkey PRIMARY KEY (id);


--
-- Name: categorias categorias_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_pkey PRIMARY KEY (id);


--
-- Name: comentarios comentarios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comentarios
    ADD CONSTRAINT comentarios_pkey PRIMARY KEY (id);


--
-- Name: compartilhamentos compartilhamentos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compartilhamentos
    ADD CONSTRAINT compartilhamentos_pkey PRIMARY KEY (id);


--
-- Name: curtidas curtidas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.curtidas
    ADD CONSTRAINT curtidas_pkey PRIMARY KEY (id);


--
-- Name: dados_bancarios dados_bancarios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dados_bancarios
    ADD CONSTRAINT dados_bancarios_pkey PRIMARY KEY (id);


--
-- Name: mensagens mensagens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mensagens
    ADD CONSTRAINT mensagens_pkey PRIMARY KEY (id);


--
-- Name: notificacoes notificacoes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notificacoes
    ADD CONSTRAINT notificacoes_pkey PRIMARY KEY (id);


--
-- Name: orcamentos orcamentos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orcamentos
    ADD CONSTRAINT orcamentos_pkey PRIMARY KEY (id);


--
-- Name: portfolio_albums portfolio_albums_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portfolio_albums
    ADD CONSTRAINT portfolio_albums_pkey PRIMARY KEY (id);


--
-- Name: portfolio_comentarios portfolio_comentarios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portfolio_comentarios
    ADD CONSTRAINT portfolio_comentarios_pkey PRIMARY KEY (id);


--
-- Name: portfolio_media portfolio_media_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portfolio_media
    ADD CONSTRAINT portfolio_media_pkey PRIMARY KEY (id);


--
-- Name: postagens postagens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.postagens
    ADD CONSTRAINT postagens_pkey PRIMARY KEY (id);


--
-- Name: seguidores seguidores_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seguidores
    ADD CONSTRAINT seguidores_pkey PRIMARY KEY (id);


--
-- Name: servicos servicos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.servicos
    ADD CONSTRAINT servicos_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: solicitacoes solicitacoes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solicitacoes
    ADD CONSTRAINT solicitacoes_pkey PRIMARY KEY (id);


--
-- Name: transacoes transacoes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transacoes
    ADD CONSTRAINT transacoes_pkey PRIMARY KEY (id);


--
-- Name: curtidas unique_usuario_postagem; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.curtidas
    ADD CONSTRAINT unique_usuario_postagem UNIQUE ("usuarioId", "postagemId");


--
-- Name: compartilhamentos unique_usuario_postagem_share; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compartilhamentos
    ADD CONSTRAINT unique_usuario_postagem_share UNIQUE ("usuarioId", "postagemId");


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: accounts_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON public.accounts USING btree (provider, "providerAccountId");


--
-- Name: carteiras_usuario_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX carteiras_usuario_id_key ON public.carteiras USING btree (usuario_id);


--
-- Name: dados_bancarios_usuario_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX dados_bancarios_usuario_id_key ON public.dados_bancarios USING btree (usuario_id);


--
-- Name: idx_comentarios_postagem; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_comentarios_postagem ON public.comentarios USING btree ("postagemId");


--
-- Name: idx_curtidas_postagem; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_curtidas_postagem ON public.curtidas USING btree ("postagemId");


--
-- Name: idx_postagens_autor; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_postagens_autor ON public.postagens USING btree ("autorId");


--
-- Name: idx_postagens_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_postagens_created ON public.postagens USING btree ("createdAt");


--
-- Name: seguidores_seguidor_id_seguido_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX seguidores_seguidor_id_seguido_id_key ON public.seguidores USING btree (seguidor_id, seguido_id);


--
-- Name: sessions_sessionToken_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "sessions_sessionToken_key" ON public.sessions USING btree ("sessionToken");


--
-- Name: usuarios_documento_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX usuarios_documento_key ON public.usuarios USING btree (documento);


--
-- Name: usuarios_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX usuarios_email_key ON public.usuarios USING btree (email);


--
-- Name: verification_tokens_identifier_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX verification_tokens_identifier_token_key ON public.verification_tokens USING btree (identifier, token);


--
-- Name: verification_tokens_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX verification_tokens_token_key ON public.verification_tokens USING btree (token);


--
-- Name: accounts accounts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: agendamentos agendamentos_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agendamentos
    ADD CONSTRAINT agendamentos_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: agendamentos agendamentos_prestador_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agendamentos
    ADD CONSTRAINT agendamentos_prestador_id_fkey FOREIGN KEY (prestador_id) REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: agendamentos agendamentos_servico_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agendamentos
    ADD CONSTRAINT agendamentos_servico_id_fkey FOREIGN KEY (servico_id) REFERENCES public.servicos(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: avaliacoes avaliacoes_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.avaliacoes
    ADD CONSTRAINT avaliacoes_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: avaliacoes avaliacoes_prestador_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.avaliacoes
    ADD CONSTRAINT avaliacoes_prestador_id_fkey FOREIGN KEY (prestador_id) REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: avaliacoes avaliacoes_servico_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.avaliacoes
    ADD CONSTRAINT avaliacoes_servico_id_fkey FOREIGN KEY (servico_id) REFERENCES public.servicos(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: carteiras carteiras_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carteiras
    ADD CONSTRAINT carteiras_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: dados_bancarios dados_bancarios_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dados_bancarios
    ADD CONSTRAINT dados_bancarios_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comentarios fk_comentarios_postagem; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comentarios
    ADD CONSTRAINT fk_comentarios_postagem FOREIGN KEY ("postagemId") REFERENCES public.postagens(id) ON DELETE CASCADE;


--
-- Name: comentarios fk_comentarios_usuario; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comentarios
    ADD CONSTRAINT fk_comentarios_usuario FOREIGN KEY ("usuarioId") REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: compartilhamentos fk_compartilhamentos_postagem; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compartilhamentos
    ADD CONSTRAINT fk_compartilhamentos_postagem FOREIGN KEY ("postagemId") REFERENCES public.postagens(id) ON DELETE CASCADE;


--
-- Name: compartilhamentos fk_compartilhamentos_usuario; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compartilhamentos
    ADD CONSTRAINT fk_compartilhamentos_usuario FOREIGN KEY ("usuarioId") REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: curtidas fk_curtidas_postagem; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.curtidas
    ADD CONSTRAINT fk_curtidas_postagem FOREIGN KEY ("postagemId") REFERENCES public.postagens(id) ON DELETE CASCADE;


--
-- Name: curtidas fk_curtidas_usuario; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.curtidas
    ADD CONSTRAINT fk_curtidas_usuario FOREIGN KEY ("usuarioId") REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: postagens fk_postagens_autor; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.postagens
    ADD CONSTRAINT fk_postagens_autor FOREIGN KEY ("autorId") REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: mensagens mensagens_destinatario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mensagens
    ADD CONSTRAINT mensagens_destinatario_id_fkey FOREIGN KEY (destinatario_id) REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: mensagens mensagens_remetente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mensagens
    ADD CONSTRAINT mensagens_remetente_id_fkey FOREIGN KEY (remetente_id) REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: mensagens mensagens_solicitacao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mensagens
    ADD CONSTRAINT mensagens_solicitacao_id_fkey FOREIGN KEY (solicitacao_id) REFERENCES public.solicitacoes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notificacoes notificacoes_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notificacoes
    ADD CONSTRAINT notificacoes_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: orcamentos orcamentos_prestador_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orcamentos
    ADD CONSTRAINT orcamentos_prestador_id_fkey FOREIGN KEY (prestador_id) REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: orcamentos orcamentos_solicitacao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orcamentos
    ADD CONSTRAINT orcamentos_solicitacao_id_fkey FOREIGN KEY (solicitacao_id) REFERENCES public.solicitacoes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: portfolio_albums portfolio_albums_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portfolio_albums
    ADD CONSTRAINT portfolio_albums_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: portfolio_comentarios portfolio_comentarios_media_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portfolio_comentarios
    ADD CONSTRAINT portfolio_comentarios_media_id_fkey FOREIGN KEY (media_id) REFERENCES public.portfolio_media(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: portfolio_comentarios portfolio_comentarios_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portfolio_comentarios
    ADD CONSTRAINT portfolio_comentarios_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: portfolio_media portfolio_media_album_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portfolio_media
    ADD CONSTRAINT portfolio_media_album_id_fkey FOREIGN KEY (album_id) REFERENCES public.portfolio_albums(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: portfolio_media portfolio_media_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portfolio_media
    ADD CONSTRAINT portfolio_media_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: seguidores seguidores_seguido_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seguidores
    ADD CONSTRAINT seguidores_seguido_id_fkey FOREIGN KEY (seguido_id) REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: seguidores seguidores_seguidor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seguidores
    ADD CONSTRAINT seguidores_seguidor_id_fkey FOREIGN KEY (seguidor_id) REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: servicos servicos_categoria_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.servicos
    ADD CONSTRAINT servicos_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categorias(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: servicos servicos_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.servicos
    ADD CONSTRAINT servicos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: sessions sessions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: solicitacoes solicitacoes_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solicitacoes
    ADD CONSTRAINT solicitacoes_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: solicitacoes solicitacoes_prestador_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solicitacoes
    ADD CONSTRAINT solicitacoes_prestador_id_fkey FOREIGN KEY (prestador_id) REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: solicitacoes solicitacoes_servico_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solicitacoes
    ADD CONSTRAINT solicitacoes_servico_id_fkey FOREIGN KEY (servico_id) REFERENCES public.servicos(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: transacoes transacoes_agendamento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transacoes
    ADD CONSTRAINT transacoes_agendamento_id_fkey FOREIGN KEY (agendamento_id) REFERENCES public.agendamentos(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: transacoes transacoes_carteira_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transacoes
    ADD CONSTRAINT transacoes_carteira_id_fkey FOREIGN KEY (carteira_id) REFERENCES public.carteiras(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: usuarios usuarios_patrocinador_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_patrocinador_id_fkey FOREIGN KEY (patrocinador_id) REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict snDjiTtm0C01yCaiaexuv4kUfFSbn0wYXB1GQ5mXPgv98B5buglTQLgnkGdXIVJ

