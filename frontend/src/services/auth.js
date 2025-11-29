const authService = {
  login(token, user) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  isAuthenticated() {
    const token = localStorage.getItem("token");
    return !!token;
  },

  getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
};

export default authService;
