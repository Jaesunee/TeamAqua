import uuid
import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from utils.extraction_utils import upload_pdf_s3, get_pdf_s3, extract_pdf
from utils.generation_utils import generate_flashcards
from utils.firebase_utils import add_data, get_data, update_data, get_all

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route("/flashcards", methods=["GET"])
def get_pdf_ids():
    data = get_all()
    return jsonify(data)

@app.route("/flashcards/<flashcards_id>", methods=["GET"])
def get_flashcards(flashcards_id:str):
    """
    Get ALL flashcards of a particular module.
    """
    data = get_data(flashcards_id)
    return jsonify(data)

@app.route("/flashcards/legacy/<flashcards_id>", methods=["GET"])
def get_legacy_flashcards(flashcards_id:str):
    """
    Get ALL flashcards of a particular module.
    """
    data = get_data(flashcards_id)
    cards = []
    for k, v in data["cards"].items():
        for c in v:
            c["slide_num"] = k
            cards.append(c)
    data["cards"] = cards
    return jsonify(data)

@app.route("/flashcards/<flashcards_id>", methods=["PUT"])
def update_flashcards(flashcards_id):
    """
    Update a particular flashcard, given the module name, chapter name and flashcard id
    """
    data = request.json
    update_data(flashcards_id, data)
    return jsonify(data)

# update one flashcard
@app.route("/flashcards/<flashcards_id>/cards/<card_id>", methods=["PUT"])
def update_flashcard(flashcards_id, card_id):
    data = request.json
    flashcards = get_data(flashcards_id)
    cards = flashcards["cards"]
    for card in cards.keys():
        if cards[card] == card_id:
            cards[card].update(data)
            break
    
    update_data(flashcards_id, data)
    return jsonify(data)

@app.route("/flashcards", methods=["POST"])
def upload_pdf():
    """
    Upload a PDF file to the server and extract flashcards from it.
    """
    pdf_file = request.files.get("file")
    if not pdf_file:
        return jsonify({"success": False, "data": "pdf is required"})
    
    flashcards_id = str(uuid.uuid4())
    pdf_name = pdf_file.filename
    pdf_link = upload_pdf_s3(pdf_file, flashcards_id)
    pdf = get_pdf_s3(pdf_link)
    
    text_and_images = extract_pdf(pdf, id=flashcards_id)
    flashcards = generate_flashcards(text_and_images, 20, "SLIDE_#", flashcards_id)

    res = {
            "id": flashcards_id,
            "name": pdf_name,
            "file": "https://drarso.xyz/" + pdf_link,
            "dateCreated": datetime.datetime.now().isoformat(),
            "dateModified": datetime.datetime.now().isoformat(),
            "cards": flashcards
        }

    add_data(res)

    return jsonify(res)

if __name__ == "__main__":
    app.run(debug=True)