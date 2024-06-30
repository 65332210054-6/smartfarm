// myScript.js
export function updateTime() {
        // สร้างวัตถุ Date เพื่อเรียกข้อมูลเวลาปัจจุบัน
        var now = new Date();
    
        // ดึงข้อมูลชั่วโมง, นาที และวินาที
        var hours = now.getHours();
        var minutes = now.getMinutes();
        var seconds = now.getSeconds();
    
        // เพิ่ม 0 ข้างหน้าเลขที่มีค่าน้อยกว่า 10 เพื่อให้เป็นรูปแบบเวลาที่ถูกต้อง (เช่น 01, 02, 03)
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
    
        // สร้างข้อความที่แสดงเวลา
        var timeString = hours + ':' + minutes + ':' + seconds;
    
        // นำข้อความที่สร้างมาแสดงผลบนหน้า HTML
        document.getElementById('clock').innerHTML = timeString;
    
}
