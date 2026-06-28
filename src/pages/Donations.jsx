import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

export default function Donations() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    const res = await axios.get("http://localhost:5001/api/auth/donations");
    setData(res.data.donations);
  };

  return (
    <div className="page">
      <h2>All Donations</h2>

      <div className="grid">
        {data.map((d, i) => (
          <div className="card" key={i}>
            <h3>{d.name}</h3>
            <p>{d.email}</p>
            <p><b>Type:</b> {d.type}</p>

            {d.type === "money" && <p>₹ {d.amount}</p>}
            {d.type === "blood" && <p>Blood: {d.bloodGroup}</p>}
            {d.type === "other" && <p>Item: {d.item}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}