import { useEffect } from 'react';
import { OAuthProvider } from '../../const-shared/oauth-conf';
import { fold } from 'fp-ts/lib/Either';
import { ApiResponseSync } from '../../services/api/api-convention';
import { UserProfileDto } from '../../services/api-generated/models';
import { useI18n } from 'i18next-react';
import { useMounted } from '@jokester/ts-commonutil/lib/react/hook/use-mounted';
import { useSingletons } from '../../internal/app-context';
import { useRouter } from 'next/router';
import { TypedRoutes } from '../../typed-routes';
import { createLogger } from '../../util/debug-logger';

const logger = createLogger(__filename);

export function useOAuthCodeCallback(provider: OAuthProvider, code?: string) {
  const i18n = useI18n();
  const router = useRouter();
  const mounted = useMounted();
  const { auth, toastHelper, toast } = useSingletons();

  const onAuthResult = (authResult: ApiResponseSync<UserProfileDto>) => {
    fold(toastHelper.handleApiError, (r: UserProfileDto) => {
      toast({ status: 'success', title: i18n.t('auth.Success') });
    })(authResult);
    if (mounted.current) router.replace(TypedRoutes.account);
  };

  useEffect(() => {
    if (typeof code === 'string' && provider === OAuthProvider.discord) {
      logger('signing in with discord oauth', code);
      auth.discordOAuthSignIn({ code, redirectUrl: location.origin + location.pathname }).then(onAuthResult);
    } else if (typeof code === 'string' && provider === OAuthProvider.google) {
      logger('signing in with google oauth', code);
      auth.googleOAuthSignIn({ code, redirectUrl: location.origin + location.pathname }).then(onAuthResult);
    } /* no matched discord */ else {
      router.replace(TypedRoutes.account);
    }
  }, []);
}
