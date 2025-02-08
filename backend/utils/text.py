import uuid
from openai import OpenAI
import os
import re
from dotenv import load_dotenv
import PyPDF2
import json

load_dotenv()

YOUR_API_KEY = os.getenv('PERPLEXITY_API_KEY')
client = OpenAI(api_key=YOUR_API_KEY, base_url="https://api.perplexity.ai")

# Function to extract text from PDF
def extract_text_from_pdf(pdf_path, slide_delimiter):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page_num in range(len(reader.pages)):
            page = reader.pages[page_num]
            # append delimiter after page except for last
            if page_num != len(reader.pages) - 1:
                text += page.extract_text() + slide_delimiter + '_' + str(page_num)
            else:
                text += page.extract_text()

        print("TEXT" + text)
        return text

# Function to generate question-answer pairs from extracted text
# TODO Add function for array of text for concurrency (as paid feature)
def generate_flashcards(text, num_pairs, slide_delimiter_form):
    flashcards_data = []

    messages = [
        {
            "role": "system",
            "content": (f"Refer to the following text for the next query: {text}"),
        },
        {   
            "role": "user",
            "content": (
                f"Give me {num_pairs} flashcards (format Q.[slide_num]:[Question] [Newline] A:[Answer] [Newline] E:[Brief explanation of Answer and/or links to citations] [Newline] W: [Potentially wrong answers separated by commas] [Newline]) for each piece of text separated by {slide_delimiter_form} (indicating slide_num) of the attached text. This should result in {num_pairs} x slide_num flashcards in total."
            ),
        },
    ]

    response = client.chat.completions.create(
        model="sonar-pro",
        messages=messages,
    )

    text_response = response.choices[0].message.content

    print(text_response)

    # Regular expression to extract Q, A, E triplets
    pattern = r"Q\.(\d+): (.*?)\nA: (.*?)\nE: (.*?)\nW: (.*?)\n"

    # Find all matches
    flashcards = re.findall(pattern, text_response)

    # Generate flashcards from the triplets
    for idx, info in enumerate(flashcards, 1):
        slide_num, question, answer, explanation, wrong_answers  = info
        
        # Generate a unique ID for the flashcard
        flashcard_id = str(uuid.uuid4())

        flashcard = {
            "id": flashcard_id,
            "slideNumber": slide_num,
            "question": question,
            "answer": answer,
            "explanation": explanation,
            "incorrectAnswers": wrong_answers
            # add citations?
            # add images? CONSULT DRARSO?
        }

        flashcards_data.append(flashcard)

    return flashcards_data

# Main function to generate flashcards from a PDF
def generate_flashcards_from_pdf(num_pairs, pdf_name, slide_delimiter="SLIDE"):
    slide_delimiter_form = slide_delimiter + "_#"

    script_path = os.path.abspath(__file__)
    script_directory = os.path.dirname(script_path)
    pdf_path = os.path.join(script_directory, pdf_name)

    slides_text = extract_text_from_pdf(pdf_path, slide_delimiter)
    flashcards = generate_flashcards(slides_text, num_pairs, slide_delimiter_form)

    return flashcards

# Example usage
num_pairs = 2  # be careful when increasing this number, results in long wait time for single query
num_wrong_answers = 5
pdf_name = 'slides.pdf'
output = generate_flashcards_from_pdf(num_pairs, pdf_name)

# Convert the output to JSON format
# TODO Add module, chapter, etc. (see add_flashcards())
output_json = json.dumps({"data": output}, indent=4)

# Print the result to verify
print(output_json)
