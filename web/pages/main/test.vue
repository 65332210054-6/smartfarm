<template>
    <h1 style="text-align: center;">Update Process</h1>
    <a href="../abc">หน้าหลัก</a><br>
    <a href="../save/">เพิ่มข้อมูล</a><br>
    <a href="../delete/">ลบข้อมูล</a><br><br>
    <div>
        Name : <input type="text" v-model="name" placeholder="name" @input="show"> <br>
        Runtime (seconds): <input type="number" v-model = rumtime @input="checkRuntime"
            placeholder="runtime in seconds"><br>
            
        <div v-for="(t, index) in time" :key="index">
            Time{{ index + 1 }} : <input type="time" v-model="time[index]"><br>
        </div>
        <button @click="OnSave">Run</button><br>

        <div v-if="filteredResults.length > 0">
            <ul>
                <li v-for="result in filteredResults" :key="result.id" @click="selectResult(result.name, result.runtime, result.time)">
                    {{ result.name }} : {{ result.runtime }} : {{ result.time }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';
import { apiConfig } from '~/config';
import { n } from '../main/test';

const name = ref('');
const time = ref(['']);  // Initialize with an array containing an empty string for Time1
const searchResults = ref([]);

async function OnSave() {
    n.name = name.value;
    n.runtime = runtime.value;
    n.time = time.value;
    const res = await axios.post(`${apiConfig}/RunCodeProfile/save`, {id: "1",name: name.value, runtime: runtime.value, time: time.value})
    console.log(res.data);
    //const hours = time.value.map(t => t.split(':')[0]);
    //const min = time.value.map(t => t.split(':')[1]);
    //console.log(res.data);
    //console.log(hours);  // Array of hours
    //console.log(min);  // Array of minutes 
}

async function show() {
    console.log(time);
    if (!name.value) {
        searchResults.value = [];
        return;
    }
    const res = await axios.post(`${apiConfig}/VegetableProfile/show`).then((res) => {
        searchResults.value = res.data.dataValues;
    });
}

const filteredResults = ref([]);

async function filterResults() {
    if (name.value) {
        filteredResults.value = searchResults.value.filter(result => {
            return result.name.toLowerCase().includes(name.value.toLowerCase());
        });
    } else {
        filteredResults.value = [];
    }
}

function selectResult(selectedName, selecruntime, selectedTime) {
    name.value = selectedName;
    runtime.value = selecruntime;
    time.value = selectedTime;
    filteredResults.value = [];
    searchResults.value = [];
}

watch(name, filterResults);

</script>
