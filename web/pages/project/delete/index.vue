<template>
    <a href="../test">กลับหน้าหลัก</a><br>
    <div>
        Name : <input type="text" v-model="name" placeholder="name" @input="show"><br>
        <div v-if="filteredResults.length > 0">
            <ul>
                <li v-for="result in filteredResults" :key="result.id" @click="selectResult(result.name)">
                    {{ result.name }}
                </li>
            </ul>
        </div>
        <button @click="Delete">Delete</button>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';
import { apiConfig } from '~/config';

const name = ref('');
const searchResults = ref([]);
const filteredResults = ref([]);

async function Delete() {
    if (!name.value) {
        alert("กรุณากรอกข้อมูลในช่องว่าง");
        return;
    }
    console.log(name.value)
    const res = await axios.post(`${apiConfig}/VegetableProfile/delete` , {name: name.value} );
    console.log(res.data);
    if (res.data.status == 1) {
        alert("delete success");
    } else {
        alert("error");
    }
}

async function show() {
    if (!name.value) {
        searchResults.value = [];
        return;
    }
    const res = await axios.post(`${apiConfig}/VegetableProfile/show`, { name: name.value }).then((res) => {
        searchResults.value = res.data.dataValues;
    });
}

async function filterResults() {
    if (name.value) {
        filteredResults.value = searchResults.value.filter(result => {
            return result.name.toLowerCase().includes(name.value.toLowerCase());
        });
    } else {
        filteredResults.value = [];
    }
}

function selectResult(selectedName) {
    name.value = selectedName;
    filteredResults.value = [];
    searchResults.value = [];
}

watch(name, filterResults);

</script>
