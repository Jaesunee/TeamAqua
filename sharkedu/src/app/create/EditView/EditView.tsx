import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Container,
  Flex,
  Card,
  ScrollArea,
  Text,
  Stack,
  Title,
  Button,
  Image,
  Modal,
  Group,
  Notification,
} from "@mantine/core";
import { FlashcardSet } from "@/types/flashcards";
import { flashcardSetData } from "@/data/flashcardSet";
import { PdfViewer } from "@/app/PdfViewer/PdfViewer";
import { FileWithPath } from "@mantine/dropzone";
import { IconTrash } from "@tabler/icons-react";

interface EditViewProps {
  files: FileWithPath[];
}

export function EditView({ files }: EditViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pdf, setPdf] = useState<FileWithPath[]>([]);
  const [flashcardSet, setFlashCardSet] =
    useState<FlashcardSet>(flashcardSetData);
  const [undoImage, setUndoImage] = useState<{
    cardId: string;
    image: string;
  } | null>(null);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [notificationVisible, setNotificationVisible] = useState(false);

  const { setValue, control, watch } = useForm({
    defaultValues: {
      flashcardSet: flashcardSet,
    },
  });

  useEffect(() => {
    console.log("files", files);
    setFlashCardSet(() => flashcardSet);
  }, []);

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
      setPdf([newFile]);
    };
    fetchFile();
  }, [flashcardSet.file]);

  const flashcardsForPage = flashcardSet ? flashcardSet.cards[currentPage] : [];

  const removeImage = (cardId: string, image: string) => {
    const updatedCards = { ...flashcardSet };
    updatedCards.cards[currentPage] = updatedCards.cards[currentPage].map(
      (card) =>
        card.id === cardId
          ? {
              ...card,
              image: card.image.filter((img: string) => img !== image),
            }
          : card
    );
    setUndoImage({ cardId, image });
    setFlashCardSet(updatedCards);
    setNotificationVisible(true);
    setTimeout(() => setNotificationVisible(false), 5000); // Hide after 5 seconds
  };

  const undoRemoveImage = () => {
    if (!undoImage) return;
    const updatedCards = { ...flashcardSet };
    updatedCards.cards[currentPage] = updatedCards.cards[currentPage].map(
      (card) =>
        card.id === undoImage.cardId
          ? { ...card, image: [...card.image, undoImage.image] }
          : card
    );
    setUndoImage(null);
    setFlashCardSet(updatedCards);
    setNotificationVisible(false);
  };

  return (
    <Container w="100%" py="xl">
      <Stack py="md">
        <Title>Edit your flashcards</Title>
        <Flex gap="md" p="md">
          {/* PDF Viewer */}
          <Flex flex={1} h="100%">
            <PdfViewer
              files={pdf}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
          </Flex>

          {/* Flashcards Section */}
          <ScrollArea h={600} w="40%" p="md">
            <Stack gap="lg">
              <Text size="xl" fw={700}>
                Flashcards for Slide {currentPage}
              </Text>
              {flashcardsForPage.length > 0 ? (
                flashcardsForPage.map((card) => (
                  <Card
                    key={card.id}
                    shadow="md"
                    padding="xl"
                    radius="lg"
                    withBorder
                  >
                    <Stack gap="md">
                      <Text size="lg" fw={600}>
                        {card.question}
                      </Text>

                      {/* Render each answer in a separate line */}
                      {card.answers.map((answer, index) => (
                        <Text key={index} size="sm" c="dimmed">
                          {answer}
                        </Text>
                      ))}

                      {/* Image Thumbnails */}
                      {card.image?.length > 0 && (
                        <Group mt="sm" gap="xs">
                          {card.image.map((img: string, index: number) => (
                            <div
                              key={index}
                              style={{
                                position: "relative",
                                display: "inline-block",
                              }}
                            >
                              <Image
                                src={img}
                                width={60}
                                height={60}
                                radius="md"
                                onClick={() => setEnlargedImage(img)}
                                style={{ cursor: "pointer" }}
                              />
                              <Button
                                size="xs"
                                variant="filled"
                                color="red"
                                onClick={() => removeImage(card.id, img)}
                                style={{
                                  position: "absolute",
                                  top: -5,
                                  right: -5,
                                  zIndex: 10,
                                  padding: 2,
                                  minWidth: "auto",
                                  width: 20,
                                  height: 20,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <IconTrash size={12} />
                              </Button>
                            </div>
                          ))}
                        </Group>
                      )}
                    </Stack>
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

      {/* Mantine Notification with custom positioning and z-index */}
      {notificationVisible && (
        <Notification
          style={{
            position: "fixed",
            top: 40,
            right: 40,
            zIndex: 9999, // Ensure it's on top of other elements
          }}
          color="red"
          title="Image Removed"
          onClose={() => setNotificationVisible(false)}
        >
          <Stack>
            Image deleted. Do you want to undo this action?
            <Button
              variant="outline"
              color="blue"
              onClick={undoRemoveImage}
              style={{
                fontSize: "12px",
                padding: "5px 10px",
                height: "auto",
                minWidth: "auto",
              }}
            >
              Undo
            </Button>
          </Stack>
        </Notification>
      )}

      {/* Enlarged Image Modal */}
      <Modal
        opened={!!enlargedImage}
        onClose={() => setEnlargedImage(null)}
        centered
        size="lg"
      >
        {enlargedImage && <Image src={enlargedImage} fit="contain" />}
      </Modal>
    </Container>
  );
}