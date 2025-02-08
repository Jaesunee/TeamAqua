"use client";

import { useState } from 'react';
import { Button, Container, Text, TextInput, Transition } from "@mantine/core";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

export default function FlashcardQuestion(
  props: {
    question: string;
    editMode: boolean;
    onChange: (value: string) => void;
  }
) {

  if (props.editMode) {
    return (
      <Container w="100%" py="xl">
        <TextInput
          value={props.question}
          onChange={(e) => props.onChange(e.currentTarget.value)}
          placeholder="Enter Question"
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
    <Container w="100%" py="xl" pos="relative">
      <div style={{ position: 'relative', minHeight: '2rem' }}>
      <Text size="lg" >
              {props.question}
            </Text>
     

        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--mantine-radius-md)',
            transition: 'background-color 0.3s ease'
          }}
        >
    
        </div>
      </div>
    </Container>
  );
}
