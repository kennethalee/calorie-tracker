import React, { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { db } from "../firebase";
import { parseMeal } from "../utils/parseMeal";

export default function TodayMeals({ user }) {
  const [input, setInput] = useState("");
  const [meals, setMeals] = useState([]);
  const [totals, setTotals] = useState({
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  });

  const mealsRef = useMemo(
    () => collection(db, `users/${user.uid}/meals`),
    [user.uid]
  );

  useEffect(() => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const q = query(
      mealsRef,
      where("createdAt", ">=", startOfDay),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = [];
      let cal = 0,
        p = 0,
        f = 0,
        c = 0;

      snap.forEach((doc) => {
        const data = doc.data();
        list.push({ id: doc.id, ...data });

        cal += data.calories || 0;
        p += data.protein || 0;
        f += data.fat || 0;
        c += data.carbs || 0;
      });

      setMeals(list);
      setTotals({ calories: cal, protein: p, fat: f, carbs: c });
    });

    return () => unsub();
  }, [mealsRef]);

  const logMeal = async () => {
    if (!input.trim()) return;

    try {
      const parsed = parseMeal(input);
      await addDoc(mealsRef, {
        ...parsed,
        createdAt: serverTimestamp(),
        source: parsed.calories ? "stub-parser" : "manual",
      });
      setInput("");
    } catch (err) {
      console.error("Failed to log meal:", err);
    }
  };

  return (
    <div style={{ padding: 16, maxWidth: 520, margin: "0 auto" }}>
      <div style={{ marginBottom: 12 }}>
        <strong>Today’s total:</strong> {totals.calories} kcal ({totals.protein}
        P / {totals.fat}F / {totals.carbs}C)
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='e.g., "I ate a Big Mac" or "2 eggs"'
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={logMeal}>Log</button>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        {meals.map((m) => (
          <div
            key={m.id}
            style={{
              border: "1px solid #eee",
              padding: 12,
              borderRadius: 8,
            }}
          >
            <div>
              <strong>{m.name}</strong>
            </div>
            <div>
              {m.calories} kcal ({m.protein}P / {m.fat}F / {m.carbs}C)
            </div>
            <div style={{ fontSize: 12, color: "#666" }}>
              {m.source || "manual"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
