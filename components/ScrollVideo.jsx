"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useMediaQuery } from "react-responsive";

gsap.registerPlugin(ScrollTrigger);

const ScrollVideo = () => {
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);

  const isLG = useMediaQuery({ query: "(min-width: 1024px)" });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    function animateOnScroll(canvasID, videoInfo) {
      const canvas = document.getElementById(canvasID);
      const canvasContext = canvas.getContext("2d");

      canvasContext.webkitImageSmoothingEnabled = false;
      canvasContext.mozImageSmoothingEnabled = false;
      canvasContext.imageSmoothingEnabled = false;

      canvas.height = window.innerHeight;
      canvas.width = window.innerWidth;

      const loadImage = (src) => {
        return new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = () => reject();
          image.src = src;
        });
      };

      const loadAllImages = async () => {
        for (let i = 0; i <= videoInfo.totalFrames; i++) {
          const imgSrc = videoInfo.currentImage(i);
          try {
            const img = await loadImage(imgSrc);
            videoInfo.images.push(img);
          } catch (error) {
            console.error("Failed to load image:", imgSrc);
          }
        }

        setIsLoading(false); // All images loaded, set loading to false
      };

      loadAllImages();

      for (let i = 0; i <= videoInfo.totalFrames; i++) {
        const img = new Image();
        img.src = videoInfo.currentImage(i);
        videoInfo.images.push(img);
      }

      gsap.to(videoInfo, {
        currentFrame: videoInfo.totalFrames,
        snap: "currentFrame",
        ease: "none",
        opacity: 1,
        scrollTrigger: {
          trigger: canvas,
          start: "top",
          end: `bottom+=5500`,
          scrub: 0.5,
          markers: true,
        },
        onUpdate: render,
      });

      const calculateImageSize = (image) => {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // Calculate the desired width to fit the screen width
        const desiredWidth = screenWidth;
        const widthScale = desiredWidth / image.width;

        // Calculate the corresponding height based on the width scale
        const desiredHeight = image.height * widthScale;

        return { width: desiredWidth, height: desiredHeight };
      };

      const updateCanvasSize = () => {
        const { innerWidth, innerHeight } = window;
        const image = videoInfo.images[videoInfo.currentFrame];
        const aspectRatio = image.width / image.height;

        const renderWidth = innerWidth;
        const renderHeight = innerWidth / aspectRatio;

        const offsetX = 0;
        const offsetY = 0;

        const { width, height } = calculateImageSize(image);

        canvas.width = width;
        canvas.height = height;

        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        canvasContext.drawImage(
          image,
          offsetX,
          offsetY,
          renderWidth,
          renderHeight
        );
      };

      videoInfo.images[0].onload = () => {
        canvasContext.drawImage(videoInfo.images[0], 0, 0);
      };

      function render() {
        updateCanvasSize();
      }
    }
    const demoVideo1Info = {
      totalFrames: 97,
      totalTime: 5,
      images: [],
      currentFrame: 1,
      currentImage: (index) =>
        `/FRAMES/FRAMES${index.toString().padStart(3, "0")}.png`,
    };
    console.log(demoVideo1Info);
    animateOnScroll(canvasRef.current.id, demoVideo1Info);
  }, [isLG]);

  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    const observerOptions = {
      root: null,
      threshold: 0.1, // Adjust the threshold value as needed
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      });
    };

    const observer = new IntersectionObserver(
      handleIntersection,
      observerOptions
    );
    observer.observe(videoElement);

    return () => {
      observer.unobserve(videoElement);
    };
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (isVisible && videoElement.paused) {
      videoElement.play();
    }
  }, [isVisible]);

  return (
    <>
      <div className="w-full h-screen fixed top-0 bg-black opacity-[0.3]  z-30"></div>
      <main className=" w-full relative h-[1250vh] LG:h-[1100vh] bg-black ">
        <canvas
          ref={canvasRef}
          className="info sticky top-0 right-0 w-full m-0 object-cover  h-screen"
          id="demo_video1"
        />
      </main>
      <div className="hidden w-full min-w-full h-full">
        <div className="w-full h-full bg-evigBlack">
          <video
            className="w-full h-full object-cover"
            ref={videoRef}
            src="https://ik.imagekit.io/o0jwga39e/EVIG_LISO/VIDEOS/device_ui_final.mp4?updatedAt=1688459301187"
            loop={true}
            controls={false}
            playsInline
            muted
            preload
            type="video/mp4"
          >
            Sorry, your browser doesnt support embedded videos.
          </video>
        </div>
      </div>
    </>
  );
};

export default ScrollVideo;
