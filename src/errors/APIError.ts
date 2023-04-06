class APIError extends Error {
  public message: string;
  public statusCode: number;
  constructor(message: string, code: number) {
    super(message);
    this.message = message;
    this.statusCode = code;
  }
}

export default APIError;
