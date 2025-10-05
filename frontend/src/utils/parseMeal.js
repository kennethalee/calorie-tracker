export function parseMeal(text) {
  const t = text.trim().toLowerCase();
  if (t.includes("big mac"))
    return { name: "Big Mac", calories: 550, protein: 25, fat: 30, carbs: 45 };
  if (t.includes("2 eggs") || t.includes("two eggs"))
    return { name: "Eggs (2)", calories: 140, protein: 12, fat: 10, carbs: 1 };
  return { name: text.trim(), calories: 0, protein: 0, fat: 0, carbs: 0 }; // manual placeholder
}
