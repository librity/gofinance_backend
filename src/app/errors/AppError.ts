class AppError {
  public readonly httpCode: number;

  public readonly internalCode: string;

  public readonly description: string;

  constructor(httpCode = 400, internalCode: string, description: string) {
    this.httpCode = httpCode;
    this.internalCode = internalCode;
    this.description = description;
  }
}

export default AppError;
