// Integrating backend
// pass image link to frontends
// define flashcard type here



const BASE_URL = "http://127.0.0.1:5000/";

export default function Integration() {
    const module = "defaultModule";
    const chapter = "defaultChapterName";
    const fetchFlashcards = async () => {
        try {
            const response = await fetch(`${BASE_URL}/flashcards/${module}/${chapter}`);
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    }

    fetchFlashcards();
    return(
        <div>
            <h1>Integration</h1>
        </div>
    );
}