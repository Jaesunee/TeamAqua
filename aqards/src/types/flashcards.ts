export interface Flashcard {
  id: string; // Unique identifier for the flashcard
  question: string; // Question text
  answers: string[]; // Possible answers
  image: string[]; // Images extracted from the slide
  slideNumber: number; // Slide number from which the question is derived
  additionalInfo: string; // Extra info AI can search for outside of slide content
}

export interface FlashcardSet {
  file: string; // Link to Firebase object storage
  cards: Flashcard[]; // Array of flashcards
}
