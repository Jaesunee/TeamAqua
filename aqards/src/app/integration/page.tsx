// Integrating backend
// pass image link to frontends
// define flashcard type here

import Flashcard from "../Flashcard/Flashcard";

const BASE_URL = "http://127.0.0.1:5000/";

export default async function Integration() {
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

    const flashcards = await fetchFlashcards();
    return(
        <div>
            <h1>Flashcards</h1>
            {flashcards.map((flashcard, index) => (
                <Flashcard
                    key={flashcard.id}
                    question={flashcard.question}
                    answers={flashcard.answers}
                    id={flashcard.id}
                    slideNumber={index + 1}
                />
            ))}

            <Flashcard question={""} answers={[]} id={""} slideNumber={0} />
            <h1>Integration</h1>
        </div>
    );
}