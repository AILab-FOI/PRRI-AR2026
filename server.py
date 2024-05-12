from http.server import HTTPServer, SimpleHTTPRequestHandler 
import ssl

context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
context.load_cert_chain(certfile="cert.pem", keyfile="key.pem")

httpd = HTTPServer(('0.0.0.0', 443), SimpleHTTPRequestHandler)

httpd.socket = context.wrap_socket(httpd.socket, server_side=True)

httpd.serve_forever()