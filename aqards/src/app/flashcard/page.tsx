"use client";

import { useEffect, useState } from 'react';
import ViewingFlashcard from '../ViewingFlashcard/ViewingFlashcard';
import Sharky from '../Sharky/Sharky';
import { Container, Button, Grid, GridCol, Transition, Box, Title } from '@mantine/core';
import sharky from "../../../public/sharky.png";
import InfoCard from '../InfoCard/InfoCard';

const BASE_URL = "http://127.0.0.1:5000/";

export default function Flashcard() {
  const module = "defaultModule";
  const chapter = "defaultChapterName";
  const [flashcards, setFlashcards] = useState([]);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  let currentFlashcard = flashcards[flashcardIndex];

  const toggleAdditionalInfo = () => {
    setShowAdditionalInfo(!showAdditionalInfo);
    console.log(showAdditionalInfo);
  };


  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await fetch(`${BASE_URL}/flashcards/${module}/${chapter}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setFlashcards(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFlashcards();
  }, []); // Empty dependency array ensures this runs once on mount


  useEffect(() => {
    currentFlashcard = flashcards[flashcardIndex];
    console.log(currentFlashcard);
  }, [flashcardIndex]);


  const handlePrev = () => {
    setFlashcardIndex(prev => Math.max(0, prev - 1));

  };

  const handleNext = () => {
    setFlashcardIndex(prev => Math.min(flashcards.length - 1, prev + 1));

  };

  return (
    <Container fluid style={{ position: 'relative' }}>
      <Sharky
        imageSrc={sharky.src}
        imagePosition={{
          position: 'absolute',
          width: '200px',
          zIndex: 100,
          right: '50px',
          top: '600px',
          scale: 0.8
        }}
      />

      <Button
        onClick={toggleAdditionalInfo}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 100
        }}
      >
        {showAdditionalInfo ? "Hide Additional Info" : "Show Additional Info"}
      </Button>
      <Grid gutter="xl" justify="space-between" align="stretch" mt={'xl'} style={{ transition: 'transform 0.5s ease' }}>
        <Grid.Col
          span={{ base:1, md: 3 }}
          px={{ base: 'sm', md: 'xl' }}
          mx={{ base: 'xl', md: '2rem' }}
          style={{
            transition: 'transform 0.5s ease, width 0.5s ease',
            transform: showAdditionalInfo ? 'translateX(-180%)' : 'translateX(0)',
            width: showAdditionalInfo ? '40%' : '50%'
          }}
        >
          <Transition
            mounted={!!currentFlashcard}
            transition={{
              in: { transform: 'translateX(0)', opacity: 1 },
              out: { transform: 'translateX(-100%)', opacity: 0 },
              transitionProperty: 'transform, opacity',
            }}
            duration={400}
          >
            {(styles) => (
              <div style={{
                ...styles,
                transition: 'transform 0.5s ease, opacity 0.5s ease',
              }}>
                <ViewingFlashcard
                  question={currentFlashcard?.question || ''}
                  answers={currentFlashcard?.answers || []}
                  id={currentFlashcard?.id || ''}
                  image={currentFlashcard?.image}
                  lastSlide={flashcardIndex === flashcards.length - 1}
                  slideNumber={flashcardIndex + 1}
                  onPrev={handlePrev}
                  onNext={handleNext}
                />
              </div>
            )}
          </Transition>
        </Grid.Col>

        <Grid.Col
          span={{ base: 5, md: 6 }}
          px={{ base: 'sm' }}
          mx={{ base: 0, md: '2rem' }}
          style={{ position: 'relative', zIndex: -1 }}
        >
          <Transition
            mounted={showAdditionalInfo && !!currentFlashcard}
            transition={{
              in: {
                transform: 'translateX(0)',
                opacity: 1
              },
              out: {
                transform: 'translateX(-100%)',
                opacity: 0
              },
            }}
            duration={400}
          >
            {(styles) => (
              <div style={{
                ...styles,
                position: 'absolute',
                right: 0,
                left: 0,
                transition: 'transform 0.4s ease, opacity 0.4s ease'
              }}>
                   <InfoCard
                    additionalInfo={currentFlashcard?.additionalInfo || ""}
                  />
                {/* <Box
                  p="md"
                  style={{
                    backgroundColor: 'var(--mantine-color-white)',
                    borderRadius: 'var(--mantine-radius-lg)',
                    boxShadow: 'var(--mantine-shadow-xl)',
                    width: '35vw'
                  }}
                >
                  <Title order={2} mb="md">Additional Info</Title>
               
                </Box> */}
              </div>
            )}
          </Transition>
        </Grid.Col>

      </Grid>
    </Container>

  );
}
