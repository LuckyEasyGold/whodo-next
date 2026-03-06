# 🚀 Whodo Database Populator

Ferramenta completa para popular o banco de dados do **Whodo** com dados reais de profissionais do **Google Maps**.

## 📋 O que é?

Este projeto resolve o problema clássico de **"cold start"** de marketplaces: como ter profissionais cadastrados antes de ter usuários buscando por eles.

A solução coleta dados públicos do Google Maps, normaliza e gera scripts prontos para inserir no banco de dados do Whodo.

## ✨ Funcionalidades

- 🔍 **Scraper Inteligente**: Coleta dados do Google Maps via API Outscraper
- 🧹 **Normalização Automática**: Limpa e padroniza telefones, endereços, coordenadas
- 📝 **Geração de Scripts**: Cria SQL puro ou TypeScript (Prisma)
- 🗺️ **Múltiplas Categorias**: Busca em 30+ categorias de profissionais
- 🔄 **Remoção de Duplicatas**: Evita cadastros repetidos
- ⚙️ **Altamente Configurável**: Ajuste filtros, limites e parâmetros

## 🛠️ Tecnologias

- **Python 3.8+**
- **Outscraper API** (Google Maps)
- **Prisma ORM** (para o seed TypeScript)

## 📦 Instalação

### 1. Clone ou copie este diretório

```bash
cd whodo-populator
```

### 2. Crie um ambiente virtual (recomendado)

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 3. Instale as dependências

```bash
pip install -r requirements.txt
```

### 4. Configure a API Key

```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione sua chave da API Outscraper:

```env
OUTSCRAPER_API_KEY=sua_chave_aqui
```

> 🔑 **Obtenha sua API Key gratuita** em: https://outscraper.com/
> - Plano gratuito: 500 requisições/mês
> - Plano Starter: $9/mês (5.000 requisições)

## ⚙️ Configuração

Edite o arquivo `config.py` para personalizar:

```python
# Cidade e estado para busca
CIDADE = "Palmas"
ESTADO = "PR"

# Categorias de profissionais para buscar
CATEGORIAS_BUSCA = {
    "eletricista": "Eletricista",
    "encanador": "Encanador",
    # ... adicione mais
}

# Limite de resultados por categoria
LIMITE_POR_CATEGORIA = 50

# Filtros
SOMENTE_COM_TELEFONE = True
NOTA_MINIMA = 0
```

## 🚀 Uso

### Modo Completo (Recomendado)

Executa todo o fluxo: scraping → normalização → geração de scripts:

```bash
python main.py --modo completo
```

### Modos Individuais

**Apenas Scraping:**
```bash
python main.py --modo scraping
```

**Normalizar dados existentes:**
```bash
python main.py --modo normalizar --arquivo data/scraping_palmas_pr_20240101.json
```

**Gerar SQL/TS de dados existentes:**
```bash
python main.py --modo gerar --arquivo data/normalizados_palmas_pr_20240101.json
```

## 📁 Estrutura de Arquivos

Após execução, você terá:

```
whodo-populator/
├── data/
│   ├── scraping_palmas_pr_20240101_120000.json     # Dados brutos
│   ├── normalizados_palmas_pr_20240101_120030.json # Dados limpos
│   ├── seed_palmas_pr_20240101_120045.sql          # Script SQL
│   └── seed_palmas_pr_20240101_120045.ts           # Seed TypeScript
├── config.py
├── scraper.py
├── normalizador.py
├── gerador_sql.py
├── main.py
└── README.md
```

## 💾 Importando para o Banco

### Opção 1: SQL Puro (Mais Rápido)

```bash
# PostgreSQL local
psql -U seu_usuario -d whodo -f data/seed_palmas_pr_20240101_120045.sql

# Ou com senha
PGPASSWORD=sua_senha psql -U seu_usuario -h localhost -d whodo -f data/seed_palmas_pr_20240101_120045.sql
```

### Opção 2: Seed TypeScript (Prisma)

1. Copie o arquivo `.ts` gerado para a pasta do seu projeto:

```bash
cp data/seed_palmas_pr_20240101_120045.ts /caminho/do/whodo-next/prisma/seed.ts
```

2. Execute o seed:

```bash
cd /caminho/do/whodo-next
npx ts-node prisma/seed.ts
```

Ou configure no `package.json`:

```json
{
  "scripts": {
    "db:seed": "ts-node prisma/seed.ts"
  }
}
```

E execute:

```bash
npm run db:seed
```

### Opção 3: Supabase (Produção)

Se estiver usando Supabase:

1. Acesse o Dashboard do Supabase
2. Vá em **SQL Editor**
3. Cole o conteúdo do arquivo `.sql` gerado
4. Execute

## 📊 Estimativas

| Categoria | Profissionais Estimados |
|-----------|------------------------|
| Construção (eletricista, pedreiro, pintor, etc.) | 100-150 |
| Beleza (cabeleireiro, manicure, barbeiro, etc.) | 80-120 |
| Serviços Domésticos (diarista, faxineira) | 40-60 |
| Tecnologia (técnico informática, designer) | 20-40 |
| Automotivo (mecânico, funileiro) | 30-50 |
| **TOTAL ESTIMADO** | **270-420** |

> 💡 **Dica**: Com o plano gratuito da Outscraper (500 req/mês), você pode coletar ~400-500 profissionais por mês.

## 🔧 Personalização Avançada

### Adicionar Novas Categorias

Em `config.py`, adicione ao dicionário `CATEGORIAS_BUSCA`:

```python
CATEGORIAS_BUSCA = {
    # ... categorias existentes
    "novo_termo_busca": "Nome da Categoria no Banco",
    "professor de yoga": "Professor de Yoga",
    "tradutor": "Tradutor",
}
```

### Mudar Cidade

```python
CIDADE = "Curitiba"
ESTADO = "PR"
LATITUDE_CENTRO = -25.4284
LONGITUDE_CENTRO = -49.2733
```

### Aumentar Limite

```python
LIMITE_POR_CATEGORIA = 100  # Máximo recomendado
```

## ⚠️ Considerações Legais e Éticas

1. **Dados Públicos**: O scraper coleta apenas dados públicos do Google Maps
2. **LGPD**: Os dados são de natureza comercial (CNPJ/empresas)
3. **Reivindicação**: Recomendamos marcar perfis como `verificado: false` para que profissionais possam reivindicar
4. **Opt-out**: Forneça um mecanismo para profissionais solicitarem remoção

## 🐛 Troubleshooting

### Erro: "API Key não encontrada"
```
❌ Verifique se o arquivo .env existe e contém OUTSCRAPER_API_KEY
```

### Erro: "Limite de requisições excedido"
```
❌ Você atingiu o limite do plano gratuito. Aguarde o próximo mês ou upgrade.
```

### Poucos resultados
```
⚠️ Tente aumentar o RAIO_KM ou reduzir filtros (SOMENTE_COM_TELEFONE = False)
```

### Erro de encoding
```bash
# Certifique-se de usar UTF-8
chcp 65001  # Windows
export PYTHONIOENCODING=utf-8  # Linux/Mac
```

## 📝 Campos Mapeados

| Google Maps | Whodo (Usuario) | Observação |
|-------------|-----------------|------------|
| name | nome | Normalizado |
| phone | telefone | Formato (XX) XXXXX-XXXX |
| address | endereco | Completo |
| latitude | latitude | Decimal |
| longitude | longitude | Decimal |
| rating | avaliacao_media | 0-5 |
| reviews | - | Usado para filtro |
| site | website | URL completa |
| photos[0] | foto_perfil | Primeira foto |
| description | sobre | Limitado a 1000 chars |
| working_hours | disponibilidade | Horário de funcionamento |

## 🎯 Roadmap

- [ ] Suporte a múltiplas cidades simultâneas
- [ ] Integração direta com Supabase
- [ ] Agendamento de coletas periódicas
- [ ] Detecção automática de duplicatas por CNPJ
- [ ] Enriquecimento de dados via Instagram API

## 📄 Licença

Este projeto é fornecido como ferramenta de auxílio. O uso é de responsabilidade do usuário, respeitando os termos de serviço do Google Maps e legislações locais.

## 🤝 Contribuição

Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas categorias
- Melhorar a documentação
- Adicionar novas fontes de dados

---

**Desenvolvido para o projeto Whodo** 🚀
