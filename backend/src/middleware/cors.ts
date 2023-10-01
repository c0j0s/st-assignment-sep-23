import cors from "cors";

// TODO: Add production site to allowed origins
const allowedOrigins = ["http://localhost:5000"];

const verifyOrigin = (origin: string | undefined, callback: any) => {
  //  when the call is made from the same origin
  if (!origin) {
    return callback(null, true);
  }
  // when the call is made from a different but authorized origin
  else if (allowedOrigins.includes(origin)) {
    return callback(null, true);
  } else {
    return callback(new Error("Not allowed by CORS"), false);
  }
};

const corsOptions = {
  origin: verifyOrigin,
  methods: ["GET", "POST", "PUT", "DELETE"]
};

export default cors(corsOptions);