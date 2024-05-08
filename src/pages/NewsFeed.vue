<template>
    <div class="new-article">
        <Card>
            <div class="px-3 mt-3">
                <div class="row">
                    <div class="col-12">
                        <div class="mb-3">
                            <h5 class="card-title">Article Title</h5>
                            <small><i>Posted By: Joenell Alonzo</i></small>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="mb-3">
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
                                has been the industry's standard dummy text ever since the 1500s, when an unknown
                                printer took a galley of type and scrambled it to make a type specimen book. It has
                                survived not only five centuries, but also the leap into electronic typesetting,
                                remaining essentially unchanged. It was popularised in the 1960s with the release of
                                Letraset sheets containing </p>

                        </div>
                    </div>

                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center gap-2">
                            <button
                                class="btn btn-secondary btn-sm d-flex align-items-center justify-content-center gap-1"
                                style="width: 30%;"><i class='bx bx-upvote'></i>11</button>
                            <button
                                class="btn btn-secondary btn-sm d-flex align-items-center justify-content-center gap-1"
                                style="width: 30%;"><i class='bx bxs-chat'></i>22</button>
                            <button
                                class="btn btn-secondary btn-sm d-flex align-items-center justify-content-center gap-1"
                                style="width: 30%;">
                                <i class='bx bx-search-alt-2'></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
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
    try {
        const response = await api.post('/article/create', {
            title: formData.value.title,
            content: formData.value.content,
            user_id: user.value.id
        })
        resetFormData()
        console.log('response', response)
        swal(
            "Information",
            `Article Posted Successfully`,
            "success"
        );
    } catch (error) {
        swal(
            "Warning",
            `${error.message}`,
            "warning"
        );
    } finally {
        isLoading.value = false
    }

}

onMounted(() => {
    user.value = JSON.parse(localStorage.getItem('userData'))
})

</script>

<style scoped>
.new-article {
    height: 100vh;
    width: 100%;
    padding-top: 150px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
}
</style>