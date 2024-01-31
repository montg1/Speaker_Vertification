let mediaRecorder;
let recordedChunks = [];

const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(recordedChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        document.getElementById('audioPlayer').src = audioUrl;

        // Send the audio file to the server
        convertAndSendToServer(audioBlob);

        recordedChunks = [];
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

const convertAndSendToServer = async (blob) => {
    const formData = new FormData();
    formData.append('file', blob, 'recorded_audio.wav');

    try {
        const response = await fetch('http://127.0.0.1:8000/upload', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            console.log('File uploaded successfully');
        } else {
            console.error('File upload failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};


document.getElementById('startRecording').addEventListener('click', startRecording);
document.getElementById('stopRecording').addEventListener('click', stopRecording);
