export const fetchComments = async (id: number) => {
  try {
    const cachedComments = localStorage.getItem(`comments-${id}`);
    
    if (cachedComments) {
      return JSON.parse(cachedComments);
    }

    const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
    const story = await response.json();

    if (!story.kids) {
      return [];
    }

    const commentPromises = story.kids.map(async (commentId: number) => {
      const commentResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${commentId}.json`);
      return await commentResponse.json();
    });

    const comments = await Promise.all(commentPromises);

    localStorage.setItem(`comments-${id}`, JSON.stringify(comments));

    return comments;

  } catch (error) {
    console.error('Failed to load comments:', error);
    return [];
  }
};
