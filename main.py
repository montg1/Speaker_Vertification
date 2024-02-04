#import app in handle.py from FastAPI DIRECTORY
from FastAPI.main import app 
from FastAPI import index , items , upload

if __name__ == "__main__":
    # The following code is used to run the FastAPI app
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)