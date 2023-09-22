import React, { useEffect } from 'react';

function CameraFeed() {
  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoElement = document.querySelector('video');
        videoElement.srcObject = stream;
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    }
    startCamera();
  }, []);

  return (
    <div className="camera-feed">
      <video autoPlay playsInline></video>
    </div>
  );
}

export default CameraFeed;
