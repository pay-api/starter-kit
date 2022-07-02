import { AxiosError, AxiosResponseHeaders } from 'axios';

/*
 * axiosErr 3xx/4xx/5xx errors look like this:
 *   {
 *     data: {
 *       code: 400,
 *       message: "Missing header",
 *       name: 'invalid_request_error',
 *       status: 400,
 *       statusCode: 400,
 *     },
 *     status: 400,
 *     statusText: 'Bad Request',
 *   }
 */

export type ErrorProps = {
  code?: string; // for axios errors, ie `ECONNABORTED` | `ENOTFOUND`
  config?: Record<string, unknown>;
  data?: Record<string, unknown>;
  headers?: AxiosResponseHeaders;
  status?: number;
  statusText?: string;
};

export class HttpError extends Error implements AxiosError {
  public readonly response?: Omit<Required<ErrorProps>, 'code'>;
  public readonly isAxiosError: boolean;
  public readonly toJSON: () => object;
  public readonly config: Record<string, unknown>;
  public readonly code: string | undefined;

  constructor(props: ErrorProps) {
    if (!props.code && !props.status && !props.statusText && !props.data)
      throw new Error(
        'HttpError props not set correctly; must set at least one property'
      );

    super(`HttpError; ${JSON.stringify(props)}`);
    Object.setPrototypeOf(this, new.target.prototype);

    this.code = props.code;
    this.isAxiosError = true;
    this.toJSON = () => ({
      // https://github.com/axios/axios/blob/e52e4dbb575fc8bd9cb7d2f5306f30ee82b40b4d/lib/core/AxiosError.js#L26
      code: this.code,
      config: this.config,
      message: this.message,
      name: this.name,
      stack: this.stack,
      status:
        this.response && this.response.status ? this.response.status : null,
    });

    this.config = {};

    this.response = !props.code
      ? {
          config: this.config,
          data: props.data || {},
          headers: {},
          status: props.status || 500,
          statusText: props.statusText || 'Error',
        }
      : undefined;
    this.name = 'HttpError';
  }
}
