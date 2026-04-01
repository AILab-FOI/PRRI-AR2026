import traceback
import logging
from wsgiref.simple_server import WSGIServer, WSGIRequestHandler
import ssl
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from app import app
import ZEO
import os

# Define SSL context
context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
context.load_cert_chain(certfile="cert.pem", keyfile="key.pem")

# Log file path
LOG_PATH = os.path.join(os.path.dirname(__file__), "server_errors.log")

# Python logging system
logging.basicConfig(
    filename=LOG_PATH,
    level=logging.ERROR,
    force=True
)

print("LOG PATH:", LOG_PATH)

def simple_app(environ, start_response):
    # Call the Flask app to handle the request
    try:
        return app(environ, start_response)

    except Exception as e:
        # log full traceback
        logging.error("Unhandled server error:")
        logging.error(traceback.format_exc())

        # HTTP 500 response
        status = "500 Internal Server Error"
        response_body = b"Internal Server Error"

        start_response(status, [
            ("Content-Type", "text/plain"),
            ("Content-Length", str(len(response_body)))
        ])

        return [response_body]
    
# Create a WSGI server with SSL support
httpd = WSGIServer(('0.0.0.0', 5333), WSGIRequestHandler)
httpd.socket = context.wrap_socket(httpd.socket, server_side=True)

# Set the WSGI application to be served
httpd.set_app(simple_app)

# Start the server
print("Serving on port 5333")
httpd.serve_forever()
