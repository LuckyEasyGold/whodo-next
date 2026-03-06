#!/usr/bin/env python3
"""
Whodo Database Populator
Script principal para popular o banco de dados do Whodo com dados do Google Maps

Fluxo:
1. Scraper: Coleta dados do Google Maps via Outscraper API
2. Normalizador: Limpa e normaliza os dados
3. Gerador SQL/TS: Cria scripts para inserção no banco

Uso:
    python main.py --modo completo
    python main.py --modo scraping
    python main.py --modo normalizar --arquivo dados.json
    python main.py --modo gerar --arquivo dados.json
"""

import os
import sys
import json
import argparse
from datetime import datetime
from dotenv import load_dotenv

# Carrega variáveis de ambiente
load_dotenv()

# Importa módulos locais
from scraper import GoogleMapsScraper
from normalizador import NormalizadorDados
from gerador_sql import GeradorSQL
from config import CIDADE, ESTADO


def executar_scraping():
    """Executa apenas a etapa de scraping"""
    print("\n" + "="*60)
    print("🔍 ETAPA 1: SCRAPING DO GOOGLE MAPS")
    print("="*60)
    
    try:
        scraper = GoogleMapsScraper()
        scraper.executar_scraping()
        arquivo = scraper.salvar_json()
        return arquivo
    except Exception as e:
        print(f"❌ Erro no scraping: {str(e)}")
        sys.exit(1)


def executar_normalizacao(arquivo_entrada: str) -> str:
    """Executa apenas a etapa de normalização"""
    print("\n" + "="*60)
    print("🧹 ETAPA 2: NORMALIZAÇÃO DE DADOS")
    print("="*60)
    
    try:
        # Carrega dados
        with open(arquivo_entrada, 'r', encoding='utf-8') as f:
            dados = json.load(f)
        
        print(f"📂 Carregados {len(dados)} registros de: {arquivo_entrada}")
        
        # Normaliza
        normalizador = NormalizadorDados()
        normalizados = normalizador.normalizar_todos(dados)
        
        # Salva
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        arquivo_saida = f"data/normalizados_{CIDADE.lower()}_{ESTADO.lower()}_{timestamp}.json"
        normalizador.salvar_json(normalizados, arquivo_saida)
        
        return arquivo_saida
        
    except Exception as e:
        print(f"❌ Erro na normalização: {str(e)}")
        sys.exit(1)


def executar_geracao(arquivo_entrada: str) -> tuple:
    """Executa apenas a etapa de geração SQL/TS"""
    print("\n" + "="*60)
    print("📝 ETAPA 3: GERAÇÃO DE SCRIPTS")
    print("="*60)
    
    try:
        # Carrega dados
        with open(arquivo_entrada, 'r', encoding='utf-8') as f:
            dados = json.load(f)
        
        print(f"📂 Carregados {len(dados)} registros de: {arquivo_entrada}")
        
        # Gera scripts
        gerador = GeradorSQL()
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        arquivo_sql = f"data/seed_{CIDADE.lower()}_{ESTADO.lower()}_{timestamp}.sql"
        arquivo_ts = f"data/seed_{CIDADE.lower()}_{ESTADO.lower()}_{timestamp}.ts"
        
        gerador.gerar_sql_completo(dados, arquivo_sql)
        gerador.gerar_typescript_seed(dados, arquivo_ts)
        
        return arquivo_sql, arquivo_ts
        
    except Exception as e:
        print(f"❌ Erro na geração: {str(e)}")
        sys.exit(1)


def executar_completo():
    """Executa o fluxo completo: scraping -> normalização -> geração"""
    print("\n" + "="*60)
    print("🚀 EXECUÇÃO COMPLETA - WHODO DATABASE POPULATOR")
    print("="*60)
    
    start_time = datetime.now()
    
    # Etapa 1: Scraping
    arquivo_scraping = executar_scraping()
    
    # Etapa 2: Normalização
    arquivo_normalizado = executar_normalizacao(arquivo_scraping)
    
    # Etapa 3: Geração
    arquivo_sql, arquivo_ts = executar_geracao(arquivo_normalizado)
    
    # Resumo
    end_time = datetime.now()
    duration = (end_time - start_time).total_seconds()
    
    print("\n" + "="*60)
    print("✅ PROCESSO CONCLUÍDO COM SUCESSO!")
    print("="*60)
    print(f"\n📊 RESUMO:")
    print(f"   ⏱️  Duração: {duration:.1f} segundos")
    print(f"\n📁 ARQUIVOS GERADOS:")
    print(f"   📄 Scraping:     {arquivo_scraping}")
    print(f"   📄 Normalizado:  {arquivo_normalizado}")
    print(f"   📄 SQL:          {arquivo_sql}")
    print(f"   📄 TypeScript:   {arquivo_ts}")
    print(f"\n📝 PRÓXIMOS PASSOS:")
    print(f"   1. Execute o SQL no seu banco de dados:")
    print(f"      psql -U seu_usuario -d seu_banco -f {arquivo_sql}")
    print(f"   2. Ou use o seed TypeScript:")
    print(f"      npx ts-node {arquivo_ts}")
    print(f"   3. Ou copie o conteúdo do arquivo .ts para prisma/seed.ts")
    print("="*60)


def main():
    """Função principal com parser de argumentos"""
    parser = argparse.ArgumentParser(
        description='Whodo Database Populator - Popula o banco com dados do Google Maps',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Exemplos:
  # Executar fluxo completo
  python main.py --modo completo
  
  # Apenas scraping
  python main.py --modo scraping
  
  # Normalizar dados existentes
  python main.py --modo normalizar --arquivo data/scraping_palmas_pr_20240101.json
  
  # Gerar SQL/TS de dados existentes
  python main.py --modo gerar --arquivo data/normalizados_palmas_pr_20240101.json
        """
    )
    
    parser.add_argument(
        '--modo', 
        choices=['completo', 'scraping', 'normalizar', 'gerar'],
        default='completo',
        help='Modo de execução (padrão: completo)'
    )
    
    parser.add_argument(
        '--arquivo',
        type=str,
        help='Arquivo de entrada (para modos normalizar e gerar)'
    )
    
    args = parser.parse_args()
    
    # Validações
    if args.modo in ['normalizar', 'gerar'] and not args.arquivo:
        parser.error(f"O modo '{args.modo}' requer o parâmetro --arquivo")
    
    if args.arquivo and not os.path.exists(args.arquivo):
        print(f"❌ Arquivo não encontrado: {args.arquivo}")
        sys.exit(1)
    
    # Executa conforme modo
    if args.modo == 'completo':
        executar_completo()
    elif args.modo == 'scraping':
        arquivo = executar_scraping()
        print(f"\n✅ Scraping concluído! Arquivo: {arquivo}")
    elif args.modo == 'normalizar':
        arquivo = executar_normalizacao(args.arquivo)
        print(f"\n✅ Normalização concluída! Arquivo: {arquivo}")
    elif args.modo == 'gerar':
        sql, ts = executar_geracao(args.arquivo)
        print(f"\n✅ Geração concluída!")
        print(f"   SQL: {sql}")
        print(f"   TS:  {ts}")


if __name__ == "__main__":
    main()
