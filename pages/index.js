import { useState, useContext } from "react";
import UserContext from "lib/UserContext";
import { supabase } from "lib/Store";
import toast, { Toaster } from "react-hot-toast";

const Home = () => {
  const { signIn } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (type, username, password) => {
    let loadingToast = toast.loading("Logging in...");
    try {
      const {
        body: { user },
      } =
        type === "LOGIN"
          ? await supabase.auth.login(username, password)
          : await supabase.auth.signup(username, password);
      // If the user doesn't exist here and an error hasn't been raised yet,
      // that must mean that a confirmation email has been sent.
      if (!user)
        alert("Signup successful, confirmation mail should be sent soon!");
      if (!!user) signIn(user.id, user.email);
    } catch (error) {
      const errorObj = JSON.parse((error + "").replace("Error: ", ""));
      console.log("error", errorObj);
      let errorResult = errorObj?.error_description || errorObj?.msg;

      toast.error(errorResult, {
        id: loadingToast,
      });
    }
  };

  return (
    <>
      <div className="w-full h-full flex justify-center items-center p-4 bg-light-100">
        <div className="w-full sm:w-1/2 xl:w-1/3">
          <div className="font-semibold text-2xl mb-6 text-center">
            Sign in to SonWan Chat
          </div>
          <div className="border-teal p-8 border-t-12 bg-white mb-6 rounded-xl bg-white">
            <div className="mb-4">
              <label className="font-semibold text-sm text-grey-darker block mb-2">
                Email
              </label>
              <input
                type="text"
                className="block text-sm appearance-none w-full bg-white border border-grey-light hover:border-grey p-4 rounded-xl shadow"
                placeholder=""
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="font-semibold text-sm text-grey-darker block mb-2">
                Password
              </label>
              <input
                type="password"
                className="block text-sm appearance-none w-full bg-white border border-grey-light hover:border-grey p-4 rounded-xl shadow"
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <a
              onClick={(e) => {
                e.preventDefault();
                handleLogin("LOGIN", username, password);
              }}
              href={"/channels"}
              className="flex items-center justify-center text-sm bg-purple hover:bg-teal text-white p-4 rounded-xl transition duration-150 hover:bg-indigo-600 hover:text-white text-center"
            >
              Sign in
            </a>
          </div>
          <div className="border-teal p-8 border-t-12 bg-white mb-6 rounded-xl bg-white">
            New to SonWan Chat? &nbsp;
            <a
              onClick={(e) => {
                e.preventDefault();
                handleLogin("SIGNUP", username, password);
              }}
              href={"/channels"}
              className="text-sm text-purple font-bold"
            >
              Sign up
            </a>
          </div>
        </div>
        <Toaster />
      </div>
    </>
  );
};

export default Home;
