/** 业务异常类，抛出后由全局错误处理器捕获 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code = 1,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

/** 404 未找到 */
export function notFound(message = '资源不存在'): never {
  throw new AppError(404, message)
}

/** 400 参数错误 */
export function badRequest(message = '参数错误'): never {
  throw new AppError(400, message)
}

/** 401 未授权 */
export function unauthorized(message = '请先登录'): never {
  throw new AppError(401, message)
}

/** 403 无权限 */
export function forbidden(message = '没有权限'): never {
  throw new AppError(403, message)
}
