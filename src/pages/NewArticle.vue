<template>
  <div class="new-article">
    {{ route.params.id }}
    <Card>
      <h5 class="card-title">
        {{ route.params.id ? "Article Details" : "Create new article" }}
      </h5>
      <div
        class="d-flex align-items-center justify-content-center gap-2"
        v-if="isLoading"
      >
        <div>Loading Articles Please Wait</div>
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading Articles...</span>
        </div>
      </div>
      <form class="px-3 mt-3" @submit.prevent="submitFormhandler">
        <div class="row">
          <div class="col-12">
            <div class="mb-3">
              <label class="form-label">Title</label>
              <input
                type="text"
                v-model="formData.title"
                class="form-control"
              />
            </div>
          </div>
          <div class="col-12">
            <div class="mb-3">
              <label class="form-label">Content</label>
              <textarea
                class="form-control"
                v-model="formData.content"
                rows="5"
              ></textarea>
            </div>
          </div>

          <div class="col-12">
            <div class="d-flex justify-content-between align-items-center">
              <button
                class="btn btn-primary btn-sm"
                :disabled="isLoading"
                v-if="route.params.id"
              >
                {{
                  isLoading ? "Update Article Please Wait..." : "Update Article"
                }}
              </button>
              <button
                class="btn btn-primary btn-sm"
                :disabled="isLoading"
                v-else
              >
                {{ isLoading ? "Posting Please Wait..." : "Post Article" }}
              </button>
            </div>
          </div>
        </div>
      </form>
    </Card>
  </div>
</template>

<script setup>
import { onMounted, ref, inject } from "vue";
import Card from "@/components/Card.vue";
import api from "@/api";
import { useRouter, useRoute } from "vue-router";
import moment from "moment";
const swal = inject("$swal");
const user = ref({ name: "" });
const router = useRouter();
const route = useRoute();
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
const submitFormhandler = async () => {
  if (
    formData.value.title.trim().length === 0 ||
    !formData.value.content.trim().length === 0
  ) {
    swal("Warning", "Article title and content are required!", "warning");
    return;
  }

  if (route.params.id) {
    await updateArticle(article.value.id);
  } else {
    await createArticle();
  }
};

const createArticle = async () => {
  isLoading.value = true;
  try {
    const response = await api.post("/article/create", {
      title: formData.value.title,
      content: formData.value.content,
      user_id: user.value.id,
    });
    resetFormData();
    console.log("response", response);
    swal("Information", `Article Posted Successfully`, "success");
    router.push({ name: "feed" });
  } catch (error) {
    swal("Warning", `${error.message}`, "warning");
  } finally {
    isLoading.value = false;
  }
};

const updateArticle = async (id) => {
  isLoading.value = true;
  try {
    const response = await api.patch(`/article/${id}`, {
      title: formData.value.title,
      content: formData.value.content,
      user_id: user.value.id,
    });
    resetFormData();
    console.log("response", response);
    swal("Information", `Article Updated Successfully`, "success");
    router.push({ name: "feed" });
  } catch (error) {
    swal("Warning", `${error.message}`, "warning");
  } finally {
    isLoading.value = false;
  }
};

const article = ref({});

const fetchSingleArticle = async (id) => {
  isLoading.value = true;
  try {
    const response = await api.get("/article");
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

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("userData"));
  await fetchSingleArticle(route.params.id);
});
</script>

<style scoped>
.new-article {
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
