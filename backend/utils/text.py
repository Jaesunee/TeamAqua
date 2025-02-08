# This is a script to extract flashcard information (i.e. array of question, answer, explanation triplets)
# from a PDF file containing slides. The script uses the Perplexity(openAI under the hood) API 
# to generate the question and answer pairs. 

from openai import OpenAI
import os, re
from dotenv import load_dotenv
import PyPDF2

load_dotenv()

YOUR_API_KEY = os.getenv('PERPLEXITY_API_KEY')
client = OpenAI(api_key=YOUR_API_KEY, base_url="https://api.perplexity.ai")

""" messages = [
    {
        "role": "system",
        "content": (
            "You are an artificial intelligence assistant and you need to "
            "engage in a helpful, detailed, polite conversation with a user."
        ),
    },
    {   
        "role": "user",
        "content": (
            "How many stars are in the universe?"
        ),
    },
]



# chat completion without streaming
response = client.chat.completions.create(
    model="sonar-pro",
    messages=messages,
)
print(response)

# chat completion with streaming
response_stream = client.chat.completions.create(
    model="sonar-pro",
    messages=messages,
    stream=True,
)

for response in response_stream:
    print(response)
 """

def extract_text_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = []
        for page_num in range(len(reader.pages)):
            page = reader.pages[page_num]
            text.append(page.extract_text())
        return text

def generate_qa_pairs(text, num_pairs):
    slide_qa_pairs = []

    messages = [
        {
            "role": "system",
            "content": (
                "You are an artificial intelligence assistant and you need to "
                "engage in a helpful, detailed, polite conversation with a user."
            ),
        },
        {   
            "role": "user",
            "content": (
                f"Give me {num_pairs} pairs of questions and answers in the format Q:[Question] A:[Answer] E:[Brief explanation of Answer and/or links to citations], related to the following text: {text} ."
            ),
        },
    ]

    response = client.chat.completions.create(
        model="sonar-pro",
        messages=messages,
    )
    
    text_response = response.choices[0].message.content

    # split the response into individual qa pairs in the form (question, answer, explanation)
    # Regular expression pattern to extract Q, A, and E triplets
    pattern = r"Q: (.*?)\nA: (.*?)\nE: (.*?)\n"

    # Find all matches in the text
    triplets = re.findall(pattern, text_response)

    # Print each triplet
    for idx, triplet in enumerate(triplets, 1):
        question, answer, explanation = triplet
        slide_qa_pairs((question, answer, explanation))

    return slide_qa_pairs

def generate_qa_pairs_from_pdf(num_pairs, pdf_name):
    qa_pairs = []
    script_path = os.path.abspath(__file__)
    script_directory = os.path.dirname(script_path)
    pdf_path = os.path.join(script_directory, pdf_name)

    slides_text = extract_text_from_pdf(pdf_path)

    for slide_text in slides_text:
        pair = generate_qa_pairs(slide_text, num_pairs)
        qa_pairs.append(pair)

    return qa_pairs
    
# example use

num_pairs = 5  # specify the number of question and answer pairs
pdf_name = 'slides.pdf'
output = generate_qa_pairs_from_pdf(num_pairs, pdf_name)

print(output)



