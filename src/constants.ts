export const CODE_VERIFIER_KEY = 'virtual-office-code-verifier';

export const TOKEN_INFO_KEY = 'virtual-office-token-info';

export const REDIRECT_URI = window.location.origin + window.location.pathname;

const urlSearchParams = new URLSearchParams(
  new URL(window.location.href).search
);
export const CODE = urlSearchParams.get('code');
