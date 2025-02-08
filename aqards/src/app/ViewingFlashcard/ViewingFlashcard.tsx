"use client";

import React, { useState, useEffect } from 'react';
import { Card, Text, Image, Button, Group, Stack, Transition, TextInput, Textarea } from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconCross, IconEdit, IconEye, IconEyeOff, IconFileUpload, IconPlus, IconSquareRoundedXFilled, IconXboxAFilled, IconXboxXFilled } from '@tabler/icons-react';
import FlashcardAnswer from './FlashcardAnswer/FlashcardAnswer';

interface FlashcardProps {
    question: string;
    answers: string[];
    image?: string;
    id: string | number;
    slideNumber: number;
    lastSlide: boolean;
    onUpdate?: (updatedData: Partial<FlashcardProps>) => void;
    onPrev?: () => void;
    onNext?: () => void;
}

const BASE_URL = "http://127.0.0.1:5000/";

function Viewing({ question, answers, image, id, slideNumber, lastSlide, onUpdate, onPrev, onNext }: FlashcardProps) {
    const module = "defaultModule";
    const chapter = "defaultChapterName";

    const [showAnswer, setShowAnswer] = useState(true);
    const [editedQuestion, setEditedQuestion] = useState(question);
    const [editedAnswers, setEditedAnswers] = useState(answers);
    const [editMode, setEditMode] = useState(false);
    const [originalAnswers, setOriginalAnswers] = useState<string[]>([]);

    useEffect(() => {
        setEditedQuestion(question);
        setEditedAnswers(answers);
    }, [question, answers]); // Update state when props change

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

    const handleAnswerChange = (index: number, value: string) => {
        const newAnswers = [...editedAnswers];
        newAnswers[index] = value;
        setEditedAnswers(newAnswers);
    };

    const renderAnswers = () => {
        return editedAnswers.map((answer, index) => (
            <Group key={index} align="center" spacing="xs" noWrap>
                <div style={{ flex: 1 }}>
                    <FlashcardAnswer
                        answer={answer}
                        editMode={editMode}
                        index={index}
                        onChange={handleAnswerChange}
                    />
                </div>
                {editMode && (
                    <Group spacing="xs" noWrap>
                        <Button
                            variant="outline"
                            color="blue"
                            size="sm"
                            onClick={() => updateAnswer(index)}
                        >
                            <IconFileUpload size={14} />
                        </Button>
                        <Button
                            variant="outline"
                            color="red"
                            size="sm"
                            onClick={() => resetAnswer(index)}
                        >
                            <IconXboxAFilled size={14} />
                        </Button>
                    </Group>
                )}
                {!editMode && (
                    <IconSquareRoundedXFilled
                        size={14}
                        color="red"
                        onClick={() => deleteAnswer(index)}
                        disabled={editedAnswers.length <= 1}
                        style={{ cursor: 'pointer' }}
                    />
                )}
            </Group>
        ));
    };
    

    const toggleEdit = () => {
        if (!editMode) {
            // Save snapshot when entering edit mode
            setOriginalAnswers([...editedAnswers]);
        }
        setEditMode(!editMode);
    };

    const resetChanges = () => {
        setEditedAnswers([...originalAnswers]);
        setEditMode(false);
    };

    const updateFlashcard = () => {
        console.log("Updating for " + id);
        const updatedData = { question: editedQuestion, answers: editedAnswers };
        setEditMode(false);
        try {
            fetch(`${BASE_URL}/flashcards/${module}/${chapter}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('Flashcard updated successfully:', data);
                })
                .catch((error) => {
                    console.error('Error updating flashcard:', error);
                })
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <Card shadow="sm" padding="lg" radius="xl" withBorder h="80vh" w="30vw">
            <Card.Section mx={'auto'} mt={'sm'} style={{ width: '100%', height: 'auto', overflow: 'hidden' }}>
                {image && (
                    image.length > 0 ? (
                        <Image
                            src={image}
                            w="100%"
                            h="200px"
                            fit="cover"
                            radius="md"
                            alt="Flashcard image"
                        />
                    ) : null
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
                            lefticon={<IconPlus size={14} />}
                            variant="outline"
                            onClick={addAnswer}
                            fullWidth
                        >
                            Add Answer
                        </Button>
                    </Stack>
                )}
            </Transition>

            <Group position="apart" mt="auto" mb={"xs"}>
                <Button
                    lefticon={showAnswer ? <IconEyeOff size={14} /> : <IconEye size={14} />}
                    variant="light"
                    onClick={toggleAnswer}
                >
                    {showAnswer ? 'Hide Answer' : 'Show Answer'}
                </Button>
                <Group>
                    {!editMode && (
                        <Button onClick={toggleEdit}>
                            <IconEdit size={14} />
                        </Button>
                    )}

                    {editMode && (
                        <Group>
                            <Button onClick={updateFlashcard} color="green">
                                <IconFileUpload size={14} />
                            </Button>
                            <Button onClick={resetChanges} color="red">
                                <IconXboxXFilled size={14} />
                            </Button>
                        </Group>
                    )}
                </Group>
                <Group spacing="xs">
                    <Button
                        variant="subtle"
                        size="sm"
                        onClick={onPrev}  // Add click handler
                        disabled={slideNumber <= 1}  // Optional disable
                    >
                        <IconChevronLeft size={14} />
                    </Button>
                    <Button
                        variant="subtle"
                        size="sm"
                        onClick={onNext}  // Add click handler
                        disabled={lastSlide}  // Optional disable
                    >
                        <IconChevronRight size={14} />
                    </Button>
                </Group>
            </Group>
        </Card>
    );
}

export default Viewing;
