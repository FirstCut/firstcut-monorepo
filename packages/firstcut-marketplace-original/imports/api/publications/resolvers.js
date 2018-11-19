
import { _ } from 'lodash';
import creators from './creators';
import projects from './projects';

const resolvers = {
  Query: {
    creators: () => creators,
    projects: () => projects,
    project: (obj, args, context, info) => getProject({ _id: args._id }),
    creatorOfProject: (obj, args, context, info) => {
      const { projectId } = args;
      const project = getProject({ _id: projectId });
      return getCreator({ _id: project.creatorId });
    },
  },
};

function getProject(query) {
  return _.find(projects, query);
}

function getCreator(query) {
  return _.find(creators, query);
}

export default resolvers;
