from flask import Flask
from extensions import *
from routes import book_routes

def create_app():
    # Create and configure the Flask application
    app = Flask(__name__)
    CORS(app)
    
    # Set up the database URI and disable modification tracking
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///books.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Initialise the database and CORS extensions
    db.init_app(app)
    cors.init_app(app)

    # Register the book routes blueprint to handle book-related endpoints
    app.register_blueprint(book_routes)

    # Create the database tables within the application context
    with app.app_context():
        db.create_all() 

    return app

if __name__ == "__main__":
    # Run the Flask application in debug mode
    app = create_app()
    app.run(debug=True)
