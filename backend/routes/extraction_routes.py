# routes/notion_routes.py
import uuid
import datetime
from flask import Blueprint, request, jsonify
from utils.extraction_utils import upload_pdf_s3, get_pdf_s3, extract_pdf
from utils.generation_utils import generate_flashcards
from utils.firebase_utils import add_data, get_data, update_data

extraction_bp = Blueprint('extraction', __name__, url_prefix='/extraction')

@extraction_bp.route("/flashcards", methods=["POST"])
def extract_flashcards():
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

@extraction_bp.route("/flashcards/<flashcards_id>", methods=["GET"])
def get_flashcards(flashcards_id):
    data = get_data(flashcards_id)
    return jsonify(data)

@extraction_bp.route("/flashcards/<flashcards_id>", methods=["PUT"])
def update_flashcards(flashcards_id):
    data = request.json
    update_data(flashcards_id, data)
    return jsonify(data)
