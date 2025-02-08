import { useEffect, useState } from "react";
import { Flex, Card, ScrollArea, Text, Stack } from "@mantine/core";
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
    console.log(blob);
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
    <Flex h="100vh" gap="md">
      <ScrollArea h="100%" w={300} p="md">
        <Stack>
          <Text size="lg" fw={700}>
            Flashcards for Slide {currentPage}
          </Text>
          {flashcardsForPage.length > 0 ? (
            flashcardsForPage.map((card) => (
              <Card key={card.id} shadow="sm" padding="md" radius="md">
                <Text size="sm" fw={500}>
                  {card.question}
                </Text>
                <Text size="xs" c="dimmed">
                  {card.answers.join(", ")}
                </Text>
              </Card>
            ))
          ) : (
            <Text size="sm" c="dimmed">
              No flashcards for this slide.
            </Text>
          )}
        </Stack>
      </ScrollArea>

      <Flex flex={1} direction="column">
        <PdfViewer
          files={files}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </Flex>
    </Flex>
  );
}
