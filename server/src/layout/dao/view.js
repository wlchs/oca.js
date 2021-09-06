/* Logging */
import log from 'npmlog';

/* Populate */
import { POPULATE_VIEW_FULL } from '../db/populators';

/* Data models */
import ViewModel from '../db/view';

/* Validate */
import validate from './validators/view_validator';

/* DAO references */
import { getTemplateByKey } from './template';

/* Utils */
import resolveSlotContentMapping from './utils/slot_content_mapping_resolver';

/* Logging prefix */
const LOG_PREFIX = 'LAYOUT_DAO_VIEW';

export async function getViewByKey(key) {
  log.info(LOG_PREFIX, 'get view by key:', key);

  const view = await ViewModel.findOne({ key });
  if (!view) {
    log.error(LOG_PREFIX, 'no view found with key:', key);
    throw new Error(`can't get view, no view found with key: ${key}`);
  }

  return view;
}

async function getViewByKeyOrNull(key) {
  log.info(LOG_PREFIX, 'get view by key or null:', key);

  try {
    return await getViewByKey(key);
  } catch (e) {
    log.info(LOG_PREFIX, 'view with key not found, returning with null', key);
    return null;
  }
}

export async function addOrUpdateView(key, newKey, template, content, pageTitle) {
  log.info(
    LOG_PREFIX,
    'add or update view:',
    key,
    newKey,
    template,
    JSON.stringify(content, undefined, 4),
  );

  let view;
  try {
    view = await getViewByKey(key);
  } catch (e) {
    view = new ViewModel();
    view.key = key;
  }

  if (template) {
    view.template = await getTemplateByKey(template);
  }

  if (newKey) {
    const viewWithNewKey = await getViewByKeyOrNull(newKey);

    if (viewWithNewKey) {
      log.error(LOG_PREFIX, 'view with key already exists:', newKey);
      throw new Error(`can't update view, view with key already exists: ${newKey}`);
    }

    view.key = newKey;
  }

  if (content) {
    view.content = await resolveSlotContentMapping(content);
  }

  if (pageTitle) {
    view.pageTitle = pageTitle;
  }

  validate(view);
  log.verbose(LOG_PREFIX, JSON.stringify(view, undefined, 4));
  return view.save();
}

export async function removeView(key) {
  log.info(LOG_PREFIX, 'delete view:', key);

  /* If the view is not found, an exception is thrown */
  await getViewByKey(key);

  const deleted = await ViewModel
    .findOneAndDelete({ key })
    .populate(POPULATE_VIEW_FULL);

  log.verbose(LOG_PREFIX, JSON.stringify(deleted, undefined, 4));
  return deleted;
}

export async function getViewList() {
  log.info(LOG_PREFIX, 'get view list');

  const views = await ViewModel
    .find()
    .populate(POPULATE_VIEW_FULL);

  log.verbose(LOG_PREFIX, JSON.stringify(views, undefined, 4));
  return views;
}

export async function getViewByTemplate(key) {
  log.info(LOG_PREFIX, 'get view by template:', key);

  /* If the template is not found, an exception is thrown */
  const template = await getTemplateByKey(key);

  const view = await ViewModel
    .find({ template })
    .populate(POPULATE_VIEW_FULL);

  log.verbose(LOG_PREFIX, JSON.stringify(view, undefined, 4));
  return view;
}

export async function removeViews() {
  log.info(LOG_PREFIX, 'delete views');

  const deleted = await ViewModel
    .deleteMany()
    .populate(POPULATE_VIEW_FULL);

  log.verbose(LOG_PREFIX, JSON.stringify(deleted, undefined, 4));
  return deleted;
}
