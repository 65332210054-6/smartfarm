<template>
    <input type="text" v-model="username">
    <input type="password" v-model="password">
    <button :disabled="!check"  @click="onRegister">registr</button>
</template>
<script setup>
import {ref} from 'vue'
import axios from 'axios'
import {apiConfig} from '../../config'
import {computed} from 'vue'


const username = ref()
const password = ref("")
const check = computed(()=> password.value.lenght >= 6)

async function onRegister() {
    const res = await axios.post(`${apiConfig}/UserProfile/register`, {username: username.value, password: password.value})
    console.log(res.data)
}
</script>