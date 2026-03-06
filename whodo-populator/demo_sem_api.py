#!/usr/bin/env python3
"""
Script de demonstração SEM necessidade de API Key
Gera dados mockados realistas para testar o fluxo completo

Uso:
    python demo_sem_api.py
    
Isso criará:
    - data/demo_scraping.json (dados mockados)
    - data/demo_normalizados.json (dados normalizados)
    - data/demo_seed.sql (SQL para inserir no banco)
    - data/demo_seed.ts (Seed TypeScript)
"""

import json
import random
from datetime import datetime
from normalizador import NormalizadorDados
from gerador_sql import GeradorSQL


# Dados mockados realistas para demonstração
DADOS_MOCKADOS = [
    {
        "nome": "João Silva Eletricista",
        "nome_fantasia": "JS Elétrica",
        "categoria": "Eletricista",
        "termo_busca": "eletricista Palmas PR",
        "endereco": "Rua das Flores, 123 - Centro, Palmas - PR, 85555-000",
        "cidade": "Palmas",
        "estado": "PR",
        "latitude": -26.4845,
        "longitude": -51.9902,
        "telefone": "(46) 99999-1111",
        "website": "",
        "instagram": "js_eletrica",
        "avaliacao_media": 4.8,
        "total_avaliacoes": 47,
        "sobre": "Especialista em instalações elétricas residenciais e comerciais. Mais de 15 anos de experiência. Atendimento 24 horas para emergências.",
        "disponibilidade": "Seg-Sex: 8h às 18h, Sáb: 8h às 12h",
        "foto_perfil": "https://randomuser.me/api/portraits/men/32.jpg",
        "origem": "google_maps"
    },
    {
        "nome": "Maria Oliveira Encanamentos",
        "nome_fantasia": "Oliveira Hidráulica",
        "categoria": "Encanador",
        "termo_busca": "encanador Palmas PR",
        "endereco": "Av. Brasil, 456 - Jardim América, Palmas - PR, 85555-010",
        "cidade": "Palmas",
        "estado": "PR",
        "latitude": -26.4860,
        "longitude": -51.9885,
        "telefone": "(46) 98888-2222",
        "website": "https://oliveirahidraulica.com.br",
        "instagram": "oliveira_hidraulica",
        "avaliacao_media": 4.9,
        "total_avaliacoes": 62,
        "sobre": "Serviços de encanamento, desentupimento, instalação de aquecedores e reparos em geral. Garantia de 90 dias em todos os serviços.",
        "disponibilidade": "Seg-Sáb: 7h às 19h",
        "foto_perfil": "https://randomuser.me/api/portraits/women/44.jpg",
        "origem": "google_maps"
    },
    {
        "nome": "Pedro Santos Construções",
        "nome_fantasia": "Santos Reformas",
        "categoria": "Pedreiro",
        "termo_busca": "pedreiro Palmas PR",
        "endereco": "Rua São Paulo, 789 - Vila Nova, Palmas - PR, 85555-020",
        "cidade": "Palmas",
        "estado": "PR",
        "latitude": -26.4820,
        "longitude": -51.9920,
        "telefone": "(46) 97777-3333",
        "website": "",
        "instagram": "santos_reformas_pr",
        "avaliacao_media": 4.7,
        "total_avaliacoes": 38,
        "sobre": "Construção civil, reformas, acabamentos, pintura e pequenos reparos. Orçamento sem compromisso.",
        "disponibilidade": "Seg-Sex: 7h às 17h",
        "foto_perfil": "https://randomuser.me/api/portraits/men/55.jpg",
        "origem": "google_maps"
    },
    {
        "nome": "Ana Costa Pinturas",
        "nome_fantasia": "Costa Pinturas",
        "categoria": "Pintor",
        "termo_busca": "pintor Palmas PR",
        "endereco": "Rua Minas Gerais, 321 - Centro, Palmas - PR, 85555-030",
        "cidade": "Palmas",
        "estado": "PR",
        "latitude": -26.4855,
        "longitude": -51.9910,
        "telefone": "(46) 96666-4444",
        "website": "https://costapinturas.com",
        "instagram": "costa_pinturas",
        "avaliacao_media": 4.6,
        "total_avaliacoes": 29,
        "sobre": "Pintura residencial e comercial, texturas, grafiato, massa corrida. Trabalho limpo e profissional.",
        "disponibilidade": "Seg-Sáb: 8h às 18h",
        "foto_perfil": "https://randomuser.me/api/portraits/women/28.jpg",
        "origem": "google_maps"
    },
    {
        "nome": "Carlos Mendes Marcenaria",
        "nome_fantasia": "Mendes Móveis",
        "categoria": "Marceneiro",
        "termo_busca": "marceneiro Palmas PR",
        "endereco": "Rua Paraná, 654 - Industrial, Palmas - PR, 85555-040",
        "cidade": "Palmas",
        "estado": "PR",
        "latitude": -26.4870,
        "longitude": -51.9870,
        "telefone": "(46) 95555-5555",
        "website": "",
        "instagram": "mendes_moveis",
        "avaliacao_media": 4.9,
        "total_avaliacoes": 53,
        "sobre": "Móveis sob medida, cozinhas planejadas, armários, portas e janelas. Madeira de qualidade e acabamento fino.",
        "disponibilidade": "Seg-Sex: 8h às 18h",
        "foto_perfil": "https://randomuser.me/api/portraits/men/67.jpg",
        "origem": "google_maps"
    },
    {
        "nome": "Fernanda Lima Diárias",
        "nome_fantasia": "Lima Limpeza",
        "categoria": "Diarista",
        "termo_busca": "diarista Palmas PR",
        "endereco": "Rua Rio Grande do Sul, 987 - Jardim Europa, Palmas - PR, 85555-050",
        "cidade": "Palmas",
        "estado": "PR",
        "latitude": -26.4830,
        "longitude": -51.9930,
        "telefone": "(46) 94444-6666",
        "website": "",
        "instagram": "lima_limpeza_pr",
        "avaliacao_media": 4.8,
        "total_avaliacoes": 41,
        "sobre": "Limpeza residencial e comercial, organização de ambientes, lavagem de roupas e passadoria. Referências disponíveis.",
        "disponibilidade": "Seg-Sáb: 7h às 17h",
        "foto_perfil": "https://randomuser.me/api/portraits/women/52.jpg",
        "origem": "google_maps"
    },
    {
        "nome": "Ricardo Souza Jardins",
        "nome_fantasia": "Souza Paisagismo",
        "categoria": "Jardineiro",
        "termo_busca": "jardineiro Palmas PR",
        "endereco": "Av. Curitiba, 147 - Jardim das Palmeiras, Palmas - PR, 85555-060",
        "cidade": "Palmas",
        "estado": "PR",
        "latitude": -26.4880,
        "longitude": -51.9860,
        "telefone": "(46) 93333-7777",
        "website": "https://souzajardins.com.br",
        "instagram": "souza_paisagismo",
        "avaliacao_media": 4.7,
        "total_avaliacoes": 35,
        "sobre": "Paisagismo, manutenção de jardins, poda de árvores, plantio de grama e jardinagem em geral.",
        "disponibilidade": "Seg-Sáb: 7h às 18h",
        "foto_perfil": "https://randomuser.me/api/portraits/men/41.jpg",
        "origem": "google_maps"
    },
    {
        "nome": "Juliana Martins Fotografia",
        "nome_fantasia": "JM Fotos",
        "categoria": "Fotógrafo",
        "termo_busca": "fotógrafo Palmas PR",
        "endereco": "Rua Santa Catarina, 258 - Centro, Palmas - PR, 85555-070",
        "cidade": "Palmas",
        "estado": "PR",
        "latitude": -26.4815,
        "longitude": -51.9945,
        "telefone": "(46) 92222-8888",
        "website": "https://jmfotos.com.br",
        "instagram": "jm_fotografia",
        "avaliacao_media": 4.9,
        "total_avaliacoes": 78,
        "sobre": "Fotografia de casamentos, aniversários, ensaios e eventos corporativos. Edição profissional incluída.",
        "disponibilidade": "Agendamento prévio",
        "foto_perfil": "https://randomuser.me/api/portraits/women/35.jpg",
        "origem": "google_maps"
    },
    {
        "nome": "Bruno Alves Personal",
        "nome_fantasia": "Alves Fitness",
        "categoria": "Personal Trainer",
        "termo_busca": "personal trainer Palmas PR",
        "endereco": "Rua Goiás, 369 - Vila Operária, Palmas - PR, 85555-080",
        "cidade": "Palmas",
        "estado": "PR",
        "latitude": -26.4895,
        "longitude": -51.9855,
        "telefone": "(46) 91111-9999",
        "website": "",
        "instagram": "alves_fitness",
        "avaliacao_media": 4.8,
        "total_avaliacoes": 44,
        "sobre": "Treinamento personalizado, emagrecimento, hipertrofia, preparação física. Atendo em academias ou domicílio.",
        "disponibilidade": "Seg-Sáb: 6h às 21h",
        "foto_perfil": "https://randomuser.me/api/portraits/men/73.jpg",
        "origem": "google_maps"
    },
    {
        "nome": "Patrícia Rocha Beleza",
        "nome_fantasia": "Rocha Studio",
        "categoria": "Cabeleireiro",
        "termo_busca": "cabeleireiro Palmas PR",
        "endereco": "Av. Mato Grosso, 741 - Centro, Palmas - PR, 85555-090",
        "cidade": "Palmas",
        "estado": "PR",
        "latitude": -26.4805,
        "longitude": -51.9955,
        "telefone": "(46) 90000-0000",
        "website": "https://rochastudio.com.br",
        "instagram": "rocha_studio_beleza",
        "avaliacao_media": 4.7,
        "total_avaliacoes": 56,
        "sobre": "Cortes femininos e masculinos, coloração, mechas, tratamentos capilares e penteados para eventos.",
        "disponibilidade": "Ter-Sáb: 9h às 19h",
        "foto_perfil": "https://randomuser.me/api/portraits/women/61.jpg",
        "origem": "google_maps"
    }
]


def gerar_mais_dados(quantidade=20):
    """Gera dados mockados adicionais variando os existentes"""
    
    nomes_base = [
        ("Roberto", "Silva"), ("Mariana", "Santos"), ("Lucas", "Oliveira"),
        ("Camila", "Souza"), ("Gabriel", "Pereira"), ("Larissa", "Costa"),
        ("Matheus", "Rodrigues"), ("Amanda", "Almeida"), ("Felipe", "Nascimento"),
        ("Isabela", "Lima"), ("Thiago", "Carvalho"), ("Bianca", "Araújo"),
        ("Diego", "Fernandes"), ("Natália", "Barbosa"), ("Leonardo", "Ribeiro"),
        ("Carolina", "Gomes"), ("André", "Martins"), ("Letícia", "Cardoso"),
        ("Rafael", "Dias"), ("Vanessa", "Castro")
    ]
    
    categorias = [
        ("Eletricista", "eletricista"),
        ("Encanador", "encanador"),
        ("Pedreiro", "pedreiro"),
        ("Pintor", "pintor"),
        ("Marceneiro", "marceneiro"),
        ("Diarista", "diarista"),
        ("Jardineiro", "jardineiro"),
        ("Fotógrafo", "fotógrafo"),
        ("Personal Trainer", "personal trainer"),
        ("Cabeleireiro", "cabeleireiro"),
        ("Barbeiro", "barbeiro"),
        ("Manicure", "manicure"),
        ("Técnico de Informática", "técnico informática"),
        ("Designer Gráfico", "designer gráfico"),
        ("Mecânico", "mecânico"),
    ]
    
    bairros = [
        "Centro", "Jardim América", "Vila Nova", "Jardim Europa",
        "Industrial", "Vila Operária", "Jardim das Palmeiras"
    ]
    
    ruas = [
        "Rua das Flores", "Av. Brasil", "Rua São Paulo", "Rua Minas Gerais",
        "Rua Paraná", "Rua Rio Grande do Sul", "Av. Curitiba",
        "Rua Santa Catarina", "Rua Goiás", "Av. Mato Grosso"
    ]
    
    novos_dados = []
    
    for i in range(quantidade):
        nome, sobrenome = nomes_base[i % len(nomes_base)]
        categoria, termo = categorias[i % len(categorias)]
        
        # Varia coordenadas ligeiramente
        lat = -26.4841 + random.uniform(-0.008, 0.008)
        lon = -51.9905 + random.uniform(-0.008, 0.008)
        
        novo = {
            "nome": f"{nome} {sobrenome} {categoria}",
            "nome_fantasia": f"{nome} {categoria}s",
            "categoria": categoria,
            "termo_busca": f"{termo} Palmas PR",
            "endereco": f"{ruas[i % len(ruas)]}, {random.randint(100, 999)} - {bairros[i % len(bairros)]}, Palmas - PR, 85555-{random.randint(100, 999):03d}",
            "cidade": "Palmas",
            "estado": "PR",
            "latitude": round(lat, 6),
            "longitude": round(lon, 6),
            "telefone": f"(46) 9{random.randint(1000, 9999)}-{random.randint(1000, 9999)}",
            "website": random.choice(["", f"https://{nome.lower()}{categoria.lower()}.com.br"]),
            "instagram": f"{nome.lower()}_{categoria.lower()}_pr",
            "avaliacao_media": round(random.uniform(4.0, 5.0), 1),
            "total_avaliacoes": random.randint(10, 100),
            "sobre": f"Profissional de {categoria} em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.",
            "disponibilidade": random.choice([
                "Seg-Sex: 8h às 18h",
                "Seg-Sáb: 7h às 19h",
                "Agendamento prévio"
            ]),
            "foto_perfil": f"https://randomuser.me/api/portraits/{random.choice(['men', 'women'])}/{random.randint(1, 99)}.jpg",
            "origem": "google_maps"
        }
        
        novos_dados.append(novo)
    
    return novos_dados


def main():
    """Executa a demonstração completa"""
    print("=" * 60)
    print("🎬 DEMONSTRAÇÃO - Whodo Database Populator")
    print("=" * 60)
    print("\n⚠️  Modo demonstração - SEM necessidade de API Key")
    print("   Gerando dados mockados realistas...\n")
    
    # Combina dados fixos com dados gerados
    todos_dados = DADOS_MOCKADOS + gerar_mais_dados(20)
    
    # Embaralha
    random.shuffle(todos_dados)
    
    print(f"✅ Gerados {len(todos_dados)} profissionais mockados\n")
    
    # Salva scraping
    arquivo_scraping = "data/demo_scraping.json"
    with open(arquivo_scraping, 'w', encoding='utf-8') as f:
        json.dump(todos_dados, f, ensure_ascii=False, indent=2)
    print(f"💾 Scraping salvo: {arquivo_scraping}")
    
    # Normaliza
    print("\n" + "-" * 60)
    normalizador = NormalizadorDados()
    normalizados = normalizador.normalizar_todos(todos_dados)
    
    arquivo_normalizado = "data/demo_normalizados.json"
    normalizador.salvar_json(normalizados, arquivo_normalizado)
    
    # Gera SQL e TS
    print("\n" + "-" * 60)
    gerador = GeradorSQL()
    
    arquivo_sql = "data/demo_seed.sql"
    arquivo_ts = "data/demo_seed.ts"
    
    gerador.gerar_sql_completo(normalizados, arquivo_sql)
    gerador.gerar_typescript_seed(normalizados, arquivo_ts)
    
    # Resumo
    print("\n" + "=" * 60)
    print("✅ DEMONSTRAÇÃO CONCLUÍDA!")
    print("=" * 60)
    print(f"\n📁 Arquivos gerados:")
    print(f"   📄 {arquivo_scraping}")
    print(f"   📄 {arquivo_normalizado}")
    print(f"   📄 {arquivo_sql}")
    print(f"   📄 {arquivo_ts}")
    print(f"\n📝 Para testar no seu banco:")
    print(f"   psql -U seu_usuario -d whodo -f {arquivo_sql}")
    print(f"\n📝 Ou use o seed TypeScript:")
    print(f"   npx ts-node {arquivo_ts}")
    print("=" * 60)


if __name__ == "__main__":
    main()
