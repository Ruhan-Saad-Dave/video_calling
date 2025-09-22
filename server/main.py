from fastapi import FastAPI, WebSocket, Form, Depends, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse
from pydantic import BaseModel
import json
from . import database as db

db.create_users_table()

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

connected_users = {}

class User(BaseModel):
    username: str
    password: str

async def broadcast_user_list():
    user_list = list(connected_users.keys())
    for user, ws in connected_users.items():
        await ws.send_text(json.dumps({"type": "users", "data": user_list}))

@app.get("/")
async def read_root():
    return FileResponse('static/index.html')

@app.post("/register")
async def register(user: User):
    if db.create_user(user.username, user.password):
        return {"message": "User created successfully"}
    else:
        raise HTTPException(status_code=400, detail="Username already exists")

@app.post("/login")
async def login(user: User):
    db_user = db.get_user(user.username)
    if db_user and db.verify_password(user.password, db_user[2]):
        return {"message": "Login successful"}
    else:
        raise HTTPException(status_code=400, detail="Invalid credentials")

@app.websocket("/ws/{username}")
async def websocket_endpoint(websocket: WebSocket, username: str):
    await websocket.accept()
    connected_users[username] = websocket
    await broadcast_user_list()
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            peer_username = message.get("peer")
            if peer_username in connected_users:
                peer_ws = connected_users[peer_username]
                message["sender"] = username
                await peer_ws.send_text(json.dumps(message))
    except Exception as e:
        print(f"error: {e}")
    finally:
        del connected_users[username]
        await broadcast_user_list()
