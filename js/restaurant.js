// restaurantes.js
import { restaurants } from './restaurantData.js';

document.addEventListener('DOMContentLoaded', () => {
    // Função para renderizar restaurantes
    function renderRestaurants(filteredRestaurants = restaurants) {
        const restaurantContainer = document.querySelector('.restaurants-list-section');
        restaurantContainer.innerHTML = ''; // Limpa o container antes de renderizar

        filteredRestaurants.forEach(restaurant => {
            const restaurantCard = document.createElement('div');
            restaurantCard.classList.add('restaurant-card');
            
            restaurantCard.innerHTML = `
                <img src="${restaurant.image}" alt="Restaurante ${restaurant.name}" class="restaurant-image">
                <div class="restaurant-info">
                    <h2 class="restaurant-name">${restaurant.name}</h2>
                    <p class="restaurant-description">${restaurant.description}</p>
                    <div class="restaurant-details">
                        <span class="restaurant-category">${restaurant.category}</span>
                        <span class="restaurant-rating">${restaurant.rating}</span>
                        <span class="restaurant-delivery-time">${restaurant.deliveryTime}</span>
                    </div>
                </div>
            `;

            restaurantContainer.appendChild(restaurantCard);
        });
    }

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        
        const filteredRestaurants = restaurants.filter(restaurant => 
            restaurant.name.toLowerCase().includes(searchTerm) || 
            restaurant.category.toLowerCase().includes(searchTerm)
        );

        renderRestaurants(filteredRestaurants);
    }

    // Filter functionality
    const categorySelect = document.querySelector('.category-select');
    const ratingSelect = document.querySelector('.rating-select');
    const deliveryTimeSelect = document.querySelector('.delivery-time-select');

    [categorySelect, ratingSelect, deliveryTimeSelect].forEach(select => {
        select.addEventListener('change', applyFilters);
    });

    function applyFilters() {
        const selectedCategory = categorySelect.value.toLowerCase();
        const selectedRating = parseFloat(ratingSelect.value);
        const selectedDeliveryTime = parseInt(deliveryTimeSelect.value);

        const filteredRestaurants = restaurants.filter(restaurant => {
            const categoryMatch = !selectedCategory || restaurant.category.toLowerCase() === selectedCategory;
            const ratingMatch = !selectedRating || restaurant.rating >= selectedRating;
            const deliveryTimeMatch = !selectedDeliveryTime || 
                parseInt(restaurant.deliveryTime.split('-')[1]) <= selectedDeliveryTime;

            return categoryMatch && ratingMatch && deliveryTimeMatch;
        });

        renderRestaurants(filteredRestaurants);
    }

    // Pagination functionality
    const prevButton = document.querySelector('.pagination-prev');
    const nextButton = document.querySelector('.pagination-next');
    const currentPageSpan = document.querySelector('.pagination-current');
    
    let currentPage = 1;
    const itemsPerPage = 2;
    const totalPages = Math.ceil(restaurants.length / itemsPerPage);

    function updatePagination() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedRestaurants = restaurants.slice(startIndex, endIndex);

        renderRestaurants(paginatedRestaurants);

        currentPageSpan.textContent = `Página ${currentPage} de ${totalPages}`;
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;
    }

    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            updatePagination();
        }
    });

    // Inicialização - adicionei estas linhas para garantir que os restaurantes sejam renderizados
    renderRestaurants(); // Renderiza todos os restaurantes inicialmente
    updatePagination(); // Configura a paginação inicial
});