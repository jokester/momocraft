import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { DiscordOAuth } from '../user/oauth-client.provider';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { TypeORMConnection } from '../db/typeorm-connection.provider';
import { TestDeps } from './test-deps';
import { EntropyService } from '../deps/entropy.service';

export function buildTesteeAppBundle() {
  const bundle = {
    app: null! as INestApplication,
    jwtService: TestDeps.mockedJwtService,
    createdUserShortId: '',
    userService: null! as UserService,
    discordOAuthClient: {} as DiscordOAuth.Client,
  };

  async function beforeAll() {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TypeORMConnection)
      .useValue(TestDeps.testConnection)
      .overrideProvider(JwtService)
      .useValue(TestDeps.mockedJwtService)
      .overrideProvider(EntropyService)
      .useValue(TestDeps.mockedEntropy)
      // .overrideProvider(DiscordOAuth.Provider)
      // .useValue(bundle.discordOAuthClient)
      .compile();

    const app = (bundle.app = moduleFixture.createNestApplication());
    await app.init();

    bundle.jwtService = await moduleFixture.resolve(JwtService);
    bundle.userService = await moduleFixture.resolve(UserService);
    bundle.discordOAuthClient = await /* moduleFixture.resolve() fails, no idea why  */ app.get(DiscordOAuth.DiToken);

    let nanoIdSeq = 0;

    jest.spyOn(TestDeps.mockedEntropy, 'createUserStringId').mockImplementation(() => `nanoid-${++nanoIdSeq}`);
  }

  async function afterAll() {
    await bundle.app.close();
  }

  return {
    testBundle: bundle,
    bundledBeforeAll: beforeAll,
    bundledAfterAll: afterAll,

    get createdShortId() {
      return bundle.createdUserShortId;
    },
  } as const;
}
