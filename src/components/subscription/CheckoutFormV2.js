import { useEffect, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { createCheckoutSessionV2 } from "../../@redux/action/subscription";
import { setClientSecret } from "../../@redux/features/subscription";
import { Backdrop, CircularProgress } from "@mui/material";

const stripePromise = loadStripe(process.env.VITE_stripe_pub_key);

export const CheckoutForm = () => {
  const clientSecret = useSelector((state) => state.subscription.clientSecret);
  const location = useLocation();
  const priceId = location.state.id;
  const customerHashId = useSelector(
    (state) => state.onboarding?.UserOnboardingDetails?.customerHashId
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const loading = useSelector((state) => state.common.loading);

  const createSessionRef = useRef(null);

  useEffect(() => {
    clearTimeout(createSessionRef.current);
    createSessionRef.current = setTimeout(() => {
      dispatch(createCheckoutSessionV2(priceId, setIsLoading, navigate));
    }, 500);
  }, [priceId]);

  return (
    <div
      className="d-flex flex-column justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="my-auto h-100">
        {!isLoading && !loading && clientSecret?.length > 0 && (
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ clientSecret }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        )}

        {
          <div>
            <Backdrop
              sx={{
                backgroundColor: "#FFFFFF",
                zIndex: (theme) => theme.zIndex.drawer + 1,
              }}
              open={isLoading}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          </div>
        }
      </div>
    </div>
  );
};
