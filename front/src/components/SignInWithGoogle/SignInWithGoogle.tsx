/*
| Developed by Fluid
| Filename : SignInWithGoogle.tsx
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import axios from 'axios';
import { type Component } from 'solid-js';

import { backendHost } from '../../constants.json';

/*
|--------------------------------------------------------------------------
| SIGN-IN WITH GOOGLE BUTTON
|--------------------------------------------------------------------------
*/

// Add handleCredentialResponse to window
// --------------------------------------------------------------------------
declare global {
  interface Window {
    handleCredentialResponse: (response: {
      credential: string;
      select_by: string;
    }) => Promise<void>;
  }
}

// Sign In with Google Component
// --------------------------------------------------------------------------
export const SignInWithGoogle: Component = () => {
  // Handle Google Sign In Response
  // --------------------------------------------------------------------------
  async function handleCredentialResponse(response: {
    credential: string;
    select_by: string;
  }): Promise<void> {
    try {
      const res = await axios.post(backendHost + "/auth/google-sign-in", response, { withCredentials: true });
      window.location.href = res.data.redirectUrl;
    } catch (err: unknown) {
      console.error(err);
    }
  }

  // Assign handleCredentialResponse to window
  // --------------------------------------------------------------------------
  window.handleCredentialResponse = handleCredentialResponse;

  // Component
  // --------------------------------------------------------------------------
  return (
    <div>
      <div
        id="g_id_onload"
        data-client_id="205349973317-s5h03qvn3hlnjhoe52nu66aso811nlml.apps.googleusercontent.com"
        data-context="use"
        data-ux_mode="popup"
        data-callback="handleCredentialResponse"
        data-state_cookie_domain="fluidsync.app"
        data-itp_support="true"
      />

      <div
        class="g_id_signin"
        data-type="standard"
        data-shape="rectangular"
        data-theme="outline"
        data-text="continue_with"
        data-size="large"
        data-logo_alignment="left"
      />
    </div>
  );
};
