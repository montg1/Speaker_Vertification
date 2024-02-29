from typing import Union
from fastapi import FastAPI , Request, UploadFile, HTTPException, File 
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from starlette.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pathlib import Path
import os
import io

app = FastAPI()

templates = Jinja2Templates(directory="templates")

app.mount("/static", StaticFiles(directory="static"), name="static")

# Serve the doc.html file

@app.get("/", response_class=HTMLResponse)
async def get_doc(request: Request):
    return templates.TemplateResponse("doc.html", {"request": request})

@app.get("/register", response_class=HTMLResponse)
async def get_doc(request: Request):
    return templates.TemplateResponse("register.html", {"request": request})

app.get("/verify", response_class=HTMLResponse)
async def get_doc(request: Request):
    return templates.TemplateResponse("verify.html", {"request": request})


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

@app.get("/power/{num1}/{num2}")
def cal(num1: int, num2: int):
    return {"result": num1 ** num2}

@app.get("/add/{num1}/{num2}")
def cal(num1: int, num2: int):
    return {"result": num1 + num2}



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
    

@app.post("/verify")
async def verify(file: UploadFile = File(...)):
    # Load the pre-trained Kaldi model (replace with your model path)
    model = kaldi_io.ReadUtf8("path/to/your/model")

    try:
        # Read audio data from the uploaded file
        file_content = await file.read()

        # Extract features from the audio using Kaldi
        features = kaldi_io.ReadMat(file_content, is_binary=True)

        # Perform speaker verification using the loaded model
        # (Replace with your verification logic)
        verification_result = your_verification_logic(model, features)

        return {"message": verification_result}

    except Exception as e:
        return {"error": str(e)}
