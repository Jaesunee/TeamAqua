from openai import OpenAI
import os
import re
from dotenv import load_dotenv

load_dotenv()

YOUR_API_KEY = os.getenv('PERPLEXITY_API_KEY')
client = OpenAI(api_key=YOUR_API_KEY, base_url="https://api.perplexity.ai")

def generate_flashcards(text_and_images, num_pairs, slide_delimiter_form, flashcard_id=None):
    # get flashcard id from first word of text
    text = text_and_images["text"]
    if flashcard_id is None:
        flashcard_id = ""
        for c in text:
            if c == " ":
                break
            flashcard_id += c
        
    flashcards_data = {}

    messages = [
        {
            "role": "system",
            "content": (f"Refer to the following text for the next query: {text}"),
        },
        {   
            "role": "user",
            "content": (
                f"Give me {num_pairs} flashcards (format Q.[flashcard_num]:[Academic Question] A:[Answer(s)] E:[Brief explanation of Answer and/or links to citations] W: [Potentially wrong answers separated by commas] S: [Slide Number for Reference] ) for each slide separated by {slide_delimiter_form} (indicating slide_num) of the attached text. This should result in {num_pairs} flashcards in total."
            ),
        },
    ]

    response = client.chat.completions.create(
        model="sonar-pro",
        messages=messages,
    )

    text_response = response.choices[0].message.content

    # Regular expression to extract Q, A, E triplets
    pattern = r"Q\.(\d+): (.*?)\nA: (.*?)\nE: (.*?)\nW: (.*?)\nS: (\d+)"

    # Find all matches
    flashcards = re.findall(pattern, text_response)

    # Generate flashcards from the triplets
    for idx, info in enumerate(flashcards, 1):
        _, question, answers, explanation, wrong_answers, slide_num  = info
        current_id = flashcard_id + "_" + str(idx)
        answers = answers.split(", ")
        wrong_answers = wrong_answers.split(", ")

        flashcard = {
            "id": current_id,
            "question": question,
            "answers": answers,
            "incorrectAnswers": wrong_answers,
            "additionalInfo": explanation,
            "image": text_and_images["images"][int(slide_num)]
        }

        current_flashcards = flashcards_data.get(slide_num, [])
        current_flashcards.append(flashcard)
        flashcards_data[slide_num] = current_flashcards

    return flashcards_data
