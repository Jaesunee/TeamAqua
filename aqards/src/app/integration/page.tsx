// Integrating backend
// pass image link to frontends
// define flashcard type here
import { use } from 'react';

import SkeletonFlashCard from "../SkeletonFlashcard/SkeletonFlashcard";

const BASE_URL = "http://127.0.0.1:5000/";

export default  function Integration() {
    const module = "defaultModule";
    const chapter = "defaultChapterName";
    const fetchFlashcards = async () => {
        try {
            const response = await fetch(`${BASE_URL}/flashcards/${module}/${chapter}`);
            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            console.error(error);
        }
    }
    
    const flashcardsPromise = fetchFlashcards();
    const flashcards = use(flashcardsPromise);    
    
    return(
        <div>
            <h1>Flashcards</h1>
            {flashcards.map((flashcard, index) => (
                <SkeletonFlashCard
                    key={flashcard.id}
                    question={flashcard.question}
                    answers={flashcard.answers}
                    id={flashcard.id}
                    slideNumber={index + 1}
                />
            ))}

            <h1>Integration</h1>
        </div>
    );
}