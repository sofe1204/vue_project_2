<script lang="ts">
import { ref, onMounted, computed ,watchEffect } from 'vue';
import { useHackerNewsApi, type Story } from '../utils/fetchHackerNewsApi';
import Item from './Item.vue';

export default {
  components: {
    Item,
  },
  setup() {
    const topStories = ref<Story[]>([]);
    const searchQuery = ref('');
    const sortOrder = ref('latest');
    const loading = ref(false);
    const isOnline = ref(navigator.onLine);
    const currentPage = ref(1); 
    const totalStories = ref(0); 
    const storiesPerPage = 10; 

    const { fetchTopStories, searchStories, clearLocalStorage } = useHackerNewsApi();

    window.addEventListener('online', () => (isOnline.value = true));
    window.addEventListener('offline', () => (isOnline.value = false));

    onMounted(async () => {
      if (isOnline.value) {
        await loadStoriesForPage(currentPage.value);
      } else {
        const storedStories = localStorage.getItem('top-stories');
        if (storedStories) {
          topStories.value = JSON.parse(storedStories);
        } else {
          console.log('No stories found in localStorage.');
        }
      }
    });

    const loadStoriesForPage = async (page: number) => {
      if (loading.value) return;
      loading.value = true;

      try {
        const startIndex = (page - 1) * storiesPerPage;
        const newStories = await fetchTopStories(startIndex);
        topStories.value = newStories;
        totalStories.value = 500; 
        localStorage.setItem('top-stories', JSON.stringify(topStories.value));
      } catch (error) {
        console.error('Failed to load stories:', error);
      } finally {
        loading.value = false;
      }
    };

    const filteredStories = computed(() => {
      if (!searchQuery.value) return topStories.value;

      const query = searchQuery.value.toLowerCase();

      return topStories.value.filter(story =>
        story.title.toLowerCase().includes(query) ||
        story.by.toLowerCase().includes(query) ||
        (story.url && story.url.toLowerCase().includes(query))
      );
    });

    const sortedStories = computed(() => {
      const stories = [...filteredStories.value];
    
      return stories.sort((a, b) => {
        const aTime = a.time ?? 0; 
        const bTime = b.time ?? 0; 

        if (sortOrder.value === 'latest') {
          return bTime - aTime; 
        }
        return aTime - bTime; 
      });
    });

    const executeSearch = async () => {

      loading.value = true;
      try {
        const searchResults = await searchStories(searchQuery.value);
        topStories.value = searchResults; 
      } catch (error) {
        console.error('Failed to search stories:', error);
      } finally {
        loading.value = false;
      }
    };

    watchEffect(() => {
      searchQuery.value && executeSearch(); 
    });

    const goToPage = async (page: number) => {
      currentPage.value = page;
      await loadStoriesForPage(page);
    };

    return {
      topStories,
      searchQuery,
      sortOrder,
      loading,
      filteredStories,
      sortedStories,
      currentPage,
      storiesPerPage,
      totalStories,
      goToPage,
      clearLocalStorage,
      executeSearch
    };
  },
};
</script>


<template>
  <div class="top-stories-container">
    <header class="header-container">
      <h1 class="page-title">Top News</h1>
      <div class="navbar-search">
        <div class="search-wrapper">
          <img 
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADHklEQVR4nO1YO2tUQRQeFd8P3DvnZk0UoqgoREUsRBurFAo2oikUIWIhWPhYxGLNnRkrxS76BwKK4CuktRLSaGk0RomFimiXxjQqe8YjJ5vNzt6s2TxmX/F+sM1e7ne+85g551whEiRIkGBRgEwrkEntIZU6TD0b2+nSjpWikUGZLatRw2mr5WNU8MNqoPgPlXxtlbxJUapDNArIiKWowy7U8lM50WUd0fDHavmEesLtdRbfCqjk4D9EjqGCYdTwEjV8QQW/y2TkJ0bybJ3Ey93xqKOGb6iDLD8r4+yanApOWAX9+Qw4zii4VVvx2U2hKx41ICrQLHJW75vgIGo5FHM+U33lbLxLLHPLhg9szoRH58xjwnVWwYAbhJwJOkW1gRGcLzUKx+fLRRfEcqvhhXMmRvk/v4qnX5VfnehrP+UIY8WgyIuiWsBInnHEf59tzVfk1ZBxsvpeVAtWyUdFQ0HWFy+Z9lWoYbzATZHc5Yu7aESIJW6HLXdVLgTc2Gwxu1dFNZqW26R886OCy8W+IO/55hdkWvY5t8Ub3/w5E55yHHjqm5+bzyEnxa9883MvsVONTT73zS/IpLc6Gfhczf5iFdz3zS94ni/MMDyY0bX0Wp/8PA/Z4mhxR1QDE/P8pBEezPxyw/AU9wK6+4zgZcRJc78vXjLhfqcT/yITbPDFXWooSnWgAltYSniq9MHLh9Y5wH0+OGcwBg+daA3xVLkQPtRBt3O7WYpa9opqgnrS23iTckppgIxYMS8uA0e4ZJz7v1fUArwGxlbDQZ4q58Shg25XfD76sFPUCrFrL78Da8jwYFb5wLo1XxKIUTKyrWZOsGBeamKOjPNghhqu5FR4MqfgGEbhOavhNmr5drro/KVQNydyJuhko7P9pFIiXMleLpv4+1hrJ3gN5E0KFXyo/E2I61728XA49b6RbXV3ogBeRniet1retVo+m6z3BzwecIel63K9KIOGcmK+oGxLGhWMxDL2kW4Em0WzgBInGgS0KDJhyh1sGKnULBveCTJwQDQTaMKJfDmhhndNlYECWDRHvinFJ0iQ4D/CX1S0b2m0Q3GgAAAAAElFTkSuQmCC" 
            alt="Search Icon" 
            class="search-icon" 
          />
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search stories by title, URL, or author" 
            class="search-input" 
            aria-label="Search stories"
          />
        </div>
      </div>
      <div class="filter-container">
        <label for="sortOrder" class="label-sort-by">Sort By:</label>
        <select id="sortOrder" v-model="sortOrder" class="sort-select">
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>
    </header>
    <main>
      <ul class="stories-list">
        <li v-for="story in sortedStories" :key="story.id" class="story-item">
          <Item :story="{ data: story }" />
        </li>
      </ul>
      <div v-if="loading" class="loading-spinner">
        Loading stories...
      </div>
    </main>
    <footer class="pagination-container">
      <button
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
        class="pagination-button"
      >
        Previous
      </button>
      <span >Page {{ currentPage }}</span>
      <button
        :disabled="currentPage >= Math.ceil(totalStories / storiesPerPage)"
        @click="goToPage(currentPage + 1)"
        class="pagination-button"
      >
        Next
      </button>
    </footer>
  </div>
</template>




<style scoped>
  .top-stories-container {
    font-family: Arial, sans-serif;
    padding: 20px;
    background-color: #f7f7f7;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-width: 100rem;
    margin: 0 auto;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .page-title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin: 0;
  }

  .navbar-search {
  display: flex;
  justify-content: center;
  align-items: center;
}

.search-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 5px 10px;
  background-color: #fff;
  width: 400px;
}

.search-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  background: none;
}

.search-wrapper:focus-within {
  border-color: #007bff;
}

  .search-input:focus {
    border-color: #4A90E2;
    outline: none;
  }

  .search-input::placeholder {
    color: #aaa;
  }

  .stories-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  .story-item {
    margin-bottom: 20px;
    padding: 15px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .story-item:hover {
    background-color: #f1f1f1;
  }

  .loading-spinner {
    text-align: center;
    font-size: 18px;
    color: #888;
    margin-top: 20px;
  }
    .filter-container {
    margin-top: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #888;
    font-weight: bold;
  }

  .filter-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 15px;
  gap: 10px;
  font-family: Arial, sans-serif;
}

.label-sort-by {
  font-size: 16px;
  color: #555;
  margin-right: 5px;
}

.sort-select {
  padding: 8px 12px;
  font-size: 16px;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.sort-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 6px rgba(0, 123, 255, 0.4);
  outline: none;
}

.sort-select:hover {
  background-color: #f1f1f1;
}
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
  > span{
    color: black;
    font-weight: 500;
  }
}

.pagination-button {
  padding: 8px 16px;
  font-size: 14px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination-button:hover:not(:disabled) {
  background-color: #0056b3;
}


</style>
