export interface Flashcard {
  id: string; // Unique identifier for the flashcard
  question: string; // Question text
  answers: string[]; // Possible answers
  incorrectAnswers?: string[]; // Incorrect answers
  image: string[]; // Images extracted from the slide
  additionalInfo: string; // Extra info AI can search for outside of slide content
}

export interface FlashcardSet {
  id: string // Unique identifier for the flashcard set
  name: string // User-defined name for the flashcard set
  file: string; // Link to Firebase object storage
  cards: Record<number, Flashcard[]>; // Map of flashcardNum to list of flashcards
  dateCreated?: string; // Date the flashcard set was created
  dateModified?: string; // Date the flashcard set was last modified
}
