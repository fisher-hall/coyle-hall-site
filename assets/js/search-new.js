// Search functionality using Lunr.js
(function() {
  let searchIndex;
  let searchData;
  let lunrIndex;

  console.log('Search script loaded');

  // Initialize search when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing search');
    initializeSearch();
    
    // Add a small delay to ensure all elements are rendered
    setTimeout(function() {
      setupSearchModal();
    }, 100);
  });

  async function initializeSearch() {
    console.log('Initializing search index...');
    try {
      // Load search data
      const response = await fetch('/searchindex.json');
      
      if (!response.ok) {
        console.error('Search index not found, status:', response.status);
        return;
      }
      
      const text = await response.text();
      console.log('Raw search response:', text.substring(0, 200));
      
      try {
        searchData = JSON.parse(text);
        console.log('Search data loaded:', searchData.length, 'items');
      } catch (parseError) {
        console.error('Failed to parse search index JSON:', parseError);
        return;
      }
      
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
      console.log('Lunr index built successfully');
    } catch (error) {
      console.error('Error initializing search:', error);
    }
  }

  function setupSearchModal() {
    console.log('Setting up search modal...');
    
    // Try multiple selectors for the search button
    let searchButton = document.querySelector('[data-target="search-modal"]');
    if (!searchButton) {
      searchButton = document.querySelector('[aria-label="search"]');
    }
    if (!searchButton) {
      searchButton = document.querySelector('button[aria-label="search"]');
    }
    
    const searchModal = document.getElementById('search-modal');
    const closeButton = document.getElementById('close-search');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    console.log('Search elements found:', {
      searchButton: !!searchButton,
      searchButtonSelector: searchButton ? searchButton.getAttribute('data-target') || searchButton.getAttribute('aria-label') : 'none',
      searchModal: !!searchModal,
      closeButton: !!closeButton,
      searchInput: !!searchInput,
      searchResults: !!searchResults
    });

    if (!searchButton) {
      console.error('Search button not found! Checked selectors: [data-target="search-modal"], [aria-label="search"], button[aria-label="search"]');
      return;
    }
    
    if (!searchModal) {
      console.error('Search modal not found!');
      return;
    }

    // Open search modal
    searchButton.addEventListener('click', function(e) {
      console.log('Search button clicked');
      e.preventDefault();
      searchModal.classList.remove('hidden');
      searchInput.focus();
    });

    // Close search modal
    if (closeButton) {
      closeButton.addEventListener('click', closeModal);
    }
    
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
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        if (query.length >= 2) {
          performSearch(query);
        } else {
          searchResults.innerHTML = '';
        }
      });
    }

    function closeModal() {
      console.log('Closing search modal');
      searchModal.classList.add('hidden');
      if (searchInput) searchInput.value = '';
      if (searchResults) searchResults.innerHTML = '';
    }
  }

  function performSearch(query) {
    if (!searchData) {
      document.getElementById('search-results').innerHTML = '<p class="p-4 text-red-500">Search index not loaded</p>';
      return;
    }

    try {
      let results;
      
      if (lunrIndex) {
        // Use Lunr search if available
        results = lunrIndex.search(query).map(result => {
          return searchData.find(p => p.url === result.ref);
        }).filter(Boolean);
      } else {
        // Fallback to simple text search
        console.log('Using fallback search');
        results = searchData.filter(page => {
          const searchText = (page.title + ' ' + page.description + ' ' + page.content).toLowerCase();
          return searchText.includes(query.toLowerCase());
        });
      }
      
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

    const html = results.slice(0, 10).map(page => {
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