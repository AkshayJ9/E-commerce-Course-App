import { createRoot } from "react-dom/client";
import "./App.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const stripePromise = loadStripe(
  "pk_test_51RNt5fE4RCy8eDH8fQ9vPFrmqOuvB9QPKH3WQRRdVY4f07asRO3nHDswWrFlLt7qZjaW1CQYd2CXNLpeZrzvBRjV005PToVlmY"
);

createRoot(document.getElementById("root")).render(
  <Elements stripe={stripePromise}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Elements>
);
