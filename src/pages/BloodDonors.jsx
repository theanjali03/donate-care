// import { useEffect, useState } from "react";
// import axios from "axios";
// import "./BloodDonors.css";

// export default function BloodDonors() {
//   const [group, setGroup] = useState("");
//   const [donors, setDonors] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // 🔥 FETCH FROM BACKEND
//   useEffect(() => {
//     fetchDonors();
//   }, []);

//   const fetchDonors = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:5001/api/auth/blood-donors"
//       );

//       console.log("DONORS:", res.data);

//       setDonors(res.data.donors || []);
//       setLoading(false);

//     } catch (error) {
//       console.error("Error fetching donors:", error);
//       setLoading(false);
//     }
//   };

//   // 🔍 FILTER
//   const filteredDonors = group
//     ? donors.filter(d => d.bloodGroup === group)
//     : donors;

//   return (
//     <div className="blood-container">

//       <h1 className="title">🩸 Find Blood Donors</h1>
//       <p className="subtitle">
//         Connect with real donors from your database.
//       </p>

//       {/* FILTER */}
//       <div className="filter-box">
//         <select
//           value={group}
//           onChange={(e) => setGroup(e.target.value)}
//         >
//           <option value="">All Blood Groups</option>
//           <option>A+</option>
//           <option>A-</option>
//           <option>B+</option>
//           <option>B-</option>
//           <option>O+</option>
//           <option>O-</option>
//           <option>AB+</option>
//           <option>AB-</option>
//         </select>
//       </div>

//       {/* LOADING */}
//       {loading ? (
//         <p>Loading donors...</p>
//       ) : (
//         <div className="donor-grid">

//           {filteredDonors.length > 0 ? (
//             filteredDonors.map((donor, index) => (
//               <div key={index} className="donor-card">

//                 <div className="blood-badge">
//                   {donor.bloodGroup}
//                 </div>

//                 <h3>{donor.name}</h3>

//                 <p>📧 {donor.email}</p>

//                 <p>
//                   💬 {donor.message || "No message"}
//                 </p>

//                 <button className="contact-btn">
//                   Contact
//                 </button>

//               </div>
//             ))
//           ) : (
//             <p className="no-data">
//               No donors found
//             </p>
//           )}

//         </div>
//       )}

//     </div>
//   );
// }



import { useEffect, useState } from "react";
import axios from "axios";
import "./BloodDonors.css";

export default function BloodDonors() {
  const [donors, setDonors] = useState([]);
  const [group, setGroup] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔥 FETCH DONORS
  const fetchDonors = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `http://localhost:5001/api/auth/blood-donors?group=${group}`
      );

      setDonors(res.data.donors || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load donors");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 AUTO LOAD + REFRESH
  useEffect(() => {
    fetchDonors();

    const interval = setInterval(fetchDonors, 5000); // every 5 sec

    return () => clearInterval(interval);
  }, [group]);

  return (
    <div className="blood-container">

      {/* HEADER */}
      <div className="blood-header">
        <h1>🩸 Live Blood Donors</h1>
        <p>Find real donors instantly from your database</p>
      </div>

      {/* FILTER */}
      <div className="blood-filter">
        <select
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          className="blood-select"
        >
          <option value="">All Blood Groups</option>
          <option>A+</option>
          <option>B+</option>
          <option>O+</option>
          <option>AB+</option>
          <option>A-</option>
          <option>B-</option>
          <option>O-</option>
          <option>AB-</option>
        </select>
      </div>

      {/* STATES */}
      {loading && <p className="status-msg">Loading donors...</p>}
      {error && <p className="error-msg">{error}</p>}

      {/* DONORS GRID */}
      <div className="blood-grid">
        {!loading && donors.length === 0 ? (
          <p className="status-msg">No donors found</p>
        ) : (
          donors.map((d, i) => (
            <div className="blood-card" key={i}>

              <div className="blood-top">
                <h3>{d.name}</h3>
                <span className="blood-badge">
                  {d.bloodGroup || "N/A"}
                </span>
              </div>

              <p className="blood-email">📧 {d.email}</p>

              {d.message && (
                <p className="blood-message">
                  💬 {d.message}
                </p>
              )}

              <button
                className="contact-btn"
                onClick={() => window.location.href = `mailto:${d.email}`}
              >
                📩 Contact
              </button>

            </div>
          ))
        )}
      </div>

    </div>
  );
}