/* Logging */
import log from 'npmlog';

/* Data models */
import ProjectModel from '../db/project';

/* Errors */
import NotFoundError from '../../core/errors/not_found';

/* Logging prefix */
const LOG_PREFIX = 'PROJECTS_DAO_PROJECT';

export async function getProjectById(_id) {
  log.info(LOG_PREFIX, 'get project by id:', _id);

  const project = await ProjectModel.findById(_id);
  if (!project) {
    log.error(LOG_PREFIX, 'no project found with _id:', _id);
    throw new NotFoundError(`can't get project, no project found with _id: ${_id}`);
  }

  log.verbose(LOG_PREFIX, JSON.stringify(project, undefined, 4));
  return project;
}

export async function updateProject(_id, name, description, imageUrl, link) {
  log.info(LOG_PREFIX, 'update project:', _id, name, description, imageUrl);

  let project;
  if (_id) {
    project = getProjectById(_id);
  } else {
    project = new ProjectModel();
  }

  project.name = name;
  project.description = description;
  project.imageUrl = imageUrl;
  project.link = link;

  log.verbose(LOG_PREFIX, JSON.stringify(project, undefined, 4));
  return project.save();
}

export async function addProject(name, description, imageUrl, link) {
  log.info(LOG_PREFIX, 'add project:', name, description, imageUrl);
  return updateProject(null, name, description, imageUrl, link);
}

export async function removeProject(_id) {
  log.info(LOG_PREFIX, 'delete project:', _id);

  /* If the project is not found, an exception is thrown */
  await getProjectById(_id);

  const deleted = await ProjectModel.findByIdAndDelete(_id);
  log.verbose(LOG_PREFIX, JSON.stringify(deleted, undefined, 4));
  return deleted;
}

export async function getProjectList() {
  log.info(LOG_PREFIX, 'get project list');

  const projects = await ProjectModel.find();
  log.verbose(LOG_PREFIX, JSON.stringify(projects, undefined, 4));
  return projects;
}

export async function removeAllProjects() {
  log.info(LOG_PREFIX, 'remove all projects');

  const deleted = await ProjectModel.deleteMany();
  log.verbose(LOG_PREFIX, JSON.stringify(deleted, undefined, 4));
  return deleted;
}
