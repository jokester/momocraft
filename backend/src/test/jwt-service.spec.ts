import { JwtService } from '@nestjs/jwt';
import { TestDeps } from './test-deps';

describe(JwtService, () => {
  const jwtService = TestDeps.mockedJwtService;

  const origPayload = { something: 'really something' } as const;

  it('signs payload to jwt token', async () => {
    const token = await jwtService.signAsync(origPayload);

    const verified = await jwtService.verifyAsync<typeof origPayload>(token);

    expect(verified.something).toEqual(origPayload.something);
  });

  it('refuses to verify JWT with no sign algorithm', async () => {
    const token = await jwtService.signAsync(origPayload, { algorithm: 'none' });

    const verified = jwtService.verifyAsync<typeof origPayload>(token);

    await expect(verified).rejects.toThrowError(/jwt signature is required/i);
  });

  it('throws on different key', async () => {
    const anotherJwtService = new JwtService({ secret: 'aaaasecret' });
    const token = await anotherJwtService.signAsync(origPayload);
    await expect(jwtService.verifyAsync(token)).rejects.toThrowError('invalid signature');
  });

  it('throws on malformed jwt token', async () => {
    const token = 'ajfal;sdf';
    expect(() => jwtService.verify(token)).toThrowError('jwt malformed');
  });

  it('throws on expired token', async () => {
    const token = await jwtService.signAsync(origPayload, { expiresIn: '7 days' });
    await expect(
      jwtService.verifyAsync(token, { clockTimestamp: Date.now() / 1e3 + 7 * 24 * 3600 - 10 }),
    ).resolves.toBeTruthy();

    await expect(
      jwtService.verifyAsync(token, { clockTimestamp: Date.now() / 1e3 + 7 * 24 * 3600 + 10 }),
    ).rejects.toThrowError(/jwt expired/);
  });
});
