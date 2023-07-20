/*
| Developed by Starton
| Filename : SignInWithGoogle.tsx
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { type JSXElement } from "solid-js";

/*
|--------------------------------------------------------------------------
| SIGN-IN WITH GOOGLE BUTTON
|--------------------------------------------------------------------------
*/

export const SignInWithGoogle = ():JSXElement => {
  return (
    <div>
      <div
        id="g_id_onload"
        data-client_id="205349973317-s5h03qvn3hlnjhoe52nu66aso811nlml.apps.googleusercontent.com"
        data-context="use"
        data-ux_mode="popup"
        data-login_uri="http://localhost:8000/auth/webhook/google-sign-in"
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
