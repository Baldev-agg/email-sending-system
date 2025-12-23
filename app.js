const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// View engine
app.set("view engine", "ejs");
app.set("views", "views");

// Routes
app.get("/", (req, res) => {
  res.render("home");
});

app.post("/send-email", async (req, res) => {
  try {
    const { recipient, subject, message } = req.body;

    // Validate inputs
    if (!recipient || !subject || !message) {
      return res.status(400).send("All fields are required!");
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Mail options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipient,
      subject: subject,
      text: message
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log("Email sent successfully to:", recipient);
    console.log("Message ID:", info.messageId);
    
    res.send(`
      <h2>Email sent successfully!</h2>
      <p>Recipient: ${recipient}</p>
      <p>Subject: ${subject}</p>
      <p><a href="/">Send another email</a></p>
    `);

  } catch (error) {
    console.error("Email Error:", error.message);
    res.status(500).send(`
      <h2>Error sending email</h2>
      <p><strong>Error:</strong> ${error.message}</p>
      <p><a href="/">Try again</a></p>
    `);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

