// Simple search functionality
console.log('Simple search script loaded');

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded - setting up search');
  
  // Find search elements
  const searchButton = document.querySelector('[data-target="search-modal"]') || 
                      document.querySelector('[aria-label="search"]');
  const searchModal = document.getElementById('search-modal');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const closeButton = document.getElementById('close-search');
  
  console.log('Search elements:', {
    button: !!searchButton,
    modal: !!searchModal,
    input: !!searchInput,
    results: !!searchResults
  });
  
  if (!searchButton || !searchModal) {
    console.error('Missing search elements');
    return;
  }
  
  let searchData = [];
  
  // Load search data
  fetch('/searchindex.json')
    .then(response => response.json())
    .then(data => {
      searchData = data;
      console.log('Search data loaded:', searchData.length, 'items');
    })
    .catch(error => {
      console.error('Failed to load search data:', error);
    });
  
  // Open search modal
  searchButton.addEventListener('click', function(e) {
    console.log('Search button clicked');
    e.preventDefault();
    searchModal.classList.remove('hidden');
    if (searchInput) searchInput.focus();
  });
  
  // Close search modal
  function closeModal() {
    console.log('Closing search modal');
    searchModal.classList.add('hidden');
    if (searchInput) searchInput.value = '';
    if (searchResults) searchResults.innerHTML = '';
  }
  
  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }
  
  // Close on escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !searchModal.classList.contains('hidden')) {
      closeModal();
    }
  });
  
  // Close on backdrop click
  searchModal.addEventListener('click', function(e) {
    if (e.target === searchModal) {
      closeModal();
    }
  });
  
  // Search functionality
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const query = this.value.trim().toLowerCase();
      console.log('Searching for:', query);
      
      if (query.length >= 2) {
        const results = searchData.filter(item => {
          const searchText = (item.title + ' ' + item.description + ' ' + item.content).toLowerCase();
          return searchText.includes(query);
        });
        
        console.log('Search results:', results.length);
        displayResults(results, query);
      } else {
        if (searchResults) searchResults.innerHTML = '';
      }
    });
  }
  
  function displayResults(results, query) {
    if (!searchResults) return;
    
    if (results.length === 0) {
      searchResults.innerHTML = '<p class="p-4 text-gray-500">No results found for "' + query + '"</p>';
      return;
    }
    
    const html = results.slice(0, 10).map(item => `
      <div class="border-b border-gray-200 p-4 hover:bg-gray-50">
        <a href="${item.url}" class="block" onclick="closeSearchModal()">
          <h4 class="font-semibold text-lg mb-2 text-blue-600">${item.title}</h4>
          <p class="text-gray-600 text-sm">${item.description}</p>
        </a>
      </div>
    `).join('');
    
    searchResults.innerHTML = html;
  }
  
  // Make closeSearchModal global
  window.closeSearchModal = closeModal;
});