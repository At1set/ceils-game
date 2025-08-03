from typing import Annotated
from fastapi import WebSocket
from fastapi import Depends, HTTPException, Query, APIRouter, status
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_204_NO_CONTENT, HTTP_403_FORBIDDEN
from pydantic import BaseModel
from typing import List

class CreateRoomResponse(BaseModel):
    success: bool
    message: str

class Player:
    name: str
    ws: WebSocket

class Room:
    def __init__(self, name, password):
        self.name = name
        self.password = password
        self.players = []

    name: str
    password: str
    players: list[Player] 

rooms: list[Room] = []
router = APIRouter(prefix="/rooms")



@router.post("/create",response_model=CreateRoomResponse, status_code=201)
async def create_room(name: str, password: str) -> bool:
    if any(room.name == name for room in rooms):
        raise HTTPException(
            status_code=403,
            detail="Комната с таким именем уже существует!"
        )

    new_room = Room(name=name, password=password)
    rooms.append(new_room)
    return CreateRoomResponse(success=True, message="Комната создана")

class RoomInfo(BaseModel):
    name: str
    players: int

@router.get("/", response_model=List[RoomInfo])
async def list_rooms():
    return [RoomInfo(name=room.name, players=len(room.players)) for room in rooms]
