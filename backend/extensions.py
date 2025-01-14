from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Initialise the SQLAlchemy extension for database interactions
# SQLAlchemy is an ORM (Object Relational Mapper) that allows us to interact with the database using Python objects.
# It provides a high-level abstraction over SQL, making it easier to work with databases in a Pythonic way.
db = SQLAlchemy()

# Initialise the CORS extension to handle Cross-Origin Resource Sharing
# CORS (Cross-Origin Resource Sharing) is a mechanism that allows restricted resources on a web page to be requested from another domain.
# This is essential for enabling web applications to make requests to servers hosted on different domains.
cors = CORS()
