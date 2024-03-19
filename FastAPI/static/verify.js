let mediaRecorder;
let recordings = [];
let recordingCount = 0;
let isRecording = false;
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

const toggleRecording = async () => {
  if (!isRecording) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    const recordedChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(recordedChunks, { type: 'audio/wav' });
      recordings.push(audioBlob);

      // Display the recording count
      recordingCount++;
      document.getElementById('recordingCount').innerText = `Recordings: ${recordingCount}`;

      // Clear the chunks for the next recording
      recordedChunks.length = 0;

      // Create buttons for the new recording
      createRecordingButtons();
    };

    mediaRecorder.start();
    // Remove the line that changes the button text
  } else {
    mediaRecorder.stop();
    // Remove the line that changes the button text
  }

  isRecording = !isRecording;
};


const uploadFiles = async () => {
  for (let i = 0; i < recordings.length; i++) {
    const formData = new FormData();
    formData.append('file', recordings[i], `recording_${i}.wav`);

    try {
      const response = await fetch('http://127.0.0.1:8000/verify_Test', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log(`File ${i + 1} uploaded successfully`);
      } else {
        console.error(`Failed to upload file ${i + 1}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
};

document.getElementById('toggleRecording').addEventListener('click', toggleRecording);
document.getElementById('downloadFiles').addEventListener('click', uploadFiles);