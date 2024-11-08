<script lang="ts">
  import { ref, onMounted, computed, watchEffect } from 'vue';
  import { useHackerNewsApi, type Story } from '../utils/fetchHackerNewsApi';
  import Item from './Item.vue';

  export default {
    components: {
      Item,
    },
    setup() {
      const topStories = ref<Story[]>([]);
      const searchQuery = ref('');
      const { fetchTopStories } = useHackerNewsApi();
      const loading = ref(false);
      const startIndex = ref(0); 

      const isOnline = ref(navigator.onLine);

      window.addEventListener('online', () => (isOnline.value = true));
      window.addEventListener('offline', () => (isOnline.value = false));

      onMounted(async () => {
        if (isOnline.value) {
          await loadMoreStories();
        } else {
          const storedStories = localStorage.getItem('top-stories');
          if (storedStories) {
            topStories.value = JSON.parse(storedStories);
          }
        }
      });

      const loadMoreStories = async () => {
        if (loading.value) return;
        loading.value = true;

        try {
          const newStories = await fetchTopStories(startIndex.value);
          topStories.value = [...topStories.value, ...newStories];

          localStorage.setItem('top-stories', JSON.stringify(topStories.value));
          startIndex.value += newStories.length;
        } catch (error) {
          console.error('Failed to load more stories:', error);
        } finally {
          loading.value = false;
        }
      };

      const handleScroll = () => {
        const scrollPosition = window.scrollY + window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        if (scrollPosition >= documentHeight - 100 && !loading.value && isOnline.value) {
          loadMoreStories();
        }
      };

      watchEffect(() => {
        window.addEventListener('scroll', handleScroll);
      });

      const filteredStories = computed(() => {
        if (!searchQuery.value) return topStories.value;
        return topStories.value.filter(story =>
          story.title.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      });

      return {
        topStories,
        searchQuery,
        filteredStories,
        loading,
        isOnline,
      };
    },
  };
</script>



<template>
  <div class="top-stories-container">
    <div class="header-container">
      <h1 class="page-title">Top News</h1>
      <div class="navbar-search">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search..." 
          class="search-input" 
        />
      </div>
    </div>
    <ul class="stories-list">
      <li v-for="story in filteredStories" :key="story.id" class="story-item">
        <Item :story="{ data: story }" />
      </li>
    </ul>
    <div v-if="loading" class="loading-spinner">
      Loading more stories...
    </div>
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

  .search-input {
    width: 400px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
    transition: border-color 0.3s ease;
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
</style>
