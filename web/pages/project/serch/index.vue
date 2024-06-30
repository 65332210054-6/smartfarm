<template>
    <div>
        <input type="text" v-model="username" placeholder="Serch">
        <button @click="Serch">Serch</button>
    </div>
    <div v-if="show">
        {{ show.username }}  {{ show.password }}
    </div>
</template>
<script setup>
import {ref} from 'vue';
import axios from 'axios'
import { apiConfig } from '~/config';
const username = ref()
const show = ref(null)

async function Serch() {
    const res = await axios.post(`${apiConfig}/StudentProfile/serch`,username.value)
    if(res.data.status == 1){
        show.value = res.data.dataValues
    }
}

</script>
