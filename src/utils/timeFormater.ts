export const formatTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp * 1000;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    else if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''}`;
    else if (days < 30) return `${days} day${days > 1 ? 's' : ''}`;
    else {
      const date = new Date(timestamp * 1000);
      return date.toLocaleDateString();
    }
  };