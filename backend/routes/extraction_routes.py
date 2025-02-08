# routes/notion_routes.py
from flask import Blueprint, request, jsonify
from utils.extraction_utils import extract_pdf_s3, upload_pdf_s3

extraction_bp = Blueprint('extraction', __name__, url_prefix='/extraction')

@extraction_bp.route("/upload", methods=["POST"])
def upload_pdf():
    pdf_file = request.files.get("pdf")
    if not pdf_file:
        return jsonify({"success": False, "data": "pdf is required"})
    pdf_link = upload_pdf_s3(pdf_file)
    return jsonify({"success": True, "data": pdf_link})

@extraction_bp.route("/extract", methods=["POST"])
def extract_pdf():
    data = request.json
    pdf = data.get("pdf")
    if not pdf:
        return jsonify({"success": False, "data": "pdf_link is required"})
    text_and_images = extract_pdf_s3(pdf)
    return jsonify({"success": True, "data": text_and_images})
