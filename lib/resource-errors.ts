export class ResourceNotFoundError extends Error {
  constructor(message = "资源不存在") {
    super(message);
    this.name = "ResourceNotFoundError";
  }
}
