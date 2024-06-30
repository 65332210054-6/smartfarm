<template>
  <a href="./project/save/">บักทึกข้อมูล</a><br>
  <div id="clock" class="clock">{{ currentTime }}</div>
  <div class="background-image"></div>

  <div class="content-container1">
    <div class="content-container">
      <div class="status-table">
        <table>
          <thead>
            <tr>

              <th>อุณหภูมิ</th>
              <th>ความซื้น</th>
              <th>ความเข้มแสง</th>
              <th>pH น้ำ</th>
              <th>ระดับน้ำ</th>
            </tr>
          </thead>
          <tbody>
            <tr>

              <td>{{ Newdata?.tem }} °C</td>
              <td>{{ Newdata?.hum }} %</td>
              <td>{{ Newdata?.bh1750 }} lux</td>
              <td>{{ Newdata?.ph }}</td>
              <td>{{ Newdata?.level }} cm</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="button-container">
        <button :class="{ active: isSwitchActive }" @click="Pump">{{ switchButtonText }}</button>
        <button :class="{ active: isValveActive }" @click="Valve">{{ valveButtonText }}</button>
        <button :class="{ active: isFanActive }" @click="Fan">{{ FanButtonText }}</button>
      </div>

      <div class="input-container">
        <div class="name-input-container">
          <label>ชื่อ: <input type="text" v-model="name" placeholder="name" @input="show"></label>
          <button @click="Delete">Delete</button>
        </div>
        <label>เวลาในการทำงาน (วินาที): <input type="number" v-model.number="runtime" @input="show"
            placeholder="runtime in seconds"></label><br>
        <label>อุณหภูมิ: <input type="number" placeholder=" °C "></label><br>

        <label>ความซื้น: <input type="number" placeholder=" % "></label><br>

        <label>ความเข้มแสง: <input type="number" placeholder=" LUX "></label><br>

        <label>pH น้ำ: <input type="number" placeholder=" pH "></label><br>



        <div v-for="(t, index) in time" :key="index" class="time-input">
          <label>เวลา {{ index + 1 }}: <input type="time" v-model="time[index]"></label>
          <div class="time-buttons">
            <button @click="removeTime(index)" v-if="time.length > 1" class="remove-button">-</button>
            <button @click="addTime" :disabled="time.length >= 10" class="add-button">+</button>

          </div>
        </div>
        <br><button @click="OnSave">save</button>
      </div>
    </div>
  </div>

  <div v-if="filteredResults.length > 0">
    <ul class="filtered-results">
      <li v-for="result in filteredResults" :key="result.id"
        @click="selectResult(result.name, result.runtime, result.time)">
        <span>{{ result.name }}</span>
        <span class="runtime">Runtime: {{ result.runtime }}</span>
        <span class="time">Time: {{ result.time.join(', ') }}</span>
      </li>
    </ul>
  </div>


  <!-- New table to display showdata values -->
  <div class="showdata-table" v-if="showdata.length">
    <h2>โปรแกรมที่ทำงาน</h2>
    <table>
      <thead>
        <tr>
          <th>ชื่อ</th>
          <th>เวลาในการทำงาน</th>
          <th>Times</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(data, index) in showdata" :key="index">
          <td>{{ data.name }}</td>
          <td>{{ data.runtime }}</td>
          <td>
            <ul>
              <li v-for="(t, i) in data.time" :key="i">เวลา {{ i + 1 }}: {{ t }}</li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import { apiConfig } from '~/config';

const isSwitchActive = ref(false);
const isValveActive = ref(false);
const isFanActive = ref(false);

const switchButtonText = computed(() => isSwitchActive.value ? 'Pump OFF' : 'Pump ON');
const valveButtonText = computed(() => isValveActive.value ? 'Valve OFF' : 'Valve ON');
const FanButtonText = computed(() => isFanActive.value ? 'Fan OFF' : 'Fan ON');
const Newdata = ref(null);

function hasDuplicates(array) {
  return new Set(array).size !== array.length;
}

async function Delete() {
  if (!name.value) {
    alert("กรุณากรอกข้อมูลในช่องว่าง");
    return;
  }
  console.log(name.value)
  const res = await axios.post(`${apiConfig}/VegetableProfile/delete`, { name: name.value });
  console.log(res.data);
  if (res.data.status === 1) {
    alert("delete success");
  } else {
    alert("error");
  }
}

async function dataTemAndHum() {
  try {
    const res = await axios.post(`${apiConfig}/TemAndHumProfile/show`, "ch1");
    Newdata.value = res.data.dataValues;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}



const Datapump = ref(null);
async function Pump() {
  try {
    const res = await axios.post(`${apiConfig}/PumpAndValveProfile/pump`, {
      id: "1",
      name: "ch1",
    });
    Datapump.value = res.data.dataValues;
    console.log(Datapump.value);

    if (Datapump == true) {
      isSwitchActive.value = isSwitchActive.value;
    } else {
      isSwitchActive.value = !isSwitchActive.value;
    }

  } catch (error) {
    console.error("Error:", error);
  }
}

const Datavalve = ref(null);
async function Valve() {
  try {
    const res = await axios.post(`${apiConfig}/PumpAndValveProfile/valve`, {
      id: "1",
      name: "ch1"
    });
    Datavalve.value = res.data.dataValues;
    console.log(Datavalve.value);

    if (Datavalve == true) {
      isValveActive.value = isValveActive.value;
    } else {
      isValveActive.value = !isValveActive.value;
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

const Datafan = ref(null);
async function Fan() {
  try {
    const res = await axios.post(`${apiConfig}/PumpAndValveProfile/fan`, {
      id: "1",
      name: "ch1",
    });
    Datafan.value = res.data.dataValues;
    console.log(Datafan.value);
    if (Datafan == true) {
      isFanActive.value = isFanActive.value;
    } else {
      isFanActive.value = !isFanActive.value;
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

const currentTime = ref('');
function updateTime() {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString();
}

const name = ref('');
const runtime = ref(0);
const time = ref(['']);

function addTime() {
  if (time.value.length < 10) time.value.push('');
}

function removeTime(index) {
  if (time.value.length > 1) time.value.splice(index, 1);
}

const searchResults = ref([]);

async function OnSave() {
  if (!name.value || !time.value[0] || !runtime.value) {
    alert('Please fill in all fields.');
    return;
  }
  if (runtime.value < 0) {
    alert('The runtime must be greater than or equal to 0.');
    return;
  }

  if (hasDuplicates(time.value)) {
    alert('Please enter unique times.');
    return;
  }

  const res = await axios.post(`${apiConfig}/RunCodeProfile/save`, { id: "1", project: "ch1", name: name.value, runtime: runtime.value, time: time.value });
  if (res) {
    alert("save success");
  } else {
    alert("Error");
  }
  fetchShowData();
  name.value = '';
  runtime.value = 0;
  time.value = [''];
}

// หากนำข้อมูลไปใช้ให้พิมพ์  showdata.value[0][0]
// showdata = (Object) {id: '1', project: 'ch1', name: 'ผักกาด', runtime: '20', time: Array(2)}
const showdata = ref([]);
/// ขอข้อมูลจาก API
async function fetchShowData() {
  try {
    const res = await axios.post(`${apiConfig}/RunCodeProfile/response`, "ch1");
    showdata.value = [res.data.dataValues];
    console.log('Fetched showdata:', showdata.value);
  } catch (error) {
    console.error("Error fetching showdata:", error);
  }
}



async function show() {
  console.log(time);
  if (runtime.value < 0) {
    runtime.value = 0;
  }
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

function selectResult(selectedName, selectedruntime, selectedTime) {
  name.value = selectedName;
  runtime.value = selectedruntime;
  time.value = selectedTime;
  filteredResults.value = [];
  searchResults.value = [];
}

async function checkStatus() {
  try {
    const res = await axios.post(`${apiConfig}/PumpAndValveProfile/request`,
      "ch1");
    const data = res.data.dataValues
    if (data.pump) {
      isSwitchActive.value = isSwitchActive.value;
    } else {
      isSwitchActive.value = !isSwitchActive.value;
    }

    if (data.valve) {
      isValveActive.value = isValveActive.value;
    } else {
      isValveActive.value = !isValveActive.value;
    }

    if (data.fan) {
      isFanActive.value = isFanActive.value;
    } else {
      isFanActive.value = !isFanActive.value;
    }

    console.log(data);

    // console.log(isSwitchActive.value);
    //console.log(isValveActive.value);
    console.log(isFanActive.value);

  } catch (error) {
    console.error("Error fetching fan status:", error);
  }
}



// ฟังชั่น dalay เวลา 1000 = 1 sec
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function chackfan() {
  const res = await axios.post(`${apiConfig}/PumpAndValveProfile/request`,
    "ch1");

  //const huminity = Newdata.value?.hum;
  const huminity = 75 ;
  const statusfan = res.data.dataValues.fan
  //onsole.log(huminity)

  //console.log(statuslalve)

  if (huminity >= 80 || (huminity >= 70 && statusfan)) {
    if (!statusfan) {
      Fan();
      console.log('fan on')
    }
  } else {
    if (statusfan) {
      Fan();
      console.log('fan off')
    }
    //เช็คถ้าพัดลมยังเปิดอยู่ ให้ปืด
  }
}


//เหลือ ปุ่มไม่แสดงตามจริงเวลากด  แก้ไขโดยเปลี่ยน Datapump.value เป็น Datapump  
//ปั้ม
// ตั้งค่าเงื่อนไขการทำงานของ ปั้ม เมื่อถึงเวลาทำงาน
async function chackpump() {
  const res = await axios.post(`${apiConfig}/PumpAndValveProfile/request`,
    "ch1");

  const statuspump = res.data.dataValues.pump
  //console.log(showdata.value[0])
  const time = [showdata.value[0].runtime]
  const newone = [showdata.value[0].time][0]
  //const ph = Newdata.value?.ph;
  const pht = 6.5;
  //console.log(statuspump)

  for (let i = 0; i < newone.length; i++) {

    //ถ้าเวลาจริง = เวลาที่ตั้งไว้ ให้ทำงาน
    if (currentTime.value === newone[i] + ':00') {

      //ถ้า ความชื้น น้อยกว่า 70 ให้ปั้มทำงาน
      if (pht > 6 && pht < 7.5) {
        if (!statuspump) {
          console.log('ปั้ม ON')
          Pump();  // เปิดปั้ม
          await delay(time * 1000);  //หน่วงเวลาทำงาน
          Pump();  //ปิดปั้ม
        } else {
          console.log('ปั้ม ON อยู่แล้ว')
          Pump();  //ปิดปั้ม
        }
      } else {
        if (statuspump) {
          console.log('ปั้ม OFF')
          Pump();  // เปิดปั้ม
        }
      }
      // เช็คสำรองเผื่อปั้มยังทำงานอยู่
      if (statuspump) {
        Pump();  //ปิดปั้ม
      }
    }
  }
}



// valve เสร็จแล้ว
// เติมน้ำลง แท้ง
// ตั้งค่าเงื่อนไขการทำงานของ วาล์ว เทียบกับ ระดับ น้ำ
async function chackWaterlevel() {
  const res = await axios.post(`${apiConfig}/PumpAndValveProfile/request`,
    "ch1");

  const statuslalve = res.data.dataValues.valve
  // จะได้ false กับ  true

  // level  อาจจะเปลี่ยนเป็น ระบบน้ำหรืออื่นๆ เพื่อกำหนดเงื่อนไข การทำงานของอุปกรณ์
  const level = Newdata.value?.level;
  //console.log(statuslalve)

  if (level < 40 || (level <= 50 && statuslalve)) {
    //ถ้า false สั่งปั้ม on
    if (!statuslalve) {
      console.log('สั่งปั้ม ON')   // pump ก็จะเป็น true
      Valve();
    }
    // ก็จะเป็น true
    //console.log('valve on')
  } else if (level > 50) {
    if (statuslalve) {
      Valve();
      console.log('สั่งปั้ม off')   // pump ก็จะเป็น false
    }
    //สั่งให้ปั้ม off  หรือ false
    //console.log('valve off')
  }
}





watch(name, filterResults);

onMounted(() => {
  dataTemAndHum();
  setInterval(dataTemAndHum, 3000);
  updateTime();
  setInterval(updateTime, 1000);
  fetchShowData();
  checkStatus(); // เช็คสถานะ Data เมื่อเริ่มเข้าเว็บ

  setInterval(chackpump, 1000); // เช็คการทำงานของปั้ม เมื่อถึงเวลา
  setInterval(chackWaterlevel, 1000); //เช็คระดับน้ำ
  setInterval(chackfan, 1000);
});
</script>


<style scoped>
/* กำหนด CSS สำหรับแท็ก <p> ภายใน content-container */
.content-container p {
  line-height: 1.5;
  /* กำหนดระยะห่างระหว่างบรรทัด */
}

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

.clock {
  font-size: 1.5rem;
  font-weight: bold;
  background-color: #a7ddee;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  text-align: center;
}

.content-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}



/*  show status sensors*/


.status-table {
  width: 60%;
  margin-bottom: 90px;
  margin-top: 50px;
}

.status-table table {
  width: 100%;
  border-collapse: collapse;
}

.status-table th,
.status-table td {
  padding: 12px 15px;
  text-align: left;
  border: 1px solid #ddd;
}

.status-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.button-container {
  display: flex;
  margin-top: 20px;
}

button {
  margin: 0 10px;
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

button.active {
  background-color: grey;
}

.input-container {
  margin-top: 2%;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

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



.name-input-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.name-input-container label {
  margin-bottom: 0;
}

.name-input-container button {
  margin-left: 10px;
  background-color: #8a1d28;
  /* เปลี่ยนสีพื้นหลังปุ่มเป็นแดง */
  color: white;
  /* เปลี่ยนสีของตัวอักษรเป็นขาว */
}

.name-input-container button:hover {
  background-color: #c82333;
  /* เปลี่ยนสีพื้นหลังปุ่มเมื่อโฮเวอร์ */
}

label {
  margin-bottom: 10px;
  font-weight: bold;
}

input {
  width: calc(100% - 30px);
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
}

.time-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.time-buttons {
  display: flex;
  align-items: center;
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

.time-buttons button {
  margin-left: 5px;
  padding: 5px 10px;
  font-size: 1.3rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}



button[disabled] {
  background-color: #ccc;
  cursor: not-allowed;
}


/*ข้อมูลที่แสดงจากการค้นหา   */

.filtered-results {
  list-style: none;
  padding: 10px 38%;
}

.filtered-results li {
  background-color: #f9f9f9;
  margin: 5px 0;
  padding: 10px 10%;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.filtered-results li:hover {
  background-color: #e0f7fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filtered-results li span {
  display: block;
  font-weight: bold;
}

.filtered-results li .runtime,
.filtered-results li .time {
  font-weight: normal;
  color: #666;
}

/*หัวข้อของ ตารางแสดงผล   */
h2 {
  text-align: center;
  width: 57%;
  font-size: 24px;
  margin-bottom: 20px;
  margin: 2%;

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
