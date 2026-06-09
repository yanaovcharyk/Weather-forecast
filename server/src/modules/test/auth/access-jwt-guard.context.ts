// import { JwtService } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config';

// import { AccessJwtGuard } from '@auth/guards';
// import { AuthCookieService } from '@auth/services';

// import { createJwtMock } from '../mocks/jwt.mock';
// import { createConfigMock } from '../mocks/config.mock';
// import { createAuthCookieServiceMock } from '../mocks/auth-cookie-service.mock';
// import { createContext } from '../utils/create-context';

// export type AccessJwtGuardTestContext = {
//   guard: AccessJwtGuard;
//   jwt: ReturnType<typeof createJwtMock>;
//   config: ReturnType<typeof createConfigMock>;
//   cookieService: ReturnType<typeof createAuthCookieServiceMock>;
// };

// export async function createAccessJwtGuardContext(): Promise<AccessJwtGuardTestContext> {
//   const jwt = createJwtMock();
//   const config = createConfigMock();
//   const cookieService = createAuthCookieServiceMock();

//   const guard = await createContext(
//     AccessJwtGuard,
//     [
//       {
//         provide: JwtService,
//         useValue: jwt,
//       },
//       {
//         provide: ConfigService,
//         useValue: config,
//       },
//       {
//         provide: AuthCookieService,
//         useValue: cookieService,
//       },
//     ],
//   );

//   return {
//     guard,
//     jwt,
//     config,
//     cookieService,
//   };
// }
