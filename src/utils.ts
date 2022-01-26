import {TokenInfo} from '@rc-ex/core/lib/definitions';
import localforage from 'localforage';

import {TOKEN_INFO_KEY} from './constants';
import rc from './ringcentral';

export const checkSavedToken = async () => {
  const tokenInfo = await localforage.getItem<TokenInfo>(TOKEN_INFO_KEY);
  if (tokenInfo === null) {
    return false;
  }
  rc.token = tokenInfo;
  try {
    await rc.refresh();
    await localforage.setItem(TOKEN_INFO_KEY, rc.token);
  } catch (e) {
    return false;
  }
  return true;
};
