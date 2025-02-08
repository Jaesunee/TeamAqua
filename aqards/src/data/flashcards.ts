import { FlashcardSet } from "@/types/flashcards";

export const flashcards: FlashcardSet = {
  file: "https://disi.unitn.it/rseba/DIDATTICA/fm2020/01_FORMAL_METHODS_SLIDES.pdf", // link to firebase object storage
  cards: [
    {
      answers: ["answer 1", "answer 2"], // answers to the question
      id: "43ipFnjVcOYrongpz4eZ", // unique id
      image: ["image1.png"], // images extracted from the slide, links to firebase object storage
      question: "This is a question",
      slideNumber: 1, // slide that the question is from
      additionalInfo:
        "This is info that the ai can search for outside of the slide content",
    },
    {
      answers: ["answer 1", "answer 2"],
      id: "7Zu4CB4gPyqUIPNdv67f",
      image: ["image1.png"],
      question: "This is a question",
      slideNumber: 1,
      additionalInfo:
        "This is info that the ai can search for outside of the slide content",
    },
    {
      answers: ["answer 1", "answer 2"],
      id: "DGocNMIssojTMFjheARW",
      image: ["image1.png"],
      question: "This is a question",
      slideNumber: 2,
      additionalInfo:
        "This is info that the ai can search for outside of the slide content",
    },
    {
      answers: ["answer 1", "answer 2"],
      id: "LeTdQrOeYbKZK0TNf3ZE",
      image: ["image1.png"],
      question: "This is a question",
      slideNumber: 2,
      additionalInfo:
        "This is info that the ai can search for outside of the slide content",
    },
  ],
};
