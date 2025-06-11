const video = document.getElementById('video');
const container = document.getElementById('container');
const startButton = document.getElementById('takePic');

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./assets/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('./assets/models'),
]).then(() => {
    startButton.addEventListener('click', startVideo);
});

function startVideo() {
    navigator.getUserMedia(
        { video: {} },
        stream => {
            video.srcObject = stream;
            video.style.display = 'block';
            video.style.width = '100%';
            video.style.height = '100%';
            video.play();
            video.addEventListener('loadedmetadata', () => {
                processFaceDetection();
            });
        },
        err => console.error(err)
    )
}

let isProcessing = false; // Variable to track if face detection is in progress
let imageDisplayed = false; // Variable to track if an image has been displayed

function processFaceDetection() {
    isProcessing = true;
    const canvas = faceapi.createCanvasFromMedia(video);

    canvas.style.position = 'relative';
    canvas.style.zIndex = '1';
    container.appendChild(canvas);

    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    // console.log(displaySize);
    // console.log(canvas);

    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
        if (!isProcessing) return; // Stop face detection if processing flag is false

        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);

        // Loop through each detected face
        resizedDetections.forEach(detection => {
            const textX = detection.detection.box.x + detection.detection.box.width / 2;
            const textY = detection.detection.box.y - 10;

            // Draw text 'Smile to take pic' on the canvas
            canvas.getContext('2d').font = '14px Arial';
            canvas.getContext('2d').fillStyle = 'white';
            canvas.getContext('2d').textAlign = 'center';
            canvas.getContext('2d').fillText('Smile to take pic', textX, textY);

            const happiness = detection.expressions.happy;
            if (happiness >= 0.95 && !imageDisplayed) { // Check if image is not already displayed
                console.log("Picture taken");
                imageDisplayed = true; // Set flag to true to indicate that an image has been displayed

                // Stop face detection
                isProcessing = false;

                // Take and display the picture
                takeAndDisplayPicture(canvas, video);
            }
        });
    }, 100);

    // Return an interval ID to stop face detection if needed
    const faceDetectionInterval = setInterval(() => { }, 1000); // Dummy interval
}

function takeAndDisplayPicture(canvas, video) {
    // Stop the video stream
    video.pause();

    // Create a canvas to combine video and overlay
    const combinedCanvas = document.createElement('canvas');
    combinedCanvas.width = video.videoWidth;
    combinedCanvas.height = video.videoHeight;
    const combinedCtx = combinedCanvas.getContext('2d');

    // Remove the canvas from the container
    container.removeChild(canvas);
    container.removeChild(video);

    // Draw video frame
    combinedCtx.drawImage(video, 0, 0, combinedCanvas.width, combinedCanvas.height);

    // Draw overlay canvas
    combinedCtx.drawImage(canvas, 0, 0, combinedCanvas.width, combinedCanvas.height);

    // Save the combined canvas as a data URL
    const pictureDataUrl = combinedCanvas.toDataURL();

    // Append the value and data to the <img> element in the container
    const img = document.getElementById('profile_pic');
    img.src = pictureDataUrl;
    img.value = pictureDataUrl;
    img.style.display = 'block'; // Make the image visible

    // Make button disabled
    startButton.value = "Picture Taken: Reload page to retake";
    startButton.style.backgroundColor = "darkgray";
    startButton.style.color = "black";
    // Disable the startButton (Pic button)
    startButton.disabled = true;


}
