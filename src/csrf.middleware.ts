import { Injectable, NestMiddleware } from '@nestjs/common';
import * as csurf from 'csurf';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  private csrfProtection = csurf({ cookie: true });

  use(req: any, res: any, next: () => void) {
    // Retrieve the CSRF token
    // const csrfToken = req.csrfToken();

    // // // Attach the CSRF token to the response headers or body, as needed
    // res.setHeader('X-CSRF-Token', csrfToken);
    // console.log(this.csrfProtection(req, res, next))
    return this.csrfProtection(req, res, next);
  }
}
