/**
 * Accessible ARIA Combobox City Search for Sweet Maid Cleaning Service
 * Lazily loads /data/city_search_index.json on input focus (<80 KB gzipped)
 * Provides instant prefix + fuzzy matching and keyboard navigation
 */

(function () {
  let searchData = null;
  let isLoading = false;
  const loadListeners = [];

  function fetchIndex(callback) {
    if (searchData) {
      callback(searchData);
      return;
    }
    loadListeners.push(callback);
    if (isLoading) return;
    isLoading = true;

    fetch('/data/city_search_index.json')
      .then(res => res.json())
      .then(data => {
        searchData = data;
        isLoading = false;
        while (loadListeners.length > 0) {
          const cb = loadListeners.shift();
          cb(searchData);
        }
      })
      .catch(err => {
        console.error('Failed to load city search index:', err);
        isLoading = false;
      });
  }

  // Pre-load index on idle or first user interaction
  function preloadOnInteraction() {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => fetchIndex(() => {}));
    } else {
      setTimeout(() => fetchIndex(() => {}), 2000);
    }
    window.removeEventListener('scroll', preloadOnInteraction);
    window.removeEventListener('mousemove', preloadOnInteraction);
    window.removeEventListener('touchstart', preloadOnInteraction);
  }
  window.addEventListener('scroll', preloadOnInteraction, { passive: true, once: true });
  window.addEventListener('mousemove', preloadOnInteraction, { passive: true, once: true });
  window.addEventListener('touchstart', preloadOnInteraction, { passive: true, once: true });

  // Damerau-Levenshtein distance calculation for fuzzy matching
  function levenshtein(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  function normalize(str) {
    return (str || '')
      .toLowerCase()
      .replace(/,\s*(fl|florida)\b/gi, '')
      .replace(/\b(fl|florida)\b/gi, '')
      .replace(/[^\w\s-]/g, '')
      .trim();
  }

  function sendAnalytics(query, matchedCity, outcome) {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'city_search', {
        search_term: query,
        matched_city: matchedCity || 'none',
        outcome: outcome || 'd'
      });
    }
  }

  function initCombobox(form) {
    if (!form || form.dataset.comboboxInitialized) return;
    form.dataset.comboboxInitialized = 'true';

    const input = form.querySelector('input[type="text"]');
    const dropdown = form.querySelector('.search-dropdown, #search-dropdown, #city-search-dropdown');
    const listbox = form.querySelector('ul[role="listbox"], #search-results, #city-search-listbox');
    const clearBtn = form.querySelector('.clear-search, #clear-search, .clear-search-btn');
    const statusLive = form.querySelector('[role="status"]');

    if (!input || !dropdown || !listbox) return;

    let activeIndex = -1;
    let currentResults = [];

    // Lazy load on focus
    input.addEventListener('focus', () => {
      fetchIndex(() => {
        if (input.value.trim().length >= 2) {
          executeSearch();
        }
      });
    });

    function setStatus(text) {
      if (statusLive) statusLive.textContent = text;
    }

    function hideDropdown() {
      dropdown.classList.add('hidden');
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
      activeIndex = -1;
    }

    function showDropdown() {
      dropdown.classList.remove('hidden');
      input.setAttribute('aria-expanded', 'true');
    }

    function renderResults(results, query) {
      currentResults = results;
      listbox.innerHTML = '';
      activeIndex = -1;

      if (results.length === 0) {
        const noMatchLi = document.createElement('li');
        noMatchLi.className = 'px-4 py-3 text-sm text-gray-500 flex items-center justify-between';
        noMatchLi.innerHTML = `<span>No exact match for "<strong>${escapeHtml(query)}</strong>"</span><span class="text-xs text-pink-600 font-semibold">Press Enter to Search</span>`;
        listbox.appendChild(noMatchLi);
        setStatus('No matching cities found. Press enter to search all locations.');
        showDropdown();
        return;
      }

      results.forEach((item, idx) => {
        const li = document.createElement('li');
        li.id = `${input.id || 'search'}-option-${idx}`;
        li.role = 'option';
        li.setAttribute('aria-selected', 'false');
        li.className = 'px-4 py-3 cursor-pointer hover:bg-pink-50 transition-colors flex items-center justify-between border-b border-pink-50/50 last:border-none';

        const name = item.name;
        const county = item.county;
        const badge = item.ready
          ? '<span class="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Ready</span>'
          : '<span class="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Request Quote</span>';

        li.innerHTML = `
          <div class="flex items-center gap-2.5">
            <i class="fa-solid fa-location-dot text-pink-500 text-sm"></i>
            <div>
              <div class="text-sm font-bold text-gray-900">${escapeHtml(name)}</div>
              <div class="text-xs text-gray-500">${escapeHtml(county)} County</div>
            </div>
          </div>
          <div>${badge}</div>
        `;

        li.addEventListener('mousedown', (e) => {
          e.preventDefault(); // Prevent input blur
          selectItem(item);
        });

        listbox.appendChild(li);
      });

      setStatus(`${results.length} Florida cities available. Use up and down arrow keys to navigate.`);
      showDropdown();
    }

    function selectItem(item) {
      sendAnalytics(input.value.trim(), item.name, item.outcome);
      window.location.href = item.dest;
    }

    function executeSearch() {
      const raw = input.value.trim();
      const q = normalize(raw);

      if (clearBtn) {
        if (raw.length > 0) clearBtn.classList.remove('hidden');
        else clearBtn.classList.add('hidden');
      }

      if (q.length < 2) {
        hideDropdown();
        return;
      }

      if (!searchData) {
        fetchIndex(() => executeSearch());
        return;
      }

      // Check ZIP code match first (exact 5 digits)
      if (/^\d{5}$/.test(q) && searchData.zips && searchData.zips[q]) {
        const targetCityName = searchData.zips[q];
        const match = searchData.cities.find(c => c[0].toLowerCase() === targetCityName.toLowerCase());
        if (match) {
          renderResults([{
            name: match[0],
            county: match[1],
            dest: match[2],
            outcome: match[3],
            ready: match[4] === 1
          }], raw);
          return;
        }
      }

      // City matching with scores
      const matches = [];
      for (const city of searchData.cities) {
        const name = city[0];
        const county = city[1];
        const dest = city[2];
        const outcome = city[3];
        const ready = city[4] === 1;
        const aliases = city[5] ? city[5].split('|') : [];

        const lowerName = name.toLowerCase();
        let score = -1;

        // 1. Exact match
        if (lowerName === q) {
          score = 100;
        } else if (aliases.some(a => a.toLowerCase() === q)) {
          score = 98;
        }
        // 2. Starts with query
        else if (lowerName.startsWith(q)) {
          score = 80 - (lowerName.length - q.length);
        } else if (aliases.some(a => a.toLowerCase().startsWith(q))) {
          score = 75;
        }
        // 3. Includes word in name
        else if (lowerName.includes(q)) {
          score = 60 - lowerName.indexOf(q);
        }
        // 4. Fuzzy match if length >= 4
        else if (q.length >= 4) {
          const dist = levenshtein(lowerName, q);
          if (dist <= 2) {
            score = 50 - dist * 10;
          } else {
            for (const a of aliases) {
              const aDist = levenshtein(a.toLowerCase(), q);
              if (aDist <= 1) {
                score = 45;
                break;
              }
            }
          }
        }

        if (score > 0) {
          matches.push({
            name,
            county,
            dest,
            outcome,
            ready,
            score
          });
        }
      }

      matches.sort((a, b) => b.score - a.score);
      const topResults = matches.slice(0, 8);
      renderResults(topResults, raw);
    }

    input.addEventListener('input', executeSearch);

    input.addEventListener('keydown', (e) => {
      const items = listbox.querySelectorAll('li[role="option"]');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (items.length === 0) return;
        activeIndex = (activeIndex + 1) % items.length;
        updateActiveOption(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (items.length === 0) return;
        activeIndex = (activeIndex - 1 + items.length) % items.length;
        updateActiveOption(items);
      } else if (e.key === 'Enter') {
        if (activeIndex >= 0 && activeIndex < currentResults.length) {
          e.preventDefault();
          selectItem(currentResults[activeIndex]);
        } else if (currentResults.length > 0 && currentResults[0].score >= 70) {
          // If first item is strong match, take user there
          e.preventDefault();
          selectItem(currentResults[0]);
        } else {
          // Allow natural GET submit to /locations/?q=[query]
          sendAnalytics(input.value.trim(), '', 'd');
        }
      } else if (e.key === 'Escape') {
        hideDropdown();
      }
    });

    function updateActiveOption(items) {
      items.forEach((item, idx) => {
        if (idx === activeIndex) {
          item.classList.add('bg-pink-100/70');
          item.setAttribute('aria-selected', 'true');
          input.setAttribute('aria-activedescendant', item.id);
          item.scrollIntoView({ block: 'nearest' });
        } else {
          item.classList.remove('bg-pink-100/70');
          item.setAttribute('aria-selected', 'false');
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        clearBtn.classList.add('hidden');
        hideDropdown();
        input.focus();
      });
    }

    document.addEventListener('click', (e) => {
      if (!form.contains(e.target)) {
        hideDropdown();
      }
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Auto-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.city-search-form, #hero-city-search-form, form[role="search"]').forEach(initCombobox);
    });
  } else {
    document.querySelectorAll('.city-search-form, #hero-city-search-form, form[role="search"]').forEach(initCombobox);
  }

  // Expose global initializer for dynamic renders
  window.initCitySearch = initCombobox;
})();
