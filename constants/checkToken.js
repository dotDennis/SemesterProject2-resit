export default function checkToken() {
  if (typeof window !== "undefined") {
    if (localStorage.getItem("token")) {
      return true;
    } else {
      return false;
    }
  }
}
