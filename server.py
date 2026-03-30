from wsgiref.simple_server import WSGIServer, WSGIRequestHandler
import ssl
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from app import app
import ZEO

#Testni commit

# Define SSL context
context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
context.load_cert_chain(certfile="cert.pem", keyfile="key.pem")

# Create a WSGI application that serves the Flask app
def simple_app(environ, start_response):
    # Call the Flask app to handle the request
    return app(environ, start_response)

# Create a WSGI server with SSL support
httpd = WSGIServer(('0.0.0.0', 5333), WSGIRequestHandler)
httpd.socket = context.wrap_socket(httpd.socket, server_side=True)

# Set the WSGI application to be served
httpd.set_app(simple_app)

# Start the server
print("Serving on port 5333")
httpd.serve_forever()
