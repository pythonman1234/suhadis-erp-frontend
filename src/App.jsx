import { useState, useEffect } from "react";
import "./App.css";
import { products } from "./data/product";
import { grades } from "./data/grades";
import { calculateFloorPrice } from "./utils/floorCalculator";

// Helper: format a value in both INR and USD
function DualPrice({ inr, usdInr, decimals = 0 }) {
  const usd = usdInr && typeof usdInr === "number" ? inr / usdInr : null;
  return (
    <span>
      ₹{inr.toFixed(decimals)}
      {usd !== null && (
        <span
          style={{
            display: "block",
            fontSize: "0.75em",
            opacity: 0.75,
            marginTop: 2,
          }}
        >
          ${usd.toFixed(decimals)}
        </span>
      )}
    </span>
  );
}

function App() {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quotePrice, setQuotePrice] = useState("");
  const [usdInr, setUsdInr] = useState(null);
  const [loadingRate, setLoadingRate] = useState(true);

  useEffect(() => {
    const fetchUsdRate = async () => {
      try {
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/${import.meta.env.VITE_EXCHANGE_API_KEY}/latest/USD`,
        );
        const data = await response.json();
        if (data.result === "success") {
          setUsdInr(data.conversion_rates.INR);
        } else {
          setUsdInr("API Error");
        }
      } catch (error) {
        console.error("USD-INR Fetch Error:", error);
        setUsdInr("Failed");
      } finally {
        setLoadingRate(false);
      }
    };
    fetchUsdRate();
  }, []);

  const rateReady = usdInr && typeof usdInr === "number";

  const [prices, setPrices] = useState({
    copper: 870,
    nickel: 1320,
    zinc: 240,
    tin: 2800,
    aluminium: 230,
    iron: 75,
  });

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

        {/* Market Data Control Panel */}
        <div className="glass">
          <h3>Market Data Control Panel</h3>
          <p style={{ marginBottom: "20px" }}>
            Market Price Control Panel (Editable Demo Rates — enter prices in ₹
            INR)
          </p>

          <div className="stats">
            {["copper", "nickel", "zinc", "tin", "aluminium", "iron"].map(
              (metal) => (
                <div className="card" key={metal}>
                  <span style={{ textTransform: "capitalize" }}>{metal}</span>
                  <input
                    type="number"
                    value={prices[metal]}
                    onChange={(e) =>
                      setPrices({ ...prices, [metal]: Number(e.target.value) })
                    }
                  />
                  {rateReady && (
                    <p
                      style={{
                        marginTop: 6,
                        fontSize: "0.78em",
                        opacity: 0.75,
                      }}
                    >
                      ≈ ${(prices[metal] / usdInr).toFixed(2)} USD
                    </p>
                  )}
                </div>
              ),
            )}

            <div className="card floor">
              <span>Exchange Rate</span>
              <h2>
                {loadingRate
                  ? "Loading..."
                  : `1 USD = ₹${Number(usdInr).toFixed(2)}`}
              </h2>
              <p style={{ marginTop: "10px", opacity: 0.8, color: "#f5c97a" }}>
                Live Currency Feed
              </p>
            </div>
          </div>
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
            {["copper", "nickel", "zinc"].map((metal) => (
              <div className="card" key={metal}>
                <span style={{ textTransform: "capitalize" }}>{metal}</span>
                <h2>
                  ₹{prices[metal]}
                  {rateReady && (
                    <span
                      style={{
                        display: "block",
                        fontSize: "0.6em",
                        opacity: 0.75,
                        marginTop: 4,
                        fontWeight: 400,
                      }}
                    >
                      ${(prices[metal] / usdInr).toFixed(2)} USD
                    </span>
                  )}
                </h2>
              </div>
            ))}
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
                {rateReady && (
                  <span style={{ opacity: 0.75, marginLeft: 8 }}>
                    (${(product.spread / usdInr).toFixed(2)} USD)
                  </span>
                )}
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
                <h2>
                  <DualPrice inr={result.metalCost} usdInr={usdInr} />
                </h2>
              </div>
              <div className="card">
                <span>Melt Loss (3%)</span>
                <h2>
                  <DualPrice inr={result.meltLoss} usdInr={usdInr} />
                </h2>
              </div>
              <div className="card floor">
                <span>Floor Price</span>
                <h2>
                  <DualPrice inr={result.floorPrice} usdInr={usdInr} />
                </h2>
              </div>
            </div>

            {/* Calculation Breakdown */}
            <div className="glass">
              <h3>Calculation Breakdown</h3>
              <br />

              {[
                { label: "Copper Cost", metal: "copper" },
                { label: "Nickel Cost", metal: "nickel" },
                { label: "Zinc Cost", metal: "zinc" },
                { label: "Tin Cost", metal: "tin" },
                { label: "Aluminium Cost", metal: "aluminium" },
                { label: "Iron Cost", metal: "iron" },
              ].map(({ label, metal }) => {
                const inrVal = ((grade[metal] || 0) * prices[metal]) / 100;
                return (
                  <p key={metal}>
                    {label} : ₹{inrVal.toFixed(2)}
                    {rateReady && (
                      <span style={{ opacity: 0.7, marginLeft: 8 }}>
                        (${(inrVal / usdInr).toFixed(2)})
                      </span>
                    )}
                  </p>
                );
              })}

              <hr style={{ margin: "15px 0" }} />

              <p>
                Metal Cost : ₹{result.metalCost.toFixed(2)}
                {rateReady && (
                  <span style={{ opacity: 0.7, marginLeft: 8 }}>
                    (${(result.metalCost / usdInr).toFixed(2)})
                  </span>
                )}
              </p>
              <p>
                Melt Loss : ₹{result.meltLoss.toFixed(2)}
                {rateReady && (
                  <span style={{ opacity: 0.7, marginLeft: 8 }}>
                    (${(result.meltLoss / usdInr).toFixed(2)})
                  </span>
                )}
              </p>
              <p>
                Spread : ₹{product.spread}
                {rateReady && (
                  <span style={{ opacity: 0.7, marginLeft: 8 }}>
                    (${(product.spread / usdInr).toFixed(2)})
                  </span>
                )}
              </p>

              <hr style={{ margin: "15px 0" }} />

              <h2>
                Floor Price : ₹{result.floorPrice.toFixed(2)}
                {rateReady && (
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.65em",
                      opacity: 0.75,
                      fontWeight: 400,
                      marginTop: 4,
                    }}
                  >
                    ${(result.floorPrice / usdInr).toFixed(2)} USD
                  </span>
                )}
              </h2>
            </div>

            {/* Quote Validation */}
            <div className="glass">
              <label>Enter Quote Price (₹ INR)</label>
              <input
                type="number"
                placeholder="Enter quotation amount in ₹"
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

                  <div style={{ marginTop: "20px" }} className="card floor">
                    <span>Difference</span>
                    <h2>
                      ₹{difference.toFixed(2)}
                      {rateReady && (
                        <span
                          style={{
                            display: "block",
                            fontSize: "0.6em",
                            opacity: 0.75,
                            fontWeight: 400,
                            marginTop: 4,
                          }}
                        >
                          ${(difference / usdInr).toFixed(2)} USD
                        </span>
                      )}
                    </h2>
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
