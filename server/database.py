import sqlite3
import os
from passlib.context import CryptContext

# Get the absolute path to the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))
# Join the directory with the database filename
DATABASE_URL = os.path.join(script_dir, "users.db")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

con = sqlite3.connect(DATABASE_URL, check_same_thread=False)
cur = con.cursor()

def create_users_table():
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            username TEXT UNIQUE,
            hashed_password TEXT
        )
    """)
    con.commit()

def create_user(username, password):
    try:
        hashed_password = pwd_context.hash(password)
        cur.execute("INSERT INTO users (username, hashed_password) VALUES (?, ?)", (username, hashed_password))
        con.commit()
        return True
    except sqlite3.IntegrityError:
        return False

def get_user(username):
    cur.execute("SELECT * FROM users WHERE username = ?", (username,))
    return cur.fetchone()

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)
