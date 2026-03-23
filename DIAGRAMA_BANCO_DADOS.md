# Diagrama do Banco de Dados - Whodo

```mermaid
erDiagram
    USUARIO {
        int id PK
        string nome
        string email UK
        string documento UK
        string tipo
        int avaliacao_media
        bool verificado
    }

    SERVICO {
        int id PK
        int usuario_id FK
        int categoria_id FK
        string titulo
        decimal preco_base
        bool destaque
    }

    CATEGORIA {
        int id PK
        string nome
    }

    AGENDAMENTO {
        int id PK
        int cliente_id FK
        int prestador_id FK
        int servico_id FK
        string status
        datetime data_agendamento
        decimal valor_total
        bool valor_pago
    }

    AVALIACAO {
        int id PK
        int cliente_id FK
        int prestador_id FK
        int servico_id FK
        decimal nota
        string comentario
    }

    SOLICITACAO {
        int id PK
        int cliente_id FK
        int servico_id FK
        int prestador_id FK
        string status
    }

    ORCAMENTO {
        int id PK
        int solicitacao_id FK
        int prestador_id FK
        decimal valor
        string status
    }

    MENSAGEM {
        int id PK
        int remetente_id FK
        int destinatario_id FK
        string conteudo
        bool lida
    }

    NOTIFICACAO {
        int id PK
        int usuario_id FK
        string tipo
        string titulo
        bool lida
    }

    CARTEIRA {
        int id PK
        int usuario_id FK UK
        decimal saldo
        decimal saldo_pendente
    }

    TRANSACAO {
        int id PK
        int carteira_id FK
        int agendamento_id FK
        string tipo
        decimal valor
        string status
    }

    DADOS_BANCARIOS {
        int id PK
        int usuario_id FK UK
        string chave_pix
        string banco_nome
        bool verificado
    }

    PORTFOLIO_MEDIA {
        int id PK
        int usuario_id FK
        int album_id FK
        string url
        string tipo
    }

    PORTFOLIO_ALBUM {
        int id PK
        int usuario_id FK
        string nome
    }

    POSTAGEM {
        int id PK
        int autorId FK
        string conteudo
        int visualizacoes
        bool publico
    }

    SEGUIDOR {
        int id PK
        int seguidor_id FK
        int seguido_id FK
    }

    ACCOUNT {
        string id PK
        int userId FK
        string provider
        string providerAccountId
    }

    SESSION {
        string id PK
        string sessionToken UK
        int userId FK
    }

    USUARIO ||--o{ SERVICO : "oferece"
    USUARIO ||--o{ AVALIACAO : "recebe"
    USUARIO ||--o{ AGENDAMENTO : "como cliente"
    USUARIO ||--o{ AGENDAMENTO : "como prestador"
    USUARIO ||--o{ SOLICITACAO : "como cliente"
    USUARIO ||--o{ SOLICITACAO : "como prestador"
    USUARIO ||--o{ MENSAGEM : "envia"
    USUARIO ||--o{ MENSAGEM : "recebe"
    USUARIO ||--o{ NOTIFICACAO : "recebe"
    USUARIO ||--o{ CARTEIRA : "possui"
    USUARIO ||--o{ DADOS_BANCARIOS : "possui"
    USUARIO ||--o{ PORTFOLIO_MEDIA : "possui"
    USUARIO ||--o{ PORTFOLIO_ALBUM : "possui"
    USUARIO ||--o{ POSTAGEM : "cria"
    USUARIO ||--o{ SEGUIDOR : "segue"
    USUARIO ||--o{ SEGUIDOR : "é seguido"
    USUARIO ||--o{ ACCOUNT : "autenticação"
    USUARIO ||--o{ SESSION : "sessão"

    CATEGORIA ||--o{ SERVICO : "categoriza"

    SERVICO ||--o{ AGENDAMENTO : "agendado"
    SERVICO ||--o{ AVALIACAO : "avaliado"
    SERVICO ||--o{ SOLICITACAO : "solicitado"

    AGENDAMENTO ||--o{ TRANSACAO : "pagamento"
    AGENDAMENTO ||--o{ HISTORICO_AGENDAMENTO : "log"

    SOLICITACAO ||--o{ ORCAMENTO : "recebe"
    SOLICITACAO ||--o{ MENSAGEM : "conversa"

    CARTEIRA ||--o{ TRANSACAO : "registra"

    PORTFOLIO_ALBUM ||--o{ PORTFOLIO_MEDIA : "contém"

    POSTAGEM ||--o{ POSTAGEM_COMENTARIO : "comentários"
    POSTAGEM ||--o{ POSTAGEM_CURTIDA : "curtidas"
    POSTAGEM ||--o{ POSTAGEM_COMPARTILHAMENTO : "compartilhamentos"
    POSTAGEM ||--o{ POSTAGEM_SALVA : "salva"

    HISTORICO_AGENDAMENTO {
        int id PK
        int agendamentoId FK
        int usuarioId FK
        string acao
        string status_anterior
        string status_novo
    }

    POSTAGEM_CURTIDA {
        int id PK
        int postagemId FK
        int usuarioId FK
    }

    POSTAGEM_COMENTARIO {
        int id PK
        int postagemId FK
        int usuarioId FK
        string conteudo
    }

    POSTAGEM_COMPARTILHAMENTO {
        int id PK
        int postagemId FK
        int usuarioId FK
    }

    POSTAGEM_SALVA {
        int id PK
        int postagemId FK
        int usuarioId FK
    }

    PORTFOLIO_COMENTARIO {
        int id PK
        int media_id FK
        int usuario_id FK
        string texto
    }

    VERIFICATION_TOKEN {
        string identifier
        string token UK
        datetime expires
    }
```

## Legenda

- **PK** = Primary Key (Chave Primária)
- **UK** = Unique (Único)
- **FK** = Foreign Key (Chave Estrangeira)
- **||--o{** = Um para Muitos (One-to-Many)
- **||--||** = Um para Um (One-to-One)

## Resumo das Relações

| De | Para | Tipo |
|----|------|------|
| Usuario | Servico | 1:N |
| Usuario | Avaliacao | 1:N |
| Usuario | Agendamento | 1:N (como cliente e prestador) |
| Usuario | Carteira | 1:1 |
| Usuario | DadosBancarios | 1:1 |
| Categoria | Servico | 1:N |
| Servico | Agendamento | 1:N |
| Servico | Avaliacao | 1:N |
| Solicitacao | Orcamento | 1:N |
| Solicitacao | Mensagem | 1:N |
| Carteira | Transacao | 1:N |
| PortfolioAlbum | PortfolioMedia | 1:N |
| Postagem | PostagemCurtida | 1:N |
| Postagem | PostagemComentario | 1:N |
| Postagem | PostagemCompartilhamento | 1:N |
| Postagem | PostagemSalva | 1:N |
