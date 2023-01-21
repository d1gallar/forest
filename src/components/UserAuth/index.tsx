import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import API_AUTH from "../../api/auth";
import API_USER from "../../api/user";
import { IUser, IUserLoad } from "../../models/user";
import { invalidTokenError } from "../../util/errors";
import HTTPRequestError from "../../util/httpError";
import { IFormError } from "../../util/mongooseValidator";

const UserAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const [token, setToken] = useState(null as string | null);
  const [userId, setUserId] = useState(null as string | null);
  const [user, setUser] = useState(null as IUserLoad);
  const [error, setError] = useState(
    null as HTTPRequestError | Error | IFormError | null
  );

  useEffect(() => {
    const fetchToken = () => {
      const token = API_AUTH.getAccessToken();
      if (!token) {
        setError(invalidTokenError.errors);
        setToken(null);
      }
      return token;
    };

    const fetchUserId = async () => {
      const userId = await API_AUTH.getUserId();
      return userId;
    };

    const fetchUser = async (userId: string) => {
      const user = await API_USER.getUserById(userId);
      return user;
    };

    const token = fetchToken();
    setToken(token);

    token &&
      fetchUserId()
        .then((response) => {
          if (typeof response !== "string") throw response;
          const userId = response as string;
          setUserId(userId);
        })
        .catch((err) => {
          if (err instanceof HTTPRequestError) {
            const httpError = err as HTTPRequestError;
            setError(httpError);
          }
          setError(err);
        });

    token &&
      userId &&
      fetchUser(userId)
        .then((response) => {
          // console.log("user", response);
          if (response instanceof HTTPRequestError) throw response;
          const user = response as IUser;
          setUser(user);
        })
        .catch((err) => {
          if (err instanceof HTTPRequestError) {
            const httpError = err as HTTPRequestError;
            setError(httpError);
          }
          setError(err);
        });
    // console.log({ token, userId, user });
  }, []);

  if (error) console.log(error);
  else if (user) {
    console.log({ token, userId, user });
  }
  const location = useLocation();
  return error ? (
    <Navigate to={"/login"} state={{ from: location }} replace />
  ) : (
    children
  );
};

export default UserAuth;
