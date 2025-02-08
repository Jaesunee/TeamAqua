"use client";

import { useEffect, useState } from 'react';
import ViewingFlashcard from '../ViewingFlashcard/ViewingFlashcard';
import { Container, Center } from '@mantine/core';

const BASE_URL = "http://127.0.0.1:5000/";

export default function Flashcard() {
  const module = "defaultModule";
  const chapter = "defaultChapterName";
  const [flashcards, setFlashcards] = useState([]);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  let currentFlashcard = flashcards[flashcardIndex];

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
    <Container >
      <Center h="70vh" mt={"15vh"}>

      {currentFlashcard ? (
        <ViewingFlashcard
        question={currentFlashcard.question}
        answers={currentFlashcard.answers}
        id={currentFlashcard.id}
        image={currentFlashcard.image}
        lastSlide={flashcardIndex === flashcards.length - 1}
        slideNumber={flashcardIndex + 1} // Show 1-based index
        onPrev={handlePrev}
        onNext={handleNext}
        />
      ) : (
        <div>No flashcard available</div>
      )}
      </Center>
    </Container>
  );
}
