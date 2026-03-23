// This is a test script to check TS optional chaining short-circuit behavior, just in case.
const a = null;
try {
  console.log(a?.b.c);
} catch (e) {
  console.log("Error:", e.message);
}
