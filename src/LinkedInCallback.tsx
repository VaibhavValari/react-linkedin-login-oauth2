import { useEffect, useState } from 'react';

import { parse } from './utils';

type ParamsType = {
  state: string;
  code?: string;
  error?: string;
  error_description?: string;
};

export function LinkedInCallback() {
  const [errorMessage, setErrorMessage] = useState<string>('');
  useEffect(() => {
    const checkAndPerform = async () => {
      const params = parse(window.location.search) as ParamsType;

      if (params.error) {
        const errorMessage =
          params.error_description || 'Login failed. Please try again.';

        setErrorMessage(errorMessage);

        window.opener &&
          window.opener.postMessage(
            {
              error: params.error,
              state: params.state,
              errorMessage,
              from: 'Linked In',
            },
            window.location.origin,
          );
        // Close tab if user cancelled login
        if (params.error === 'user_cancelled_login') {
          window.close();
        }
      }
      if (params.code) {
        window.opener &&
          window.opener.postMessage(
            { code: params.code, state: params.state, from: 'Linked In' },
            window.location.origin,
          );
      }
    };

    checkAndPerform();
  }, []);

  return <div>{errorMessage}</div>;
}
