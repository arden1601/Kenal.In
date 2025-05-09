from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse

app = FastAPI()

html = """
<!DOCTYPE html>
<html>
    <body>
        <h1>WebSocket Test</h1>
        <script>
            const ws = new WebSocket("ws://localhost:8000/ws");
            ws.onmessage = (event) => {
                const msg = document.createElement("div");
                msg.textContent = "Server: " + event.data;
                document.body.appendChild(msg);
            };
            ws.onopen = () => {
                ws.send("Hello from client!");
            };
        </script>
    </body>
</html>
"""

@app.get("/")
async def get():
    return HTMLResponse(html)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"You said: {data}")
