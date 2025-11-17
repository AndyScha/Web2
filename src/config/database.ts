import mongoose from "mongoose";

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      "mongodb://localhost:27017/studierendenbewerberportal";

    await mongoose.connect(mongoUri);

    console.log("✅ MongoDB erfolgreich verbunden");

    // Handle connection events
    mongoose.connection.on("error", (error) => {
      console.error("❌ MongoDB Verbindungsfehler:", error);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB Verbindung getrennt");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("🔌 MongoDB Verbindung geschlossen");
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Fehler beim Verbinden mit MongoDB:", error);
    throw error;
  }
};




