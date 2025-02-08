"use client";

import { Upload } from "@/app/create/Upload/Upload";
import { Button, Container, Space, Stack, Text, Title } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { useState } from "react";
import { PdfViewer } from "@/app/PdfViewer/PdfViewer";
import { EditView } from "@/app/create/EditView/EditView";

export default function Create() {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const onDrop = (files: FileWithPath[]) => {
    setFiles(() => [...files]);
    console.log(`accepted files: `, files);
  };

  const removeFile = () => {
    setFiles([]);
  };

  const onSubmit = async () => {
    setSubmitting(true);
  };

  if (submitting) {
    return <EditView files={files} />;
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
