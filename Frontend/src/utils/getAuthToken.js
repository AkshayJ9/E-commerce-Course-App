// export const getAuthToken = () => {
//   try {
//     const userData = localStorage.getItem("user");
//     if (!userData) return null;

//     const parsed = JSON.parse(userData);

//     if (parsed && typeof parsed === "object" && parsed.token) {
//       return parsed.token;
//     } else {
//       return null;
//     }
//   } catch (error) {
//     console.error("Invalid user token in localStorage:", error);
//     return null;
//   }
// };
