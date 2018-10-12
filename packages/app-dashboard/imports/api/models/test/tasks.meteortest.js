
import Models from '/imports/api/models';
import StubCollections from 'meteor/hwillson:stub-collections';
import oid from 'mdbid';
import { _ } from 'lodash';

class TestPersister {
  save(record) {
    record.constructor.collection.insert(record.toJS());
  }
}

const projectId = 'projectId';
const shootId = 'shootId';
const deliverableId = 'deliverableId';
const cutId = 'cutId';
const cut2Id = 'cut2Id';
const otherProjectId = 'otherProjectId';

_.forEach(Models.allModels, m => m.persister = new TestPersister({}));

const project = new Models.Project({
  _id: projectId,
});

const otherProject = new Models.Project({
  _id: otherProjectId,
});

const projectDeliverables = [
  new Models.Deliverable({
    _id: deliverableId,
    projectId,
  }),
];

const projectShoots = [
  new Models.Shoot({
    _id: shootId,
    projectId,
  }),
];

const projectCuts = [
  new Models.Cut({
    _id: cutId,
    deliverableId,
  }),
  new Models.Cut({
    _id: cut2Id,
    deliverableId,
  }),
];

const numProjectTasks = 1;
const numShootTasks = 4;
const numDeliverableTasks = 2;
const numCutTasks = 3;
const numCut2Tasks = 6;
const otherProjectTasks = 7;

describe('tasks', () => {
  after(() => {
    StubCollections.restore();
  });

  before(() => {
    const collections = Models.allModels.map(m => m.collection);
    StubCollections.add(collections);
    StubCollections.stub();
    [project, ...projectShoots, ...projectCuts, otherProject, ...projectDeliverables].forEach(obj => obj.save());
    for (let i = 0; i < numProjectTasks; i++) {
      Models.Task.createNew({ _id: oid(), relatedRecordId: project._id, relatedRecordType: 'Project' }).save();
    }
    for (let i = 0; i < numShootTasks; i++) {
      Models.Task.createNew({ _id: oid(), relatedRecordId: projectShoots[0]._id, relatedRecordType: 'Shoot' }).save();
    }
    for (let i = 0; i < numDeliverableTasks; i++) {
      Models.Task.createNew({ _id: oid(), relatedRecordId: projectDeliverables[0]._id, relatedRecordType: 'Deliverable' }).save();
    }
    for (let i = 0; i < numCutTasks; i++) {
      Models.Task.createNew({ _id: oid(), relatedRecordId: projectCuts[0]._id, relatedRecordType: 'Cut' }).save();
    }
    for (let i = 0; i < numCut2Tasks; i++) {
      Models.Task.createNew({ _id: oid(), relatedRecordId: projectCuts[1]._id, relatedRecordType: 'Cut' }).save();
    }
    for (let i = 0; i < otherProjectTasks; i++) {
      Models.Task.createNew({ _id: oid(), relatedRecordId: otherProject._id, relatedRecordType: 'Project' }).save();
    }
  });

  describe('all taskable models', () => {
    it('should know its related tasks', () => {
      expect(projectDeliverables[0].getRelatedTasks).to.be.a('function');
      expect(projectDeliverables[0].getRelatedTasks({}).size).to.equal(numDeliverableTasks);

      expect(projectCuts[0].getRelatedTasks).to.be.a('function');
      expect(projectCuts[0].getRelatedTasks({}).size).to.equal(numCutTasks);

      expect(projectShoots[0].getRelatedTasks).to.be.a('function');
      expect(projectShoots[0].getRelatedTasks({}).size).to.equal(numShootTasks);
    });
  });

  describe('project', () => {
    it('should know its deliverables', () => {
      const deliverables = project.getDeliverables();
      expect(deliverables.size).to.equal(projectDeliverables.length);
    });
    it('should know its cuts', () => {
      expect(project.getAllCuts().size).to.equal(projectCuts.length);
    });
    it('should know its shoots', () => {
      expect(project.getShoots().size).to.equal(projectShoots.length);
    });
  });

  it('should know all its related tasks', () => {
    expect(project.getRelatedTasks({}).size).to.equal(numProjectTasks);
    expect(projectShoots[0].getRelatedTasks({}).size).to.equal(numShootTasks);
    expect(projectCuts[0].getRelatedTasks({}).size).to.equal(numCutTasks);
    expect(projectCuts[1].getRelatedTasks({}).size).to.equal(numCut2Tasks);
    expect(projectDeliverables[0].getRelatedTasks({}).size).to.equal(numDeliverableTasks);
    expect(otherProject.getRelatedTasks({}).size).to.equal(otherProjectTasks);
  });

  it('should know all its related tasks', () => {
    const totalTasks = numProjectTasks + numShootTasks + numCutTasks + numDeliverableTasks + numCut2Tasks;
    expect(project.getCompleteRecordAndChildrenTasks({}).size).to.equal(totalTasks);
  });
});
