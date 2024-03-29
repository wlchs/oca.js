/* Logging */
import log from 'npmlog';

/* Data models */
import RedirectModel from '../db/schema/redirect';
import { getRouteByPath } from './route';

/* Errors */
import NotFoundError from '../../core/errors/not_found';
import Conflict from '../../core/errors/conflict';

/* Logging prefix */
const LOG_PREFIX = 'AUTH_DAO_REDIRECT';

export async function getRedirectByReferer(referer) {
  log.info(LOG_PREFIX, 'get redirect by referer:', referer);

  /* If the route is not found, an exception is thrown */
  const refererRoute = await getRouteByPath(referer);
  const redirect = await RedirectModel.findOne({ referer: refererRoute });

  if (!redirect) {
    log.error(LOG_PREFIX, 'no redirect found with referer:', referer);
    throw new NotFoundError(`can't get redirect, no redirect found with referer: ${referer}`);
  }

  log.verbose(LOG_PREFIX, JSON.stringify(redirect, undefined, 4));
  return redirect;
}

export async function getRedirectByRefererOrNull(referer) {
  log.info(LOG_PREFIX, 'get redirect by referer or null:', referer);

  try {
    return await getRedirectByReferer(referer);
  } catch (e) {
    log.info(LOG_PREFIX, 'redirect with referer not found, returning with null', referer);
    return null;
  }
}

export async function addRedirect(referer, redirect) {
  log.info(LOG_PREFIX, 'add redirect:', referer, redirect);

  const existingRedirect = await getRedirectByRefererOrNull(referer);
  if (existingRedirect) {
    log.error(LOG_PREFIX, 'redirect with referer already exists', referer);
    throw new Conflict(`can't create redirect, redirect with referer already exists: ${referer}`);
  }

  const redirectModel = new RedirectModel();
  redirectModel.referer = await getRouteByPath(referer);
  redirectModel.redirect = await getRouteByPath(redirect);

  log.verbose(LOG_PREFIX, JSON.stringify(redirectModel, undefined, 4));
  return redirectModel.save();
}

export async function updateRedirect(referer, newReferer, redirect) {
  log.info(LOG_PREFIX, 'update redirect:', referer, newReferer, redirect);

  /* If the redirect is not found, an exception is thrown */
  const redirectModel = await getRedirectByReferer(referer);

  if (newReferer) {
    const redirectWithNewReferer = await getRedirectByRefererOrNull(newReferer);

    if (redirectWithNewReferer) {
      log.error(LOG_PREFIX, 'redirect with referer already exists:', newReferer);
      throw new Conflict(`can't update redirect, redirect with referer already exists: ${newReferer}`);
    }

    redirectModel.referer = await getRouteByPath(newReferer);
  }

  redirectModel.redirect = await getRouteByPath(redirect);

  log.verbose(LOG_PREFIX, JSON.stringify(redirectModel, undefined, 4));
  return redirectModel.save();
}

export async function addOrUpdateRedirect(referer, redirect) {
  log.info(LOG_PREFIX, 'add or update redirect:', referer, redirect);

  try {
    return await updateRedirect(referer, undefined, redirect);
  } catch (e) {
    log.info(LOG_PREFIX, 'redirect with referer not found, creating', referer, redirect);
    return addRedirect(referer, redirect);
  }
}

export async function removeRedirect(referer) {
  log.info(LOG_PREFIX, 'delete redirect:', referer);

  /* If the referer is not found, an exception is thrown */
  await getRedirectByReferer(referer);

  const deleted = await RedirectModel.findOneAndDelete({ referer });
  log.verbose(LOG_PREFIX, JSON.stringify(deleted, undefined, 4));
  return deleted;
}

export async function getRedirectList() {
  log.info(LOG_PREFIX, 'get redirect list');

  const redirects = await RedirectModel.find();
  log.verbose(LOG_PREFIX, JSON.stringify(redirects, undefined, 4));
  return redirects;
}

export async function removeAllRedirects() {
  log.info(LOG_PREFIX, 'remove all redirects');

  const deleted = await RedirectModel.deleteMany();
  log.verbose(LOG_PREFIX, JSON.stringify(deleted, undefined, 4));
  return deleted;
}
