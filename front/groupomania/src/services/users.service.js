import http from "../http-common";
class UsersDataService {
  signup(data) {
    return http.post("/auth/signup", data);
  }
  signin(data) {
    return http.post("/auth/login", data);
  }
}
export default new UsersDataService();