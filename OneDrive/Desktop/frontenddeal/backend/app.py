"""
Example WSGI Application with Graceful Shutdown

This is an example of how to integrate the graceful shutdown handler
into your main application file.

For Flask:
    from flask import Flask
    from backend.graceful_shutdown import setup_graceful_shutdown
    
    app = Flask(__name__)
    setup_graceful_shutdown()

For Django:
    - Add to your wsgi.py or manage.py
    - from backend.graceful_shutdown import setup_graceful_shutdown
    - setup_graceful_shutdown()

For FastAPI:
    import uvicorn
    from backend.graceful_shutdown import setup_graceful_shutdown
    
    app = FastAPI()
    setup_graceful_shutdown()
"""

import logging

logger = logging.getLogger(__name__)

# Import your framework here
# For development example, we'll create a simple WSGI app
from backend.graceful_shutdown import setup_graceful_shutdown

# Set up graceful shutdown handlers
setup_graceful_shutdown()


def application(environ, start_response):
    """
    Simple WSGI application for testing.
    
    Replace this with your actual Flask/Django/FastAPI app.
    """
    path = environ.get('PATH_INFO', '/')
    
    if path == '/products/':
        status = '200 OK'
        response_body = b'{"results": []}'
    elif path == '/health':
        status = '200 OK'
        response_body = b'{"status": "healthy"}'
    else:
        status = '404 Not Found'
        response_body = b'{"error": "Not Found"}'
    
    response_headers = [
        ('Content-Type', 'application/json'),
        ('Content-Length', str(len(response_body)))
    ]
    start_response(status, response_headers)
    return [response_body]


# For local testing with Flask
if __name__ == '__main__':
    try:
        from flask import Flask
        app = Flask(__name__)
        setup_graceful_shutdown()
        
        @app.route('/products/', methods=['GET'])
        def get_products():
            """Example endpoint for fetching products."""
            return {'results': []}
        
        @app.route('/health', methods=['GET'])
        def health_check():
            """Health check endpoint."""
            return {'status': 'healthy'}
        
        logger.info("Starting Flask app...")
        app.run(debug=True)
    except ImportError:
        logger.warning("Flask not installed. Using simple WSGI app instead.")
        from wsgiref.simple_server import make_server
        server = make_server('0.0.0.0', 8000, application)
        logger.info("Starting WSGI server on http://0.0.0.0:8000")
        server.serve_forever()
