import { Image, Container } from "@mantine/core";
import { useEffect, useState } from "react";

interface SharkyProps {
  imageSrc?: string;
  imagePosition?: React.CSSProperties;
}

export default function Sharky({ imageSrc, imagePosition }: SharkyProps) {
  const [floatOffset, setFloatOffset] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

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

  useEffect(() => {
    if (isHovered) {
        console.log("hovered" + isHovered);
    }
  }, [isHovered]);

  return (
    <Container w="100%" py="xl" pos={"absolute"} >
        {isHovered && (
            <div style={{
              position: 'absolute',
              bottom: '25%',
              left: '60%',
              transform: `translateY(${floatOffset}px)`,
              marginBottom: '0px',
              backgroundColor: 'rgba(255, 255, 255, 1)',
              padding: '10px 15px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              zIndex: 100,
              minWidth: '160px',
              textAlign: 'center'
            }}>
              <h1 style={{ fontSize: '18px', marginBottom: '5px', color: 'rgba(0, 0, 0, 0.9)' }}>
                "Let's make some flashcards! 🦈"
              </h1>
              {/* Speech bubble pointer */}
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                width: 0,
                height: 0,
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                borderTop: '10px solid rgba(255, 255, 255, 0.9)',
                transform: 'translateX(-50%)'
              }} />
            </div>
          )}
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
          onMouseEnter={() => setIsHovered(true)}  
          onMouseLeave={() => setIsHovered(false)}
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
