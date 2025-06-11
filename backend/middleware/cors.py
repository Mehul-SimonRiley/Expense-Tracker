from flask import request, make_response, current_app

def handle_options_request():
    if request.method == 'OPTIONS':
        response = make_response()
        # Get allowed origins from config
        origins = current_app.config['CORS_ORIGINS']
        # Get the requesting origin
        origin = request.headers.get('Origin')
        
        # If the requesting origin is in our allowed origins, use it
        if origin in origins:
            response.headers.add('Access-Control-Allow-Origin', origin)
        else:
            # Otherwise use the first allowed origin
            response.headers.add('Access-Control-Allow-Origin', origins[0])
            
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        response.headers.add('Access-Control-Max-Age', '3600')
        return response
    return None 