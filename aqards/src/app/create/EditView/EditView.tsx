import { useEffect, useState } from "react";
import {
  Container,
  Flex,
  Card,
  ScrollArea,
  Text,
  Stack,
  Title,
} from "@mantine/core";
import { FlashcardSet } from "@/types/flashcards";
import { PdfViewer } from "@/app/PdfViewer/PdfViewer";
import { FileWithPath } from "@mantine/dropzone";

interface FlashcardViewerProps {
  flashcardSet: FlashcardSet;
}

export function EditView({ flashcardSet }: FlashcardViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [files, setFiles] = useState<FileWithPath[]>([]);

  async function createFileFromPath(
    url: string,
    filename: string,
    type: string
  ): Promise<FileWithPath> {
    const response = await fetch(url, { method: "GET" });
    const blob = await response.blob();
    const file = new File([blob], filename, { type });
    return Object.assign(file, { path: url }) as FileWithPath;
  }

  useEffect(() => {
    const fetchFile = async () => {
      const newFile = await createFileFromPath(
        flashcardSet.file,
        "myfile.pdf",
        "application/pdf"
      );
      setFiles([newFile]);
    };
    fetchFile();
  }, [flashcardSet.file]);

  const flashcardsForPage = flashcardSet.cards[currentPage] || [];

  return (
    <Container w="100%" py="xl">
      <Stack py="md">
        <Title>Edit your flashcards</Title>
        <Flex gap="md" p="md">
          <Flex flex={1} h="100%">
            <PdfViewer
              files={files}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
          </Flex>

          <ScrollArea h="100%" w="35%" p="md">
            <Stack gap="lg">
              <Text size="xl" fw={700}>
                Flashcards for Slide {currentPage}
              </Text>
              {flashcardsForPage.length > 0 ? (
                flashcardsForPage.map((card) => (
                  <Card key={card.id} shadow="md" padding="lg" radius="lg">
                    <Text size="md" fw={600}>
                      {card.question}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {card.answers.join(", ")}
                    </Text>
                  </Card>
                ))
              ) : (
                <Text size="md" c="dimmed">
                  No flashcards for this slide.
                </Text>
              )}
            </Stack>
          </ScrollArea>
        </Flex>
      </Stack>
    </Container>
  );
}
