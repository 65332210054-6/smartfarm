<template>
    <div>
        <input type="text" v-model="username">
        <input type="text" v-model="password">
        <button @click="onRegister">register</button>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import axios from 'axios'
import { apiConfig } from '~/config';

const username = ref()
const password = ref()

async function onRegister() {
    const res = await axios.post(`${apiConfig}/UserProfile/register`, {username: username.value, password: password.value})
    console.log(res.data)
}
</script>