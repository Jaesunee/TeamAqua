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
    <div className="Example">
      <div className="Example__container">
        <div ref={setContainerRef}>
          {containerRef && ( // Prevent rendering if containerRef is not assigned
            <Center>
              <Document
                file={files[0]}
                onLoadSuccess={onDocumentLoadSuccess}
                options={options}
              >
                <Page
                  pageNumber={currentPage}
                  width={
                    containerWidth
                      ? Math.min(containerWidth, maxWidth)
                      : maxWidth
                  }
                />
              </Document>
            </Center>
          )}
        </div>

        <Flex justify="center" align="center" gap="md" mt="lg">
          <Button
            onClick={goToPreviousPage}
            disabled={currentPage <= 1}
            variant="default"
          >
            Previous
          </Button>

          <Text size="md" fw={500}>
            Page {currentPage} of {numPages || "?"}
          </Text>

          <Button
            onClick={goToNextPage}
            disabled={!numPages || currentPage >= numPages}
            variant="default"
          >
            Next
          </Button>
        </Flex>
      </div>
    </div>
  );
}
