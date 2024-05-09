<template>
  <div class="auth">
    <Card>
      <h5 class="card-title">
        Bulletin Board {{ login ? "Login" : "Sign Up" }}
      </h5>
      <form class="px-5 mt-3" @submit.prevent="loginSubmit" v-if="login">
        <div class="row">
          <div class="col-12">
            <div class="mb-3">
              <label class="form-label">Email address</label>
              <input
                type="email"
                v-model="formData.email"
                class="form-control"
              />
            </div>
          </div>
          <div class="col-12">
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input
                type="password"
                v-model="formData.password"
                class="form-control"
              />
            </div>
          </div>

          <div class="col-12">
            <div class="d-flex justify-content-between align-items-center">
              <button class="btn btn-primary btn-sm">
                {{ isLoading ? "Loggin In, Please wait..." : "Login" }}
              </button>

              <a href="#" @click="login = !login" style="text-decoration: none"
                >Create an Account?</a
              >
            </div>
          </div>
        </div>
      </form>
      <form class="px-5 mt-3" @submit.prevent="registerHandler" v-else>
        <div class="row">
          <div class="col-12">
            <div class="mb-3">
              <label class="form-label">Name</label>
              <input type="text" v-model="formData.name" class="form-control" />
            </div>
          </div>
          <div class="col-12">
            <div class="mb-3">
              <label class="form-label">Email address</label>
              <input
                type="email"
                v-model="formData.email"
                class="form-control"
              />
            </div>
          </div>
          <div class="col-12">
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input
                type="password"
                v-model="formData.password"
                class="form-control"
              />
            </div>
          </div>

          <div class="col-12">
            <div class="d-flex justify-content-between align-items-center">
              <button class="btn btn-primary btn-sm" :disabled="isLoading">
                {{ isLoading ? "Signing Up Please wait..." : "Sign Up" }}
              </button>
              <a href="#" @click="login = !login" style="text-decoration: none"
                >Proceed to Login</a
              >
            </div>
          </div>
        </div>
      </form>
    </Card>
  </div>
</template>

<script setup>
import Card from "@/components/Card.vue";
import { ref, onMounted, inject, watch } from "vue";
import { useRouter } from "vue-router";
import api from "@/api";

const swal = inject("$swal");
const router = useRouter();

const login = ref(true);

const formData = ref({
  email: "",
  name: "",
  password: "",
});

const resetForm = () => {
  Object.keys(formData.value).forEach((element) => {
    formData.value[element] = "";
  });
};

const isLoading = ref(false);
const loginSubmit = async () => {
  if (
    formData.value.email.trim().length === 0 ||
    !formData.value.password.trim().length === 0
  ) {
    swal("Warning", "Name, Email and Password are Required!", "warning");
    return;
  }
  isLoading.value = true;
  try {
    const response = await api.post("/auth/login", {
      email: formData.value.email,
      password: formData.value.password,
    });
    if (response.data.authorization.token) {
      const token = response.data.authorization.token;
      const userData = JSON.stringify(response.data.user);

      localStorage.setItem("ajioasdmianc8a79sdy0fffaq", token);
      localStorage.setItem("userData", userData);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      router.push({ name: "feed" });
      isLoading.value = false;
    }
  } catch (e) {
    console.log(e.response.data.message);
    swal("Warning", `Invalid Username / Password`, "warning");
  }
  isLoading.value = false;
};

const registerHandler = async () => {
  if (
    formData.value.name.trim().length === 0 ||
    formData.value.email.trim().length === 0 ||
    formData.value.password.trim().length === 0 ||
    formData.value.password.length < 5
  ) {
    const message =
      formData.value.password.length < 5
        ? "Password must be at least 5 characters."
        : "Email and Password are Required!";

    swal("Warning", `${message}`, "warning");
    return;
  }
  isLoading.value = true;
  const { name, email, password } = formData.value;
  try {
    const response = await api.post("/auth/register", {
      name: name,
      email: email,
      password: password,
    });
    if (response.status === 201) {
      swal(
        "Success",
        "User Created Successfully, Please Proceed to login",
        "success"
      );
      login.value = !login.value;
      isLoading.value = false;
      resetForm();
    }
  } catch (error) {
    swal("Error", `${error.response.data.message}`, "error");
  }
};

const clearItems = () => {
  localStorage.removeItem("ajioasdmianc8a79sdy0fffaq");
  localStorage.removeItem("userData");
};

watch(login, () => {
  resetForm();
});

onMounted(() => {
  clearItems();
  resetForm();
});
</script>

<style scoped>
.auth {
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
