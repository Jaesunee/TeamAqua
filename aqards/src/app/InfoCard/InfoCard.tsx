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
        <Title order={2} mb="md">Addiadtional Info</Title>
        <Text size="lg">
          {props.additionalInfo}
        </Text>
        <Text>e policy section of the village pump is intended for discussions about already-proposed policies and guidelines, as well as changes to existing ones. Discussions often begin on other pages and are subsequently moved or referenced here to ensure greater visibility and broader participation.
If you wish to propose something new that is not a policy or guideline, use Village pump (proposals). Alternatively, for drafting with a more focused group, consider starting the discussion on the talk page of a relevant WikiProject, the Manual of Style, or another relevant project page.
For questions about how to apply existing policies or guidelines, refer to one of the many Wikipedia:Noticeboards.
If you want to inquire about what the policy is on a specific topic, visit the Help desk or the Teahouse.
This is not the place to resolve disputes regarding the implementation of policies. For such cases, consult Wikipedia:Dispute resolution.
For proposals for new or amended speedy deletion criteria, use Wikipedia</Text>
        {props.citation && (
          <Text size="sm" mt="md" >
            Citation: {props.citation}
            
          </Text>
        )}
        <Text size="sm" mt="md" align="right">
          Slide {props.slideNumber}
        </Text>
      </Box>
    </Container>
  );
}
