import { useState } from "react";
import "./App.css";
import { products } from "./data/product";
import { grades } from "./data/grades";
import { calculateFloorPrice } from "./utils/floorCalculator";

function App() {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quotePrice, setQuotePrice] = useState("");

  // Demo Prices (Replace with API later)
  const prices = {
    copper: 950,
    nickel: 1400,
    zinc: 250,
    tin: 3000,
    aluminium: 250,
    iron: 80,
  };

  const product = products.find((p) => p.id === Number(selectedProduct));

  const grade = product ? grades.find((g) => g.id === product.gradeId) : null;

  const result =
    product && grade
      ? calculateFloorPrice(grade, prices, product.spread)
      : null;

  const approved =
    quotePrice && result && Number(quotePrice) >= result.floorPrice;

  const difference =
    quotePrice && result ? Number(quotePrice) - result.floorPrice : 0;

  return (
    <div className="app">
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>

      <div className="container">
        {/* Hero */}
        <div className="hero">
          <h1>MULTIMETALS LIMITED</h1>

          <h2>Floor Price Intelligence Engine</h2>

          <p>Real-time metal cost simulation & quotation validation</p>
        </div>
        <div className="glass">
          <h3>🚀 ERP Status Dashboard</h3>
          <p style={{ marginTop: "10px" }}>
            LME Connected: Pending | Products: {products.length} | Grades:{" "}
            {grades.length} | Approval Engine: Active
          </p>
        </div>
        {/* Dashboard Stats */}
        <div className="stats">
          <div className="card">
            <span>Total Products</span>
            <h2>{products.length}</h2>
          </div>

          <div className="card">
            <span>Total Grades</span>
            <h2>{grades.length}</h2>
          </div>

          <div className="card floor">
            <span>System Status</span>
            <h2>LIVE</h2>
          </div>
        </div>

        {/* Live Prices */}
        <div className="glass">
          <h3 style={{ marginBottom: "20px" }}>Live Market Prices (Demo)</h3>

          <div className="stats">
            <div className="card">
              <span>Copper</span>
              <h2>₹{prices.copper}</h2>
            </div>

            <div className="card">
              <span>Nickel</span>
              <h2>₹{prices.nickel}</h2>
            </div>

            <div className="card">
              <span>Zinc</span>
              <h2>₹{prices.zinc}</h2>
            </div>
          </div>
        </div>

        {/* Product Selection */}
        <div className="glass">
          <label>Select Product</label>

          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">Choose Product</option>

            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {product && grade && result && (
          <>
            {/* Product Info */}
            <div className="glass">
              <h3>Product Information</h3>

              <br />

              <p>
                <strong>Product:</strong> {product.name}
              </p>

              <p>
                <strong>Grade:</strong> {grade.name}
              </p>

              <p>
                <strong>Spread:</strong> ₹{product.spread}
              </p>
            </div>

            {/* Grade Composition */}
            <div className="glass">
              <h3>Grade Composition</h3>

              <br />

              <p>Copper : {grade.copper || 0}%</p>

              <p>Nickel : {grade.nickel || 0}%</p>

              <p>Zinc : {grade.zinc || 0}%</p>

              <p>Tin : {grade.tin || 0}%</p>

              <p>Aluminium : {grade.aluminium || 0}%</p>

              <p>Iron : {grade.iron || 0}%</p>
            </div>

            {/* Main Calculation Cards */}
            <div className="stats">
              <div className="card">
                <span>Metal Cost</span>
                <h2>₹{result.metalCost.toFixed(0)}</h2>
              </div>

              <div className="card">
                <span>Melt Loss (3%)</span>
                <h2>₹{result.meltLoss.toFixed(0)}</h2>
              </div>

              <div className="card floor">
                <span>Floor Price</span>
                <h2>₹{result.floorPrice.toFixed(0)}</h2>
              </div>
            </div>

            {/* Calculation Breakdown */}
            <div className="glass">
              <h3>Calculation Breakdown</h3>

              <br />

              <p>
                Copper Cost : ₹
                {(((grade.copper || 0) * prices.copper) / 100).toFixed(2)}
              </p>

              <p>
                Nickel Cost : ₹
                {(((grade.nickel || 0) * prices.nickel) / 100).toFixed(2)}
              </p>

              <p>
                Zinc Cost : ₹
                {(((grade.zinc || 0) * prices.zinc) / 100).toFixed(2)}
              </p>

              <p>
                Tin Cost : ₹{(((grade.tin || 0) * prices.tin) / 100).toFixed(2)}
              </p>

              <hr
                style={{
                  margin: "15px 0",
                }}
              />

              <p>Metal Cost : ₹{result.metalCost.toFixed(2)}</p>

              <p>Melt Loss : ₹{result.meltLoss.toFixed(2)}</p>

              <p>Spread : ₹{product.spread}</p>

              <hr
                style={{
                  margin: "15px 0",
                }}
              />

              <h2>Floor Price : ₹{result.floorPrice.toFixed(2)}</h2>
            </div>

            {/* Quote Validation */}
            <div className="glass">
              <label>Enter Quote Price</label>

              <input
                type="number"
                placeholder="Enter quotation amount"
                value={quotePrice}
                onChange={(e) => setQuotePrice(e.target.value)}
              />

              {quotePrice && (
                <>
                  <div
                    className={approved ? "status success" : "status danger"}
                  >
                    {approved ? (
                      <>
                        ✅ Quote Above Floor
                        <br />
                        Auto Approved
                      </>
                    ) : (
                      <>
                        ⚠ Quote Below Floor
                        <br />
                        MD Approval Required
                      </>
                    )}
                  </div>

                  <div
                    style={{
                      marginTop: "20px",
                    }}
                    className="card floor"
                  >
                    <span>Difference</span>

                    <h2>₹{difference.toFixed(2)}</h2>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
