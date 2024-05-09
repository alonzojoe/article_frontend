<template>
  <div class="new-article">
    <!-- <pre>{{ articles }}</pre> -->
    <div
      class="d-flex align-items-center justify-content-center gap-2"
      v-if="isLoading"
    >
      <div>Loading Articles Please Wait</div>
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading Articles...</span>
      </div>
    </div>

    <div
      class="d-flex align-items-center justify-content-center gap-2"
      v-if="articles.length < 0"
    >
      <h3>No Articles found, add some?</h3>
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading Articles...</span>
      </div>
    </div>
    <div v-else>
      <Card class="mb-5" v-for="(article, index) in articles" :key="index">
        <div class="px-3 mt-3" v-if="article">
          <div class="row">
            <div class="col-12">
              <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center">
                  <h5 class="card-title">{{ article.title }}</h5>
                  <button
                    v-if="article.user.id === user.id"
                    class="btn btn-danger btn-sm"
                    @click="deleteArticle(article)"
                  >
                    Delete Article
                  </button>
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
                    @click="viewArticle(article.id)"
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
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, inject } from "vue";
import Card from "@/components/Card.vue";
import api from "@/api";
import { useRouter } from "vue-router";
import moment from "moment";
const router = useRouter();
const swal = inject("$swal");
const user = ref({ name: "" });

const formData = ref({
  title: "",
  content: "",
});

const resetFormData = () => {
  Object.keys(formData.value).forEach((item) => {
    formData.value[item] = "";
  });
};

const isLoading = ref(false);

const articles = ref([]);

const fetchArticles = async () => {
  isLoading.value = true;
  try {
    const response = await api.get("/article");
    console.log(response.data.data);
    if (response.data.data.length > 0) {
      articles.value = await response.data.data.map((data) => {
        return {
          ...data,
          created_at: moment(data.created_at).format("lll"),
        };
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const deleteArticle = async (article) => {
  const { id, title } = article;
  swal({
    title: "Confirmation",
    text: `Are you sure to delete this article '${title}'?`,
    icon: "question",
    showDenyButton: true,
    confirmButtonText: "Yes",
    denyButtonText: `Cancel`,
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await api.delete(`/article/${id}`);
        swal("Information", `Article ${title} deleted successfully`, "info");
        await fetchArticles();
      } catch (error) {
        console.log(error);
      }
    }
  });
};

const upVote = async (id) => {
  await api.post("/cast/vote", {
    article_id: id,
    user_id: user.value.id,
  });
  await fetchArticles();
};

const updateArticle = (id) => {
  router.push({ name: "create", params: { id: id } });
};

const viewArticle = (id) => {
  router.push({ name: "details", params: { id: id } });
};

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("userData"));
  await fetchArticles();
});
</script>

<style scoped>
.new-article {
  width: 100%;
  padding-top: 100px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}
</style>
