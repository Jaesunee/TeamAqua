"use client";

import { useState } from 'react';
import { Box, Button, Container, Text, TextInput, Transition, Title } from "@mantine/core";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

export default function InfoCard(
  props: {
    additionalInfo: string;
    citation: string;
    slideNumber: number;
    onChange: (value: string) => void;
  }
) {
  return (
    <Container pos="relative">
      <Box
        p="md"
        style={{
          backgroundColor: 'var(--mantine-color-white)',
          borderRadius: 'var(--mantine-radius-lg)',
          boxShadow: 'var(--mantine-shadow-xl)',
          width: '35vw'
        }}
      >
        <Title order={2} mb="md">Additional Info</Title>
     
        <Text style={{ color: 'black' }}>{props.additionalInfo}</Text>
        <Text style={{ fontSize: '10px', color: 'black' }}>This portion is generated by LLMs.</Text>
    
        <Text size="sm" mt="md" align="right">
          Slide {props.slideNumber}
        </Text>
      </Box>
    </Container>
  );
}
