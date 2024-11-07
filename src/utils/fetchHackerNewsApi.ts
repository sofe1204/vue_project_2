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

  return {
    fetchTopStories,
  };
}
