<template>
    <div class="new-article">
        <Card>
            <h5 class="card-title">Create new article</h5>
            <form class="px-5 mt-3" @submit.prevent="submitFormhandler">
                <div class="row">
                    <div class="col-12">
                        <div class="mb-3">
                            <label class="form-label">Title</label>
                            <input type="text" v-model="formData.title" class="form-control">
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="mb-3">
                            <label class="form-label">Content</label>
                            <textarea class="form-control" v-model="formData.content" rows="5"></textarea>
                        </div>
                    </div>

                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center">
                            <button class="btn btn-primary btn-sm" :disabled="isLoading">
                                {{ isLoading ? 'Posting Please Wait...' : 'Post Article' }}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </Card>
    </div>
</template>

<script setup>
import { onMounted, ref, inject } from 'vue'
import Card from '@/components/Card.vue'
import api from '@/api'
const swal = inject("$swal");
const user = ref({ name: '' })

const formData = ref({
    title: '',
    content: '',
})

const resetFormData = () => {
    Object.keys(formData.value).forEach((item) => {

        formData.value[item] = ''

    })
}

const isLoading = ref(false)
const submitFormhandler = async () => {
    if (formData.value.title.trim().length === 0 || !formData.value.content.trim().length === 0) {
        swal(
            "Warning",
            "Article title and content are required!",
            "warning"
        );
        return;
    }
    isLoading.value = true
    const response = await api.post('/article/create', {
        title: formData.value.title,
        content: formData.value.content,
        user_id: user.value.id
    })
    resetFormData()
    console.log('response', response)
    isLoading.value = false
}

onMounted(() => {
    user.value = JSON.parse(localStorage.getItem('userData'))
})

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