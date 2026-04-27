from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import pandas as pd
import numpy as np

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Stock API Running"}

@app.get("/stock-data")
def get_stock_data():
    conn = sqlite3.connect("stocks.db")

    query = "SELECT * FROM stocks"
    df = pd.read_sql_query(query, conn)

    conn.close()

    # Replace NaN values
    df = df.replace([np.nan], 0)

    return df.to_dict(orient="records")