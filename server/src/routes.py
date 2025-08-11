from fastapi import APIRouter

from .support.controlers import room_controller


def get_apps_router():
    router = APIRouter()
    router.include_router(room_controller.router)
    return router