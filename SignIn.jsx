import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../stylesheet/SignIn.css";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import { useEffect } from "react";
import { fetchreq, uploadImageAws, jwtauth } from "../Helper/fetch";
import { MyContext } from "../App";
import GoogleIcon from "@mui/icons-material/Google";
import { auth, provider } from "../firebase";
import { FacebookAuthProvider, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const SignIn = () => {
  const { user, setUser, setIsLogin, setWh, setWd } = useContext(MyContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signin, setSignin] = useState("Sign In");
  const [isfp, setIsfp] = useState(false);
  const [fpp, setFpp] = useState(false);
  const nav = useNavigate();
  const [check, setCheck] = useState(false);
  const handlesubmit = async (e) => {
    e.preventDefault();
    if (signin == "Just A Sec...") {
      return;
    }
    setSignin("Just A Sec...");
    const out = await fetchreq("POST", "loginUser", { email, password });
    if (out) {
      window.localStorage.setItem("token", JSON.stringify(out.token));
      setIsLogin(true);
      const users = out.user;
      setUser(users);
      if (users.Status == 0) {
        nav("/plan");
      } else {
        nav("/dashboard");
      }
    } else {
      alert("Invalid Credentials...");
    }
    setSignin("Sign In");
  };
  const forgotpass = async (e) => {
    e.preventDefault();
    setFpp(true);
    const dt = await fetchreq("GET", `forgotPass/${email}`, {});
    if (dt) {
      if (dt.msg == "ok") {
        alert(" Password Is Sended To your Mail...");
        setIsfp(false);
      } else {
        alert("No User Exists");
      }
    } else {
      alert("Server Error...");
    }
    setFpp(false);
  };
  useEffect(() => {
    window.localStorage.clear();
    setUser(null);
    setIsLogin(false);
    setWh(null);
    setWd(null);
  }, []);
  return (
    <div id="mcd">
      <section id="SpSignIn">
        
        <div className="left ">
          <div className="data">
              <h2>YourIndianShop</h2>
            {!isfp ? (
              <div>
                <h1 >Sign In</h1>
                
                <form className="form-s" onSubmit={handlesubmit}>
                  <h3>Email</h3>
                  <input
                    required
                    maxLength={50}
                    minLength={4}
                    type="email"
                    placeholder="abcd123@xyz.com"
                    value={email}
                    onChange={(d) => {
                      setEmail(d.target.value);
                    }}
                  />
                  <h3>Password</h3>
                  <input
                    required
                    maxLength={30}
                    minLength={4}
                    type={check ? "text" : "password"}
                    placeholder="Enter Password"
                    value={password}
                    onChange={(d) => {
                      setPassword(d.target.value);
                    }}
                  />
                  {password.length >= 4 && (
                    <div
                      style={{
                        display: "flex",
                        textAlign: "left"
                      }}
                    >
                      <div>  
                      <input
                        type="checkbox"
                        checked={check}
                        onClick={() => {
                          setCheck(!check);
                        }}
                        style={{ width: "20px" }}
                      />
                      </div>
                      <div>
                      <span>Show Password</span>
                      </div>
                    </div>
                  )}
                  <button type="submit" className="btn-signin">
                    {signin}
                  </button>

                  <center>
                    <div id="other-s-in">
                      <GoogleIcon />
                      <button onClick={async () => {
                       await signInWithPopup(auth, provider)
                        .then((result) => {
                          const credential = GoogleAuthProvider.credentialFromResult(result);
                          const token = credential.accessToken;
                          const user = result.user;
                          const name= user.displayName;
                          const email = user.email;
                          const profileUrl= user.profileUrl;
                          const emailAuth= user.emailVerified;
                          console.log(name);
                          console.log(email);
                          console.log(emailAuth)
                        }).catch((error) => {
                          const errorCode = error.code;
                          const errorMessage = error.message;
                          const email = error.customData.email;
                          const credential = GoogleAuthProvider.credentialFromError(error);
                          // ...
                        });
                      }}>
                      Sign up with google
                      </button>
                    </div>
                  </center>
                  {/* <center>
                    <div id="other-s-in">
                      <FacebookRoundedIcon />
                      <button onClick={() => {
                        signInWithPopup(auth, provider)
                        .then((result) => {
                          // The signed-in user info.
                          const user = result.user;
                      
                          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                          const credential = FacebookAuthProvider.credentialFromResult(result);
                          const accessToken = credential.accessToken;
                      
                          // IdP data available using getAdditionalUserInfo(result)
                          // ...
                        })
                        .catch((error) => {
                          // Handle Errors here.
                          const errorCode = error.code;
                          const errorMessage = error.message;
                          // The email of the user's account used.
                          const email = error.customData.email;
                          // The AuthCredential type that was used.
                          const credential = FacebookAuthProvider.credentialFromError(error);
                      
                          // ...
                        });
                      }}>
                      Sign up with facebook
                      </button>
                    </div>
                  </center> */}
                </form>
                <div className="last-p">
                <p className="last-p">
                  Don't remember your password?
                  <Link
                    onClick={() => {
                      setIsfp(true);
                    }}
                    className="gray"
                  >
                    Forget Password
                  </Link>
                </p> 
                <p className="last-p">
                  Don't have an account?
                  <Link
                    to={"/signup"}
                    className="gray"
                  >
                    Create Account
                  </Link>
                </p> 
                </div>
              </div>
            ) : (
              <div>
                <h2>Forgot Password</h2>
                <form onSubmit={forgotpass}>
                  <h3>Email</h3>
                  <input
                    required
                    maxLength={50}
                    minLength={4}
                    type="email"
                    placeholder="abcd123@xyz.com"
                    value={email}
                    onChange={(d) => {
                      setEmail(d.target.value);
                    }}
                  />
                  <button disabled={fpp} type="submit" className="btn btn-blk">
                    {!fpp ? "Send Email" : "Sending Mail..."}
                  </button>
                </form>
                <br />
                <br />
                <br />
                <p>
                  <Link
                    onClick={() => {
                      setIsfp(false);
                    }}
                    className="gray"
                  >
                    Back to Login?
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="right">
        <img className="img1" src="/signup-img/indian.jpg" alt="no" >
        </img>  
        </div>
      </section>
    </div>
  );
};

export default SignIn;
