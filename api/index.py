import sys
import os

root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
hw6_dir = os.path.join(root_dir, "hw6")
if hw6_dir not in sys.path:
    sys.path.insert(0, hw6_dir)

from server import DocuMindFullStackHandler

class handler(DocuMindFullStackHandler):
    """
    Root Vercel Serverless Function entry point.
    Delegates all API requests to hw6/server.py.
    """
    pass
