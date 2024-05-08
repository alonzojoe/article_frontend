<template>
    <div class="auth">
        <Card>
            <h5 class="card-title">Bulletin Board {{ login ? 'Login' : 'Sign Up' }}</h5>
            {{ formData }}
            <form class="px-5 mt-3" @submit.prevent="loginSubmit" v-if="login">
                <div class="row">
                    <div class="col-12">
                        <div class="mb-3">
                            <label for="exampleFormControlInput1" class="form-label">Email address</label>
                            <input type="email" v-model="formData.email" class="form-control">
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="mb-3">
                            <label for="exampleFormControlInput1" class="form-label">Password</label>
                            <input type="password" v-model="formData.password" class="form-control">
                        </div>
                    </div>

                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center">
                            <button class="btn btn-primary btn-sm">Login</button>
                            <a href="#" @click="login = !login" style="text-decoration: none">Create an Account?</a>
                        </div>
                    </div>
                </div>
            </form>
            <form class="px-5 mt-3" @submit.prevent="zxc" v-else>
                <div class="row">
                    <div class="col-12">
                        <div class="mb-3">
                            <label for="exampleFormControlInput1" class="form-label">Name</label>
                            <input type="text" class="form-control" id="exampleFormControlInput1">
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="mb-3">
                            <label for="exampleFormControlInput1" class="form-label">Email address</label>
                            <input type="email" class="form-control" id="exampleFormControlInput1">
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="mb-3">
                            <label for="exampleFormControlInput1" class="form-label">Password</label>
                            <input type="password" class="form-control" id="exampleFormControlInput1">
                        </div>
                    </div>

                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center">
                            <button class="btn btn-primary btn-sm">Sign Up</button>
                            <a href="#" @click="login = !login" style="text-decoration: none">Proceed to Login</a>
                        </div>
                    </div>
                </div>
            </form>
        </Card>
    </div>
</template>

<script setup>
import Card from '@/components/Card.vue'
import { ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router';
import Cookies from "js-cookie";
import api from '@/api';

const swal = inject("$swal");
const router = useRouter();

const login = ref(true)

const formData = ref({
    email: '',
    name: '',
    password: '',
    confirm: ''
})

const resetForm = () => {
    Object.keys(formData.value).forEach(element => {
        formData.value[element] = ''
    });
}

const isLoading = ref(false)
const loginSubmit = async () => {
    if (!formData.value.email || !formData.value.password) {
        swal(
            "Warning",
            "Email and Password are Required!",
            "warning"
        );
        return;
    }
    isLoading.value = true
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
            router.push({ name: "main" });
            isLoading.value = false;
        }

    } catch (e) {
        swal(
            "Warning",
            `Invalid Username / Password`,
            "warning"
        );
    }
}

const clearItems = () => {
    localStorage.removeItem('ajioasdmianc8a79sdy0fffaq')
    localStorage.removeItem('userData')
}

onMounted(() => {
    clearItems()
    resetForm()
})



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