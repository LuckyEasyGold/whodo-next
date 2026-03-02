<?php
require_once __DIR__ . '/config.php';
// Buscar categorias para os filtros
$stmt = $pdo->query("SELECT id, nome, icone FROM categorias ORDER BY nome");
$categorias = $stmt->fetchAll(PDO::FETCH_ASSOC);
// Obter parâmetros de filtro da URL
$termo = isset($_GET['q']) ? $_GET['q'] : '';
$cidade = isset($_GET['cidade']) ? $_GET['cidade'] : '';
$estado = isset($_GET['estado']) ? $_GET['estado'] : '';
$distancia = isset($_GET['distancia']) ? (int)$_GET['distancia'] : 10;
$lat_usuario = isset($_GET['lat']) ? (float)$_GET['lat'] : null;
$lon_usuario = isset($_GET['lon']) ? (float)$_GET['lon'] : null;
$categoria_id = isset($_GET['categoria_id']) ? (int)$_GET['categoria_id'] : null;
$avaliacao_minima = isset($_GET['avaliacao_minima']) ? (float)$_GET['avaliacao_minima'] : 0;
$preco_maximo = isset($_GET['preco_maximo']) ? (float)$_GET['preco_maximo'] : null;
$ordenar_por = isset($_GET['ordenar_por']) ? $_GET['ordenar_por'] : 'relevancia';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pesquisar Profissionais - WhoDo!</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
    
    <!-- Leaflet -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <!-- Clustering (Leaflet.markercluster) -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css"/>
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css"/>
    <script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"></script>
    
    <style>
        .gradient-bg {
            background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
        }
        .service-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .rating-stars {
            color: #f59e0b;
        }
        .filter-card {
            transition: all 0.3s ease;
        }
        .filter-card:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .availability-badge {
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 10;
        }
        .map-container {
            height: 400px;
            border-radius: 0.75rem;
            overflow: hidden;
        }
        .range-slider {
            -webkit-appearance: none;
            width: 100%;
            height: 8px;
            border-radius: 5px;
            background: #e0e7ff;
            outline: none;
        }
        .range-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #4f46e5;
            cursor: pointer;
        }
        .range-slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #4f46e5;
            cursor: pointer;
        }
        .tabs button.active {
            border-bottom: 3px solid #4f46e5;
            color: #4f46e5;
            font-weight: 600;
        }
        #map { 
            width: 100%; 
            height: 100%;
            border-radius: 0.5rem;
        }
        .loading {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #4f46e5;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body class="bg-gray-50 font-sans">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex">
                    <div class="flex-shrink-0 flex items-center">
                        <img src="logowhodo.png" alt="Logo WhoDo!" class="h-12 w-auto mr-2">
                        <span class="text-xl font-bold text-gray-900">WhoDo!</span>
                    </div>
                    <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                        <a href="index.php" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Início</a>
                        <a href="pesquisa.php" class="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Encontrar Serviços</a>
                        <a href="#como-funciona" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Como Funciona</a>
                        <?php if(isset($_SESSION['usuario']) && $_SESSION['usuario']['tipo']==='prestador'): ?>
                            <a href="publicar.php" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Publicar Serviço</a>
                        <?php endif; ?>
                    </div>
                </div>
                <div class="hidden sm:ml-6 sm:flex sm:items-center">
                    <?php if(isset($_SESSION['usuario'])): ?>
                        <a href="notificacoes.php" class="bg-white p-1 rounded-full text-gray-400 hover:text-indigo-500 ml-4">
                            <span class="sr-only">Notificações</span><i class="fas fa-bell h-6 w-6"></i>
                        </a>
                        <div class="ml-3 relative">
                            <a href="perfil.php" class="bg-white rounded-full flex text-sm hover:ring-2 hover:ring-indigo-500 transition-all duration-200">
                                <img class="h-8 w-8 rounded-full" src="<?= htmlspecialchars($_SESSION['usuario']['foto'] ?? 'https://via.placeholder.com/80') ?>" alt="Foto de <?= htmlspecialchars($_SESSION['usuario']['nome'] ?? 'Usuário') ?>">
                            </a>
                        </div>
                        <a href="logout.php" class="ml-4 text-sm text-indigo-600 hover:text-indigo-800">Sair</a>
                    <?php else: ?>
                        <a href="login.php" class="ml-4 inline-flex items-center px-4 py-2 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700">Entrar</a>
                        <a href="cadastro.php" class="ml-2 inline-flex items-center px-4 py-2 text-sm text-indigo-600 bg-white border border-indigo-600 rounded hover:bg-indigo-50">Quero me cadastrar</a>
                    <?php endif; ?>
                </div>
                <div class="-mr-2 flex items-center sm:hidden">
                    <button type="button" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500" id="mobile-menu-button">
                        <span class="sr-only">Abrir menu principal</span>
                        <i class="fas fa-bars h-6 w-6"></i>
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Menu mobile panel -->
        <div id="mobile-menu" class="sm:hidden hidden">
            <div class="pt-2 pb-3 space-y-1">
                <a href="index.php" class="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Início</a>
                <a href="pesquisa.php" class="bg-indigo-50 border-indigo-500 text-indigo-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Encontrar Serviços</a>
                <a href="#como-funciona" class="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Como Funciona</a>
                <?php if(isset($_SESSION['usuario']) && $_SESSION['usuario']['tipo']==='prestador'): ?>
                    <a href="publicar.php" class="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Publicar Serviço</a>
                <?php endif; ?>
            </div>
            
            <?php if(isset($_SESSION['usuario'])): ?>
                <div class="pt-4 pb-3 border-t border-gray-200">
                    <div class="flex items-center px-4">
                        <div class="flex-shrink-0">
                            <img class="h-10 w-10 rounded-full" src="<?= htmlspecialchars($_SESSION['usuario']['foto'] ?? 'https://via.placeholder.com/80') ?>" alt="Foto de <?= htmlspecialchars($_SESSION['usuario']['nome'] ?? 'Usuário') ?>">
                        </div>
                        <div class="ml-3">
                            <div class="text-base font-medium text-gray-800"><?= htmlspecialchars($_SESSION['usuario']['nome'] ?? 'Usuário') ?></div>
                            <div class="text-sm font-medium text-gray-500"><?= htmlspecialchars($_SESSION['usuario']['email'] ?? '') ?></div>
                        </div>
                    </div>
                    <div class="mt-3 space-y-1">
                        <a href="perfil.php" class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">Meu Perfil</a>
                        <a href="notificacoes.php" class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">Notificações</a>
                        <a href="logout.php" class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">Sair</a>
                    </div>
                </div>
            <?php else: ?>
                <div class="pt-4 pb-3 border-t border-gray-200">
                    <div class="flex items-center px-4 space-x-3">
                        <a href="login.php" class="block w-full text-center px-4 py-2 text-base font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700">Entrar</a>
                        <a href="cadastro.php" class="block w-full text-center px-4 py-2 text-base font-medium text-indigo-600 bg-white border border-indigo-600 rounded hover:bg-indigo-50">Quero me cadastrar</a>
                    </div>
                </div>
            <?php endif; ?>
        </div>
    </nav>
    
    <!-- Hero Search Section -->
    <div class="gradient-bg">
        <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                    Encontre o profissional perfeito
                </h1>
                <p class="mt-3 max-w-2xl mx-auto text-xl text-indigo-100">
                    Mais de 5.000 profissionais verificados prontos para ajudar com seu projeto
                </p>
            </div>
            
            <div class="mt-8 max-w-3xl mx-auto">
                <form id="search-form" class="bg-white rounded-xl shadow-xl p-2 flex">
                    <div class="relative flex-1">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i class="fas fa-search text-gray-400"></i>
                        </div>
                        <input type="text" id="search-input" name="q" class="block w-full pl-10 pr-3 py-4 border-0 focus:ring-0 text-lg" placeholder="Qual serviço você precisa?" value="<?= htmlspecialchars($termo) ?>">
                    </div>
                    <div class="ml-2">
                        <button type="submit" class="h-full px-6 py-4 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                            Buscar
                        </button>
                    </div>
                </form>
                
                <div class="mt-4 flex flex-wrap justify-center gap-2">
                    <?php foreach(array_slice($categorias, 0, 4) as $categoria): ?>
                        <a href="pesquisa.php?categoria_id=<?= $categoria['id'] ?>" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white hover:bg-opacity-30">
                            <i class="fas <?= htmlspecialchars($categoria['icone']) ?> mr-1"></i> <?= htmlspecialchars($categoria['nome']) ?>
                        </a>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col lg:flex-row gap-8">
            <!-- Filters Sidebar -->
            <div class="w-full lg:w-1/4">
                <div class="bg-white rounded-lg shadow-md p-6 sticky top-4">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-lg font-bold text-gray-900">Filtrar Resultados</h2>
                        <button id="clear-filters" class="text-sm text-indigo-600 hover:text-indigo-800">Limpar filtros</button>
                    </div>
                    
                    <div class="space-y-6">
                        <!-- Localização -->
                        <div class="filter-card">
                            <h3 class="font-medium text-gray-900 mb-3 flex items-center">
                                <i class="fas fa-map-marker-alt text-indigo-600 mr-2"></i> Localização
                            </h3>
                            <div class="relative">
                                <input type="text" id="location-input" name="cidade" class="w-full p-2 border border-gray-300 rounded-md pl-9" placeholder="Digite seu CEP ou endereço" value="<?= htmlspecialchars($cidade) ?>">
                                <i class="fas fa-location-dot absolute left-3 top-3 text-gray-400"></i>
                                <button id="use-location" class="absolute right-2 top-2 text-indigo-600">
                                    <i class="fas fa-location-arrow"></i>
                                </button>
                            </div>
                            <div class="mt-3 flex items-center">
                                <input type="checkbox" id="near-me" class="rounded text-indigo-600">
                                <label for="near-me" class="ml-2 text-sm text-gray-700">Mostrar apenas profissionais próximos</label>
                            </div>
                            <div class="mt-3">
                                <label class="block text-sm text-gray-700 mb-1">Distância máxima: <span id="distance-value"><?= $distancia ?></span> km</label>
                                <input type="range" id="distance-slider" min="1" max="50" value="<?= $distancia ?>" class="range-slider w-full">
                            </div>
                        </div>
                        
                        <!-- Categorias -->
                        <div class="filter-card">
                            <h3 class="font-medium text-gray-900 mb-3 flex items-center">
                                <i class="fas fa-tags text-indigo-600 mr-2"></i> Categorias
                            </h3>
                            <div class="space-y-2 max-h-60 overflow-y-auto pr-2">
                                <?php foreach($categorias as $categoria): ?>
                                    <div class="flex items-center">
                                        <input type="checkbox" id="cat-<?= $categoria['id'] ?>" name="categoria_id[]" class="rounded text-indigo-600 category-checkbox" value="<?= $categoria['id'] ?>" <?= ($categoria_id == $categoria['id']) ? 'checked' : '' ?>>
                                        <label for="cat-<?= $categoria['id'] ?>" class="ml-2 text-sm text-gray-700"><?= htmlspecialchars($categoria['nome']) ?></label>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        </div>
                        
                        <!-- Preço -->
                        <div class="filter-card">
                            <h3 class="font-medium text-gray-900 mb-3 flex items-center">
                                <i class="fas fa-dollar-sign text-indigo-600 mr-2"></i> Faixa de Preço
                            </h3>
                            <div class="mt-2">
                                <label class="block text-sm text-gray-700 mb-1">Valor máximo: R$ <span id="price-value"><?= $preco_maximo ?: '500' ?></span></label>
                                <input type="range" id="price-slider" min="50" max="2000" value="<?= $preco_maximo ?: '500' ?>" step="50" class="range-slider w-full">
                            </div>
                        </div>
                        
                        <!-- Avaliação -->
                        <div class="filter-card">
                            <h3 class="font-medium text-gray-900 mb-3 flex items-center">
                                <i class="fas fa-star text-indigo-600 mr-2"></i> Avaliação Mínima
                            </h3>
                            <div class="flex space-x-2">
                                <button class="rating-filter flex-1 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50" data-rating="0">Qualquer</button>
                                <button class="rating-filter flex-1 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50" data-rating="4">4.0+</button>
                                <button class="rating-filter flex-1 py-2 bg-indigo-100 border-indigo-300 text-indigo-700 border rounded-md text-sm font-medium <?= ($avaliacao_minima >= 4.5) ? 'active' : '' ?>" data-rating="4.5">4.5+</button>
                            </div>
                        </div>
                        
                        <!-- Outros Filtros -->
                        <div class="filter-card">
                            <h3 class="font-medium text-gray-900 mb-3 flex items-center">
                                <i class="fas fa-sliders-h text-indigo-600 mr-2"></i> Outros Filtros
                            </h3>
                            <div class="space-y-2">
                                <div class="flex items-center">
                                    <input type="checkbox" id="verified-only" class="rounded text-indigo-600" checked>
                                    <label for="verified-only" class="ml-2 text-sm text-gray-700">Apenas verificados</label>
                                </div>
                                <div class="flex items-center">
                                    <input type="checkbox" id="online-now" class="rounded text-indigo-600">
                                    <label for="online-now" class="ml-2 text-sm text-gray-700">Online agora</label>
                                </div>
                                <div class="flex items-center">
                                    <input type="checkbox" id="instant-booking" class="rounded text-indigo-600">
                                    <label for="instant-booking" class="ml-2 text-sm text-gray-700">Agendamento instantâneo</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Results Section -->
            <div class="w-full lg:w-3/4">
                <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 class="text-xl font-bold text-gray-900">Profissionais Disponíveis</h2>
                            <p class="text-gray-600 mt-1">Exibindo <span class="font-medium" id="result-count">0</span> profissionais próximos de você</p>
                        </div>
                        
                        <div class="mt-4 md:mt-0">
                            <div class="flex items-center">
                                <span class="text-gray-700 mr-2">Ordenar por:</span>
                                <select id="sort-by" name="ordenar_por" class="border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                                    <option value="relevancia" <?= ($ordenar_por == 'relevancia') ? 'selected' : '' ?>>Relevância</option>
                                    <option value="avaliacao" <?= ($ordenar_por == 'avaliacao') ? 'selected' : '' ?>>Melhor avaliação</option>
                                    <option value="distancia" <?= ($ordenar_por == 'distancia') ? 'selected' : '' ?>>Mais próximos</option>
                                    <option value="preco_asc" <?= ($ordenar_por == 'preco_asc') ? 'selected' : '' ?>>Menor preço</option>
                                    <option value="preco_desc" <?= ($ordenar_por == 'preco_desc') ? 'selected' : '' ?>>Maior preço</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-6 tabs flex border-b border-gray-200">
                        <button class="tab-btn pb-3 px-4 text-gray-500 hover:text-gray-700 active" data-tab="all">Todos</button>
                        <button class="tab-btn pb-3 px-4 text-gray-500 hover:text-gray-700" data-tab="available">Disponíveis Hoje</button>
                        <button class="tab-btn pb-3 px-4 text-gray-500 hover:text-gray-700" data-tab="verified">Verificados</button>
                        <button class="tab-btn pb-3 px-4 text-gray-500 hover:text-gray-700" data-tab="top-rated">Melhor Avaliados</button>
                    </div>
                    
                    <div id="results-container" class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <!-- Os resultados serão carregados aqui via JavaScript -->
                        <div class="text-center py-12">
                            <i class="fas fa-search text-gray-400 text-4xl mb-4"></i>
                            <p class="text-gray-600">Carregando profissionais...</p>
                        </div>
                    </div>
                    
                    <!-- Pagination -->
                    <div id="pagination" class="mt-8 hidden">
                        <div class="flex items-center justify-between border-t border-gray-200 pt-6">
                            <div class="flex-1 flex justify-between sm:hidden">
                                <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Anterior</a>
                                <a href="#" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Próxima</a>
                            </div>
                            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p class="text-sm text-gray-700">
                                        Mostrando <span class="font-medium">1</span> a <span class="font-medium">6</span> de <span class="font-medium" id="total-results">0</span> resultados
                                    </p>
                                </div>
                                <div id="pagination-links">
                                    <!-- Paginação será carregada aqui -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Map Section -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-xl font-bold text-gray-900 mb-4">Profissionais próximos no mapa</h2>
                    
                    <div class="map-container bg-gray-200 relative">
                        <!-- Mapa será implementado com Leaflet -->
                        <div id="map"></div>
                        <div id="mapLoading" class="hidden absolute inset-0 flex justify-center items-center bg-white bg-opacity-80">
                            <div class="loading"></div>
                        </div>
                        <div id="mapNoCoords" class="hidden absolute inset-0 flex justify-center items-center bg-white bg-opacity-90">
                            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 max-w-md">
                                <div class="flex">
                                    <div class="flex-shrink-0">
                                        <i class="fas fa-exclamation-triangle text-yellow-400"></i>
                                    </div>
                                    <div class="ml-3">
                                        <p class="text-sm text-yellow-700">
                                            Nenhum profissional possui coordenadas geográficas para exibir no mapa.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Footer -->
    <footer class="bg-gray-800 mt-12">
        <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                    <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase">Serviços</h3>
                    <ul class="mt-4 space-y-4">
                        <li><a href="#" class="text-base text-gray-300 hover:text-white">Encanador</a></li>
                        <li><a href="#" class="text-base text-gray-300 hover:text-white">Eletricista</a></li>
                        <li><a href="#" class="text-base text-gray-300 hover:text-white">Pintor</a></li>
                        <li><a href="#" class="text-base text-gray-300 hover:text-white">Diarista</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase">Empresa</h3>
                    <ul class="mt-4 space-y-4">
                        <li><a href="#" class="text-base text-gray-300 hover:text-white">Sobre nós</a></li>
                        <li><a href="#" class="text-base text-gray-300 hover:text-white">Carreiras</a></li>
                        <li><a href="#" class="text-base text-gray-300 hover:text-white">Blog</a></li>
                        <li><a href="#" class="text-base text-gray-300 hover:text-white">Imprensa</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
                    <ul class="mt-4 space-y-4">
                        <li><a href="#" class="text-base text-gray-300 hover:text-white">Privacidade</a></li>
                        <li><a href="#" class="text-base text-gray-300 hover:text-white">Termos</a></li>
                        <li><a href="#" class="text-base text-gray-300 hover:text-white">Segurança</a></li>
                        <li><a href="#" class="text-base text-gray-300 hover:text-white">LGPD</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase">Contato</h3>
                    <ul class="mt-4 space-y-4">
                        <li><a href="#" class="text-base text-gray-300 hover:text-white">Ajuda</a></li>
                        <li><a href="#" class="text-base text-gray-300 hover:text-white">Central de Atendimento</a></li>
                        <li><a href="#" class="text-base text-gray-300 hover:text-white">WhatsApp</a></li>
                        <li><a href="#" class="text-base text-gray-300 hover:text-white">Email</a></li>
                    </ul>
                </div>
            </div>
            <div class="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
                <div class="flex space-x-6 md:order-2">
                    <a href="#" class="text-gray-400 hover:text-gray-300">
                        <span class="sr-only">Facebook</span>
                        <i class="fab fa-facebook-f h-6 w-6"></i>
                    </a>
                    <a href="#" class="text-gray-400 hover:text-gray-300">
                        <span class="sr-only">Instagram</span>
                        <i class="fab fa-instagram h-6 w-6"></i>
                    </a>
                    <a href="#" class="text-gray-400 hover:text-gray-300">
                        <span class="sr-only">Twitter</span>
                        <i class="fab fa-twitter h-6 w-6"></i>
                    </a>
                    <a href="#" class="text-gray-400 hover:text-gray-300">
                        <span class="sr-only">LinkedIn</span>
                        <i class="fab fa-linkedin-in h-6 w-6"></i>
                    </a>
                </div>
                <p class="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
                    &copy; <?= date('Y') ?> WhoDo! Todos os direitos reservados.
                </p>
            </div>
        </div>
    </footer>
    
    <!-- Scripts -->
    <script>
    // Inicialização do mapa
    let map, markersLayer, hasInit = false;
    
    function initMapLeaflet() {
        if (hasInit) return;
        
        try {
            // Inicializar o mapa com uma visão padrão do Brasil
            map = L.map('map', { zoomControl: true }).setView([-15.7801, -47.9292], 4);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);
            
            // Inicializar o grupo de marcadores com clustering
            markersLayer = L.markerClusterGroup();
            map.addLayer(markersLayer);
            
            hasInit = true;
        } catch (e) {
            console.error("Erro ao inicializar o mapa:", e);
            document.getElementById('mapNoCoords').innerHTML = `
                <div class="flex">
                    <div class="flex-shrink-0">
                        <i class="fas fa-exclamation-triangle text-red-400"></i>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-red-700">
                            Erro ao carregar o mapa. Verifique sua conexão com a internet.
                        </p>
                    </div>
                </div>
            `;
            document.getElementById('mapNoCoords').classList.remove('hidden');
        }
    }
    
    function clearMarkers() {
        if (!markersLayer) return;
        markersLayer.clearLayers();
    }
    
    function createMarker(profissional) {
        const lat = parseFloat(profissional.latitude);
        const lng = parseFloat(profissional.longitude);
        
        if (!isFinite(lat) || !isFinite(lng)) return null;
        
        // Determinar o ícone com base na categoria
        let icon = 'fa-user';
        if (profissional.categoria_nome) {
            if (profissional.categoria_nome.toLowerCase().includes('encan')) icon = 'fa-wrench';
            else if (profissional.categoria_nome.toLowerCase().includes('eletric')) icon = 'fa-bolt';
            else if (profissional.categoria_nome.toLowerCase().includes('pint')) icon = 'fa-paint-roller';
            else if (profissional.categoria_nome.toLowerCase().includes('diar') || profissional.categoria_nome.toLowerCase().includes('limp')) icon = 'fa-broom';
        }
        
        // Construir estrelas com base na avaliação
        let estrelasHtml = '';
        const nota = parseFloat(profissional.avaliacao_media || 0);
        const cheias = Math.floor(nota);
        const temMeia = nota - cheias >= 0.3 && nota - cheias < 1;
        
        for (let i = 0; i < cheias; i++) {
            estrelasHtml += '<i class="fas fa-star text-yellow-400"></i>';
        }
        if (temMeia) {
            estrelasHtml += '<i class="fas fa-star-half-alt text-yellow-400"></i>';
        }
        
        const popup = `
            <div style="max-width:240px">
                <div class="flex items-center mb-2">
                    <img src="${profissional.foto_perfil || 'https://via.placeholder.com/100x100?text=Perfil'}" 
                         alt="${profissional.nome}" class="w-12 h-12 rounded-full mr-3 object-cover">
                    <div>
                        <strong>${profissional.nome}</strong>
                        <div class="text-xs">${estrelasHtml} ${nota.toFixed(1)}</div>
                    </div>
                </div>
                ${profissional.categoria_nome ? '<i class="fas fa-tag text-indigo-500"></i> ' + profissional.categoria_nome + '<br/>' : ''}
                ${profissional.cidade && profissional.estado ? '<i class="fas fa-map-marker-alt text-indigo-500"></i> ' + profissional.cidade + ', ' + profissional.estado + '<br/>' : ''}
                ${profissional.distancia !== null ? '<i class="fas fa-route text-indigo-500"></i> ' + profissional.distancia + ' km de distância<br/>' : ''}
                <div class="mt-2 flex space-x-2">
                    <a href="perfil.php?id=${profissional.id}" class="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700">Ver Perfil</a>
                    <a href="#" class="text-xs bg-white border border-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-50">Contratar</a>
                </div>
            </div>
        `;
        
        // Criar ícone personalizado
        const customIcon = L.divIcon({
            html: `<div class="bg-indigo-600 rounded-full w-8 h-8 flex items-center justify-center text-white shadow-lg transform hover:scale-110 transition-transform"><i class="fas ${icon}"></i></div>`,
            iconSize: [32, 32],
            className: 'custom-marker'
        });
        
        return L.marker([lat, lng], { icon: customIcon }).bindPopup(popup);
    }
    
    function atualizarMapa(profissionais) {
        document.getElementById('mapLoading').classList.remove('hidden');
        document.getElementById('mapNoCoords').classList.add('hidden');
        
        setTimeout(() => {
            try {
                initMapLeaflet();
                clearMarkers();
                
                let any = false;
                const bounds = L.latLngBounds([]);
                
                (profissionais || []).forEach(profissional => {
                    const marker = createMarker(profissional);
                    if (marker) {
                        markersLayer.addLayer(marker);
                        bounds.extend(marker.getLatLng());
                        any = true;
                    }
                });
                
                if (any) {
                    map.fitBounds(bounds, { maxZoom: 16, padding: [20, 20] });
                } else {
                    document.getElementById('mapNoCoords').classList.remove('hidden');
                }
            } catch (e) {
                console.error("Erro ao atualizar o mapa:", e);
                document.getElementById('mapNoCoords').innerHTML = `
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <i class="fas fa-exclamation-triangle text-red-400"></i>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm text-red-700">
                                Erro ao exibir os marcadores no mapa.
                            </p>
                        </div>
                    </div>
                `;
                document.getElementById('mapNoCoords').classList.remove('hidden');
            }
            
            document.getElementById('mapLoading').classList.add('hidden');
        }, 500);
    }
    
    // Função para geocodificar um endereço
    async function geocodificarEndereco(endereco) {
        try {
            const response = await fetch('geocodificar.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `endereco=${encodeURIComponent(endereco)}`
            });
            
            const data = await response.json();
            
            if (data.success) {
                return {
                    latitude: data.latitude,
                    longitude: data.longitude,
                    display_name: data.display_name
                };
            }
            
            return null;
        } catch (error) {
            console.error('Erro ao geocodificar endereço:', error);
            return null;
        }
    }
    
    // Função para obter localização atual do usuário
    function obterLocalizacaoAtual() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    
                    // Preencher os campos de localização
                    const locationInput = document.getElementById('location-input');
                    locationInput.value = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
                    
                    // Armazenar as coordenadas para uso posterior
                    locationInput.dataset.lat = lat;
                    locationInput.dataset.lon = lon;
                    
                    // Recarregar profissionais com a nova localização
                    carregarProfissionais();
                },
                error => {
                    console.error('Erro ao obter localização:', error);
                    alert('Não foi possível obter sua localização. Por favor, digite seu endereço manualmente.');
                }
            );
        } else {
            alert('Geolocalização não é suportada pelo seu navegador.');
        }
    }
    
    // Função para carregar profissionais
    async function carregarProfissionais(pagina = 1) {
        const termo = document.getElementById('search-input').value;
        const locationInput = document.getElementById('location-input');
        const location = locationInput.value;
        const distancia = document.getElementById('distance-slider').value;
        const avaliacaoMinima = document.querySelector('.rating-filter.bg-indigo-100')?.dataset.rating || 0;
        const precoMaximo = document.getElementById('price-slider').value;
        const categoriasSelecionadas = Array.from(document.querySelectorAll('.category-checkbox:checked')).map(cb => cb.value);
        const ordenarPor = document.getElementById('sort-by').value;
        const verificadoApenas = document.getElementById('verified-only').checked;
        
        // Construir URL com parâmetros
        const params = new URLSearchParams();
        if (termo) params.append('q', termo);
        
        // Verificar se temos coordenadas
        let lat = null;
        let lon = null;
        
        if (locationInput.dataset.lat && locationInput.dataset.lon) {
            lat = parseFloat(locationInput.dataset.lat);
            lon = parseFloat(locationInput.dataset.lon);
            params.append('lat', lat);
            params.append('lon', lon);
        } else if (location) {
            // Tentar geocodificar o endereço
            const coords = await geocodificarEndereco(location);
            if (coords) {
                lat = coords.latitude;
                lon = coords.longitude;
                params.append('lat', lat);
                params.append('lon', lon);
                
                // Armazenar as coordenadas para uso posterior
                locationInput.dataset.lat = lat;
                locationInput.dataset.lon = lon;
            } else {
                // Se não conseguir geocodificar, usar como cidade
                params.append('cidade', location);
            }
        }
        
        if (distancia) params.append('distancia', distancia);
        if (avaliacaoMinima) params.append('avaliacao_minima', avaliacaoMinima);
        if (precoMaximo) params.append('preco_maximo', precoMaximo);
        if (categoriasSelecionadas.length > 0) {
            categoriasSelecionadas.forEach(id => params.append('categoria_id', id));
        }
        if (ordenarPor) params.append('ordenar_por', ordenarPor);
        if (verificadoApenas) params.append('verificado', 1);
        
        params.append('pagina', pagina);
        
        try {
            const response = await fetch(`buscar_profissionais.php?${params}`);
            const profissionais = await response.json();
            
            const container = document.getElementById('results-container');
            container.innerHTML = '';
            
            if (profissionais.length === 0) {
                container.innerHTML = '<p class="text-gray-600 text-center py-8">Nenhum profissional encontrado com os filtros selecionados.</p>';
                document.getElementById('result-count').textContent = '0';
                document.getElementById('pagination').classList.add('hidden');
                return;
            }
            
            document.getElementById('result-count').textContent = profissionais.length;
            
            profissionais.forEach(profissional => {
                const card = document.createElement('div');
                card.className = 'service-card bg-white rounded-lg shadow-md overflow-hidden transition duration-300 ease-in-out relative';
                
                // Badge de disponibilidade (poderia ser dinâmico)
                const badgeClass = profissional.verificado ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
                const badgeIcon = profissional.verificado ? 'fa-check-circle' : 'fa-clock';
                const badgeText = profissional.verificado ? 'Verificado' : 'Disponível agora';
                
                // Construir estrelas com base na avaliação
                let estrelasHtml = '';
                const nota = parseFloat(profissional.avaliacao_media || 0);
                const cheias = Math.floor(nota);
                const temMeia = nota - cheias >= 0.3 && nota - cheias < 1;
                const vazias = 5 - cheias - (temMeia ? 1 : 0);
                
                for (let i = 0; i < cheias; i++) {
                    estrelasHtml += '<i class="fas fa-star"></i>';
                }
                if (temMeia) {
                    estrelasHtml += '<i class="fas fa-star-half-alt"></i>';
                }
                for (let i = 0; i < vazias; i++) {
                    estrelasHtml += '<i class="far fa-star"></i>';
                }
                
                card.innerHTML = `
                    <span class="availability-badge px-3 py-1 ${badgeClass} rounded-full text-xs font-medium">
                        <i class="fas ${badgeIcon} mr-1"></i> ${badgeText}
                    </span>
                    <div class="relative pb-48 overflow-hidden">
                        <img class="absolute inset-0 h-full w-full object-cover" 
                             src="${profissional.foto_perfil || 'https://via.placeholder.com/500x300?text=Perfil'}" 
                             alt="${profissional.nome}">
                    </div>
                    <div class="p-4">
                        <div class="flex items-start">
                            <div class="flex-1">
                                <h3 class="text-lg font-bold text-gray-900">${profissional.nome}</h3>
                                <p class="text-sm text-gray-500">${profissional.especialidade || profissional.categoria_nome}</p>
                            </div>
                            <div class="flex-shrink-0">
                                <div class="rating-stars text-sm">
                                    ${estrelasHtml}
                                    <span class="ml-1 text-gray-600">${nota.toFixed(1)}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mt-3 flex items-center text-sm">
                            <i class="fas fa-map-marker-alt text-gray-400 mr-1"></i>
                            <span class="text-gray-600">${profissional.cidade || 'Localização não informada'}${profissional.estado ? ', ' + profissional.estado : ''}</span>
                            ${profissional.distancia !== null ? `<span class="mx-2">•</span>
                            <i class="fas fa-route text-gray-400 mr-1"></i>
                            <span class="text-gray-600">${profissional.distancia} km de distância</span>` : ''}
                        </div>
                        
                        <div class="mt-4 grid grid-cols-2 gap-2">
                            <a href="perfil.php?id=${profissional.id}" class="px-3 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 text-center">
                                Ver Perfil
                            </a>
                            <a href="#" class="px-3 py-2 bg-white border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 text-center">
                                Contratar
                            </a>
                        </div>
                    </div>
                `;
                
                container.appendChild(card);
            });
            
            // Mostrar paginação se necessário
            if (profissionais.length > 0) {
                document.getElementById('pagination').classList.remove('hidden');
                document.getElementById('total-results').textContent = profissionais.length;
                
                // Aqui você pode implementar a lógica de paginação
                const paginationLinks = document.getElementById('pagination-links');
                paginationLinks.innerHTML = `
                    <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                            <span class="sr-only">Anterior</span>
                            <i class="fas fa-chevron-left h-5 w-5"></i>
                        </a>
                        <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">1</a>
                        <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-indigo-50 text-sm font-medium text-indigo-600">2</a>
                        <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">3</a>
                        <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">4</a>
                        <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">5</a>
                        <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                            <span class="sr-only">Próxima</span>
                            <i class="fas fa-chevron-right h-5 w-5"></i>
                        </a>
                    </nav>
                `;
            }
            
            // Atualizar mapa com marcadores
            atualizarMapa(profissionais);
            
        } catch (error) {
            console.error('Erro ao carregar profissionais:', error);
            document.getElementById('results-container').innerHTML = '<p class="text-red-600">Erro ao carregar profissionais. Tente novamente mais tarde.</p>';
        }
    }
    
    // Inicializar quando o DOM estiver carregado
    document.addEventListener('DOMContentLoaded', function() {
        // Carregar profissionais iniciais
        carregarProfissionais();
        
        // Event listeners
        document.getElementById('search-form').addEventListener('submit', function(e) {
            e.preventDefault();
            carregarProfissionais();
        });
        
        document.getElementById('clear-filters').addEventListener('click', function() {
            document.getElementById('search-input').value = '';
            document.getElementById('location-input').value = '';
            document.getElementById('location-input').dataset.lat = '';
            document.getElementById('location-input').dataset.lon = '';
            document.getElementById('distance-slider').value = 10;
            document.getElementById('distance-value').textContent = '10 km';
            document.getElementById('price-slider').value = 500;
            document.getElementById('price-value').textContent = '500';
            document.querySelectorAll('.category-checkbox').forEach(cb => cb.checked = false);
            document.querySelectorAll('.rating-filter').forEach(btn => {
                btn.classList.remove('bg-indigo-100', 'border-indigo-300', 'text-indigo-700');
                btn.classList.add('border-gray-300');
            });
            carregarProfissionais();
        });
        
        document.getElementById('use-location').addEventListener('click', obterLocalizacaoAtual);
        
        document.getElementById('distance-slider').addEventListener('input', function() {
            document.getElementById('distance-value').textContent = this.value + ' km';
        });
        
        document.getElementById('price-slider').addEventListener('input', function() {
            document.getElementById('price-value').textContent = this.value;
        });
        
        document.querySelectorAll('.rating-filter').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.rating-filter').forEach(b => {
                    b.classList.remove('bg-indigo-100', 'border-indigo-300', 'text-indigo-700');
                    b.classList.add('border-gray-300');
                });
                this.classList.remove('border-gray-300');
                this.classList.add('bg-indigo-100', 'border-indigo-300', 'text-indigo-700');
                carregarProfissionais();
            });
        });
        
        document.querySelectorAll('.category-checkbox').forEach(cb => {
            cb.addEventListener('change', carregarProfissionais);
        });
        
        document.getElementById('sort-by').addEventListener('change', carregarProfissionais);
        
        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.tab-btn').forEach(b => {
                    b.classList.remove('active');
                });
                this.classList.add('active');
                
                // Aqui você pode adicionar lógica para filtrar por tab
                carregarProfissionais();
            });
        });
        
        // Menu mobile
        document.getElementById('mobile-menu-button').addEventListener('click', function() {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('hidden');
        });
    });
    </script>
</body>
</html>