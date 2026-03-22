const fs = require('fs');
const path = require('path');

function getApiFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      if (item !== 'node_modules') {
        getApiFiles(fullPath, files);
      }
    } else if (item === 'route.ts') {
      files.push(fullPath.replace(/\\/g, '/').replace('src/', ''));
    }
  }
  return files;
}

function findFetchCalls(dir, calls = {}) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      if (item !== 'node_modules' && !item.startsWith('.')) {
        findFetchCalls(fullPath, calls);
      }
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const matches = content.matchAll(/fetch\([\`\"\'](.*?\/api\/[^\`\"\']+)/g);
      for (const match of matches) {
        const apiPath = match[1];
        if (!calls[apiPath]) calls[apiPath] = [];
        calls[apiPath].push(fullPath.replace(/\\/g, '/').replace('src/', ''));
      }
    }
  }
  return calls;
}

const apiFiles = getApiFiles('src/app/api');
const fetchCalls = findFetchCalls('src/app');

console.log('=== RELATÓRIO DE DEPENDÊNCIAS ===\n');
console.log(`Total de APIs: ${apiFiles.length}`);
console.log(`Total de endpoints chamados: ${Object.keys(fetchCalls).length}\n`);

// Normalizar caminhos de API
function normalizeApi(api) {
  return api
    .replace(/\[id\]/g, ':id')
    .replace(/\[solicitacaoId\]/g, ':solicitacaoId')
    .replace(/\[mediaId\]/g, ':mediaId')
    .replace(/\[...nextauth\]/g, ':nextauth')
    .replace(/\.tsx$/, '');
}

// APIs chamadas
console.log('=== APIs CHAMADAS ===');
Object.keys(fetchCalls).forEach(call => {
  console.log(`\n${call}:`);
  fetchCalls[call].forEach(f => console.log(`  - ${f}`));
});

// APIs que existem mas podem não ser chamadas
console.log('\n=== APIs POTENCIALMENTE NÃO CHAMADAS ===');
const calledApis = Object.keys(fetchCalls);
let orphanCount = 0;

apiFiles.forEach(api => {
  const normalized = normalizeApi(api);
  const hasCall = calledApis.some(ca => {
    const normalizedCall = ca.replace(/\/$/, '');
    return normalized.includes(normalizedCall) || normalizedCall.includes(normalized);
  });
  if (!hasCall) {
    orphanCount++;
    console.log(`⚠️  ${api}`);
  }
});

if (orphanCount === 0) {
  console.log('Nenhuma API órfã encontrada!');
}

console.log(`\nTotal de APIs potencialmente não chamadas: ${orphanCount}`);

// Salvar em arquivo
fs.writeFileSync('dependency-analysis.json', JSON.stringify({
  apiFiles,
  fetchCalls,
  orphanCount
}, null, 2));

console.log('\nArquivo dependency-analysis.json criado!');
