
import oid from 'mdbid';
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

const tasks = [];

for (let i = 0; i < numProjectTasks; i++) {
  [...tasks, Task.createNew({ _id: oid(), relatedRecordId: project._id, relatedRecordType: 'Project' })];
}
for (let i = 0; i < numShootTasks; i++) {
  [...tasks, Task.createNew({ _id: oid(), relatedRecordId: shoot._id, relatedRecordType: 'Shoot' })];
}
for (let i = 0; i < numDeliverableTasks; i++) {
  [...tasks, Task.createNew({ _id: oid(), relatedRecordId: deliverable._id, relatedRecordType: 'Deliverable' })];
}
for (let i = 0; i < numCutTasks; i++) {
  [...tasks, Task.createNew({ _id: oid(), relatedRecordId: cut._id, relatedRecordType: 'Cut' })];
}
for (let i = 0; i < numCut2Tasks; i++) {
  [...tasks, Task.createNew({ _id: oid(), relatedRecordId: cut2._id, relatedRecordType: 'Cut' })];
}
for (let i = 0; i < otherProjectTasks; i++) {
  [...tasks, Task.createNew({ _id: oid(), relatedRecordId: otherProject._id, relatedRecordType: 'Project' })];
}


describe('tasks', () => {
  test('should know all its related tasks', () => {
    expect(project.getRelatedTasks({}).size).to.equal(numProjectTasks);
    expect(shoot.getRelatedTasks({}).size).to.equal(numShootTasks);
    expect(cut.getRelatedTasks({}).size).to.equal(numCutTasks);
    expect(cut2.getRelatedTasks({}).size).to.equal(numCut2Tasks);
    expect(deliverable.getRelatedTasks({}).size).to.equal(numDeliverableTasks);
    expect(otherProject.getRelatedTasks({}).size).to.equal(otherProjectTasks);
  });

  test('should know all its childrens related tasks', () => {
    const totalTasks = numProjectTasks + numShootTasks + numCutTasks + numDeliverableTasks + numCut2Tasks;
    expect(project.getCompleteRecordAndChildrenTasks({}).size).to.equal(totalTasks);
  });
});
