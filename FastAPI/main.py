from typing import Union

from fastapi import FastAPI , UploadFile, HTTPException, File 
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import os
import io

app = FastAPI()

# Allow all origins for testing purposes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Item(BaseModel):
    name: str
    price: float
    is_offer: Union[bool, None] = None
    
app.mount("/static", StaticFiles(directory="static"), name="static")

#response index.html
@app.get("/")
async def read_index():
    return FileResponse('static/index.html')


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


@app.put("/items/{item_id}")
def update_item(item_id: int, item: Item):
    return {"item_name": item.name, "item_id": item_id}



@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Read the content of the uploaded file as bytes
        file_content = await file.read()

        # Save the content as a .wav file
        save_path = os.path.join("uploaded_files", file.filename)
        with open(save_path, "wb") as save_file:
            save_file.write(file_content)

        return JSONResponse(content={"message": "File uploaded successfully"}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"message": f"Error uploading file: {str(e)}"}, status_code=500)