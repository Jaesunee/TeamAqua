import { FlashcardSet } from "@/types/flashcards";

export const flashcards: FlashcardSet = {
  file: "https://disi.unitn.it/rseba/DIDATTICA/fm2020/01_FORMAL_METHODS_SLIDES.pdf", // Link to Firebase object storage
  cards: {
    1: [
      {
        id: "43ipFnjVcOYrongpz4eZ",
        question: "This is a question",
        answers: ["answer 1", "answer 2"],
        incorrectAnswers: ["incorrect answer 1", "incorrect answer 2"],
        image: ["image1.png"],
        additionalInfo:
          "This is info that the AI can search for outside of the slide content",
      },
      {
        id: "7Zu4CB4gPyqUIPNdv67f",
        question: "This is a question",
        answers: ["answer 1", "answer 2"],
        incorrectAnswers: ["incorrect answer 1", "incorrect answer 2"],
        image: ["image1.png"],
        additionalInfo:
          "This is info that the AI can search for outside of the slide content",
      },
    ],
    2: [
      {
        id: "DGocNMIssojTMFjheARW",
        question: "This is a question",
        answers: ["answer 1"],
        incorrectAnswers: [
          "incorrect answer 1",
          "incorrect answer 2",
          "incorrect answer 3",
        ],
        image: ["image1.png"],
        additionalInfo:
          "This is info that the AI can search for outside of the slide content",
      },
      {
        id: "LeTdQrOeYbKZK0TNf3ZE",
        question: "This is a question",
        answers: ["answer 1"],
        incorrectAnswers: [
          "incorrect answer 1",
          "incorrect answer 2",
          "incorrect answer 3",
        ],
        image: ["image1.png"],
        additionalInfo:
          "This is info that the AI can search for outside of the slide content",
      },
    ],
  },
};
