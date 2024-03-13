function myFunction() {
    var element = document.getElementsByClassName("mic-icon")[0];
    // เพิ่ม class "active" เพื่อให้ได้สถานะที่ถูกต้อง
    element.classList.toggle("active");

    // ตรวจสอบว่าตอนนี้มี class "active" หรือไม่
    if(element.classList.contains("active")){
        document.getElementsByClassName("mic-icon")[0].style.fill="red";
    } else {
        document.getElementsByClassName("mic-icon")[0].style.fill="#1E2D70";
    }
}