import sys
import os

# Ensure hw6 root directory is in sys.path to import server.py
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from server import DocuMindFullStackHandler

class handler(DocuMindFullStackHandler):
    """
    Vercel Serverless Function Entry Point for DocuMind AI Enterprise API.
    Handles all /api/* requests.
    """
    pass
