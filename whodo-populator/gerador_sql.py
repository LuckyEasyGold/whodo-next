"""
Gerador de SQL para inserção no banco de dados do Whodo
Converte dados normalizados em comandos SQL INSERT
"""

import json
import hashlib
from datetime import datetime
from typing import List, Dict
from config import CIDADE, ESTADO, SENHA_PADRAO


class GeradorSQL:
    """Gera comandos SQL para popular o banco do Whodo"""
    
    def __init__(self):
        self.categorias_mapeadas = {}
        self.contador_usuario = 0
        
    def gerar_sql_completo(self, dados: List[Dict], arquivo_saida: str = None) -> str:
        """
        Gera arquivo SQL completo com todos os inserts
        
        Args:
            dados: Lista de profissionais normalizados
            arquivo_saida: Caminho do arquivo de saída
            
        Returns:
            Conteúdo SQL gerado
        """
        print(f"📝 Gerando SQL para {len(dados)} profissionais...")
        
        linhas = []
        
        # Header
        linhas.extend(self._gerar_header())
        
        # Categorias
        linhas.extend(self._gerar_categorias(dados))
        
        # Usuários
        linhas.extend(self._gerar_usuarios(dados))
        
        # Footer
        linhas.extend(self._gerar_footer())
        
        sql = '\n'.join(linhas)
        
        # Salva arquivo
        if arquivo_saida:
            with open(arquivo_saida, 'w', encoding='utf-8') as f:
                f.write(sql)
            print(f"💾 SQL salvo em: {arquivo_saida}")
        
        return sql
    
    def gerar_typescript_seed(self, dados: List[Dict], arquivo_saida: str = None) -> str:
        """
        Gera arquivo TypeScript de seed para o Prisma
        
        Args:
            dados: Lista de profissionais normalizados
            arquivo_saida: Caminho do arquivo de saída
            
        Returns:
            Conteúdo TypeScript gerado
        """
        print(f"📝 Gerando seed TypeScript para {len(dados)} profissionais...")
        
        linhas = []
        
        # Imports
        linhas.append("import { PrismaClient } from '@prisma/client'")
        linhas.append("import bcrypt from 'bcryptjs'")
        linhas.append("")
        linhas.append("const prisma = new PrismaClient()")
        linhas.append("")
        linhas.append("async function main() {")
        linhas.append('  console.log("🌱 Iniciando seed com dados do Google Maps...")')
        linhas.append("")
        
        # Hash da senha padrão
        linhas.append(f"  const senhaHash = await bcrypt.hash('{SENHA_PADRAO}', 10)")
        linhas.append("")
        
        # Mapeamento de categorias
        categorias = self._extrair_categorias_unicas(dados)
        linhas.append("  // Categorias")
        linhas.append("  const categorias = {")
        
        for i, cat in enumerate(categorias):
            slug = self._slugify(cat)
            virgula = "," if i < len(categorias) - 1 else ""
            linhas.append(f'    {slug}: {{ nome: "{cat}" }}{virgula}')
        
        linhas.append("  }")
        linhas.append("")
        
        # Criação das categorias
        linhas.append("  // Criar categorias no banco")
        linhas.append("  for (const [key, cat] of Object.entries(categorias)) {")
        linhas.append("    await prisma.categoria.upsert({")
        linhas.append("      where: { nome: cat.nome },")
        linhas.append("      update: {},")
        linhas.append("      create: { nome: cat.nome, descricao: `Serviços de ${cat.nome}` }")
        linhas.append("    })")
        linhas.append("  }")
        linhas.append("")
        linhas.append("  console.log('✅ Categorias criadas')")
        linhas.append("")
        
        # Buscar IDs das categorias
        linhas.append("  // Buscar IDs das categorias")
        linhas.append("  const cats = await prisma.categoria.findMany()")
        linhas.append("  const catMap: Record<string, number> = {}")
        linhas.append("  cats.forEach(c => catMap[c.nome] = c.id)")
        linhas.append("")
        
        # Criação dos usuários
        linhas.append(f"  // Criando {len(dados)} profissionais")
        linhas.append("  const profissionais = [")
        
        for i, p in enumerate(dados):
            virgula = "," if i < len(dados) - 1 else ""
            
            # Escapa aspas no texto
            nome = p['nome'].replace('"', '\\"')
            sobre = p['sobre'].replace('"', '\\"') if p['sobre'] else f"Profissional de {p['categoria_nome']}"
            especialidade = p['especialidade'].replace('"', '\\"')
            
            linhas.append(f"    {{")
            linhas.append(f'      nome: "{nome}",')
            linhas.append(f'      email: "{p["email"]}",')
            linhas.append(f'      senha: senhaHash,')
            linhas.append(f'      telefone: "{p["telefone"]}",')
            linhas.append(f'      cidade: "{p["cidade"]}",')
            linhas.append(f'      estado: "{p["estado"]}",')
            linhas.append(f'      latitude: {p["latitude"]},')
            linhas.append(f'      longitude: {p["longitude"]},')
            linhas.append(f'      especialidade: "{especialidade}",')
            linhas.append(f'      sobre: "{sobre}",')
            linhas.append(f'      avaliacao_media: {p["avaliacao_media"]},')
            linhas.append(f'      verificado: {str(p["verificado"]).lower()},')
            linhas.append(f'      foto_perfil: "{p["foto_perfil"]}",')
            linhas.append(f'      instagram: "{p["instagram"]}",')
            linhas.append(f'      website: "{p["website"]}",')
            linhas.append(f'      status: "{p["status"]}",')
            linhas.append(f'      tipo: "{p["tipo"]}",')
            linhas.append(f'      email_verificado: {str(p["email_verificado"]).lower()},')
            linhas.append(f'      categoria_nome: "{p["categoria_nome"]}"')
            linhas.append(f"    }}{virgula}")
        
        linhas.append("  ]")
        linhas.append("")
        
        # Inserção dos usuários
        linhas.append("  // Inserir profissionais")
        linhas.append("  for (const prof of profissionais) {")
        linhas.append("    try {")
        linhas.append("      await prisma.usuario.create({")
        linhas.append("        data: {")
        linhas.append("          nome: prof.nome,")
        linhas.append("          email: prof.email,")
        linhas.append("          senha: prof.senha,")
        linhas.append("          telefone: prof.telefone,")
        linhas.append("          cidade: prof.cidade,")
        linhas.append("          estado: prof.estado,")
        linhas.append("          latitude: prof.latitude,")
        linhas.append("          longitude: prof.longitude,")
        linhas.append("          especialidade: prof.especialidade,")
        linhas.append("          sobre: prof.sobre,")
        linhas.append("          avaliacao_media: prof.avaliacao_media,")
        linhas.append("          verificado: prof.verificado,")
        linhas.append("          foto_perfil: prof.foto_perfil,")
        linhas.append("          instagram: prof.instagram,")
        linhas.append("          website: prof.website,")
        linhas.append("          status: prof.status,")
        linhas.append("          tipo: prof.tipo,")
        linhas.append("          email_verificado: prof.email_verificado,")
        linhas.append("          servicos: {")
        linhas.append("            create: {")
        linhas.append("              categoria_id: catMap[prof.categoria_nome] || 1,")
        linhas.append("              titulo: prof.especialidade,")
        linhas.append("              descricao: prof.sobre,")
        linhas.append("              preco_base: 0,")
        linhas.append("              cobranca_tipo: 'A_COMBINAR'")
        linhas.append("            }")
        linhas.append("          }")
        linhas.append("        }")
        linhas.append("      })")
        linhas.append('      console.log(`✅ Criado: ${prof.nome}`)')
        linhas.append("    } catch (error) {")
        linhas.append('      console.error(`❌ Erro ao criar ${prof.nome}:`, error)')
        linhas.append("    }")
        linhas.append("  }")
        linhas.append("")
        linhas.append('  console.log("🎉 Seed concluído!")')
        linhas.append("}")
        linhas.append("")
        linhas.append("main()")
        linhas.append("  .catch((e) => {")
        linhas.append("    console.error(e)")
        linhas.append("    process.exit(1)")
        linhas.append("  })")
        linhas.append("  .finally(async () => {")
        linhas.append("    await prisma.$disconnect()")
        linhas.append("  })")
        
        ts_content = '\n'.join(linhas)
        
        if arquivo_saida:
            with open(arquivo_saida, 'w', encoding='utf-8') as f:
                f.write(ts_content)
            print(f"💾 Seed TypeScript salvo em: {arquivo_saida}")
        
        return ts_content
    
    def _gerar_header(self) -> List[str]:
        """Gera header do arquivo SQL"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        return [
            "-- ============================================",
            "-- SEED DE DADOS DO GOOGLE MAPS",
            f"-- Gerado em: {timestamp}",
            f"-- Local: {CIDADE} - {ESTADO}",
            "-- ============================================",
            "",
            "BEGIN;",
            "",
        ]
    
    def _gerar_footer(self) -> List[str]:
        """Gera footer do arquivo SQL"""
        return [
            "",
            "COMMIT;",
            "",
            "-- ============================================",
            "-- SEED CONCLUÍDO",
            "-- ============================================",
        ]
    
    def _gerar_categorias(self, dados: List[Dict]) -> List[str]:
        """Gera INSERTs para categorias"""
        linhas = []
        categorias = self._extrair_categorias_unicas(dados)
        
        linhas.append("-- Categorias")
        linhas.append("INSERT INTO categorias (nome, descricao, icone) VALUES")
        
        for i, cat in enumerate(categorias):
            slug = self._slugify(cat)
            virgula = "," if i < len(categorias) - 1 else ""
            linhas.append(f"  ('{cat}', 'Serviços de {cat}', 'fa-{slug}'){virgula}")
            self.categorias_mapeadas[cat] = i + 1
        
        linhas.append("ON CONFLICT (nome) DO NOTHING;")
        linhas.append("")
        
        return linhas
    
    def _gerar_usuarios(self, dados: List[Dict]) -> List[str]:
        """Gera INSERTs para usuários"""
        linhas = []
        
        linhas.append("-- Profissionais (Usuários)")
        
        for i, p in enumerate(dados):
            self.contador_usuario += 1
            
            # Escapa aspas simples
            nome = p['nome'].replace("'", "''")
            sobre = p['sobre'].replace("'", "''") if p['sobre'] else f"Profissional de {p['categoria_nome']}"
            especialidade = p['especialidade'].replace("'", "''")
            
            # Gera hash da senha (simplificado - em produção use bcrypt)
            senha_hash = hashlib.sha256(SENHA_PADRAO.encode()).hexdigest()
            
            sql = f"""INSERT INTO usuarios (
  nome, nome_fantasia, email, senha, telefone, tipo,
  especialidade, sobre, avaliacao_media, verificado, disponibilidade,
  endereco, cidade, estado, cep, latitude, longitude,
  website, instagram, foto_perfil, status, email_verificado, created_at
) VALUES (
  '{nome}', '{nome}', '{p['email']}', '{senha_hash}', '{p['telefone']}', 'usuario',
  '{especialidade}', '{sobre}', {p['avaliacao_media']}, {str(p['verificado']).lower()}, '{p['disponibilidade']}',
  '{p['endereco']}', '{p['cidade']}', '{p['estado']}', '', {p['latitude']}, {p['longitude']},
  '{p['website']}', '{p['instagram']}', '{p['foto_perfil']}', '{p['status']}', false, NOW()
) ON CONFLICT (email) DO NOTHING;"""
            
            linhas.append(sql)
            linhas.append("")
            
            # Cria serviço associado
            cat_id = self.categorias_mapeadas.get(p['categoria_nome'], 1)
            
            sql_servico = f"""INSERT INTO servicos (
  usuario_id, categoria_id, titulo, descricao, preco_base, cobranca_tipo, status, created_at
) SELECT 
  id, {cat_id}, '{especialidade}', '{sobre}', 0, 'A_COMBINAR', 'ativo', NOW()
FROM usuarios WHERE email = '{p['email']}' AND NOT EXISTS (
  SELECT 1 FROM servicos WHERE usuario_id = (SELECT id FROM usuarios WHERE email = '{p['email']}')
);"""
            
            linhas.append(sql_servico)
            linhas.append("")
        
        return linhas
    
    def _extrair_categorias_unicas(self, dados: List[Dict]) -> List[str]:
        """Extrai lista única de categorias"""
        categorias = set()
        for p in dados:
            cat = p.get('categoria_nome', 'Outros')
            if cat:
                categorias.add(cat)
        return sorted(list(categorias))
    
    def _slugify(self, texto: str) -> str:
        """Converte texto em slug"""
        import unicodedata
        texto = unicodedata.normalize('NFKD', texto.lower())
        texto = texto.encode('ASCII', 'ignore').decode('ASCII')
        texto = texto.replace(' ', '-')
        texto = ''.join(c for c in texto if c.isalnum() or c == '-')
        return texto


def main():
    """Função principal"""
    import sys
    
    if len(sys.argv) < 2:
        print("Uso: python gerador_sql.py <arquivo_json_normalizado>")
        sys.exit(1)
    
    arquivo = sys.argv[1]
    
    with open(arquivo, 'r', encoding='utf-8') as f:
        dados = json.load(f)
    
    gerador = GeradorSQL()
    
    # Gera SQL
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    gerador.gerar_sql_completo(dados, f"data/seed_{timestamp}.sql")
    
    # Gera TypeScript
    gerador.gerar_typescript_seed(dados, f"data/seed_{timestamp}.ts")


if __name__ == "__main__":
    main()
