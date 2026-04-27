import pandas as pd
import sqlite3

# Load multi stock data
df = pd.read_csv("multi_stock_data.csv")

# Connect database
conn = sqlite3.connect("stocks.db")

# Save data
df.to_sql("stock_data", conn, if_exists="replace", index=False)

conn.close()

print("Multi-stock data saved successfully!")