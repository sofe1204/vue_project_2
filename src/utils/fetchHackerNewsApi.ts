import axios from 'axios';

export interface Story {
  id: number;
  title: string;
  by: string;
  url?: string;
  score?: number;
  time?: number;
  descendants?: number;
}

export function useHackerNewsApi() {
  const baseUrl = 'https://hacker-news.firebaseio.com/v0';
  const searchApiUrl = 'https://hn.algolia.com/api/v1/search';

  const clearLocalStorage = () => {
    const lastClearTime = localStorage.getItem('lastClearTime');
    const currentTime = Date.now();

    if (lastClearTime && currentTime - parseInt(lastClearTime) >= 21600000) {
      localStorage.removeItem('top-stories');
      localStorage.removeItem('lastClearTime');
    } else if (!lastClearTime) {
      localStorage.setItem('lastClearTime', currentTime.toString());
    }
  };

  clearLocalStorage();
  setInterval(clearLocalStorage, 3600000);

  async function fetchTopStories(start = 0, limit = 10): Promise<Story[]> {
    try {
      const response = await axios.get<number[]>(`${baseUrl}/topstories.json`);
      const storyIds = response.data.slice(start, start + limit);

      const stories = await Promise.all(
        storyIds.map(async (id) => {
          const storyResponse = await axios.get<Story>(`${baseUrl}/item/${id}.json`);
          return storyResponse.data;
        })
      );

      return stories;
    } catch (error) {
      console.error('Error fetching top stories:', error);
      throw error;
    }
  }

  async function searchStories(query: string, page = 0): Promise<Story[]> {
    try {
      const response = await axios.get(`${searchApiUrl}`, {
        params: {
          query,
          page,
        },
      });

      return response.data.hits.map((hit: any) => ({
        id: hit.objectID,
        title: hit.title || 'No title available',
        by: hit.author,
        url: hit.url,
        score: hit.points,
        time: hit.created_at_i,
        descendants: hit.num_comments,
      }));
    } catch (error) {
      console.error('Error searching stories:', error);
      throw error;
    }
  }

  return {
    fetchTopStories,
    searchStories,
    clearLocalStorage,
  };
}
