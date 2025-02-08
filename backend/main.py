from flask import Flask, request, jsonify
from flask_cors import CORS
from firebaseService import fs_scrape_and_add_flashcard, fs_get_flashcards, fs_update_flashcard, fs_login, fs_get_modules, fs_add_modules, fs_add_chapter, fs_add_flashcard
import re

# Importing other routes
from routes.extraction_routes import extraction_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(extraction_bp)


    
@app.route("/flashcards/<module_name>/<chapter_name>", methods=["GET"])
def get_flashcards(module_name:str, chapter_name:int):
    """
    Get all flashcards of a particular module.
    """
    data = fs_get_flashcards(module_name, chapter_name)
    return jsonify(data)

@app.route("/flashcards/<module_name>/<chapter_name>/<flashcard_id>", methods=["PUT"])
def update_flashcard(module_name:str, chapter_name:int, flashcard_id:str):
    """
    Update a particular flashcard
    """
    new_flashcard_obj = request.json
    print(new_flashcard_obj)
    data = fs_update_flashcard(module_name, chapter_name, flashcard_id, new_flashcard_obj)
    return jsonify(data)

@app.route("/flashcards/add", methods=["POST"])
def add_flashcards():
    # Code to generate flashcard from web interface
    input_type = request.json.get('input_type', None)
    print("We got here")
    # assume validated
    fs_add_flashcard(
        request.json.get('module', None),
        request.json.get('chapterNumber', None),
        request.json.get('chapterName', None),
        request.json.get("data", None)
    )
    return jsonify("Status: Done")
    if input_type == "text":
        # Input is a block of text copied and pasted in from the web interface in string format
        output = _generate_flashcards_from_text(request.json.get('text', None))
        return output



@app.route("/modules", methods=["GET", "POST"])
def handle_modules():
    """
    Handle GET and POST requests for modules.
    """
    if request.method == "GET":
        user_id = request.args.get('id', None)
        try:
            res = fs_get_modules(user_id)
            return jsonify(res)
        except Exception as e:
            return jsonify({"error": str(e)}), 400
    
    elif request.method == "POST":
        module_name = request.json.get('moduleName', None)
        user_id = request.json.get('userId', None)
        
        if module_name and user_id:
            try:
                fs_add_modules(module_name, user_id)
                return jsonify({"message": "Module added successfully."}), 201
            except Exception as e:
                return jsonify({"error": str(e)}), 400
        else:
            return jsonify({"error": "moduleName and userId must be provided."}), 400

@app.route("/modules/chapter", methods=["POST"])
def add_chapter():
    """
    Add a chapter to a module.
    """
    module_name = request.json.get('moduleName', None)
    chapter_name = request.json.get('chapterName', None)
    user_id = request.json.get('userId', None)
    
    if module_name and chapter_name and user_id:
        try:
            fs_add_chapter(chapter_name, module_name,  user_id)
            return jsonify({"message": "Chapter added successfully."}), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 400
    else:
        return jsonify({"error": "Module does not exist!"}), 400


        
    


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