from openai import OpenAI
import os
import re
from dotenv import load_dotenv
import PyPDF2
# from extraction_utils import extract_pdf_s3

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

        return text

# Same as above but with extraction_utils
# def combine_text_from_pdf(pdf, slide_delimiter):

#     text_and_images = extract_pdf_s3(pdf)
#     text = ""
#     text += pdf + " "
#     # insert delimiter after each page
#     for page in text_and_images:
#         text += page[1] + slide_delimiter + '_' + str(page[0])

#     return text

# Function to generate question-answer pairs from extracted text
# TODO Add function for array of text for concurrency (as paid feature)
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

    print(text_response)
    print(text_and_images["images"])

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

# Function to generate flashcards from PDF
# def generate_flashcards_from_pdf(num_pairs, pdf_name, slide_delimiter="SLIDE"):
#     slide_delimiter_form = slide_delimiter + "_#"

#     slides_text = combine_text_from_pdf(pdf_name, slide_delimiter)
#     flashcards = generate_flashcards(slides_text, num_pairs, slide_delimiter_form)

#     return flashcards

# redudant (but different)
# def generate_flashcards_from_pdf(num_pairs, pdf_name, slide_delimiter="SLIDE"):
#     slide_delimiter_form = slide_delimiter + "_#"

#     script_path = os.path.abspath(__file__)
#     script_directory = os.path.dirname(script_path)
#     pdf_path = os.path.join(script_directory, pdf_name)

#     slides_text = combine_text_from_pdf(pdf_path, slide_delimiter)
#     flashcards = generate_flashcards(slides_text, num_pairs, slide_delimiter_form)

#     return flashcards


# Example usage
# num_pairs = 2  # be careful when increasing this number, results in long wait time for single query
# num_wrong_answers = 5
# #TODO Adjust pdf_link
# pdf_link = 'some pdf link'

# output = generate_flashcards_from_pdf(num_pairs, pdf_link)

# # Convert the output to JSON format
# # TODO Add module, chapter, etc. (see add_flashcards())
# output_json = json.dumps({"data": output}, indent=4)

# # Print the result to verify
# print(output_json)
