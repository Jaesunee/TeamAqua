"use client";

import React, { useState } from 'react';
import { Card, Text, Image, Button, Group, Stack, Transition } from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconEye, IconEyeOff } from '@tabler/icons-react';


interface FlashcardProps {
    question: string;
    answers: string[];
    image?: string;  // Optional, as not all flashcards might have an image
    id: string | number;
    slideNumber: number;
  }

function Flashcard({ question, answers, image, id, slideNumber }: FlashcardProps) {  
    
    const [showAnswer, setShowAnswer] = useState(false);

    const toggleAnswer = () => setShowAnswer(!showAnswer);

    return (
        <Card shadow="sm" padding="lg" radius="xl" withBorder>
        <Card.Section>
            {image && (
            <Image
                src={image}
                height={160}
                alt="Flashcard image"
            />
            )}
        </Card.Section>

        <Group position="apart" mt="md" mb="xs">
            <Text weight={500}>Question {slideNumber}</Text>
            <Text size="sm" color="dimmed">ID: {id}</Text>
        </Group>

        <Text size="sm" mb="xl">{question}</Text>

        <Transition mounted={showAnswer} transition="fade" duration={400} timingFunction="ease">
            {(styles) => (
            <Stack spacing="xs" style={styles}>
                {answers.map((answer, index) => (
                <Text key={index} size="sm">{answer}</Text>
                ))}
            </Stack>
            )}
        </Transition>

        <Group position="apart" mt="xl">
            <Button 
            leftIcon={showAnswer ? <IconEyeOff size={14} /> : <IconEye size={14} />} 
            variant="light" 
            onClick={toggleAnswer}
            >
            {showAnswer ? 'Hide Answer' : 'Show Answer'}
            </Button>
            <Group spacing="xs">
            <Button variant="subtle" size="sm" compact><IconChevronLeft size={14} /></Button>
            <Button variant="subtle" size="sm" compact><IconChevronRight size={14} /></Button>
            </Group>
        </Group>
        </Card>
  );
}

export default Flashcard;
