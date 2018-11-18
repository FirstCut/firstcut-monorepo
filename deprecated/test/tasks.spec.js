
import oid from 'mdbid';
import { List } from 'immutable';
import Project from '../firstcut-projects';
import Task from '../firstcut-tasks';
import Deliverable from '../firstcut-deliverables';
import Cut from '../firstcut-cuts';
import Shoot from '../firstcut-shoots';

const projectId = 'projectId';
const shootId = 'shootId';
const deliverableId = 'deliverableId';

const cutId = 'cutId';
const cut2Id = 'cut2Id';
const otherProjectId = 'otherProjectId';

const project = Project.createNew({
  _id: projectId,
});

const otherProject = Project.createNew({
  _id: otherProjectId,
});

const deliverable = Deliverable.createNew({
  _id: deliverableId,
  projectId,
});

const shoot = new Shoot({
  _id: shootId,
  projectId,
});

const cut = new Cut({
  _id: cutId,
  deliverableId,
});

const cut2 = new Cut({
  _id: cut2Id,
  deliverableId,
});

const numProjectTasks = 1;
const numShootTasks = 4;
const numDeliverableTasks = 2;
const numCutTasks = 3;
const numCut2Tasks = 6;
const otherProjectTasks = 7;

let tasks = {
};

for (let i = 0; i < numProjectTasks; i++) {
  tasks = ensureTasksInitialized(tasks, projectId);
  tasks[projectId].push(Task.createNew({ _id: oid(), relatedRecordId: project._id, relatedRecordType: 'Project' }));
}
for (let i = 0; i < numShootTasks; i++) {
  tasks = ensureTasksInitialized(tasks, shootId);
  tasks[shootId].push(Task.createNew({ _id: oid(), relatedRecordId: shoot._id, relatedRecordType: 'Shoot' }));
}
for (let i = 0; i < numDeliverableTasks; i++) {
  tasks = ensureTasksInitialized(tasks, deliverableId);
  tasks[deliverableId].push(Task.createNew({ _id: oid(), relatedRecordId: deliverable._id, relatedRecordType: 'Deliverable' }));
}
for (let i = 0; i < numCutTasks; i++) {
  tasks = ensureTasksInitialized(tasks, cutId);
  tasks[cutId].push(Task.createNew({ _id: oid(), relatedRecordId: cut._id, relatedRecordType: 'Cut' }));
}
for (let i = 0; i < numCut2Tasks; i++) {
  tasks = ensureTasksInitialized(tasks, cut2Id);
  tasks[cut2Id].push(Task.createNew({ _id: oid(), relatedRecordId: cut2._id, relatedRecordType: 'Cut' }));
}
for (let i = 0; i < otherProjectTasks; i++) {
  tasks = ensureTasksInitialized(tasks, otherProjectId);
  tasks[otherProjectId].push(Task.createNew({ _id: oid(), relatedRecordId: otherProject._id, relatedRecordType: 'Project' }));
}

function ensureTasksInitialized(tasks, id) {
  if (!tasks[id]) {
    tasks[id] = [];
  }
  return tasks;
}

const mockedModels = {
  Deliverable: {
    find: jest.fn(({ projectId }) => {
      if (projectId === otherProjectId) {
        return new List([]);
      }
      return new List([deliverable]);
    }),
  },
  Shoot: {
    find: jest.fn(({ projectId }) => {
      if (projectId === otherProjectId) {
        return new List([]);
      }
      return new List([shoot]);
    }),
  },
  Cut: {
    find: jest.fn(({ projectId }) => {
      if (projectId === otherProjectId) {
        return new List([]);
      }
      return new List([cut, cut2]);
    }),
  },
  Task: {
    find: jest.fn(({ relatedRecordId }) => new List(tasks[relatedRecordId])),
  },
};

Project.models = mockedModels;
Cut.models = mockedModels;
Task.models = mockedModels;
Shoot.models = mockedModels;
Deliverable.models = mockedModels;


describe('tasks', () => {
  test('should know all its related tasks', () => {
    expect(project.getRelatedTasks({}).size).toBe(numProjectTasks);
    expect(shoot.getRelatedTasks({}).size).toBe(numShootTasks);
    expect(cut.getRelatedTasks({}).size).toBe(numCutTasks);
    expect(cut2.getRelatedTasks({}).size).toBe(numCut2Tasks);
    expect(deliverable.getRelatedTasks({}).size).toBe(numDeliverableTasks);
    expect(otherProject.getRelatedTasks({}).size).toBe(otherProjectTasks);
  });

  test('should know all its childrens related tasks', () => {
    const totalTasks = numProjectTasks + numShootTasks + numCutTasks + numDeliverableTasks + numCut2Tasks;
    expect(project.getCompleteRecordAndChildrenTasks({}).size).toBe(totalTasks);
  });
});
