# routes/notion_routes.py
from flask import Blueprint, request, jsonify
from utils.extraction_utils import test_extraction_utils

extraction_bp = Blueprint('extraction', __name__, url_prefix='/extraction')

@extraction_bp.route("/test", methods=["GET"])
def test_blueprint():
    if test_extraction_utils():
        return jsonify({"success": True, "data": "Blueprint works!"})
    return jsonify({"success": False, "data": "Blueprint does not work!"})
