export class AuthenticationError extends Error {
  constructor(message = "请先登录后再继续操作") {
    super(message);
    this.name = "AuthenticationError";
  }
}
