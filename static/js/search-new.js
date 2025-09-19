// Search functionality using Lunr.js
(function() {
  let searchIndex;
  let searchData;
  let lunrIndex;

  // Initialize search when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    setupSearchModal();
  });

  async function initializeSearch() {
    try {
      // Load search data
      const response = await fetch('/searchindex.json');
      searchData = await response.json();
      
      // Build Lunr index
      lunrIndex = lunr(function() {
        this.ref('url');
        this.field('title', { boost: 10 });
        this.field('description', { boost: 5 });
        this.field('content');
        
        searchData.forEach(function(doc, idx) {
          this.add({
            url: doc.url,
            title: doc.title,
            description: doc.description,
            content: doc.content,
            id: idx
          });
        }, this);
      });
    } catch (error) {
      console.error('Error initializing search:', error);
    }
  }

  function setupSearchModal() {
    const searchButton = document.querySelector('[data-target="search-modal"]');
    const searchModal = document.getElementById('search-modal');
    const closeButton = document.getElementById('close-search');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    if (!searchButton || !searchModal) return;

    // Open search modal
    searchButton.addEventListener('click', function() {
      searchModal.classList.remove('hidden');
      searchInput.focus();
    });

    // Close search modal
    closeButton.addEventListener('click', closeModal);
    searchModal.addEventListener('click', function(e) {
      if (e.target === searchModal) {
        closeModal();
      }
    });

    // Handle escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && !searchModal.classList.contains('hidden')) {
        closeModal();
      }
    });

    // Perform search on input
    searchInput.addEventListener('input', function() {
      const query = this.value.trim();
      if (query.length >= 2) {
        performSearch(query);
      } else {
        searchResults.innerHTML = '';
      }
    });

    function closeModal() {
      searchModal.classList.add('hidden');
      searchInput.value = '';
      searchResults.innerHTML = '';
    }
  }

  function performSearch(query) {
    if (!lunrIndex || !searchData) {
      document.getElementById('search-results').innerHTML = '<p class="p-4 text-gray-500">Search not ready yet...</p>';
      return;
    }

    try {
      const results = lunrIndex.search(query);
      displayResults(results, query);
    } catch (error) {
      console.error('Search error:', error);
      document.getElementById('search-results').innerHTML = '<p class="p-4 text-red-500">Search error occurred</p>';
    }
  }

  function displayResults(results, query) {
    const searchResults = document.getElementById('search-results');
    
    if (results.length === 0) {
      searchResults.innerHTML = '<p class="p-4 text-gray-500">No results found</p>';
      return;
    }

    const html = results.slice(0, 10).map(result => {
      const page = searchData.find(p => p.url === result.ref);
      if (!page) return '';

      const title = highlightText(page.title, query);
      const description = highlightText(page.description || '', query);
      
      return `
        <div class="border-b border-gray-200 dark:border-gray-600 p-4 hover:bg-gray-50 dark:hover:bg-darkmode-light">
          <a href="${page.url}" class="block" onclick="closeSearchModal()">
            <h4 class="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">${title}</h4>
            ${description ? `<p class="text-gray-600 dark:text-gray-300 text-sm">${description}</p>` : ''}
          </a>
        </div>
      `;
    }).join('');

    searchResults.innerHTML = html;
  }

  function highlightText(text, query) {
    if (!text || !query) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-600">$1</mark>');
  }

  // Make closeSearchModal available globally
  window.closeSearchModal = function() {
    const searchModal = document.getElementById('search-modal');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (searchModal) searchModal.classList.add('hidden');
    if (searchInput) searchInput.value = '';
    if (searchResults) searchResults.innerHTML = '';
  };
})();