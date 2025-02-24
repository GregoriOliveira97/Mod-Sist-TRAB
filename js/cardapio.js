import { menuItems as defaultMenuItems } from './menuData.js';

document.addEventListener('DOMContentLoaded', () => {

    function initializeMenuItems() {
        // Verifica se já existem itens no menu
        if (!localStorage.getItem('menuItems')) {
            // Itens padrão do menu
            const defaultMenuItems = [
                {
                    id: '1',
                    name: 'X-Burguer',
                    category: 'Lanches',
                    price: 12.90,
                    description: 'Hambúrguer com queijo, alface e tomate',
                    image: '/images/xburguer.jpg'
                },
                {
                    id: '2',
                    name: 'Coca-Cola',
                    category: 'Bebidas',
                    price: 5.00,
                    description: 'Refrigerante 350ml',
                    image: '/images/coca.jpg'
                },
                {
                    id: '3',
                    name: 'Batata Frita',
                    category: 'Acompanhamentos',
                    price: 8.90,
                    description: 'Porção de batata frita crocante',
                    image: '/images/batata.jpg'
                },
                {
                    id: '4',
                    name: 'Milk Shake',
                    category: 'Bebidas',
                    price: 13.90,
                    description: 'Milk shake de chocolate 400ml',
                    image: '/images/milkshake.jpg'
                }
            ];

            // Salva os itens padrão no localStorage
            localStorage.setItem('menuItems', JSON.stringify(defaultMenuItems));
        }
    }

    let currentPage = 1;
    const itemsPerPage = 4;
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Recuperar itens do localStorage ou usar os dados padrão
    const menuItems = JSON.parse(localStorage.getItem('menuItems')) || defaultMenuItems;

    function addToCart(item) {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            cart.push({
                name: item.name,
                category: item.category,
                price: item.price,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Função para renderizar pratos
    function renderMenuItems(filteredItems = menuItems) {
        const menuContainer = document.querySelector('.restaurants-list-section');
        
        if (!menuContainer) {
            console.error("Menu container not found!");
            return;
        }

        menuContainer.innerHTML = ''; // Limpa o container antes de renderizar

        const localStorageItems = JSON.parse(localStorage.getItem('menuItems')) || filteredItems;

        // Aplica paginação
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedItems = filteredItems.slice(startIndex, endIndex);

        paginatedItems.forEach(item => {
            const menuItemCard = document.createElement('div');
            menuItemCard.classList.add('restaurant-card');
            const truncatedDescription = item.description.length > 30 
            ? item.description.substring(0, 30) + '...' 
            : item.description;
            
            menuItemCard.innerHTML = `
                <div class="restaurant-card-image">
                    <img src="${item.image || 'caminho/para/imagem-padrao.jpg'}" alt="${item.name}">
                </div>
                <div class="restaurant-card-content">
                    <h3 class="restaurant-card-title">${item.name}</h3>
                    <div class="restaurant-card-details">
                        <span class="restaurant-category">${item.category}</span>
                        <span class="restaurant-price">R$ ${item.price.toFixed(2)}</span>
                    </div>
                    <p class="restaurant-description">${truncatedDescription || ''}</p>
                    <button class="restaurant-card-button">Adicionar ao Carrinho</button>
                </div>
            `;

            menuContainer.appendChild(menuItemCard);

            // Adiciona evento de adicionar ao carrinho (placeholder)
            const addToCartButton = menuItemCard.querySelector('.restaurant-card-button');
            addToCartButton.addEventListener('click', () => {
                addToCart(item);
                alert(`${item.name} adicionado ao carrinho!`);
            });
        });

        updatePaginationControls(filteredItems);
    }

    // Função para atualizar controles de paginação
    function updatePaginationControls(items) {
        const totalPages = Math.ceil(items.length / itemsPerPage);
        const currentPageSpan = document.querySelector('.pagination-current');
        const prevButton = document.querySelector('.pagination-prev');
        const nextButton = document.querySelector('.pagination-next');

        if (currentPageSpan) {
            currentPageSpan.textContent = `Página ${currentPage} de ${totalPages}`;
        }

        if (prevButton) {
            prevButton.disabled = currentPage === 1;
        }

        if (nextButton) {
            nextButton.disabled = currentPage === totalPages;
        }
    }

    // Funcionalidade de busca
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');

    function performSearch() {
        currentPage = 1; // Reinicia para primeira página ao buscar
        const searchTerm = searchInput.value.toLowerCase();
        
        const filteredItems = menuItems.filter(item => 
            item.name.toLowerCase().includes(searchTerm) || 
            item.category.toLowerCase().includes(searchTerm)
        );

        renderMenuItems(filteredItems);
    }

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    // Funcionalidades de filtro
    const categorySelect = document.querySelector('.category-select');
    const priceSelect = document.querySelector('.delivery-time-select');

    function applyFilters() {
        currentPage = 1; // Reinicia para primeira página ao filtrar
        const selectedCategory = categorySelect.value.toLowerCase();
        const selectedPrice = parseFloat(priceSelect.value);

        const filteredItems = menuItems.filter(item => {
            const categoryMatch = !selectedCategory || item.category.toLowerCase() === selectedCategory;
            const priceMatch = !selectedPrice || item.price <= selectedPrice;

            return categoryMatch && priceMatch;
        });

        renderMenuItems(filteredItems);
    }

    [categorySelect, priceSelect].forEach(select => {
        select.addEventListener('change', applyFilters);
    });

    // Controles de paginação
    const prevButton = document.querySelector('.pagination-prev');
    const nextButton = document.querySelector('.pagination-next');

    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderMenuItems();
        }
    });

    nextButton.addEventListener('click', () => {
        const totalPages = Math.ceil(menuItems.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderMenuItems();
        }
    });
    
    // Chamada inicial de renderização com paginação
    renderMenuItems();
    initializeMenuItems();
});
