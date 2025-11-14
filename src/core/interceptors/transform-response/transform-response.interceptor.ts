import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface PaginatedResponse<T = unknown> {
  data: T;
  meta?: Record<string, unknown>;
}

interface StandardResponse<T = unknown> {
  data: T;
}

@Injectable()
export class TransformResponseinterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<StandardResponse<unknown> | PaginatedResponse<unknown>> {
    return next.handle().pipe(
      map(
        (
          response: unknown,
        ): StandardResponse<unknown> | PaginatedResponse<unknown> => {
          if (!response) {
            return {
              data: [],
            };
          }

          if (
            typeof response === 'object' &&
            response !== null &&
            'data' in response &&
            'meta' in response
          ) {
            const typedResponse = response as PaginatedResponse;
            return {
              data: typedResponse.data,
              meta: typedResponse.meta,
            };
          }

          return { data: response };
        },
      ),
    );
  }
}
