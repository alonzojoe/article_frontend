<template>
  <div class="view-article">
    <Card class="mb-5">
      <div class="px-3 mt-3" v-if="article">
        <div class="row">
          <div class="col-12">
            <div class="mb-3">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="card-title">{{ article.title }}</h5>
              </div>
              <small class="d-block"
                >Date Created : {{ article.created_at }}</small
              >
              <small class="d-block"
                ><i
                  >Posted By:
                  {{
                    article.user.id === user.id ? "You" : article.user.name
                  }}</i
                ></small
              >
            </div>
          </div>
          <div class="col-12">
            <div class="mb-3">
              <p>
                {{ article.content }}
              </p>
            </div>
          </div>

          <div class="col-12">
            <div class="row">
              <div class="col-md-3 col-sm-12 mb-2">
                <button
                  class="btn btn-secondary btn-sm d-flex align-items-center justify-content-center gap-1"
                  style="width: 90%"
                  @click="upVote(article.id)"
                  :disabled="
                    article.votes.some((vote) => {
                      return vote.user_id == user.id;
                    })
                  "
                >
                  <i
                    :class="
                      article.votes.some((vote) => {
                        return vote.user_id == user.id;
                      })
                        ? 'bx bxs-upvote'
                        : 'bx bx-upvote'
                    "
                  ></i
                  >{{ article.votes.length }}
                </button>
              </div>
              <div class="col-md-3 col-sm-12 mb-2">
                <button
                  class="btn btn-secondary btn-sm d-flex align-items-center justify-content-center gap-1"
                  style="width: 90%"
                >
                  <i class="bx bxs-chat"></i>{{ article.comments.length }}
                </button>
              </div>
              <div class="col-md-3 col-sm-12 mb-2">
                <button
                  class="btn btn-secondary btn-sm d-flex align-items-center justify-content-center gap-1"
                  style="width: 90%"
                  @click="viewArticle(article.id)"
                >
                  <i class="bx bx-search-alt-2"></i>View
                </button>
              </div>
              <div class="col-md-3 col-sm-12 mb-2">
                <button
                  v-if="article.user.id === user.id"
                  class="btn btn-secondary btn-sm d-flex align-items-center justify-content-center gap-1"
                  style="width: 90%"
                  @click="updateArticle(article.id)"
                >
                  <i class="bx bxs-edit-alt"></i>Edit
                </button>
              </div>
            </div>
            <div
              class="d-flex justify-content-between align-items-center gap-2"
            ></div>
          </div>
          <div class="col-12">
            <hr />
            <h4>Comments</h4>
            <ul
              class="px-0"
              style="list-style: none"
              v-if="comments.length > 0"
            >
              <li v-for="(c, index) in comments" :key="index">
                <div>
                  <small class="fs-6"
                    ><b>{{ c.user.name }}</b> commented: {{ c.text }}</small
                  >
                  <small class="d-block"
                    ><i>{{ c.created_at }}</i></small
                  >
                </div>
              </li>
            </ul>
            <form class="mt-3" @submit.prevent="addComment(article.id)">
              <div class="row">
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label">Add Comment</label>
                    <textarea
                      class="form-control"
                      v-model="commentText"
                      rows="2"
                    ></textarea>
                  </div>
                </div>
                <div class="col-12">
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <button
                      class="btn btn-primary btn-sm w-100"
                      :disabled="fulfilled"
                    >
                      {{ fulfilled ? "Adding comment..." : "Add Comment" }}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { onMounted, ref, inject, onBeforeMount } from "vue";
import Card from "@/components/Card.vue";
import api from "@/api";
import { useRouter, useRoute } from "vue-router";
import moment from "moment";
const swal = inject("$swal");
const user = ref({ name: "" });
const router = useRouter();
const route = useRoute();

const isLoading = ref(false);

const article = ref(null);

const fetchSingleArticle = async (id) => {
  isLoading.value = true;
  try {
    const response = await api.get(`/article/${id}`);
    console.log(response.data.data);
    if (response.data.data.length > 0) {
      article.value = await response.data.data.map((data) => {
        return {
          ...data,
          created_at: moment(data.created_at).format("lll"),
        };
      })[0];
      formData.value.title = article.value.title;
      formData.value.content = article.value.content;
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const comments = ref([]);
const fetchComments = async (id) => {
  const response = await api.get(`/cast/${id}`);
  if (response.data.data.length > 0) {
    comments.value = await response.data.data.map((data) => {
      return {
        ...data,
        created_at: moment(data.created_at).format("lll"),
      };
    });
  }
};

const upVote = async (id) => {
  await api.post("/cast/vote", {
    article_id: id,
    user_id: user.value.id,
  });
  await fetchSingleArticle(route.params.id);
};

const fulfilled = ref(false);
const commentText = ref("");
const addComment = async (id) => {
  fulfilled.value = true;
  if (commentText.value.trim().length === 0) {
    swal("Warning", "Comment Text must not be empty", "warning");
    return;
  }
  const response = await api.post("/cast/comment", {
    article_id: id,
    text: commentText.value,
    user_id: user.value.id,
  });

  await fetchComments(route.params.id);
  commentText.value = "";
  fulfilled.value = false;
};

onBeforeMount(() => {
  user.value = JSON.parse(localStorage.getItem("userData"));
});

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("userData"));
  await fetchSingleArticle(route.params.id);
  fetchComments(route.params.id);
});
</script>

<style scoped>
.view-article {
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
