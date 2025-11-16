import express from "express";
import cors from "cors";
import admin from "firebase-admin";

// ---- LOAD FIREBASE SERVICE ACCOUNT FROM ENV (Render-safe) ----
const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

// ---------- ROUTES ----------

// Create profile
app.post("/create-profile", async (req, res) => {
  try {
    const { fullName, email, phone, city, age, gender, skills, interests } =
      req.body;

    // Create new document (auto-id)
    const userRef = db.collection("users").doc();

    await userRef.set({
      fullName,
      email,
      phone,
      city,
      age,
      gender,
      skills,
      interests,
      createdAt: new Date(),
    });

    res.json({ success: true, id: userRef.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("NGO Finder Backend Running Successfully");
});

// Start server
app.listen(4000, () => {
  console.log("Backend running on port 4000");
});
