import React, { useState }from "react";
import TopBar from "./TopBar"
import Main from "./Main";
import '../styles/App.css';
import { TOKEN_KEY } from "../constants";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem(TOKEN_KEY)? true : false);

    const logout = () => {
        console.log("log out");
        localStorage.removeItem(TOKEN_KEY);
        setIsLoggedIn(false);
    };

    const loggedIn = (token) => {
        if (token) {
            window.localStorage.setItem(TOKEN_KEY, token);
            setIsLoggedIn(true);
        }
    };

  return (
    <div className="App">
        <TopBar
            isLoggedIn={isLoggedIn}
            handleLogout={logout}
        />
        <Main
            handleLoggedIn={loggedIn}
            isLoggedIn={isLoggedIn}
        />

    </div>
  );
}

export default App;
