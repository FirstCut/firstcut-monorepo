
import creators from './creators';
import projects from './projects';

const resolvers = {
  Query: {
    creators: () => creators,
    projects: () => projects,
  },
};

export default resolvers;
