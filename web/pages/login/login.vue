<template>
    <div>
        <input type="text" v-model="username">
        <input type="text" v-model="password">
        <button @click="onLogin">login</button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios'
import {apiConfig} from '../../config'

const username = ref("")
const password = ref("")

async function onLogin() {
    const res = await axios.post(`${apiConfig}/UserProfile/login`,{username: username.value, password: password.value})
    if(res.data.status == 0) {
        navigateTo("/")
    } else {
        alert("5555")
    }
    console.log(res.data)
}
</script>