let mediaRecorder;
let recordings = [];
let recordingCount = 0;

const startRecording = async () => {
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
  document.getElementById('startRecording').disabled = true;
  document.getElementById('stopRecording').disabled = false;
};

const stopRecording = () => {
  mediaRecorder.stop();
  document.getElementById('startRecording').disabled = false;
  document.getElementById('stopRecording').disabled = true;
};

const playRecording = (index) => {
  const audioUrl = URL.createObjectURL(recordings[index]);
  const audioPlayer = new Audio(audioUrl);
  audioPlayer.play();
};

const deleteRecording = (index) => {
  recordings.splice(index, 1);

  // Display the recording count
  recordingCount--;
  document.getElementById('recordingCount').innerText = `Recordings: ${recordingCount}`;

  // Create buttons for the updated recordings
  createRecordingButtons();
};

const createRecordingButtons = () => {
  const recordingsContainer = document.getElementById('recordingsContainer');
  recordingsContainer.innerHTML = '';

  for (let i = 0; i < recordings.length; i++) {
    const audioUrl = URL.createObjectURL(recordings[i]);

    // Create a div to hold each recording and its buttons
    const recordingDiv = document.createElement('div');
    recordingDiv.classList.add('recording');

    // Create an audio element for each recording
    const audioPlayer = document.createElement('audio');
    audioPlayer.controls = true;
    audioPlayer.src = audioUrl;

    // Create buttons for playing and deleting each recording
    const playButton = document.createElement('button');
    playButton.innerText = 'Play';
    playButton.addEventListener('click', () => playRecording(i));

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', () => deleteRecording(i));

    // Append elements to the recording div
    recordingDiv.appendChild(audioPlayer);
    recordingDiv.appendChild(playButton);
    recordingDiv.appendChild(deleteButton);

    // Append the recording div to the container
    recordingsContainer.appendChild(recordingDiv);
  }
};

const uploadFiles = async () => {
  for (let i = 0; i < recordings.length; i++) {
    const formData = new FormData();
    formData.append('file', recordings[i], `recording_${i}.wav`);

    try {
      const response = await fetch('http://127.0.0.1:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log(`File ${i+1} uploaded successfully`);
      } else {
        console.error(`Failed to upload file ${i+1}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
};



document.getElementById('startRecording').addEventListener('click', startRecording);
document.getElementById('stopRecording').addEventListener('click', stopRecording);
document.getElementById('downloadFiles').addEventListener('click', uploadFiles);
