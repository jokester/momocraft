import React, { useEffect } from 'react';
import { OAuthProvider } from '../../const-shared/oauth-conf';
import { fold } from 'fp-ts/lib/Either';
import { ApiError } from '../../api/api-convention';
import { Messages } from '../../i18n/messages';
import { UserProfileDto } from '../../api-generated/models';
import { useI18n } from 'i18next-react';
import { useMounted } from '@jokester/ts-commonutil/react/hook/use-mounted';
import { useSingletons } from '../../internal/app-context';
import { useRouter } from 'next/router';
import { TypedRoutes } from '../../typed-routes';

export function useOAuthCodeCallback(provider: OAuthProvider, code?: string) {
  const i18n = useI18n();
  const router = useRouter();
  const mounted = useMounted();
  const { auth, toaster } = useSingletons();

  useEffect(() => {
    if (typeof code === 'string' && provider === OAuthProvider.discord) {
      auth.oDiscordAuthSignIn({ code, redirectUrl: location.origin + location.pathname }).then((authResult) => {
        fold(
          (l: ApiError) => {
            toaster.current?.show({ intent: 'warning', message: Messages.apiError(i18n, l) });
          },
          (r: UserProfileDto) => {
            toaster.current?.show({ intent: 'success', message: i18n.t('auth.Success') });
          },
        )(authResult);
        if (mounted.current) router.replace(TypedRoutes.account);
      });
    } /* no matched discord */ else {
      router.replace(TypedRoutes.account);
    }
  }, []);
}
