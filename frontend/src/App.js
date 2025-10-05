import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./firebase";
import SignIn from "./components/SignIn";
import Header from "./components/Header";
import TodayMeals from "./components/TodayMeals";

<SignIn />;

<Header />;

<TodayMeals />;

export default function App() {
  const [user, setUser] = useState(null);
  useEffect(() => onAuthStateChanged(auth, setUser), []);
  if (!user) return <SignIn />;
  return (
    <>
      <Header user={user} />
      <TodayMeals user={user} />
    </>
  );
}
