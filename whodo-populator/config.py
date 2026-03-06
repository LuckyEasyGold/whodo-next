"""
Configurações para o scraper do Google Maps
Ajuste conforme suas necessidades
"""

# ============================================
# CONFIGURAÇÕES GLOBAIS
# ============================================

# Cidade e estado para busca
CIDADE = "Palmas"
ESTADO = "PR"

# Coordenadas aproximadas do centro da cidade (para cálculo de distância)
# Palmas - PR
LATITUDE_CENTRO = -26.4841
LONGITUDE_CENTRO = -51.9905

# Raio de busca em km (aproximado)
RAIO_KM = 50

# ============================================
# CATEGORIAS DE PROFISSIONAIS PARA BUSCAR
# ============================================
# Estrutura: "termo de busca": "nome da categoria no banco"

CATEGORIAS_BUSCA = {
    # Construção e Reformas
    "eletricista": "Eletricista",
    "encanador": "Encanador", 
    "pedreiro": "Pedreiro",
    "pintor": "Pintor",
    "marceneiro": "Marceneiro",
    "gesseiro": "Gesseiro",
    "azulejista": "Azulejista",
    "serralheiro": "Serralheiro",
    "vidraceiro": "Vidraceiro",
    "jardineiro": "Jardineiro",
    
    # Beleza e Estética
    "cabeleireiro": "Cabeleireiro",
    "barbeiro": "Barbeiro",
    "manicure": "Manicure",
    "pedicure": "Pedicure",
    "maquiador": "Maquiador",
    "depilador": "Depilador",
    "massoterapeuta": "Massoterapeuta",
    "esteticista": "Esteticista",
    
    # Serviços Domésticos
    "diarista": "Diarista",
    "faxineira": "Diarista",
    "lavanderia": "Lavanderia",
    "passadeira": "Passadeira",
    "cozinheira": "Cozinheira",
    "babá": "Babá",
    "cuidador de idosos": "Cuidador de Idosos",
    
    # Tecnologia
    "técnico de informática": "Técnico de Informática",
    "conserto de celular": "Técnico de Celular",
    "desenvolvedor": "Desenvolvedor",
    "designer gráfico": "Designer Gráfico",
    
    # Automotivo
    "mecânico": "Mecânico",
    "funileiro": "Funileiro",
    "pintor de carro": "Pintor Automotivo",
    "lanterneiro": "Lanterneiro",
    "borracheiro": "Borracheiro",
    "lavagem de carro": "Lavação Automotiva",
    
    # Saúde e Bem-estar
    "personal trainer": "Personal Trainer",
    "nutricionista": "Nutricionista",
    "fisioterapeuta": "Fisioterapeuta",
    "psicólogo": "Psicólogo",
    "dentista": "Dentista",
    
    # Eventos e Fotografia
    "fotógrafo": "Fotógrafo",
    "filmagem": "Videomaker",
    "dj": "DJ",
    "buffet": "Buffet",
    "decorador de festas": "Decorador de Festas",
    
    # Outros Serviços
    "chaveiro": "Chaveiro",
    "relojoeiro": "Relojoeiro",
    "costureira": "Costureira",
    "sapateiro": "Sapateiro",
    "conserto de roupas": "Costureira",
    "reformas de calçados": "Sapateiro",
}

# ============================================
# CONFIGURAÇÕES DE LIMITE
# ============================================

# Limite de resultados por categoria (máximo recomendado: 100)
LIMITE_POR_CATEGORIA = 50

# Limite total de profissionais (0 = sem limite)
LIMITE_TOTAL = 0

# ============================================
# CONFIGURAÇÕES DE FILTRO
# ============================================

# Apenas empresas com telefone?
SOMENTE_COM_TELEFONE = True

# Apenas empresas com avaliação?
SOMENTE_COM_AVALIACAO = False

# Nota mínima (0 = sem filtro)
NOTA_MINIMA = 0

# Número mínimo de avaliações
MIN_AVALIACOES = 0

# ============================================
# CONFIGURAÇÕES DE DADOS
# ============================================

# Senha padrão para usuários criados automaticamente
SENHA_PADRAO = "whodo123"

# Domínio de email para usuários sem email
EMAIL_DOMINIO = "whodo.temp"

# Status de verificação para usuários do scraper
USUARIO_VERIFICADO = False

# Marcar como perfil reivindicável
PERFIL_REIVINDICAVEL = True
