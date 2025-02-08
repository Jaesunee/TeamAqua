from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.firebase_utils import fs_get_flashcards, fs_update_flashcards, fs_get_modules, fs_add_modules, fs_add_chapter, fs_add_flashcard, fs_get_chapters
from dotenv import load_dotenv
import re

# Importing other routes
from routes.extraction_routes import extraction_bp

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

app.register_blueprint(extraction_bp)

@app.route("/flashcards/<flashcard_id>", methods=["GET"])
def get_flashcards(flashcard_id:str):
    """
    Get ALL flashcards of a particular module.
    """
    data = fs_get_flashcards()
    return jsonify(data)

@app.route("/flashcards", methods=["PUT"])
def update_flashcards():
    """
    Update a particular flashcard, given the module name, chapter name and flashcard id
    """
    data = fs_update_flashcards(request.json)
    return jsonify(data)

@app.route("/flashcards", methods=["POST"])
def upload_pdf():
    """
    Upload a PDF file to the server and extract flashcards from it.
    """
    data = extraction_bp.extract_flashcards()
    return jsonify(data)

# REFERENCE
# @app.route("/items", methods=["POST"])
# def create_item():
#     new_item = request.json
#     data.append(new_item)
#     return jsonify(new_item), 201

# @app.route("/items/<int:item_id>", methods=["PUT"])
# def update_item(item_id):
#     item = next((item for item in data if item["id"] == item_id), None)
#     if item is None:
#         return jsonify({"error": "Item not found"}), 404

#     updated_data = request.json
#     item.update(updated_data)
#     return jsonify(item)

# @app.route("/items/<int:item_id>", methods=["DELETE"])
# def delete_item(item_id):
#     global data
#     data = [item for item in data if item["id"] != item_id]
#     return jsonify({"result": "Item deleted"})

# @app.route("/login", methods=["GET"])
# def login():
#     """
#     Create user object inside Firebase if first time login, if not retrieve UID.
#     """
#     id = request.args.get('id', None)
#     if id:
#         # Replace 'data' with your actual data processing logic
#         res = fs_login(id)
#         return jsonify(res)
#     else:
#         return jsonify({"error": "User id must be provided."}), 400

# @app.route("/notion/scrape", methods=["GET"])
# def get_items():
#     url = request.args.get('url', None)
#     module = request.args.get('module', None)
#     chapter_number = request.args.get('chapterNumber', None)
#     chapter_name = request.args.get('chapterName', None)

#     if url and module and chapter_number and chapter_name:
#         # Replace 'data' with your actual data processing logic
#         res = fs_scrape_and_add_flashcard(url, module,chapter_number, chapter_name)
#         return "Done"
#     else:
#         return jsonify({"error": "All parameters (url, module, chapter_number, and chapter_name) must be provided."}), 400
    
# @app.route("/flashcards/generate", methods=["POST"])
# def generate_flashcards():
#     # Code to generate flashcard from web interface
#     input_type = request.json.get('input_type', None)
#     if input_type == "text":
#         # Input is a block of text copied and pasted in from the web interface in string format
#         output = _generate_flashcards_from_text(request.json.get('text', None))
#         return output

# def _generate_flashcards_from_text(text:str) -> dict:
#     # Split the text into list of strings based on ?q
#     questions = []
#     split_questions = text.split("?q")[1:]
#     pattern = r"\?(q|a|h)\s(.*?)(?=\?\w|$)"
#     for question in split_questions:
#         current_question = {"prompt": "", "answer":[], "hint":[]}
#         question = "?q " + question
#         matches = re.findall(pattern, question, re.DOTALL)

#         for match in matches:
#             marker = match[0]
#             content = match[1]
#             if marker == "q":
#                 current_question["prompt"] = content
#             elif marker == "a":
#                 current_question["answer"].append(content)
#             elif marker == "h":
#                 current_question["hint"].append(content)
#         questions.append(current_question)
#     return questions
if __name__ == "__main__":
    app.run(debug=True)