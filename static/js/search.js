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
      searchString = e.target.value.toLowerCase();
      window.history.replaceState(
        {},
        "",
        `${window.location.origin}${
          window.location.pathname
        }?s=${searchString.replace(/ /g, "+")}`
      );

      doSearch(searchString);
    });
  });

  // dom content loaded
  document.addEventListener("DOMContentLoaded", async () => {
    await loadJsonData();
    doSearch(searchString);
  });

  // doSearch
  const doSearch = async (searchString) => {
    if (searchString !== "") {
      searchIcon && (searchIcon.style.display = "none");
      searchIconReset && (searchIconReset.style.display = "initial");
      emptySearchResult.forEach((el) => {
        const notFoundContent = `
  <div class="search-not-found">
    <svg width="42" height="42" viewBox="0 0 47 47" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M7.10368 33.9625C9.90104 36.2184 13.2988 37.6547 16.9158 38.0692C21.6958 38.617 26.5063 37.3401 30.3853 34.4939C30.4731 34.6109 30.5668 34.7221 30.6721 34.8304L41.9815 46.1397C42.5323 46.6909 43.2795 47.0007 44.0587 47.001C44.838 47.0013 45.5854 46.692 46.1366 46.1412C46.6878 45.5904 46.9976 44.8432 46.9979 44.064C46.9981 43.2847 46.6888 42.5373 46.138 41.9861L34.8287 30.6767C34.7236 30.5704 34.6107 30.4752 34.4909 30.3859C37.3352 26.5046 38.6092 21.6924 38.0579 16.912C37.6355 13.2498 36.1657 9.81322 33.8586 6.9977L31.7805 9.09214C34.0157 11.9274 35.2487 15.4472 35.2487 19.0942C35.2487 21.2158 34.8308 23.3167 34.0189 25.2769C33.207 27.2371 32.0169 29.0181 30.5167 30.5184C29.0164 32.0186 27.2354 33.2087 25.2752 34.0206C23.315 34.8325 21.2141 35.2504 19.0925 35.2504C16.9708 35.2504 14.8699 34.8325 12.9098 34.0206C11.5762 33.4682 10.3256 32.7409 9.18992 31.8599L7.10368 33.9625ZM28.9344 6.28152C26.1272 4.12516 22.671 2.93792 19.0925 2.93792C14.8076 2.93792 10.6982 4.64009 7.66829 7.66997C4.6384 10.6999 2.93623 14.8093 2.93623 19.0942C2.93623 21.2158 3.35413 23.3167 4.16605 25.2769C4.72475 26.6257 5.4625 27.8897 6.35716 29.0358L4.2702 31.1391C1.35261 27.548 -0.165546 23.0135 0.00974294 18.3781C0.19158 13.5695 2.18233 9.00695 5.58371 5.60313C8.98509 2.19932 13.5463 0.205307 18.3547 0.0200301C22.9447 -0.156832 27.4369 1.32691 31.0132 4.18636L28.9344 6.28152Z" fill="currentColor"/>
      <path d="M3.13672 39.1367L38.3537 3.64355" stroke="black" stroke-width="3" stroke-linecap="round"/>
    </svg>
    <p>${search_no_results} "<b>${escapeHTML(searchString)}</b>"</p>
  </div>
`;
        el.innerHTML = notFoundContent;
      });
    } else {
      searchIcon && (searchIcon.style.display = "initial");
      searchIconReset && (searchIconReset.style.display = "none");
      emptySearchResult.forEach((el) => {
        el.innerHTML = search_initial_message;
      });
    }

    let filteredJSON = includeSectionsInSearch.map((section) => {
      const data = jsonData.filter(
        (item) => slugify(item.section) === slugify(section)
      );

      const sectionName = section.replace(/[-_]/g, " ");
      return {
        section: capitalizeFirstLetter(sectionName),
        data,
      };
    });

    let searchItem = filteredJSON.filter((item) => {
      if (searchString === "") {
        return false;
      }
      return item.data.some((el) => {
        const regex = new RegExp(searchString, "gi");
        return (
          el.title.toLowerCase().match(regex) ||
          el.description?.toLowerCase().match(regex) ||
          el.searchKeyword.toLowerCase().match(regex) ||
          el.content.toLowerCase().match(regex) ||
          el.tags?.toLowerCase().match(regex) ||
          el.categories?.toLowerCase().match(regex)
        );
      });
    });

    displayResult(searchItem, searchString);

    // Navigate with arrow keys
    if (searchModal && searchString != "") {
      let resItems;
      resItems = searchResult[0].querySelectorAll(".search-result-item");
      let selectedIndex = -1;

      const selectItem = (index) => {
        if (index >= 0 && index < resItems.length) {
          for (let i = 0; i < resItems.length; i++) {
            resItems[i].classList.toggle("search-item-selected", i === index);
          }
          selectedIndex = index;
          resItems[index].scrollIntoView({
            behavior: "auto",
            block: "nearest",
          });
        }
      };

      const handleKeyDown = (event) => {
        if (searchItem.length !== 0) {
          if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            event.preventDefault();

            if (event.key === "ArrowUp") {
              selectedIndex =
                selectedIndex > 0 ? selectedIndex - 1 : resItems.length - 1;
            } else if (event.key === "ArrowDown") {
              selectedIndex =
                selectedIndex < resItems.length - 1 ? selectedIndex + 1 : 0;
            }

            selectItem(selectedIndex !== -1 ? selectedIndex : -1);
          } else if (event.key === "Enter") {
            event.preventDefault();

            if (selectedIndex !== -1) {
              let selectedLink = resItems[selectedIndex]
                .getElementsByClassName("search-result-item-title")[0]
                .getAttribute("href");
              window.location.href = selectedLink;
            }
          }
        }
      };

      searchInput.forEach((el) => {
        el.addEventListener("keydown", handleKeyDown);
      });
      selectItem(-1);
    }
  };

  const displayResult = (searchItems, searchString) => {
    const generateSearchResultHTML = (item) => {
      const highlightResult = (content) => {
        const regex = new RegExp(searchString, "i");
        return content.replace(regex, (match) => `<u>${match}</u>`);
      };
      const highlightResultContent = (content) => {
        const regex = new RegExp(searchString, "i");
        const matchIndex = content.search(regex);

        if (matchIndex >= 0) {
          const matchedContent = content.slice(matchIndex);
          const lastWord = content.slice(0, matchIndex).split(" ").pop();

          return matchedContent.replace(
            regex,
            (match) => lastWord + `<mark>${match}</mark>`
          );
        }

        return content;
      };

      const filteredItems = item.data.filter(
        (d) =>
          d.title.toLowerCase().includes(searchString) ||
          (description === "true"
            ? d.description?.toLowerCase().includes(searchString)
            : "") ||
          d.searchKeyword.toLowerCase().includes(searchString) ||
          (tags === "true"
            ? d.tags?.toLowerCase().includes(searchString)
            : "") ||
          (categories === "true"
            ? d.categories?.toLowerCase().includes(searchString)
            : "") ||
          d.content.toLowerCase().includes(searchString)
      );

      // pull template from hugo template definition
      let templateDefinition =
        searchResultItemTemplate != null
          ? searchResultItemTemplate.innerHTML
          : `
          <div class="search-result-item">
          #{ isset image }<div class="search-result-item-image">#{image}</div>#{ end }
          <div class="search-result-item-body">
            <a href="#{slug}" class="search-result-item-title">#{title}</a>
            #{ isset description }<p class="search-result-item-description">#{description}</p>#{ end }
            <p class="search-result-item-content">#{content}</p>
            <div class="search-result-item-taxonomies">
              #{ isset categories }<div><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" style="margin-top:-2px"><path d="M11 0H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2 2 2 0 0 0 2-2V4a2 2 0 0 0-2-2 2 2 0 0 0-2-2zm2 3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1V3zM2 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2z"/></svg>#{categories}</div>#{ end }
              
              #{ isset tags }<div><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M3 2v4.586l7 7L14.586 9l-7-7H3zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586V2z"/><path d="M5.5 5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM1 7.086a1 1 0 0 0 .293.707L8.75 15.25l-.043.043a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 0 7.586V3a1 1 0 0 1 1-1v5.086z"/></svg>#{tags}</div>#{ end }
            </div>
          </div>
        </div>`;

      const renderedItems = filteredItems
        .map((innerItem) => {
          let output = renderResult(templateDefinition, {
            slug: innerItem.slug,
            date: innerItem.date,
            description:
              description == "true"
                ? highlightResult(innerItem.description)
                : "",
            title: highlightResult(innerItem.title),
            image: image == "true" ? innerItem.image : "",
            tags: tags == "true" ? highlightResult(innerItem.tags) : "nomatch",
            categories:
              categories == "true"
                ? highlightResult(innerItem.categories)
                : "nomatch",
            content: highlightResultContent(innerItem.content),
          });

          return output;
        })
        .join("");

      return `
				<div class="search-result-group">
					<p class="search-result-group-title">${item.section}</p>
					${renderedItems}
				</div>`;
    };

    const filteredItemsLength = searchItems.reduce((totalLength, item) => {
      const filteredItems = item.data.filter(
        (d) =>
          d.title.toLowerCase().includes(searchString) ||
          (description === "true"
            ? d.description?.toLowerCase().includes(searchString)
            : "") ||
          d.searchKeyword.toLowerCase().includes(searchString) ||
          (tags === "true"
            ? d.tags?.toLowerCase().includes(searchString)
            : "") ||
          (categories === "true"
            ? d.categories?.toLowerCase().includes(searchString)
            : "") ||
          d.content.toLowerCase().includes(searchString)
      );

      return totalLength + filteredItems.length;
    }, 0);

    // count time start
    const startTime = performance.now();

    // Render Result into HTML
    const htmlString = searchItems.map(generateSearchResultHTML).join("");
    searchResult.forEach((el) => {
      el.innerHTML = htmlString;
    });

    // count time end
    const endTime = performance.now();

    // count total-result and time
    let totalResults = `<em>${filteredItemsLength}</em> results`;
    let totalTime = ((endTime - startTime) / 1000).toFixed(3);
    totalTime = `- in <em>${totalTime}</em> seconds`;

    searchResultInfo &&
      (searchResultInfo.innerHTML =
        filteredItemsLength > 0 ? `${totalResults} ${totalTime}` : "");

    // hide search-result-group-title if un-available result
    const groupTitle = document.querySelectorAll(".search-result-group-title");
    groupTitle.forEach((el) => {
      // hide search-result-group-title if there is no result
      if (el.nextElementSibling === null) {
        el.style.display = "none";
      }
      // hide emptySearchResult if there is no result
      if (el.nextElementSibling != null) {
        emptySearchResult.forEach((el) => {
          el.style.display = "";
        });
      } else {
        emptySearchResult.forEach((el) => {
          el.style.display = "block";
        });
      }
    });

    // hide tag/category if un-available result
    const searchInfo = document.querySelectorAll(".search-info > div");
    if (searchInfo.length > 0) {
      // hide tag/category if there is no result
      searchInfo.forEach((el) => {
        if (el.innerText.includes("nomatch") || el.innerText == "") {
          el.classList.add("hidden");
        }
      });
    }
  };
}

// Render Result Template
const renderResult = (templateString, data) => {
  var conditionalMatches, conditionalPattern, copy;
  conditionalPattern = /\#\{\s*isset ([a-zA-Z]*) \s*\}(.*)\#\{\s*end\s*}/g;
  // since loop below depends on re.lastIndex, we use a copy to capture any manipulations whilst inside the loop
  copy = templateString;
  while (
    (conditionalMatches = conditionalPattern.exec(templateString)) !== null
  ) {
    if (data[conditionalMatches[1]]) {
      // if valid key, remove conditionals, leave contents.
      copy = copy.replace(conditionalMatches[0], conditionalMatches[2]);
    } else {
      // if not valid, remove entire section
      copy = copy.replace(conditionalMatches[0], "");
    }
  }
  templateString = copy;
  //now any conditionals removed we can do simple substitution
  var key, find, re;
  for (key in data) {
    find = "\\#\\{\\s*" + key + "\\s*\\}";
    re = new RegExp(find, "g");
    templateString = templateString.replace(re, data[key]);
  }
  return templateString;
};

// ========================================================================================

// Reset Search
const resetSearch = () => {
  searchIcon && (searchIcon.style.display = "initial");
  searchIconReset && (searchIconReset.style.display = "none");
  searchInput.forEach((el) => {
    el.value = "";
  });
  searchResult.forEach((el) => {
    el.innerHTML = "";
  });
  emptySearchResult.forEach((el) => {
    el.style.display = "";
    el.innerHTML = search_initial_message;
  });
  searchResultInfo.innerHTML = "";

  // clear search query string from URL
  if (window.location.search.includes("?s=")) {
    window.history.pushState(
      "",
      document.title,
      window.location.pathname + window.location.hash
    );
  }
};

// Body Scroll
const enableBodyScroll = () => {
  setTimeout(() => {
    body.style.overflowY = "";
    body.style.paddingRight = "";
  }, 200);
};
const disableBodyScroll = () => {
  const documentWidth = document.documentElement.clientWidth;
  const scrollbarWidth = Math.abs(window.innerWidth - documentWidth);
  body.style.overflowY = "hidden";
  body.style.paddingRight = scrollbarWidth + "px";
};

// Show/Hide Search Modal
const showModal = () => {
  searchModal.classList.add("show");
  window.setTimeout(
    () => document.querySelector("[data-search-input]").focus(),
    100
  );
  if (hasSearchModal) {
    disableBodyScroll();
    searchModalVisible = true;
  }
};
const closeModal = () => {
  searchModal.classList.remove("show");
  resetSearch();
  if (hasSearchModal) {
    enableBodyScroll();
    searchModalVisible = false;
  }
};

// Trigger Search Modal Show/Hide Events
if (hasSearchWrapper) {
  // Show Search Modal on page load
  if (searchModalVisible) {
    showModal();
  }

  // Trigger Reset Search
  searchIconReset &&
    searchIconReset.addEventListener("click", () => {
      resetSearch();
    });

  // Open Search Modal with click
  openSearchModal.forEach((el) => {
    el.addEventListener("click", function () {
      showModal();
    });
  });

  // Close Search Modal with click
  closeSearchModal.forEach((el) => {
    el.addEventListener("click", function () {
      closeModal();
    });
  });

  // Close modal on click outside modal-body
  searchWrapper.addEventListener("click", function (e) {
    if (e.target.classList.contains("search-wrapper")) {
      closeModal();
    }
  });

  // Close modal with ESC
  const closeSearchModalWithESC = (e) => {
    if (e.key === "Escape") {
      if (searchModalVisible) {
        e.preventDefault();
        closeModal();
      }
    }
  };

  // Toggle modal on Ctrl + K / Cmd + K
  const toggleSearchModalWithK = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      if (searchModalVisible) {
        e.preventDefault();
        closeModal();
      } else {
        e.preventDefault();
        showModal();
      }
    }
  };
  document.addEventListener("keydown", (e) => {
    toggleSearchModalWithK(e);
    closeSearchModalWithESC(e);
  });
}
