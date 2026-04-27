import yfinance as yf
import pandas as pd
import sqlite3
import numpy as np

stocks = ["TCS.NS", "INFY.NS", "RELIANCE.NS", "HDFCBANK.NS"]

all_data = []

for stock in stocks:
    print(f"Fetching {stock}...")

    df = yf.download(stock, period="1mo")

    df.reset_index(inplace=True)

    # flatten columns
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    df = df[["Date", "Open", "High", "Low", "Close", "Volume"]]

    df["Company"] = stock
    df["Daily Return"] = ((df["Close"] - df["Open"]) / df["Open"]) * 100
    df["Risk Score"] = np.random.randint(1,10,size=len(df))

    all_data.append(df)

final_df = pd.concat(all_data, ignore_index=True)

print(final_df.head())

final_df.to_csv("multi_stock_data.csv", index=False)

conn = sqlite3.connect("stocks.db")
final_df.to_sql("stocks", conn, if_exists="replace", index=False)
conn.close()

print("Data stored successfully!")