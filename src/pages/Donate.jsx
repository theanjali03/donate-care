// import { useState } from "react";
// import axios from "axios";
// import "./Donate.css";

// export default function Donate() {
//   const [type, setType] = useState("money");
//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");

//   const [bloodGroup, setBloodGroup] = useState("");
//   const [item, setItem] = useState("");

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     amount: "",
//     message: ""
//   });

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value
//     });
//   };

//   // ================= SUBMIT =================
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setSuccess("");
//     setError("");

//     console.log("🔥 FORM SUBMITTED");

//     // ✅ CHECK LOGIN
//     const user = JSON.parse(localStorage.getItem("user"));

//     if (!user) {
//       setError("Please login first");
//       return;
//     }

//     // ✅ VALIDATION
//     if (!form.name || !form.email) {
//       setError("Please fill all required fields");
//       return;
//     }

//     if (type === "money" && !form.amount) {
//       setError("Please enter amount");
//       return;
//     }

//     if (type === "blood" && !bloodGroup) {
//       setError("Please select blood group");
//       return;
//     }

//     if (type === "other" && !item) {
//       setError("Please specify what you are donating");
//       return;
//     }

//     try {
//       const res = await axios.post(
//         "http://localhost:5001/api/auth/donate",
//         {
//           userId: user.id, // ✅ IMPORTANT FIX

//           name: form.name,
//           email: form.email,
//           type,

//           amount: type === "money" ? form.amount : null,
//           bloodGroup: type === "blood" ? bloodGroup : null,
//           item: type === "other" ? item : null,

//           message: form.message
//         }
//       );

//       console.log("✅ API SUCCESS:", res.data);

//       setSuccess("🎉 Donation Successful!");

//       // RESET FORM
//       setForm({
//         name: "",
//         email: "",
//         amount: "",
//         message: ""
//       });
//       setBloodGroup("");
//       setItem("");

//     } catch (err) {
//       console.error("❌ ERROR:", err.response?.data || err.message);

//       setError(
//         err.response?.data?.message ||
//         "Something went wrong ❌"
//       );
//     }
//   };

//   return (
//     <div className="donate-container">

//       <h1 className="title">Make a Donation</h1>
//       <p className="subtitle">
//         Choose what you want to donate and help someone in need.
//       </p>

//       <div className="donate-card">

//         {/* LEFT */}
//         <div className="donate-left">
//           <h3>What would you like to donate?</h3>

//           <div
//             className={`option ${type === "money" ? "active" : ""}`}
//             onClick={() => setType("money")}
//           >
//             💰 Money
//           </div>

//           <div
//             className={`option ${type === "blood" ? "active" : ""}`}
//             onClick={() => setType("blood")}
//           >
//             🩸 Blood
//           </div>

//           <div
//             className={`option ${type === "other" ? "active" : ""}`}
//             onClick={() => setType("other")}
//           >
//             🎁 Other
//           </div>

//           <div className="secure-box">
//             🔒 100% Secure & Transparent
//           </div>
//         </div>

//         {/* RIGHT */}
//         <div className="donate-right">
//           <h3>Donation Details</h3>

//           {success && <div className="success-msg">{success}</div>}
//           {error && <div className="error-msg">{error}</div>}

//           <form onSubmit={handleSubmit}>

//             {/* NAME */}
//             <div className="input-group">
//               <label>Full Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Enter your full name"
//                 value={form.name}
//                 onChange={handleChange}
//               />
//             </div>

//             {/* EMAIL */}
//             <div className="input-group">
//               <label>Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Enter your email"
//                 value={form.email}
//                 onChange={handleChange}
//               />
//             </div>

//             {/* MONEY */}
//             {type === "money" && (
//               <div className="input-group">
//                 <label>Amount (₹)</label>
//                 <input
//                   type="number"
//                   name="amount"
//                   placeholder="Enter donation amount"
//                   value={form.amount}
//                   onChange={handleChange}
//                 />
//               </div>
//             )}

//             {/* BLOOD */}
//             {type === "blood" && (
//               <div className="input-group">
//                 <label>Blood Group</label>
//                 <select
//                   value={bloodGroup}
//                   onChange={(e) => setBloodGroup(e.target.value)}
//                 >
//                   <option value="">Select Blood Group</option>
//                   <option>A+</option>
//                   <option>A-</option>
//                   <option>B+</option>
//                   <option>B-</option>
//                   <option>O+</option>
//                   <option>O-</option>
//                   <option>AB+</option>
//                   <option>AB-</option>
//                 </select>
//               </div>
//             )}

//             {/* OTHER */}
//             {type === "other" && (
//               <div className="input-group">
//                 <label>Donation Item</label>
//                 <input
//                   type="text"
//                   placeholder="Food, Clothes, etc."
//                   value={item}
//                   onChange={(e) => setItem(e.target.value)}
//                 />
//               </div>
//             )}

//             {/* MESSAGE */}
//             <div className="input-group">
//               <label>Message</label>
//               <textarea
//                 name="message"
//                 placeholder="Optional message..."
//                 value={form.message}
//                 onChange={handleChange}
//               />
//             </div>

//             <button type="submit" className="donate-btn">
//               ❤️ Donate Now
//             </button>

//           </form>
//         </div>

//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import axios from "axios";
import "./Donate.css";

export default function Donate() {
  const [type, setType] = useState("money");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [bloodGroup, setBloodGroup] = useState("");
  const [item, setItem] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    amount: "",
    message: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    console.log("🔥 FORM SUBMITTED");

    // ✅ CHECK LOGIN
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      setError("Please login first");
      return;
    }

    // ✅ VALIDATION
    if (!form.name || !form.email) {
      setError("Please fill all required fields");
      return;
    }

    if (type === "money" && !form.amount) {
      setError("Please enter amount");
      return;
    }

    if (type === "blood" && !bloodGroup) {
      setError("Please select blood group");
      return;
    }

    if (type === "other" && !item) {
      setError("Please specify what you are donating");
      return;
    }

    try {
      // ✅ ADD LOCATION HERE (ONLY ADDITION)
      const location = JSON.parse(localStorage.getItem("location"));

      const res = await axios.post(
        "http://localhost:5001/api/auth/donate",
        {
          userId: user.id,

          name: form.name,
          email: form.email,
          type,

          amount: type === "money" ? form.amount : null,
          bloodGroup: type === "blood" ? bloodGroup : null,
          item: type === "other" ? item : null,

          message: form.message,

          // ✅ NEW (for nearby system)
          latitude: location?.latitude,
          longitude: location?.longitude
        }
      );

      console.log("✅ API SUCCESS:", res.data);

      setSuccess("🎉 Donation Successful!");

      // RESET FORM
      setForm({
        name: "",
        email: "",
        amount: "",
        message: ""
      });
      setBloodGroup("");
      setItem("");

    } catch (err) {
      console.error("❌ ERROR:", err.response?.data || err.message);

      setError(
        err.response?.data?.message ||
        "Something went wrong ❌"
      );
    }
  };

  return (
    <div className="donate-container">

      <h1 className="title">Make a Donation</h1>
      <p className="subtitle">
        Choose what you want to donate and help someone in need.
      </p>

      <div className="donate-card">

        {/* LEFT */}
        <div className="donate-left">
          <h3>What would you like to donate?</h3>

          <div
            className={`option ${type === "money" ? "active" : ""}`}
            onClick={() => setType("money")}
          >
            💰 Money
          </div>

          <div
            className={`option ${type === "blood" ? "active" : ""}`}
            onClick={() => setType("blood")}
          >
            🩸 Blood
          </div>

          <div
            className={`option ${type === "other" ? "active" : ""}`}
            onClick={() => setType("other")}
          >
            🎁 Other
          </div>

          <div className="secure-box">
            🔒 100% Secure & Transparent
          </div>
        </div>

        {/* RIGHT */}
        <div className="donate-right">
          <h3>Donation Details</h3>

          {success && <div className="success-msg">{success}</div>}
          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>

            {/* NAME */}
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            {/* EMAIL */}
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            {/* MONEY */}
            {type === "money" && (
              <div className="input-group">
                <label>Amount (₹)</label>
                <input
                  type="number"
                  name="amount"
                  placeholder="Enter donation amount"
                  value={form.amount}
                  onChange={handleChange}
                />
              </div>
            )}

            {/* BLOOD */}
            {type === "blood" && (
              <div className="input-group">
                <label>Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                >
                  <option value="">Select Blood Group</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>O+</option>
                  <option>O-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                </select>
              </div>
            )}

            {/* OTHER */}
            {type === "other" && (
              <div className="input-group">
                <label>Donation Item</label>
                <input
                  type="text"
                  placeholder="Food, Clothes, etc."
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                />
              </div>
            )}

            {/* MESSAGE */}
            <div className="input-group">
              <label>Message</label>
              <textarea
                name="message"
                placeholder="Optional message..."
                value={form.message}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="donate-btn">
              ❤️ Donate Now
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}