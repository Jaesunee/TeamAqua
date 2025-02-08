import {
  useCallback,
  useState,
  useMemo,
  Dispatch,
  SetStateAction,
} from "react";
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
  files: FileWithPath[]; // Should contain only one file
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

export function PdfViewer({
  files,
  currentPage,
  setCurrentPage,
}: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

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
      setNumPages(loadedPages);
      setCurrentPage(1); // Reset to the first page when loading a new document
    },
    [setCurrentPage]
  );

  const goToPreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, [setCurrentPage]);

  const goToNextPage = useCallback(() => {
    setCurrentPage((prev) => (numPages ? Math.min(prev + 1, numPages) : prev));
  }, [numPages, setCurrentPage]);

  const options = useMemo(
    () => ({
      cMapUrl: "/cmaps/",
      standardFontDataUrl: "/standard_fonts/",
    }),
    []
  );
  console.log(`files: `, files);
  return (
    // <div className="Example">
    //   <div className="Example__container">
    <div ref={setContainerRef} style={{ width: "100%", height: "100%" }}>
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
                containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth
              }
            />
          </Document>
        </Center>
      )}
      {/* </div> */}

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
    // </div>
  );
}
