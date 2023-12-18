import type { AdManagerEventErrorPayload } from './types/events';

export const createErrorFromErrorData = (
  errorData: AdManagerEventErrorPayload
) => {
  const { message, ...extraErrorInfo } = errorData || {};
  const error = new Error(message);
  extraErrorInfo.framesToPop = 1;
  return Object.assign(error, extraErrorInfo);
};
