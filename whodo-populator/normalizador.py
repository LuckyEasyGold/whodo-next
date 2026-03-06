"""
Normalizador e limpador de dados do Google Maps
Converte os dados brutos no formato esperado pelo banco do Whodo
"""

import re
import json
import unicodedata
from typing import Dict, List, Optional
from config import (
    CIDADE, ESTADO, SENHA_PADRAO, EMAIL_DOMINIO, 
    USUARIO_VERIFICADO, LATITUDE_CENTRO, LONGITUDE_CENTRO
)


class NormalizadorDados:
    """Classe para normalizar e limpar dados dos profissionais"""
    
    def __init__(self):
        self.contador_email = 0
        
    def normalizar_todos(self, dados: List[Dict]) -> List[Dict]:
        """
        Normaliza uma lista completa de profissionais
        
        Args:
            dados: Lista de dicionários com dados brutos
            
        Returns:
            Lista de dicionários normalizados
        """
        print(f"🧹 Normalizando {len(dados)} profissionais...")
        
        normalizados = []
        for i, item in enumerate(dados, 1):
            try:
                normalizado = self.normalizar_profissional(item)
                if normalizado:
                    normalizados.append(normalizado)
                    
                if i % 50 == 0:
                    print(f"   Processados: {i}/{len(dados)}")
                    
            except Exception as e:
                print(f"   ⚠️ Erro ao normalizar item {i}: {str(e)}")
                continue
        
        print(f"✅ Normalização concluída: {len(normalizados)} profissionais válidos")
        return normalizados
    
    def normalizar_profissional(self, dados: Dict) -> Optional[Dict]:
        """
        Normaliza os dados de um único profissional
        
        Args:
            dados: Dicionário com dados brutos
            
        Returns:
            Dicionário normalizado ou None se inválido
        """
        # Nome
        nome = self._normalizar_nome(dados.get('nome', ''))
        if not nome:
            return None
        
        # Nome fantasia
        nome_fantasia = dados.get('nome_fantasia', nome)
        
        # Email
        email = self._gerar_email(nome, dados.get('website', ''))
        
        # Telefone
        telefone = self._normalizar_telefone(dados.get('telefone', ''))
        
        # Endereço
        endereco = self._limpar_texto(dados.get('endereco', ''))
        
        # Cidade e Estado (usa os da config se não tiver nos dados)
        cidade = dados.get('cidade', CIDADE)
        estado = dados.get('estado', ESTADO)
        
        # Coordenadas
        latitude = self._normalizar_coordenada(dados.get('latitude'))
        longitude = self._normalizar_coordenada(dados.get('longitude'))
        
        # Se não tiver coordenadas, gera aleatórias próximas ao centro
        if latitude is None or longitude is None:
            latitude, longitude = self._gerar_coordenada_proxima()
        
        # Especialidade
        especialidade = dados.get('categoria', 'Profissional')
        
        # Sobre/Descrição
        sobre = self._limpar_texto(dados.get('sobre', ''))
        if not sobre:
            sobre = f"Profissional de {especialidade} em {cidade} - {estado}"
        
        # Disponibilidade
        disponibilidade = self._normalizar_horario(dados.get('disponibilidade', ''))
        
        # Avaliação
        avaliacao = self._normalizar_avaliacao(dados.get('avaliacao_media', 0))
        
        # Foto de perfil
        foto_perfil = dados.get('foto_perfil', '')
        if not foto_perfil:
            foto_perfil = self._gerar_avatar_padrao(nome)
        
        # Redes sociais
        instagram = self._normalizar_instagram(dados.get('instagram', ''))
        website = self._normalizar_website(dados.get('website', ''))
        
        # Status
        status = 'ativo'
        verificado = USUARIO_VERIFICADO
        
        # Categoria ID (será mapeada depois)
        categoria_nome = dados.get('categoria', 'Outros')
        
        return {
            'nome': nome,
            'nome_fantasia': nome_fantasia,
            'email': email,
            'senha': SENHA_PADRAO,
            'telefone': telefone,
            'endereco': endereco,
            'cidade': cidade,
            'estado': estado,
            'cep': '',  # Não temos CEP nos dados do Google Maps
            'latitude': latitude,
            'longitude': longitude,
            'especialidade': especialidade,
            'sobre': sobre,
            'disponibilidade': disponibilidade,
            'avaliacao_media': avaliacao,
            'verificado': verificado,
            'foto_perfil': foto_perfil,
            'instagram': instagram,
            'website': website,
            'status': status,
            'tipo': 'usuario',
            'email_verificado': False,
            'categoria_nome': categoria_nome,
            'origem': dados.get('origem', 'google_maps')
        }
    
    def _normalizar_nome(self, nome: str) -> str:
        """Normaliza o nome do profissional"""
        if not nome:
            return ''
        
        # Remove espaços extras
        nome = ' '.join(nome.split())
        
        # Capitaliza cada palavra
        nome = nome.title()
        
        # Remove caracteres especiais problemáticos
        nome = nome.replace('@', '').replace('#', '').replace('$', '')
        
        return nome.strip()
    
    def _gerar_email(self, nome: str, website: str = '') -> str:
        """Gera um email único baseado no nome"""
        # Se tiver website, tenta extrair email
        if website and '@' in website:
            match = re.search(r'[\w\.-]+@[\w\.-]+', website)
            if match:
                return match.group(0).lower()
        
        # Gera email baseado no nome
        self.contador_email += 1
        nome_limpo = unicodedata.normalize('NFKD', nome.lower())
        nome_limpo = nome_limpo.encode('ASCII', 'ignore').decode('ASCII')
        nome_limpo = re.sub(r'[^a-z0-9]', '', nome_limpo)
        
        return f"{nome_limpo}{self.contador_email}@{EMAIL_DOMINIO}"
    
    def _normalizar_telefone(self, telefone: str) -> str:
        """Normaliza o número de telefone para formato brasileiro"""
        if not telefone:
            return ''
        
        # Remove tudo exceto números
        numeros = re.sub(r'\D', '', telefone)
        
        # Se começar com 55 (código do Brasil), remove
        if numeros.startswith('55') and len(numeros) > 10:
            numeros = numeros[2:]
        
        # Se tiver DDD + 9 dígitos (formato novo)
        if len(numeros) == 11:
            return f"({numeros[:2]}) {numeros[2:7]}-{numeros[7:]}"
        
        # Se tiver DDD + 8 dígitos (formato antigo)
        if len(numeros) == 10:
            return f"({numeros[:2]}) {numeros[2:6]}-{numeros[6:]}"
        
        # Se não conseguir formatar, retorna como está
        return telefone
    
    def _limpar_texto(self, texto: str) -> str:
        """Limpa e normaliza texto"""
        if not texto:
            return ''
        
        # Remove espaços extras
        texto = ' '.join(texto.split())
        
        # Limita tamanho
        if len(texto) > 1000:
            texto = texto[:997] + '...'
        
        return texto.strip()
    
    def _normalizar_coordenada(self, coord: any) -> Optional[float]:
        """Normaliza coordenadas geográficas"""
        if coord is None:
            return None
        
        try:
            valor = float(coord)
            # Valida range básico
            if -90 <= valor <= 90 or -180 <= valor <= 180:
                return round(valor, 8)
        except (ValueError, TypeError):
            pass
        
        return None
    
    def _gerar_coordenada_proxima(self) -> tuple:
        """Gera coordenadas aleatórias próximas ao centro da cidade"""
        import random
        
        # Gera variação de até ±0.05 graus (aproximadamente 5km)
        lat_var = random.uniform(-0.05, 0.05)
        lon_var = random.uniform(-0.05, 0.05)
        
        return (
            round(LATITUDE_CENTRO + lat_var, 8),
            round(LONGITUDE_CENTRO + lon_var, 8)
        )
    
    def _normalizar_horario(self, horario: str) -> str:
        """Normaliza horário de funcionamento"""
        if not horario:
            return 'Seg-Sex: 8h às 18h'
        
        # Limita tamanho
        horario = horario[:255]
        
        return horario.strip()
    
    def _normalizar_avaliacao(self, avaliacao: any) -> float:
        """Normaliza a nota de avaliação"""
        try:
            nota = float(avaliacao)
            if 0 <= nota <= 5:
                return round(nota, 2)
        except (ValueError, TypeError):
            pass
        
        return 0.0
    
    def _gerar_avatar_padrao(self, nome: str) -> str:
        """Gera URL de avatar padrão baseado no nome"""
        # Usa UI Avatars para gerar avatar com iniciais
        iniciais = ''.join([p[0] for p in nome.split()[:2] if p]).upper()
        return f"https://ui-avatars.com/api/?name={iniciais}&background=random&size=256"
    
    def _normalizar_instagram(self, instagram: str) -> str:
        """Normaliza handle do Instagram"""
        if not instagram:
            return ''
        
        # Remove @ se existir
        instagram = instagram.replace('@', '').strip()
        
        # Remove URL completa se for o caso
        if 'instagram.com/' in instagram.lower():
            match = re.search(r'instagram\.com/([^/\s?]+)', instagram.lower())
            if match:
                instagram = match.group(1)
        
        return instagram
    
    def _normalizar_website(self, website: str) -> str:
        """Normaliza URL do website"""
        if not website:
            return ''
        
        website = website.strip()
        
        # Adiciona https:// se não tiver protocolo
        if website and not website.startswith(('http://', 'https://')):
            website = 'https://' + website
        
        return website
    
    def salvar_json(self, dados: List[Dict], filepath: str = None) -> str:
        """Salva dados normalizados em JSON"""
        import time
        
        if not filepath:
            timestamp = time.strftime("%Y%m%d_%H%M%S")
            filepath = f"data/normalizados_{CIDADE.lower()}_{ESTADO.lower()}_{timestamp}.json"
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(dados, f, ensure_ascii=False, indent=2)
        
        print(f"💾 Dados normalizados salvos em: {filepath}")
        return filepath


def main():
    """Função principal para teste standalone"""
    import sys
    
    # Carrega dados do scraping
    if len(sys.argv) < 2:
        print("Uso: python normalizador.py <arquivo_json>")
        sys.exit(1)
    
    arquivo = sys.argv[1]
    
    with open(arquivo, 'r', encoding='utf-8') as f:
        dados = json.load(f)
    
    # Normaliza
    normalizador = NormalizadorDados()
    normalizados = normalizador.normalizar_todos(dados)
    
    # Salva
    normalizador.salvar_json(normalizados)


if __name__ == "__main__":
    main()
