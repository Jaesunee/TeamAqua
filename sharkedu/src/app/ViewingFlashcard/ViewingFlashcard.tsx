"use client";

import React, { useState, useEffect } from 'react';
import { Card, Text, Image, Button, Group, Stack, Transition, TextInput, Textarea } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import ImageDisplay from './Carousel/ImageSlideshow';
import { IconChevronLeft, IconChevronRight, IconCross, IconEdit, IconEye, IconEyeOff, IconFileUpload, IconPlus, IconSquareRoundedXFilled, IconXboxAFilled, IconXboxXFilled } from '@tabler/icons-react';
import FlashcardAnswer from './FlashcardAnswer/FlashcardAnswer';
import FlashcardQuestion from './FlashcardQuestion/FlashcardQuestion';

// interface FlashcardProps {
//     question: string;
//     answers: string[];
//     image?: string;
//     id: string | number;
//     slideNumber: number;
//     lastSlide: boolean;
//     onUpdate?: (updatedData: Partial<FlashcardProps>) => void;
//     onPrev?: () => void;
//     onNext?: () => void;
//     showAdditionalInfo?: boolean;
//     toggleAdditionalInfo?: () => void;
// }
interface FlashcardProps {
    id: string | number;
    question: string;
    answers: string[];
    image?: string[]; // changed to array
    slideNumber: number; // take from the index at the start
    additionalInfo: string;
    incorrectAnswers?: string[];
    lastSlide: boolean;

    onUpdate?: (updatedData: Partial<FlashcardProps>) => void;
    onPrev?: () => void;
    onNext?: () => void;
    showAdditionalInfo?: boolean;
    toggleAdditionalInfo?: () => void;
}

const BASE_URL = "http://127.0.0.1:5000/";

function Viewing({ question, answers, image, id, slideNumber, lastSlide, onUpdate, onPrev, onNext, showAdditionalInfo, toggleAdditionalInfo }: FlashcardProps) {
    const module = "defaultModule";
    const chapter = "defaultChapterName";
    const hasMultipleImages = Array.isArray(image) && image.length > 1;

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

    const handleQuestionChange = (newQuestion: string) => {
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
                {/* {editMode && (
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
                )} */}
                {editMode && (
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

        <ImageDisplay images={image}  />
            <Group position="apart" mt="md" mb="xs">
                <Text weight={500}>Question {slideNumber}</Text>
                <Text size="sm" color="dimmed">ID: {id}</Text>
            </Group>
            {/* <Textarea
                value={editedQuestion}
                onChange={handleQuestionChange}
                placeholder="Enter question"
                mb="xl"
            /> */}
            <FlashcardQuestion question={editedQuestion} editMode={editMode} onChange={handleQuestionChange} />

            <Transition mounted={showAnswer} transition="fade" duration={400} timingFunction="ease">
                {(styles) => (
                    <Stack spacing="xs" style={styles}>
                        {renderAnswers()}
                        {editMode && (<Button
                            lefticon={<IconPlus size={14} />}
                            variant="outline"
                            onClick={addAnswer}
                            fullWidth
                        >
                            Add Answer
                        </Button>)}
                    </Stack>
                )}
            </Transition>

            <Group position="apart" mt="auto" mb={"xs"}>
                {/* <Button
                    lefticon={showAnswer ? <IconEyeOff size={14} /> : <IconEye size={14} />}
                    variant="light"
                    onClick={toggleAnswer}
                >
                    {showAnswer ? 'Hide Answer' : 'Show Answer'}
                </Button> */}
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
                    <Button
                        onClick={toggleAdditionalInfo}
                        style={{
                            zIndex: 100
                        }}
                    >
                        {showAdditionalInfo ? "Hide Additional Info" : "Show Additional Info"}
                    </Button>
                </Group>
            </Group>
        </Card>
    );
}

export default Viewing;
