import { Image, Container } from "@mantine/core";
import { useEffect, useState } from "react";

interface SharkyProps {
  imageSrc?: string;
  imagePosition?: React.CSSProperties;
}

export default function Sharky({ imageSrc, imagePosition }: SharkyProps) {
  const [floatOffset, setFloatOffset] = useState(0);
  
  useEffect(() => {
    let animationFrameId: number;
    const startTime = Date.now();

    const animate = () => {
      // Calculate time elapsed since animation start
      const time = Date.now() - startTime;
      
      // Use sine wave for smooth bobbing motion (adjust 500 for speed)
      const floatValue = Math.sin(time / 500) * 20; // 20px amplitude
      setFloatOffset(floatValue);
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <Container w="100%" py="xl" pos={"absolute"}>
      {imageSrc && (
        <div 
          style={{
            position: 'fixed',
            borderRadius: '50%',
            overflow: 'hidden',
            width: '200px',
            height: '200px',
            transform: `translateY(${floatOffset}px)`,
            transition: 'transform 0.3s ease-out',
            ...imagePosition
          }}
        >
          <Image 
            src={imageSrc} 
            alt="Sharky" 
            width="100%"
            height="100%"
            style={{
              objectFit: 'cover',
            }}
          />
        </div>
      )}
    </Container>
  );
}
