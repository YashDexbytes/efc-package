import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { LoginCredentials, Tokens } from "./interface";
import { clearToken } from "@/redux/slices/authSlice";
import { post, del } from "@/utils/apiCalls";
import { getSubdomain } from "@/utils/isTenant";
import { removeAllCookies } from "@/utils/removeCookies";

export const login = async (
  credentials: LoginCredentials,
  headers: Record<string, string>,
): Promise<{ tokens: Tokens; userData: any }> => {
  const token = ""; // No token needed for login
  const response = await post("/api/users/login", token, credentials, headers);
  try {
    const userData: any = {
      firstName: response.data.firstName,
      lastName: response.data.lastName,
      emailId: response.data.emailId,
      userType: response.data.userType,
      permissions: response.data.permissions,
    };

    return { tokens: response.data.tokens, userData };
  } catch (error) {
    const errorMessage = JSON.parse((error as Error).message); // Parse the error message
    throw new Error(errorMessage.message || "An error occurred"); // Throw a new error with the message
  }
};

export const useLogout = () => {
  const dispatch = useDispatch();
  const logout = async () => {
    const token = Cookies.get("accessToken");
    if (token) {
      try {
        const response = await del("/api/users/logout", token, null);

        if (response && response.code === 200) {
          // Clear tokens from cookies
          const domain = window.location.hostname;
          removeAllCookies(`${domain}`);
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          localStorage.removeItem("userInfo");

          // Clear token from Redux
          dispatch(clearToken());
        } else {
          throw new Error("Logout API did not return success.");
        }
      } catch (error) {
        const errorMessage = JSON.parse((error as Error).message); 
        throw new Error(errorMessage.message || "An error occurred")
      }
    }
  };
  return logout;
};

// Define this interface if using TypeScript

export const signupUser = async (values: any, token: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tenants/customer/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-request-origin": `${getSubdomain()}`,
          "X-Recaptcha-Token": token,
        },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          emailId: values.email,
          phoneNumber: values.phoneNumber,
          password: "123456",
          username: values.phoneNumber,
          countryCode: values.countryCode || "91",
          dob: `${String(values.dob.day).padStart(2, "0")}/${String(values.dob.month).padStart(2, "0")}`,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Signup failed");
    }

    return data;
  } catch (error) {
    throw error;
  }
};
