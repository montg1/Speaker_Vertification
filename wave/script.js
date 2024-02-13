document.addEventListener("DOMContentLoaded", () => {
    let audioStream;
    let audioContext;
    let mediaRecorder;
    let chunks = [];
    let isRecording = false;
    let isVisualizing = true; // Add this variable

    const canvas = document.getElementById("audioCanvas");
    const ctx = canvas.getContext("2d");
    const audioPlayback = document.getElementById("audioPlayback");

    document.getElementById("startRecording").addEventListener("click", startRecording);
    document.getElementById("stopRecording").addEventListener("click", stopRecording);

    async function startRecording() {
        try {
            audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(audioStream);
    
            mediaRecorder = new MediaRecorder(audioStream);
            mediaRecorder.ondataavailable = handleDataAvailable;
    
            canvas.style.display = "block";
    
            // Set isVisualizing to true when starting recording
            isVisualizing = true;
    
            visualize(source);
    
            mediaRecorder.start();
            isRecording = true;
            document.getElementById("startRecording").disabled = true;
            document.getElementById("stopRecording").disabled = false;
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    }
    

    function stopRecording() {
        mediaRecorder.stop();
        // Stop the visualization
        isVisualizing = false;
        // Connecting the source to the destination when recording stops
        const source = audioContext.createMediaStreamSource(audioStream);
        source.connect(audioContext.destination);
        isRecording = false;
        document.getElementById("startRecording").disabled = false;
        document.getElementById("stopRecording").disabled = true;
    
        // Play back the recorded audio
        const recordedBlob = new Blob(chunks, { type: "audio/wav" });
        playRecordedAudio(recordedBlob);
    }
    
    function playRecordedAudio(blob) {
        const url = URL.createObjectURL(blob);
        audioPlayback.src = url;
    }
    

    function handleDataAvailable(event) {
        chunks.push(event.data);
    }

    function visualize(source) {
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;

        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        function draw() {
            if (!isVisualizing) return;

            const drawVisual = requestAnimationFrame(draw);

            analyser.getByteTimeDomainData(dataArray);

            ctx.fillStyle = "rgb(29, 240, 141)";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            ctx.lineWidth = 2;
            ctx.strokeStyle = "rgb(0, 0, 0)";

            ctx.beginPath();

            const sliceWidth = (WIDTH * 1.0) / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = (v * HEIGHT) / 2;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            ctx.lineTo(canvas.width, canvas.height / 2);
            ctx.stroke();
        };

        source.connect(analyser);
        draw();
    }

    function playRecordedAudio(blob) {
        const url = URL.createObjectURL(blob);
        audioPlayback.src = url;
    }

    mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        playRecordedAudio(blob);
        chunks = [];
    };

    window.onbeforeunload = () => {
        if (isRecording) {
            return "Are you sure you want to leave?";
        }
    };
});
