import { useRef, useState, useEffect, useCallback } from "react";
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { useNavigate } from "react-router-dom";
  
function WebcamCapture({newUser}) {
    const [imgSrc, setImgSrc] = useState(null);
    const [isFaceDetected, setFaceDetected] = useState(false);
    const webcamRef = useRef(null);
    const navigate = useNavigate();

    const buttonClasses = "rounded-md px-3 py-1.5 text-sm font-bold leading-6 text-white shadow-sm"

    useEffect(() => {
        const loadModels = async () => {
          Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceExpressionNet.loadFromUri('/models'),
          ]).then(()=> console.log("Models Loaded")).catch((err)=> console.log(err))
        }
        loadModels();
    }, []);

    const capture = useCallback(
        async () => {
            if (!imgSrc) {
                const imageSrc = webcamRef.current.getScreenshot();            
                const image = await faceapi.fetchImage(imageSrc);
    
                // Perform face detection
                const detections = await faceapi.detectAllFaces(image, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
                setImgSrc(imageSrc);
                if (detections.length > 0) {
                    setFaceDetected(true);
                } else {
                    setFaceDetected(false);
                }
            }
        }, [imgSrc, webcamRef]
    )

    const handleSubmit = async () => {
        await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
            method: 'POST',
            body: JSON.stringify({
                ...newUser,
                imgSrc
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                return navigate('/signin');
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
      <>
            <div className="flex flex-col items-center gap-8" >
                <h2 className="bg-blue-400 p-4">Register yourself by capturing your photo</h2>
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
                {imgSrc && (isFaceDetected ? <button className={`${buttonClasses} bg-gray-700 hover: bg-gray-500`}
                    onClick={handleSubmit}>Submit</button> : <p className="text-red-500">Face not detected properly!!!</p>)}

                <p className="text-gray-400">Note: Capture your clear photo as this will be used for future reference.
                    Sit Properly in a well lit room. </p>
            </div>
           
      </>
    );
};

export default WebcamCapture;