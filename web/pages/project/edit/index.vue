<template>
    <div>
        <input type="text" v-model="name">
    </div>
    <div>
        <input type="time" v-model="time" v-if="status === 1">
    </div>
    <div>
        <button @click="Check">check</button>
    </div>
</template>

<script setup>
import {ref} from 'vue'
import axios from 'axios'
import { apiConfig } from "~/config"
const name = ref()
const time = ref()
const status = ref(0)

async function Check(){
    const res = await axios.post(`${apiConfig}/VegetableProfile/search`, name.value)
    status.value = res.data.status;
    if (status.value == 0) {
        console.log("No data")
        alert("No data")
    } else {
        console.log(res.data)
    }
}
</script>
