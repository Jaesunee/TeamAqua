"use client";

import { Upload } from "@/app/create/Upload/Upload";
import { Button, Container, Space, Stack, Text, Title } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { useState } from "react";
import { PdfViewer } from "@/app/PdfViewer/PdfViewer";
import { FlashcardSet } from "@/types/flashcards";
import { EditView } from "@/app/create/EditView/EditView";
import { flashcardSetData } from "@/data/flashcardSet";

export default function Create() {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [flashcardSet, setFlashCardSet] = useState<FlashcardSet | undefined>(
    undefined
  );

  const onDrop = (files: FileWithPath[]) => {
    setFiles(() => [...files]);
    console.log(`accepted files: `, files);
  };

  const removeFile = () => {
    setFiles([]);
  };

  const onSubmit = async () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setFlashCardSet(flashcardSetData);
      console.log(flashcardSet);
    }, 1000);
  };

  if (flashcardSet !== undefined) {
    console.log("edit views");
    return <EditView flashcardSet={flashcardSet} />;
  }

  if (submitting) {
    return (
      <Container w="100%" py="xl">
        <Stack gap="sm">
          <Title order={1}>Generating flashcards</Title>
          <Text size="lg" c="dimmed">
            Please wait while we process your slides.
          </Text>
        </Stack>
      </Container>
    );
  }

  return (
    <Container w="100%" py="xl">
      <Stack gap="sm">
        <Title order={1}>Upload your slides</Title>
        <Text size="lg" c="dimmed">
          Currently, we only accept PDF files.
        </Text>
        {files.length == 0 && <Upload onDrop={onDrop} />}
        {files.length > 0 && (
          <>
            <Button color="red" onClick={removeFile}>
              Remove File
            </Button>
            <PdfViewer
              files={files}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </>
        )}
        <Space h="xs" />
        <Button
          disabled={files.length === 0}
          onClick={onSubmit}
          loading={submitting}
        >
          {" "}
          Generate flashcards{" "}
        </Button>
      </Stack>
    </Container>
  );
}
