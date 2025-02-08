import React, { useState } from 'react';
import { Card, Image, Button, Group } from '@mantine/core';

export default function ImageDisplay({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle edge cases
  if (!Array.isArray(images) || images.length === 0) {
    console.log("No images found"); 
    return null; // Do not display anything if there are no images
  }

  if (images.length === 1) {
    // Display a single image if there's only one
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: '100%', height: '100%' }}>
        <Image 
          src={images[0]} 
          alt="Single image" 
          fit="cover" 
          radius="md" 
        />
      </Card>
    );
  }

  // Multiple images: Show with navigation buttons
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // Loop back to the first image
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1 // Loop back to the last image
    );
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: '100%', height: '20vw' }}>
      <Image
        src={images[currentIndex]}
        alt={`Image ${currentIndex + 1}`}
        fit="cover"
        height="100vw"
        radius="md"
        style={{ width: '100%' }}
      />
      <Group position="center" mt="md">
        <Button onClick={handlePrev} disabled={images.length <= 1}>
          Previous
        </Button>
        <Button onClick={handleNext} disabled={images.length <= 1}>
          Next
        </Button>
      </Group>
    </Card>
  );
}
