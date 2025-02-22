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
  Center,
  TextInput,
  Textarea,
} from "@mantine/core";
import { FlashcardSet } from "@/types/flashcards";
import { flashcardSetData } from "@/data/flashcardSet";
import { PdfViewer } from "@/app/PdfViewer/PdfViewer";
import { FileWithPath } from "@mantine/dropzone";
import { IconTrash } from "@tabler/icons-react";
import dancingShark from "../../../../public/dancing-shark.gif";

interface EditViewProps {
  files: FileWithPath[];
}

export function EditView({ files }: EditViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pdf, setPdf] = useState<FileWithPath[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [flashcardSet, setFlashCardSet] = useState<FlashcardSet>();
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
    const handleSubmit = async () => {
      setSubmitting(true);
      if (!files) {
        alert("Please select a PDF file");
        return;
      }

      const formData = new FormData();
      formData.append("file", files[0]);

      try {
        const res = await fetch("https://backend.sharkedu.org/flashcards", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          setFlashCardSet(data);
          const newFile = await createFileFromPath(
            data.file,
            "myfile.pdf",
            "application/pdf"
          );
          console.log(`data: ${JSON.stringify(data)}`);
          setPdf([newFile]);
        } else {
          const errorData = await res.json();
          alert(`Error: ${errorData.data}`);
        }
      } catch (error) {
        console.error(error);
        alert("Error uploading file");
      } finally {
        setSubmitting(false);
      }
    };

    handleSubmit();
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

  const flashcardsForPage = flashcardSet ? flashcardSet.cards[currentPage] : [];

  const removeImage = (cardId: string, image: string) => {
    const updatedCards = { ...flashcardSet };
    if (!updatedCards.cards) return;
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
    // setFlashCardSet(updatedCards);
    setNotificationVisible(true);
    setTimeout(() => setNotificationVisible(false), 5000); // Hide after 5 seconds
  };

  const undoRemoveImage = () => {
    if (!undoImage) return;
    const updatedCards = { ...flashcardSet };
    if (!updatedCards.cards) return;
    updatedCards.cards[currentPage] = updatedCards.cards[currentPage].map(
      (card) =>
        card.id === undoImage.cardId
          ? { ...card, image: [...card.image, undoImage.image] }
          : card
    );
    setUndoImage(null);
    // setFlashCardSet(updatedCards);
    setNotificationVisible(false);
  };

  if (submitting) {
    return (
      <Center>
        <Stack py="xl">
          <Title>Generating flashcards...</Title>
          <img src="dancing-shark.gif" alt="" />
        </Stack>
      </Center>
    );
  }

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
                      <Textarea
                        size="sm"
                        fw={600}
                        defaultValue={card.question}
                      ></Textarea>

                      {/* Render each answer in a separate line */}
                      {card.answers.map((answer, index) => (
                        <Textarea
                          key={index}
                          size="sm"
                          c="dimmed"
                          defaultValue={answer}
                        />
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
