import pandas as pd
import matplotlib.pyplot as plt

data = pd.read_csv("processed_tcs_stock_data.csv")

plt.figure(figsize=(8,5))
plt.plot(data["Close"], marker="o")

plt.title("TCS Stock Closing Prices")
plt.xlabel("Days")
plt.ylabel("Closing Price")

plt.savefig("stock_chart.png")
print("Chart saved successfully!")

plt.show()