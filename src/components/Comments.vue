<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { formatTime } from '../utils/timeFormater'; 
  import { fetchComments, type Comment } from '../utils/fetchComments'; 
  
  export default defineComponent({
    name: 'Comments',
    props: {
      storyId: {
        type: Number,
        required: true,
      },
    },
    components: {
      Comment,
    },
    setup(props) {
      const comments = ref<Comment[]>([]);
  
      onMounted(async () => {
        comments.value = await fetchComments(props.storyId);
      });
  
      return { comments ,formatTime };
    },
  });
</script>

<template>
    <div class="comments-container" v-if="comments.length > 0">
      <ul>
        <li v-for="comment in comments" :key="comment.id" class="comment-item">
          <div class="comment-author">{{ comment.by }}</div>
          <div class="comment-time">{{ formatTime(comment.time) }} ago</div>
          <div class="comment-text" v-html="comment.text"></div>
          <div v-if="comment.kids" class="nested-comments">
            <Comments :storyId="comment.id" />
          </div>
        </li>
      </ul>
    </div>
    <div v-else class="no-comments">
      No comments available.
    </div>
</template>

<style scoped>
.comments-container {
  margin-top: 15px;
  padding: 10px;
  border-top: 1px solid #ddd;
  background-color: #f4f4f4;
  border-radius: 5px;
}
.comments-container h3 {
  color: rgb(0, 0, 0);
  font-weight: bold;
}

.comment-item {
  margin-bottom: 10px;
}

.comment-author {
  font-weight: bold;
  color: #858788;
  margin-bottom: 5px;
}

.comment-time {
  color: #3d57e9;
  font-size: 12px;
  font-weight: bold;
}

.comment-text {
  color: #333;
  font-size: 14px;
  margin-left: 10px;
}

.nested-comments {
  margin-left: 20px;
  border-left: 2px solid #ddd;
  padding-left: 10px;
}

.no-comments {
  color: #888;
  font-size: 14px;
  margin-top: 15px;
}
</style>
