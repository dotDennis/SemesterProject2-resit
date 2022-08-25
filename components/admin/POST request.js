let usernameInput = username.element;
let passwordInput = password.element;

fetch("http://example.com/wp-json/jwt-auth/v1/token", {
  method: "POST",
  body: JSON.stringify({
    // Username of a user on the WordPress website in which the REST API request
    // is being made to.
    username: usernameInput,
    // And the above user's password.
    password: passwordInput,
  }),
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((res) => res.json())
  .then((res) => console.log(res.token));
