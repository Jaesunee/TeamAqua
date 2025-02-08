import { useCallback, useState, useMemo } from "react";
import { useResizeObserver } from "@wojtekmaj/react-hooks";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import type { PDFDocumentProxy } from "pdfjs-dist";
import { FileWithPath } from "@mantine/dropzone";
import { Button, Center, Flex, Text } from "@mantine/core";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const maxWidth = 500;

interface PdfViewerProps {
  files: FileWithPath[]; // this should only be a list of one file.
}

export function PdfViewer({ files }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  console.log("refreshing page");

  // Resize observer callback
  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const entry = entries[0];
    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, {}, onResize);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages: loadedPages }: PDFDocumentProxy) => {
      if (loadedPages !== numPages) {
        setNumPages(loadedPages);
        setCurrentPage(1);
      }
    },
    [numPages]
  );

  const goToPreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setCurrentPage((prev) => (numPages ? Math.min(prev + 1, numPages) : prev));
  }, [numPages]);

  const options = useMemo(
    () => ({
      cMapUrl: "/cmaps/",
      standardFontDataUrl: "/standard_fonts/",
    }),
    []
  );
  return (
    <Container size="xl" py="xl">
      <Sharky 
        imageSrc={sharky.src} 
        imagePosition={{
          position: 'absolute',
          width: '200px',
          zIndex: 100,
          right: '50px',
          top: '50px',
          scale: 0.8
        }}
      />
      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Center h="70vh">
            {currentFlashcard ? (
              <ViewingFlashcard
                question={currentFlashcard.question}
                answers={currentFlashcard.answers}
                id={currentFlashcard.id}
                image={currentFlashcard.image}
                lastSlide={flashcardIndex === flashcards.length - 1}
                slideNumber={flashcardIndex + 1}
                onPrev={handlePrev}
                onNext={handleNext}
              />
            ) : (
              <div>No flashcard available</div>
            )}
          </Center>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Center h="70vh">
            <div>
              <h1>Additional Info</h1>
              <InfoCard
                additionalInfo={currentFlashcard ? currentFlashcard.additionalInfo : ""}
              />
            </div>
          </Center>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
