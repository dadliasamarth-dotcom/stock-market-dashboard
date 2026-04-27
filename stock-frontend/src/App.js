import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

function App() {
  const [stocks, setStocks] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedStock, setSelectedStock] = useState("TCS.NS");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/stock-data")
      .then((res) => {
        console.log(res.data);
        setStocks(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // Latest unique stock cards
  const latestStocks = [
    ...new Map(
      stocks.map((stock) => [stock.Company, stock])
    ).values()
  ];

  // Search filter
  const filteredStocks = latestStocks.filter((stock) => {
    const companyName = String(stock.Company || "")
      .replace(".NS", "")
      .toLowerCase();

    const searchValue = search.toLowerCase();

    return (
      companyName.includes(searchValue) ||
      (searchValue === "infosys" && companyName.includes("infy")) ||
      (searchValue === "hdfc" && companyName.includes("hdfcbank")) ||
      (searchValue === "tcs" && companyName.includes("tcs")) ||
      (searchValue === "reliance" && companyName.includes("reliance"))
    );
  });

  // Individual stock graph data
  const chartData = stocks
    .filter((stock) => stock.Company === selectedStock)
    .map((stock) => ({
      ...stock,
      Close: Number(stock.Close) || 0
    }));

  return (
    <div style={styles.container}>
      
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2>📈 TradePro</h2>
        <p>Dashboard</p>
        <p>Portfolio</p>
        <p>Watchlist</p>
        <p>Analytics</p>
        <p>Orders</p>
      </div>

      {/* Main */}
      <div style={styles.main}>
        <h1>Stock Trading Dashboard</h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search stock..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />

        {/* KPI Cards */}
        <div style={styles.kpiContainer}>
          <div style={styles.card}>
            <h3>Portfolio Value</h3>
            <h2>₹2,45,000</h2>
          </div>

          <div style={styles.card}>
            <h3>Total Profit</h3>
            <h2 style={{ color: "lightgreen" }}>+₹18,500</h2>
          </div>

          <div style={styles.card}>
            <h3>Total Stocks</h3>
            <h2>
              {search ? filteredStocks.length : latestStocks.length}
            </h2>
          </div>
        </div>

        {/* Graph Section */}
        <div style={styles.card}>
          <h2>{selectedStock} Price Trend</h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="Close"
                stroke="#2fff00"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Market Watch */}
        <h2>Market Watch</h2>

        <div style={styles.stockGrid}>
          {(search ? filteredStocks : latestStocks).map(
            (stock, index) => (
              <div
                key={index}
                style={styles.stockCard}
                onClick={() =>
                  setSelectedStock(stock.Company)
                }
              >
                <h3>{stock.Company}</h3>

                <p>Close: ₹{stock.Close || 0}</p>
                <p>High: ₹{stock.High || 0}</p>
                <p>Low: ₹{stock.Low || 0}</p>

                <p>
                  Daily Return:{" "}
                  {stock["Daily Return"]
                    ? Number(
                        stock["Daily Return"]
                      ).toFixed(2)
                    : "0"}
                  %
                </p>

                <p>
                  Risk Score:{" "}
                  {stock["Risk Score"] || "N/A"}
                </p>

                <div style={styles.buttonContainer}>
                  <button style={styles.buyBtn}>
                    Buy
                  </button>

                  <button style={styles.sellBtn}>
                    Sell
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#0f172a",
    color: "white",
    fontFamily: "Arial"
  },

  sidebar: {
    width: "220px",
    backgroundColor: "#1e293b",
    padding: "20px"
  },

  main: {
    flex: 1,
    padding: "20px"
  },

  search: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "none"
  },

  kpiContainer: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(200px,1fr))",
    gap: "20px",
    marginBottom: "30px"
  },

  card: {
    backgroundColor: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px"
  },

  stockGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(250px,1fr))",
    gap: "20px"
  },

  stockCard: {
    backgroundColor: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
    cursor: "pointer",
    boxShadow:
      "0px 4px 10px rgba(0,0,0,0.3)"
  },

  buttonContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "15px"
  },

  buyBtn: {
    backgroundColor: "green",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },

  sellBtn: {
    backgroundColor: "red",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  }
};

export default App;