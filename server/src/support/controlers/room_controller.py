from typing import Annotated
from fastapi import WebSocket
from fastapi import Depends, HTTPException, Query, APIRouter, status
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_204_NO_CONTENT, HTTP_403_FORBIDDEN
from pydantic import BaseModel
from typing import List
import logging
import json

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

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
        self.objects = []

    name: str
    password: str
    players: list[Player]
    objects: map

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

@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    room_name: str,
    player_name: str
):
    try:
        await websocket.accept()
        
        # Находим комнату
        room = next((r for r in rooms if r.name == room_name), None)
        
        if not room:
            logger.error(f"Комната {room_name} не найдена")
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return
            
        logger.debug(f"Найдена комната: {room.name}")
        
        # Проверяем существующего игрока
        if any(p.name == player_name for p in room.players):
            logger.warning(f"Игрок {player_name} уже существует в комнате {room_name}")
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return
            
        # Создаем и добавляем нового игрока
        player = Player()
        player.name = player_name
        player.ws = websocket
        room.players.append(player)
        logger.info(f"Игрок {player_name} добавлен в комнату {room_name}")

        objects = []
        for obj in room.objects:
            objects += obj

        try:
            join_message = {
            "event": "join",
            "data": {
            "room": room_name,
            "username": player_name,
            "objects": objects,
            "sender": "server"
            }}
            await websocket.send_text(json.dumps(join_message))
            while True:
                data = await websocket.receive_text()
                try:
                    message = json.loads(data)
                except json.JSONDecodeError:
                    print("Ошибка: Невалидный JSON")
                    continue
                message["sender"] = player.name
                
                updated_data = json.dumps(message)

                for p in room.players:
                    if p == player:
                        continue
                    await p.ws.send_text(updated_data)
        except Exception as e:
            logger.error(f"Ошибка в соединении: {str(e)}")
    finally:
        # Удаляем игрока при отключении
        if room and 'player' in locals():
            room.players = [p for p in room.players if p.name != player_name]
            logger.info(f"Игрок {player_name} удален из комнаты {room_name}")