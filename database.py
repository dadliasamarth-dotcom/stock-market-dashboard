import sqlite3
import pandas as pd

# Load CSV data
data = pd.read_csv("multi_stock_data.csv")

# Connect database
conn = sqlite3.connect("stocks.db")

# Save table
data.to_sql("stock_data", conn, if_exists="replace", index=False)

print("Data stored successfully in SQLite database!")

conn.close()