import asyncio
import json
from typing import Set, Dict, Any

class BroadcastManager:
    def __init__(self):
        self.clients: Set[asyncio.Queue] = set()
        self._lock = asyncio.Lock()

    async def add_client(self) -> asyncio.Queue:
        q: asyncio.Queue = asyncio.Queue(maxsize=100)
        async with self._lock:
            self.clients.add(q)
        return q

    async def remove_client(self, q: asyncio.Queue) -> None:
        async with self._lock:
            self.clients.discard(q)

    async def publish(self, data: Dict[str, Any]) -> None:
        msg = json.dumps(data)
        async with self._lock:
            dead = []
            for q in self.clients:
                try:
                    q.put_nowait(msg)
                except asyncio.QueueFull:
                    dead.append(q)
            for q in dead:
                self.clients.discard(q)
