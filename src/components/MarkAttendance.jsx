import { useRef, useState, useEffect, useCallback } from "react";
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { useNavigate } from "react-router-dom";
  
export default function MarkAttendance() {
    const [imgSrc, setImgSrc] = useState(null);
    const [isFaceDetected, setFaceDetected] = useState(false);
    const [storedImg, setStoredImg] = useState(null);
    const webcamRef = useRef(null);
    const navigate = useNavigate();

    const buttonClasses = "rounded-md px-3 py-1.5 text-sm font-bold leading-6 text-white shadow-sm"

    useEffect(() => {
        const jwtToken = localStorage.getItem('jwtToken');

        const loadModels = async () => {
          Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceExpressionNet.loadFromUri('/models'),
          ]).then(()=> console.log("Models Loaded")).catch((err)=> console.log(err))
        }
        loadModels();

        const fetchImage = async ()=> {
            await fetch(`${import.meta.env.VITE_API_URL}/attendance/image`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                },
            })
                .then((response) => response.json())
                .then(async (record) => {
                    if (!record.error) {
                        const image = await faceapi.fetchImage(record.image);

                        // Perform face detection
                        const detections = await faceapi.detectAllFaces(image, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
                        setStoredImg({image, detections});
                        console.log(detections);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        fetchImage();
    }, []);

    const capture = async () => {
            if (!imgSrc) {
                const imageSrc = webcamRef.current.getScreenshot();            
                const image = await faceapi.fetchImage(imageSrc);
    
                // Perform face detection
                const detections = await faceapi.detectAllFaces(image, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
                setImgSrc(imageSrc);
                if (detections.length > 0) {
                    return compare({image, detections});
                } else {
                    setFaceDetected(false);
                }
            }
        }

    const compare = async (imgSrcOne)=> {
        const faceDescriptor = await faceapi.computeFaceDescriptor(imgSrcOne.image, imgSrcOne.detections[0].landmarks);
        const storedFaceDescriptor = await faceapi.computeFaceDescriptor(storedImg.image, storedImg.detections[0].landmarks);

        const faceMatcher = new faceapi.FaceMatcher(storedFaceDescriptor);
        const bestMatch = faceMatcher.findBestMatch(faceDescriptor);
        const distance = faceapi.euclideanDistance(faceDescriptor, storedFaceDescriptor);
        console.log(distance, bestMatch);

        if (distance < 0.4) {
            setFaceDetected(true);
            setTimeout(()=> {
                return handleMarkAttendance();
            }, 2000);
        } else {
            setFaceDetected(false);
        }
    }

    const handleMarkAttendance = async () => {
        const jwtToken = localStorage.getItem('jwtToken');
        const date = new Date();
        await fetch(`${import.meta.env.VITE_API_URL}/attendance/add/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                date: date.toLocaleString()
            })
        })
        .then((response)=> response.json())
        .then((data)=> {
            console.log(data.message);
            return navigate('/');
        })
        .catch((error)=> console.log(error))
    }

    return (
      <>
            <div className="flex flex-col items-center gap-8" >
                <h2 className="bg-blue-400 p-4">Mark Your Attendance</h2>
                <div className="mt-6 h-80 w-80">
                    {imgSrc ?
                        <img src={imgSrc} alt="Captured Image" /> :
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                        />
                    }
                </div>
                <button className={`${buttonClasses} bg-indigo-600 hover: bg-indigo-500`}
                    onClick={capture}>Capture photo</button>

                {imgSrc && <button className={`${buttonClasses} bg-indigo-600 hover: bg-indigo-500`}
                 onClick={() => { setImgSrc(null) }}>Reset</button>}
                {imgSrc && (isFaceDetected ? <p className="text-green-500">Face Matched!!!</p> : <p className="text-red-500">Face not detected/matched !!</p>)}

                <p className="text-gray-400">Note: Capture your clear photo. Sit Properly in a well lit room. </p>
            </div>
           
      </>
    );
};