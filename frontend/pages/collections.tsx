import { PageType } from '../src/next-types';
import { Layout, CenterH } from '../src/components/layout/layout';
import { Button, H2, FormGroup, InputGroup, Label } from '@blueprintjs/core';
import React, { useState, ChangeEvent, useCallback } from 'react';
import { useSingletons } from '../src/internal/app-context';
import { ApiResponseSync } from '../src/service/api-convention';
import { isLeft } from 'fp-ts/lib/Either';
import { createLogger } from '../src/util/debug-logger';
import { HankoUser } from '../src/api/hanko-api';
import gravatarUrl from 'gravatar-url';
import { useAuthState } from '../src/components/hooks/use-auth-state';

const logger = createLogger(__filename);

const CollectionsPageContent: React.FC = () => {
  return <div></div>;
};

const CollectionsPage: PageType = props => {
  return (
    <Layout>
      <CollectionsPageContent />
      <hr className="my-8 " />
    </Layout>
  );
};

export default CollectionsPage;
