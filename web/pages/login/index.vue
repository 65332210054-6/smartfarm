<template>
    <div>
        <input type="text" v-model="usernae">
        <input type="text" v-model="password">
        <button @click="onLogin">login</button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios'
import { apiConfig } from '~/config';
const username = ref()
const password = ref()
async function onLogin() {
    const res = await axios.post(`${apiConfig}/StudentProfile/login`, {username: username.value, password: password.value})
    const status = res.data.status
    if(status == 1) {
        navigateTo("/")
    }
    console.log(res.data.status)
    console.log(res.data.message)
}
</script>