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
    def __init__(self, name: str, ws: WebSocket):
        self.name = name
        self.ws = ws

class Room:
    def __init__(self, name: str, password: str):
        self.name: str = name
        self.password: str = password
        self.players: list[Player] = []
        self.objects: dict[str, object] = {}

    async def broadcast(self, message: str, sender: Player):
        for p in self.players:
            if p == sender:
                continue
            await p.ws.send_text(message)

rooms: list[Room] = []
router = APIRouter(prefix="/rooms")

@router.post("/create", response_model=CreateRoomResponse, status_code=201)
async def create_room(name: str, password: str):
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
    player_name: str,
    password: str
):
    room = None
    player = None
    
    try:
        await websocket.accept()
        
        # Находим комнату
        room = next((r for r in rooms if r.name == room_name), None)
        
        if not room:
            logger.error(f"Комната {room_name} не найдена")
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return
        
        logger.debug(f"Найдена комната: {room.name}")
        
        if room.password != password: 
            logger.error(f"Неверный пароль от комнаты: {room_name}")
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return

        if any(p.name == player_name for p in room.players):
            logger.warning(f"Игрок {player_name} уже существует в комнате {room_name}")
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return
            
        player = Player(name=player_name, ws=websocket)
        room.players.append(player)
        logger.info(f"Игрок {player_name} добавлен в комнату {room_name}")

        try:
            join_message = {
                "event": "join",
                "data": {
                    "room": room_name,
                    "username": player_name,
                    "objects": room.objects,
                    "sender": "server"
                }
            }
            
            join_event = {
                "event": "player_joined",
                "data": {
                    "room": room_name,
                    "username": player_name,
                    "sender": "server"
                }
            }

            await websocket.send_text(json.dumps(join_message))
            await room.broadcast(json.dumps(join_event), player)
            
            while True:
                data = await websocket.receive_text()
                logger.debug(f"Получено сообщение: {data}")
                
                try:
                    message = json.loads(data)
                except json.JSONDecodeError:
                    logger.error("Ошибка: Невалидный JSON")
                    continue

                message["sender"] = player_name

                if message["event"] == "placeBlock":
                    x = message["data"]["x"]
                    y = message["data"]["y"]
                    item = message["data"]["item"]
                    room.objects[f"{x}_{y}"] = item

                if message["event"] == "removeBlock":
                    x = message["data"]["x"]
                    y = message["data"]["y"]
                    if f"{x}_{y}" in room.objects:
                        del room.objects[f"{x}_{y}"]

                await room.broadcast(json.dumps(message), player)
                
        except Exception as e:
            logger.error(f"Ошибка в соединении: {str(e)}")
            
    except Exception as e:
        logger.error(f"Общая ошибка WebSocket: {str(e)}")
        
    finally:
        if room and player:
            room.players = [p for p in room.players if p.name != player_name]
            logger.info(f"Игрок {player_name} удален из комнаты {room_name}")

            if room.players:
                leave_event = {
                    "event": "player_left",
                    "data": {
                        "room": room_name,
                        "username": player_name,
                        "sender": "server"
                    }
                }
                await room.broadcast(json.dumps(leave_event), player)