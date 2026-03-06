"""
Scraper de Google Maps para popular o banco de dados do Whodo
Usa a API do Outscraper para coleta de dados
"""

import os
import json
import time
from typing import List, Dict, Any, Optional
from outscraper import ApiClient
from config import (
    CIDADE, ESTADO, CATEGORIAS_BUSCA, LIMITE_POR_CATEGORIA,
    SOMENTE_COM_TELEFONE, SOMENTE_COM_AVALIACAO, NOTA_MINIMA, MIN_AVALIACOES
)


class GoogleMapsScraper:
    """Classe para fazer scraping de dados do Google Maps"""
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Inicializa o scraper
        
        Args:
            api_key: Chave da API do Outscraper (opcional, pode usar variável de ambiente)
        """
        self.api_key = api_key or os.getenv('OUTSCRAPER_API_KEY')
        if not self.api_key:
            raise ValueError(
                "API Key do Outscraper não encontrada. "
                "Defina a variável de ambiente OUTSCRAPER_API_KEY ou passe como parâmetro."
            )
        
        self.client = ApiClient(api_key=self.api_key)
        self.resultados = []
        
    def buscar_categoria(self, termo_busca: str, categoria_nome: str) -> List[Dict[str, Any]]:
        """
        Busca profissionais de uma categoria específica
        
        Args:
            termo_busca: Termo de busca (ex: "eletricista")
            categoria_nome: Nome da categoria no banco (ex: "Eletricista")
            
        Returns:
            Lista de dicionários com os dados dos profissionais
        """
        query = f"{termo_busca} {CIDADE} {ESTADO}"
        print(f"🔍 Buscando: {query}")
        
        try:
            # Faz a busca na API do Outscraper
            results = self.client.google_maps_search(
                query=query,
                limit=LIMITE_POR_CATEGORIA,
                language='pt',
                region='br'
            )
            
            profissionais = []
            
            for item in results:
                # Extrai os dados relevantes
                profissional = self._extrair_dados(item, categoria_nome)
                
                if profissional and self._validar_profissional(profissional):
                    profissionais.append(profissional)
            
            print(f"  ✅ Encontrados {len(profissionais)} profissionais válidos")
            return profissionais
            
        except Exception as e:
            print(f"  ❌ Erro na busca: {str(e)}")
            return []
    
    def _extrair_dados(self, item: Dict, categoria_nome: str) -> Optional[Dict]:
        """
        Extrai e normaliza os dados de um item do Google Maps
        
        Args:
            item: Item retornado pela API
            categoria_nome: Nome da categoria
            
        Returns:
            Dicionário com dados normalizados ou None se inválido
        """
        # Dados básicos
        nome = item.get('name', '').strip()
        if not nome:
            return None
        
        # Endereço e localização
        endereco = item.get('full_address', '') or item.get('address', '')
        latitude = item.get('latitude')
        longitude = item.get('longitude')
        
        # Contato
        telefone = item.get('phone', '')
        website = item.get('site', '')
        
        # Redes sociais
        instagram = self._extrair_instagram(item)
        
        # Avaliações
        avaliacao = item.get('rating', 0)
        total_avaliacoes = item.get('reviews', 0)
        
        # Descrição/sobre
        sobre = item.get('description', '') or item.get('about', '')
        
        # Horário de funcionamento
        horario = item.get('working_hours', '')
        
        # Fotos
        fotos = item.get('photos', [])
        foto_perfil = fotos[0] if fotos else None
        
        return {
            'nome': nome,
            'nome_fantasia': item.get('business_name', nome),
            'categoria': categoria_nome,
            'termo_busca': item.get('query', ''),
            'endereco': endereco,
            'cidade': CIDADE,
            'estado': ESTADO,
            'latitude': latitude,
            'longitude': longitude,
            'telefone': telefone,
            'website': website,
            'instagram': instagram,
            'avaliacao_media': avaliacao,
            'total_avaliacoes': total_avaliacoes,
            'sobre': sobre,
            'disponibilidade': horario,
            'foto_perfil': foto_perfil,
            'origem': 'google_maps',
            'dados_originais': item  # Mantém dados originais para referência
        }
    
    def _extrair_instagram(self, item: Dict) -> str:
        """Extrai o Instagram dos dados"""
        # Tenta encontrar nas redes sociais
        social_media = item.get('social_media', {})
        if isinstance(social_media, dict):
            instagram = social_media.get('instagram', '')
            if instagram:
                return instagram
        
        # Tenta encontrar no about
        about = item.get('about', '')
        if 'instagram.com/' in about.lower():
            # Extrai o handle do Instagram
            import re
            match = re.search(r'instagram\.com/([^/\s]+)', about.lower())
            if match:
                return match.group(1)
        
        return ''
    
    def _validar_profissional(self, profissional: Dict) -> bool:
        """
        Valida se o profissional atende aos critérios definidos
        
        Args:
            profissional: Dicionário com dados do profissional
            
        Returns:
            True se válido, False caso contrário
        """
        # Verifica telefone
        if SOMENTE_COM_TELEFONE and not profissional.get('telefone'):
            return False
        
        # Verifica avaliação
        if SOMENTE_COM_AVALIACAO and not profissional.get('avaliacao_media'):
            return False
        
        # Verifica nota mínima
        if NOTA_MINIMA > 0:
            avaliacao = profissional.get('avaliacao_media') or 0
            if avaliacao < NOTA_MINIMA:
                return False
        
        # Verifica número mínimo de avaliações
        if MIN_AVALIACOES > 0:
            total = profissional.get('total_avaliacoes') or 0
            if total < MIN_AVALIACOES:
                return False
        
        return True
    
    def executar_scraping(self) -> List[Dict[str, Any]]:
        """
        Executa o scraping para todas as categorias configuradas
        
        Returns:
            Lista completa de profissionais encontrados
        """
        print("=" * 60)
        print("🚀 INICIANDO SCRAPING DO GOOGLE MAPS")
        print(f"📍 Local: {CIDADE} - {ESTADO}")
        print(f"📋 Categorias: {len(CATEGORIAS_BUSCA)}")
        print("=" * 60)
        
        todos_profissionais = []
        
        for termo_busca, categoria_nome in CATEGORIAS_BUSCA.items():
            profissionais = self.buscar_categoria(termo_busca, categoria_nome)
            todos_profissionais.extend(profissionais)
            
            # Pausa entre requisições para não sobrecarregar a API
            time.sleep(1)
        
        # Remove duplicatas (pelo nome + telefone)
        profissionais_unicos = self._remover_duplicatas(todos_profissionais)
        
        print("\n" + "=" * 60)
        print("📊 RESUMO DO SCRAPING")
        print(f"   Total coletado: {len(todos_profissionais)}")
        print(f"   Após remoção de duplicatas: {len(profissionais_unicos)}")
        print("=" * 60)
        
        self.resultados = profissionais_unicos
        return profissionais_unicos
    
    def _remover_duplicatas(self, profissionais: List[Dict]) -> List[Dict]:
        """Remove profissionais duplicados baseado no nome e telefone"""
        vistos = set()
        unicos = []
        
        for p in profissionais:
            # Cria uma chave única baseada no nome e telefone
            nome = p.get('nome', '').lower().strip()
            telefone = p.get('telefone', '').replace(r'\D', '')
            chave = f"{nome}_{telefone}"
            
            if chave not in vistos and nome:
                vistos.add(chave)
                unicos.append(p)
        
        return unicos
    
    def salvar_json(self, filepath: str = None) -> str:
        """
        Salva os resultados em arquivo JSON
        
        Args:
            filepath: Caminho do arquivo (opcional)
            
        Returns:
            Caminho do arquivo salvo
        """
        if not filepath:
            timestamp = time.strftime("%Y%m%d_%H%M%S")
            filepath = f"data/scraping_{CIDADE.lower()}_{ESTADO.lower()}_{timestamp}.json"
        
        # Remove dados originais para economizar espaço
        dados_limpos = []
        for p in self.resultados:
            p_limpo = {k: v for k, v in p.items() if k != 'dados_originais'}
            dados_limpos.append(p_limpo)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(dados_limpos, f, ensure_ascii=False, indent=2)
        
        print(f"💾 Dados salvos em: {filepath}")
        return filepath


def main():
    """Função principal para execução standalone"""
    # Carrega variáveis de ambiente
    from dotenv import load_dotenv
    load_dotenv()
    
    # Cria e executa o scraper
    scraper = GoogleMapsScraper()
    scraper.executar_scraping()
    scraper.salvar_json()


if __name__ == "__main__":
    main()
