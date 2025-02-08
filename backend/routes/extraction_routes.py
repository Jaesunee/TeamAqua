# routes/notion_routes.py
import uuid
import datetime
from flask import Blueprint, request, jsonify
from utils.extraction_utils import upload_pdf_s3, get_pdf_s3, extract_pdf

extraction_bp = Blueprint('extraction', __name__, url_prefix='/extraction')

@extraction_bp.route("/flashcards", methods=["POST"])
def generate_flashcards():
    """
    Example request:
    {
        "file": object
    }
    Example response:
    id: "82b1b3b0-0b1b-4b1b-8b1b-0b1b1b1b1b1b",
    name: "01_FORMAL_METHODS_SLIDES",
    file: "https://disi.unitn.it/rseba/DIDATTICA/fm2020/01_FORMAL_METHODS_SLIDES.pdf", // Link to Firebase object storage
    dateCreated: "2025-02-06T00:00:00.000Z",
    dateModified: "2025-02-06T00:00:01.000Z",
    cards: {
        1: [
        {
            id: "43ipFnjVcOYrongpz4eZ",
            question: "This is a question",
            answers: ["answer 1", "answer 2"],
            incorrectAnswers: ["incorrect answer 1", "incorrect answer 2"],
            image: ["image1.png"],
            additionalInfo:
            "This is info that the AI can search for outside of the slide content",
        },
        {
            id: "7Zu4CB4gPyqUIPNdv67f",
            question: "This is a question",
            answers: ["answer 1", "answer 2"],
            incorrectAnswers: ["incorrect answer 1", "incorrect answer 2"],
            image: ["image1.png"],
            additionalInfo:
            "This is info that the AI can search for outside of the slide content",
        },
        ],
        2: [
        {
            id: "DGocNMIssojTMFjheARW",
            question: "This is a question",
            answers: ["answer 1"],
            incorrectAnswers: [
            "incorrect answer 1",
            "incorrect answer 2",
            "incorrect answer 3",
            ],
            image: ["image1.png"],
            additionalInfo:
            "This is info that the AI can search for outside of the slide content",
        },
        {
            id: "LeTdQrOeYbKZK0TNf3ZE",
            question: "This is a question",
            answers: ["answer 1"],
            incorrectAnswers: [
            "incorrect answer 1",
            "incorrect answer 2",
            "incorrect answer 3",
            ],
            image: ["image1.png"],
            additionalInfo:
            "This is info that the AI can search for outside of the slide content",
        },
        ],
    }
    """
    pdf_file = request.files.get("file")
    if not pdf_file:
        return jsonify({"success": False, "data": "pdf is required"})
    
    flashcards_id = str(uuid.uuid4())
    pdf_name = pdf_file.filename
    pdf_link = upload_pdf_s3(pdf_file, flashcards_id)
    pdf = get_pdf_s3(pdf_link)
    
    text_and_images = extract_pdf(pdf)

    return jsonify(
        {
            "id": flashcards_id,
            "name": pdf_name,
            "file": pdf_link,
            "dateCreated": datetime.datetime.now().isoformat(),
            "dateModified": datetime.datetime.now().isoformat(),
            "cards": text_and_images
        }
    )

