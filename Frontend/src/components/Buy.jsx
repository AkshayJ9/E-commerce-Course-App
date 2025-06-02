import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { BACKEND_URL } from "../utils/utils";

const Buy = () => {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState({});
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const [cardError, setCardError] = useState("");

  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.user?._id || storedUser?._id;
  const email = storedUser?.user?.email || storedUser?.email;
  const token = storedUser?.token;

  console.log("User Info from LocalStorage:", { userId, email });

  useEffect(() => {
    const fetchByCourseData = async () => {
      if (!token) {
        setError("Please login to buy the course");
        return;
      }

      try {
        const response = await axios.post(
          `${BACKEND_URL}/course/buy/${courseId}`,
          { userId, email },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        console.log("Course response:", response.data);
        setCourse(response.data.course);
        setClientSecret(response.data.clientSecret);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error?.response?.status === 400) {
          error.response.data.errors ||
            "You have already purchased this course";
          setError("You have already purchased this course");

          navigate("/purchases");
        } else {
          toast.error(error?.response?.data?.errors || "Something went wrong");
        }
      }
    };

    fetchByCourseData();
  }, [courseId, token, userId, email, navigate]);

  const handlePurchase = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      console.log("Stripe or Elements not found");
      return;
    }
    const card = elements.getElement(CardElement);
    if (!card) {
      console.log("CardElement not found");
      return;
    }
    setLoading(true);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
      billing_details: {
        name: storedUser?.user?.firstName || "Customer",
        email,
      },
    });
    if (error) {
      console.log("Stripe payment method error", error);
      setCardError(error.message);
      setLoading(false);
      return;
    }
    console.log("[PaymentMethod Created]", paymentMethod);
    if (!clientSecret) {
      console.log("No Client Secret Found");
      setLoading(false);
      return;
    }
    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: storedUser?.user?.firstName || "Customer",
            email,
          },
        },
      });
    if (confirmError) {
      setCardError(confirmError.message);
      setLoading(false);
      return;
    }
    if (paymentIntent.status === "succeeded") {
      console.log("Payment succeeded", paymentIntent);
      const paymentInfo = {
        amount: course.price,
        email: email,
        userId: userId, // ✅ Fixed: always defined
        courseId: courseId,
        paymentId: paymentIntent.id,
        status: paymentIntent.status,
      };
      console.log("Payment Info:", paymentInfo);
      try {
        const orderResponse = await axios.post(
          `${BACKEND_URL}/order`,
          paymentInfo,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        console.log("Order response:", orderResponse.data);
        toast.success("Payment completed successfully!");
        navigate("/purchases");
      } catch (orderErr) {
        console.error("Error in order creation:", orderErr);
        toast.error("Error in order creation");
      }
    }
    setLoading(false);
  };

  return (
    <>
      {error ? (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
          <div className="bg-red-100 text-red-800 px-6 py-6 rounded-lg shadow-md max-w-md w-full text-center">
            <p className="text-lg font-semibold">{error}</p>
            <Link
              to="/purchases"
              className="mt-4 inline-flex items-center justify-center w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200"
            >
              Go to Purchases
            </Link>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-16">
          <div className="flex flex-col md:flex-row items-start justify-center gap-10 w-full max-w-6xl">
            {/* Order Details */}
            <div className="w-full md:w-1/2 bg-white p-8 rounded-lg shadow-lg">
              <h1 className="text-2xl font-bold text-gray-800 underline mb-6">
                Order Details
              </h1>
              <div className="space-y-4 text-base">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">
                    Course Name:
                  </span>
                  <span className="text-red-500 font-semibold">
                    {course.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">
                    Total Price:
                  </span>
                  <span className="text-red-500 font-semibold">
                    ${course.price}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="w-full md:w-1/2 bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Process Your Payment
              </h2>

              <form onSubmit={handlePurchase}>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Credit/Debit Card
                </label>
                <div className="border p-3 rounded-md shadow-inner mb-4">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#424770",
                          "::placeholder": {
                            color: "#aab7c4",
                          },
                        },
                        invalid: {
                          color: "#9e2146",
                        },
                      },
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!stripe || loading}
                  className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-200 font-semibold"
                >
                  {loading ? "Processing..." : "Pay"}
                </button>

                {cardError && (
                  <p className="text-red-500 font-semibold text-sm mt-3">
                    {cardError}
                  </p>
                )}
              </form>

              <button
                type="button"
                className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-4 flex items-center justify-center font-semibold"
              >
                <span className="mr-2">🅿️</span> Other Payment Methods
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Buy;
