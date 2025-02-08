"use client";

import React, { useState } from 'react';
import { Card, Text, Image, Button, Group, Stack, Transition, TextInput, Textarea } from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconEye, IconEyeOff, IconFileUpload, IconPlus, IconSquareRoundedXFilled } from '@tabler/icons-react';

interface FlashcardProps {
  question: string;
  answers: string[];
  image?: string;
  id: string | number;
  slideNumber: number;
  onUpdate?: (updatedData: Partial<FlashcardProps>) => void;
}

function Flashcard({ question, answers, image, id, slideNumber, onUpdate }: FlashcardProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(question);
  const [editedAnswers, setEditedAnswers] = useState(answers);

  const toggleAnswer = () => setShowAnswer(!showAnswer);

  const addAnswer = () => {
    const newAnswers = [...editedAnswers, ""];
    setEditedAnswers(newAnswers);
    onUpdate?.({ answers: newAnswers });
  };

  const deleteAnswer = (index: number) => {
    if (editedAnswers.length > 1) {
      const newAnswers = editedAnswers.filter((_, i) => i !== index);
      setEditedAnswers(newAnswers);
      onUpdate?.({ answers: newAnswers });
    }
  };

  const handleQuestionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newQuestion = event.currentTarget.value;
    setEditedQuestion(newQuestion);
    onUpdate?.({ question: newQuestion });
  };

  const handleAnswerChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswers = [...editedAnswers];
    newAnswers[index] = event.currentTarget.value;
    setEditedAnswers(newAnswers);
    onUpdate?.({ answers: newAnswers });
  };

  const renderAnswers = () => {
    return editedAnswers.map((answer, index) => (
      <Group key={index} spacing="xs">
        <TextInput
          value={answer}
          onChange={(event) => handleAnswerChange(index, event)}
          placeholder={`Answer ${index + 1}`}
          style={{ flex: 1 }}
        />
        <IconSquareRoundedXFilled
          size={14}
          color="red"
          onClick={() => deleteAnswer(index)}
          disabled={editedAnswers.length <= 1}
        >
          <IconSquareRoundedXFilled size={14} />
        </IconSquareRoundedXFilled>
      </Group>
    ));
  };

  const updateFlashcard = () => {
      console.log("Updating for " + id);
      const updatedData = { question: editedQuestion, answers: editedAnswers };
      console.log(updatedData);
  }

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

      <Textarea
        value={editedQuestion}
        onChange={handleQuestionChange}
        placeholder="Enter question"
        mb="xl"
      />

<Transition mounted={showAnswer} transition="fade" duration={400} timingFunction="ease">
        {(styles) => (
          <Stack spacing="xs" style={styles}>
            {renderAnswers()}
            <Button
              leftIcon={<IconPlus size={14} />}
              variant="outline"
              onClick={addAnswer}
              fullWidth
            >
              Add Answer
            </Button>
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
        <Button 
          onClick={updateFlashcard}>
            <IconFileUpload size={14} />
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
