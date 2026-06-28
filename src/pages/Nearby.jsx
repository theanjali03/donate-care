import { useEffect, useState } from "react";
import axios from "axios";
import "./Nearby.css";

export default function Nearby() {
  const [data, setData] = useState({ donations: [], helps: [] });

  useEffect(() => {
    const location = JSON.parse(localStorage.getItem("location"));
    if (!location) return;

    axios
      .get(`http://localhost:5001/api/auth/nearby-feed?lat=${location.latitude}&lng=${location.longitude}`)
      .then(res => setData(res.data));
  }, []);

  return (
    <div className="nearby-container">
      <h2>Nearby Activity</h2>

      <div className="grid">
        {data.helps.map((h, i) => (
          <div className="card urgent" key={i}>
            <h4>{h.type}</h4>
            <p>{h.detail}</p>
            <span>{h.distance.toFixed(1)} km away</span>
          </div>
        ))}

        {data.donations.map((d, i) => (
          <div className="card" key={i}>
            <h4>{d.type}</h4>
            {d.amount && <p>₹ {d.amount}</p>}
            {d.bloodGroup && <p>{d.bloodGroup}</p>}
            <span>{d.distance.toFixed(1)} km away</span>
          </div>
        ))}
      </div>
    </div>
  );
}