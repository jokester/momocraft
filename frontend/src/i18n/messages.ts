import { ApiError } from '../services/api/api-convention';
import { i18n } from 'i18next';

export const Messages = {
  apiError: (i18n: i18n, e: ApiError) => i18n.t('error.otherError'),
} as const;
