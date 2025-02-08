"use client";

import { useState } from 'react';
import { Button, Container, Text, TextInput, Transition } from "@mantine/core";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

export default function FlashcardAnswer(
  props: {
    answer: string;
    editMode: boolean;
    index: number;
    onChange: (index: number, value: string) => void;
  }
) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  if (props.editMode) {
    return (
      <Container w="100%" >
        <TextInput
          value={props.answer}
          onChange={(e) => props.onChange(props.index, e.currentTarget.value)}
          placeholder="Enter answer"
          styles={{
            input: {
              fontSize: 'var(--mantine-font-size-lg)',
              padding: 'var(--mantine-spacing-sm)'
            }
          }}
        />
      </Container>
    );
  }

  return (
    <Container w="100%"  pos="relative">
      <div style={{ position: 'relative', minHeight: '2rem' }}>
        <Transition
          mounted={isVisible}
          transition="fade"
          duration={400}
          timingFunction="ease"
        >
          {(styles) => (
            <Text size="lg" style={styles}>
              {props.answer}
            </Text>
          )}
        </Transition>

        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: isVisible ? 'transparent' : 'rgba(0,0,0,0.1)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--mantine-radius-md)',
            transition: 'background-color 0.3s ease'
          }}
          onClick={toggleVisibility}
        >
          <Button 
            variant="subtle"
            color="gray"
            leftSection={isVisible ? <IconEyeOff size={20} /> : <IconEye size={20} />}
            onClick={(e) => {
              e.stopPropagation();
              toggleVisibility();
            }}
          >
          </Button>
        </div>
      </div>
    </Container>
  );
}
