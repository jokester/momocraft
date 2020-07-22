import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { TypeORMConnection } from '../db/typeorm-connection.provider';
import { EntropyService } from '../deps/entropy.service';
import { TestDeps } from './test-deps';

interface OverrideTestDeps {
  (builder: TestingModuleBuilder): TestingModuleBuilder;
}

export function buildTestingModule(moreOverride: OverrideTestDeps = (_) => _): Promise<TestingModule> {
  const builder = Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(TypeORMConnection)
    .useValue(TestDeps.testConnection)
    .overrideProvider(EntropyService)
    .useValue(TestDeps.mockedEntropy);

  return moreOverride(builder).compile();
}
