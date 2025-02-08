import { Upload } from "@/app/create/Upload/Upload";
import { Button, Container, Space, Stack, Text, Title } from "@mantine/core";

export default function Create() {
  return (
    <Container w="100%" py="xl">
      <Stack gap="sm">
        <Title order={1}>Upload your slides</Title>
        <Text size="lg" c="dimmed">
          Currently, we only accept PDF files.
        </Text>
        <Upload />
        <Space h="xs" />
        <Button> Generate flashcards </Button>
      </Stack>
    </Container>
  );
}
