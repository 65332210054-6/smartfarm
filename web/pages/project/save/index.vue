<template>
    <a href="/">กลับหน้าหลัก</a>
    <h2 style=" text-align: center; font-size: xx-large;">บักทึกข้อมูล</h2>
    <div class="form-container">
        <label>Name: <input type="text" v-model="name" placeholder="name"></label><br>
        <label>Runtime (seconds): <input type="number" v-model.number="runtime" @input="checkRuntime"
                placeholder="runtime in seconds"></label><br>
        <div v-for="(time, index) in times" :key="index" class="time-input">
            <label>Time {{ index + 1 }}: <input type="time" v-model="times[index]"></label>
            <button @click="removeTime(index)" v-if="times.length > 1" class="remove-button">-</button><br>
            <button @click="addTime" :disabled="times.length >= 10" class="add-button">+</button>
        </div>
        <button v-if="std === 0" @click="onSave" class="save-button">save</button>
        <button v-else @click="onEdit" class="save-button">Edit to save</button>
    </div>
    <div class="showdata-table" v-if="showdata.length">
        <h2>ตารางรายการผักที่บันทึก</h2>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Runtime</th>
                    <th>Times</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(data, index) in showdata" :key="index">
                    <td>{{ data.name }}</td>
                    <td>{{ data.runtime }}</td>
                    <td>
                        <ul>
                            <li v-for="(t, i) in data.time" :key="i">Time {{ i + 1 }}: {{ t }}</li>
                        </ul>
                    </td>
                    <td>
                        <button @click="editData(index)">Edit</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>


</template>


<script setup>
import { ref, onMounted } from 'vue';
import { apiConfig } from '~/config';
import axios from 'axios';

const name = ref('');
const runtime = ref('');
const times = ref(['']);
const showdata = ref([]);
let editIndex = ref(null); // Keep track of the index of the item being edited
let std = ref(0)

// หลักการทำงานคือ สร้าง new set array สร้าง array ใหม่เพื่อเก็บค่าที่ไม่ซ้ำกัน
// และเปรียบเทียบกับจำนวนช่องของ array เดิม
// ถ้า array ใหม่ != array เดิม    คือ true
// ถ้า array ใหม่ = array เดิม    คือ flase
function hasDuplicates(array) {
    return new Set(array).size !== array.length;
}



function addTime() {
    if (times.value.length < 10) {
        times.value.push('');
    }
}

function removeTime(index) {
    if (times.value.length > 1) {
        times.value.splice(index, 1);
    }
}

function checkRuntime() {
    if (runtime.value < 0) {
        runtime.value = 0;
    }
}

async function request_data() {
    const res = await axios.post(`${apiConfig}/VegetableProfile/show`);
    showdata.value = res.data.dataValues;
    console.log(res.data.dataValues);
    return res;
}

async function onSave() {
    if (!name.value || !runtime.value || !times.value[0]) {
        alert('Please fill in all fields.');
        return;
    }
    if (hasDuplicates(times.value)) {
        alert('Please enter unique times.');
        return;
    }

    try {
        const res = await axios.post(`${apiConfig}/VegetableProfile/save`, {
            name: name.value,
            runtime: runtime.value,
            time: times.value,
            edit: 1
        });

        console.log(res.data);
        const status = res.data.status;

        if (status === 0) {
            alert("name exists");
        } else {
            alert("save success");
            request_data();
        }

        name.value = '';
        runtime.value = '';
        times.value = [''];
        editIndex.value = null; // reset edit index after saving

    } catch (error) {
        console.error('Error saving vegetable profile:', error);
    }
}


async function onEdit() {

    if (!name.value || !runtime.value || !times.value[0]) {
        alert('Please fill in all fields.');
        return;
    }

    try {
        const res = await axios.post(`${apiConfig}/VegetableProfile/edit`, {
            name: name.value,
            runtime: runtime.value,
            time: times.value,
        });

        console.log(res.data);
        const status = res.data.status;

        if (status === 1) {
            alert("Error");
        } else {
            alert("Edit success");
            request_data();
        }
        std = 0;
        name.value = '';
        runtime.value = '';
        times.value = [''];
        editIndex.value = null; // reset edit index after saving

    } catch (error) {
        console.error('Error saving vegetable profile:', error);
    }
}

function editData(index) {
    const data = showdata.value[index];
    name.value = data.name;
    runtime.value = data.runtime;
    times.value = [...data.time];
    editIndex.value = index; // Set the edit index
    std = 1;
}

onMounted(() => {
    request_data();
});
</script>









<style scoped>
/* Link style */
a {
    display: block;
    margin-bottom: 20px;
    color: #007bff;
    text-decoration: none;
    font-weight: bold;
}

a:hover {
    color: #0056b3;
}

/*หัวข้อของ ตารางแสดงผล   */
h2 {
    text-align: center;
    width: 60%;
    font-size: 24px;
    margin-bottom: 20px;
    margin: 2%;

}

/* Form container style */
.form-container {
    display: flex;
    flex-direction: column;
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Label style */
label {
    margin-bottom: 10px;
    font-weight: bold;
}

/* Input style */
input[type="text"],
input[type="number"],
input[type="time"] {
    width: calc(100% - 22px);
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

/* Time input container style */
.time-input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
}

/* Button styles */
button {
    padding: 8px 12px;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.add-button {
    background-color: #28a745;
    color: white;
}

.add-button:hover {
    background-color: #218838;
}

.remove-button {
    background-color: #dc3545;
    color: white;
    margin-left: 140px;
}

.remove-button:hover {
    background-color: #c82333;
}

.save-button {
    background-color: #007bff;
    color: white;
    margin-top: 20px;
}

.save-button:hover {
    background-color: #0056b3;
}

button[disabled] {
    background-color: #ccc;
    cursor: not-allowed;
}

/* New styles for the showdata table */
.showdata-table table {
    width: 50%;
    /*ความกว้างของตาราง   */
    border-collapse: collapse;
    margin: auto;
}


.showdata-table th,
.showdata-table td {
    padding: 12px 15px;
    text-align: left;
    border: 1px solid #ddd;
}

.showdata-table th {
    background-color: #f4f4f4;
    font-weight: bold;
}

.showdata-table td ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
}
</style>
