<script lang="ts">
  import { defineComponent, ref, type PropType } from 'vue';
  import type { Story } from '../utils/fetchHackerNewsApi';
  import { formatTime } from '../utils/timeFormater';
  import Comments from './Comments.vue';
  import heart from '@/components/icons/heart.png'
  import figure from '@/components/icons/figure.png'
  import clock1 from '@/components/icons/clock1.png'
  import share from '@/components/icons/share.png'
  import star from '@/components/icons/star.png'
  import comment from '@/components/icons/comment.png'

  export default defineComponent({
    name: 'Item',
    components: {
      Comments,
    },
    props: {
      story: {
        type: Object as PropType<{ data: Story }>,
        required: true,
      },
    },
    setup() {
      const showComments = ref(false);

      const toggleComments = () => {
        showComments.value = !showComments.value;
      };

      const getHostName = (url: string): string => {
        try {
          const hostname = new URL(url).hostname;
          return hostname.replace('www.', '');
        } catch {
          return '';
        }
      };

      return { getHostName, showComments, toggleComments, formatTime, heart, figure, clock1 ,comment,share,star};
    },
  });
</script>

<template>
  <div class="story-item">
    <span class="title">{{ story.data.title }}</span>
    <br />
    <span class="meta-info">
      <img :src="heart" alt="Score" class="meta-icon" />
      <span class="score">{{ story.data.score }} points</span>

      <img :src="figure" alt="Author" class="meta-icon" />
      <span class="author">{{ story.data.by }}</span>

      <img :src="clock1" alt="Time" class="meta-icon" />
      <span class="time">{{ formatTime(story.data.time ?? 0) }} ago</span>
    

    <span class="domain">
      <a :href="'http://' + getHostName(story.data.url ? getHostName(story.data.url) : '')" class="domain-link"> {{ story.data.url ? getHostName(story.data.url) : '' }}</a>
    </span>
  </span>
  <span class="right-section">
  <span class="comment-container">
    <img :src="comment" alt="Comment" class="meta-icon" />
    <span class="comments" @click="toggleComments">{{ story.data.descendants }}</span>
  </span>
  <img :src="share" alt="Share" class="meta-icon" />
  <img :src="star" alt="Star" class="meta-icon" />
</span>
    <Comments v-if="showComments" :storyId="story.data.id" />
  </div>
</template>


  <style scoped>
.story-item {
  font-family: Arial, sans-serif;
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  display: flex;
  flex-direction: column; 
}

.title {
  color: #000000;
  font-size: 18px;
  margin-bottom: 8px; 
}

.meta-info {
  font-size: 14px;
  color: #555;
  display: flex; 
  align-items: center;
  /* margin-top: 28px; */
}

.score {
  font-weight: bold;
  color: #333;
}

.author {
  font-weight: bold;
}

.comments {
  /* margin-left: 10px; */
  color: #007BFF;
}

.comments:hover {
  cursor: pointer;
  text-decoration: underline;
}

.domain-link {
  color: #007BFF;
  text-decoration: none;
  font-size: 14px;
}

.domain-link:hover {
  text-decoration: underline;
}

.right-section {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 20px;
}

.meta-info .meta-icon {
  width: 16px;
  height: 16px;
  margin: 3px;
}
.right-section .meta-icon {
  width: 25px;
  height: 25px;
}

.score,
.author,
.time {
  font-size: 14px;
}

.score,
.author,
.time {
  margin-right: 10px;
}

.right-section .meta-icon:first-child {
  width: 30px; 
  height: 30px;
}

.comment-container {
  position: relative; 
  margin-top: 10px;
}

.comments {
  position: absolute; 
  top: 35%; 
  left: 50%; 
  transform: translate(-50%, -50%); 
  color: rgb(87, 87, 87); 
  font-size: 13px; 
  cursor: pointer;
  text-decoration: none;

}

</style>

  