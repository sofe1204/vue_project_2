export type Comment = {
  id: number;
  by: string;
  time: number;
  text: string;
  kids?: number[];
};

export const fetchComments = async (id: number) => {
  try {
    const cacheKey = `comments-${id}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      const { comments, timestamp } = JSON.parse(cachedData);
      const currentTime = Date.now();
      const expirationTime = 3 * 60 * 60 * 1000;

      if (currentTime - timestamp < expirationTime) {
        return comments;
      } else {
        localStorage.removeItem(cacheKey);
      }
    }

    const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
    const story = await response.json();

    if (!story.kids) {
      return [];
    }

    const fetchNestedComments = async (commentId: number): Promise<Comment> => {
      const commentResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${commentId}.json`);
      const comment = await commentResponse.json();

      if (comment.kids && comment.kids.length > 0) {
        comment.kids = await Promise.all(comment.kids.map(fetchNestedComments));
      }

      return comment;
    };

    const commentPromises = story.kids.map(fetchNestedComments);
    const comments = await Promise.all(commentPromises);

    localStorage.setItem(cacheKey, JSON.stringify({ comments, timestamp: Date.now() }));

    return comments;

  } catch (error) {
    console.error('Failed to load comments:', error);
    return [];
  }
};
