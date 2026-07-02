// Simple in-site search. Loads the Hugo-generated search index (relative,
// same-origin URL) and filters it client-side. No external requests.

document.addEventListener('DOMContentLoaded', function() {
  // Find search elements
  const searchButton = document.querySelector('[data-target="search-modal"]') ||
                      document.querySelector('[aria-label="search"]');
  const searchModal = document.getElementById('search-modal');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const closeButton = document.getElementById('close-search');

  if (!searchButton || !searchModal) {
    return;
  }

  let searchData = [];

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function(c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function escapeRegExp(str) {
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Load the search index; fall back to the static snapshot if the
  // dynamically generated one is unavailable.
  fetch('/searchindex.json')
    .then(response => {
      if (!response.ok) throw new Error('search index ' + response.status);
      return response.json();
    })
    .catch(() => fetch('/static-searchindex.json').then(r => r.json()))
    .then(data => {
      searchData = data;
    })
    .catch(error => {
      console.error('Failed to load search data:', error);
    });

  // Open search modal
  searchButton.addEventListener('click', function(e) {
    e.preventDefault();
    searchModal.classList.remove('hidden');
    if (searchInput) searchInput.focus();
  });

  // Close search modal
  function closeModal() {
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

      if (query.length >= 2) {
        const results = searchData.filter(item => {
          const searchText = (item.title + ' ' + (item.summary || '') + ' ' + (item.content || '')).toLowerCase();
          return searchText.includes(query);
        }).map(item => {
          // Create a snippet around the matched keyword, using available content
          const contentForSnippet = item.content || item.summary || item.title || '';
          const snippet = createSnippet(contentForSnippet, query);
          return {
            ...item,
            snippet: snippet
          };
        });
        
        displayResults(results, query);
      } else {
        if (searchResults) searchResults.innerHTML = '';
      }
    });
  }
  
  function createSnippet(content, query, snippetLength = 150) {
    // Handle undefined or empty content
    if (!content || typeof content !== 'string') {
      return '';
    }
    
    const lowerContent = content.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const queryIndex = lowerContent.indexOf(lowerQuery);
    
    if (queryIndex === -1) {
      // If query not found in content, return beginning of content
      return escapeHtml(content.substring(0, snippetLength) + (content.length > snippetLength ? '...' : ''));
    }
    
    // Calculate start position for snippet
    const start = Math.max(0, queryIndex - Math.floor(snippetLength / 2));
    const end = Math.min(content.length, start + snippetLength);
    
    let snippet = content.substring(start, end);
    
    // Add ellipsis if we're not at the beginning or end
    if (start > 0) snippet = '...' + snippet;
    if (end < content.length) snippet = snippet + '...';
    
    // Escape before highlighting so the query/content can't inject markup
    snippet = escapeHtml(snippet);
    const regex = new RegExp(`(${escapeRegExp(escapeHtml(query))})`, 'gi');
    snippet = snippet.replace(regex, '<mark>$1</mark>');

    return snippet;
  }
  
  function displayResults(results, query) {
    if (!searchResults) return;
    
    if (results.length === 0) {
      searchResults.innerHTML = '<p class="p-4 text-gray-500">No results found for "' + escapeHtml(query) + '"</p>';
      return;
    }

    const html = results.slice(0, 10).map(item => `
      <div class="border border-gray-200 rounded-2xl p-4 mb-3 hover:bg-gray-50 hover:shadow-md transition-all duration-200">
        <a href="${escapeHtml(item.url)}" class="block" onclick="closeSearchModal()">
          <h4 class="font-semibold text-lg mb-2 text-blue-600">${escapeHtml(item.title)}</h4>
          <p class="text-gray-600 text-sm mb-2">${escapeHtml(item.description || '')}</p>
          ${item.snippet ? `<p class="text-gray-700 text-sm">${item.snippet}</p>` : ''}
        </a>
      </div>
    `).join('');
    
    searchResults.innerHTML = html;
  }
  
  // Make closeSearchModal global
  window.closeSearchModal = closeModal;
});