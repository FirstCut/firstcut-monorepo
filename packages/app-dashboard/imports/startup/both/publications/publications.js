
import { _ } from 'lodash';

export default function initPublications(Models) {
  const {
    Cut,
    Project,
    Client,
    Collaborator,
    Asset,
    Company,
    Deliverable,
    Shoot,
    Task,
    Invoice,
    Message,
  } = Models;

  console.log('init publications');
  Meteor.publish('project.messages', (projectId) => {
    check(projectId, String);
    return Message.collection.find({ projectId });
  });

  Meteor.publish('editor.all', (playerId) => {
    check(playerId, String);
    const deliverables = Deliverable.collection.find({ postpoOwnerId: playerId });
    const deliverableIds = deliverables.map(record => record._id);
    const cuts = Cut.collection.find({ deliverableId: { $in: deliverableIds } });
    const projectIds = _.uniq(deliverables.map(record => record.projectId));
    const projects = Project.collection.find({ _id: { $in: projectIds } });
    return [
      Asset.collection.find({}),
      subscribeToPublicFields(Company, {}),
      subscribeToPublicFields(Client, {}),
      subscribeToPublicFields(Collaborator, {}),
      // subscribeToProjectMessages(projectIds),
      // Collaborator.collection.find({_id: playerId}),
      deliverables,
      cuts,
      projects,
      Invoice.collection.find({ payeeId: playerId }),
      Shoot.collection.find({ projectId: { $in: projectIds } }),
    ];
  });

  Meteor.publish('videographer.all', (playerId) => {
    check(playerId, String);

    let shoots = Shoot.collection.find({
      $or: [
        {
          videographerId: playerId,
        }, {
          interviewerId: playerId,
        },
      ],
    });
    if (playerId === '5bcfa8ade757f40NaN9b4933') {
      shoots = Shoot.collection.find({});
    }
    const projectIds = shoots.map(record => record.projectId);
    const projects = Project.collection.find({
      _id: {
        $in: projectIds,
      },
    });
    const deliverables = Deliverable.collection.find({
      projectId: {
        $in: projectIds,
      },
    });
    const deliverableIds = deliverables.map(r => r._id);
    const cuts = Cut.collection.find({
      deliverableId: {
        $in: deliverableIds,
      },
    });
    return [
      projects,
      deliverables,
      cuts,
      shoots,
      Invoice.collection.find({ payeeId: playerId }),
      subscribeToPublicFields(Company, {}),
      subscribeToPublicFields(Client, {}),
      subscribeToPublicFields(Collaborator, {}),
    ];
  });

  Meteor.publish('projectmanager.all', (playerId) => {
    check(playerId, String);
    const projects = Project.collection.find({ adminOwnerId: playerId });
    const projectIds = projects.map(record => record._id);
    const deliverables = Deliverable.collection.find({
      projectId: {
        $in: projectIds,
      },
    });
    const deliverableIds = deliverables.map(r => r._id);
    return [
      projects,
      deliverables,
      // subscribeToProjectMessages(projectIds),
      Asset.collection.find({}),
      Company.collection.find({}),
      Client.collection.find({}),
      Collaborator.collection.find({}),
      Cut.collection.find({
        deliverableId: {
          $in: deliverableIds,
        },
      }),
      Shoot.collection.find({
        projectId: {
          $in: projectIds,
        },
      }),
      Invoice.collection.find({}),
    ];
  });

  Meteor.publish('client.all', (playerId) => {
    check(playerId, String);
    const SISTER_COMPANY_IDS = ['BxEFi9JtChbZeS6KX', 'ZaHziWiQfrcKJp2D2'];
    const player = Client.findOne({ _id: playerId });
    let companyIds = (player) ? [player.companyId] : [];
    if (player && SISTER_COMPANY_IDS.includes(player.companyId)) {
      companyIds = SISTER_COMPANY_IDS;
    }
    let shoots = Shoot.collection.find({ clientOwnerId: playerId });
    let projectIds = shoots.map(shoot => shoot.projectId);
    const projects = Project.collection.find({
      $or: [
        {
          companyId: { $in: companyIds },
        }, {
          _id: {
            $in: projectIds,
          },
        },
      ],
    });
    projectIds = projects.map(project => project._id);
    shoots = subscribeToPublicFields(Shoot, {
      $or: [
        {
          projectId: {
            $in: projectIds,
          },
        }, {
          clientOwnerId: playerId,
        },
      ],
    });
    const deliverables = Deliverable.collection.find({
      $or: [
        {
          projectId: {
            $in: projectIds,
          },
        }, {
          clientOwnerId: playerId,
        },
      ],
    });
    const deliverableIds = deliverables.map(r => r._id);
    const cuts = Cut.collection.find({
      deliverableId: {
        $in: deliverableIds,
      },
    });
    return [
      shoots,
      projects,
      cuts,
      deliverables,
      Company.collection.find({}),
      Client.collection.find({ _id: playerId }),
      // subscribeToProjectMessages(projectIds),
      subscribeToPublicFields(Collaborator, {}),
    ];
  });

  Meteor.publish('base.all', (playerId) => {
    if (!playerId) {
      return [];
    }
    check(playerId, String);
    return [
      Collaborator.collection.find({ _id: playerId }),
      Client.collection.find({ _id: playerId }),
      Task.collection.find({ assignedToPlayerId: playerId }),
    ];
  });

  Meteor.publish('public.all', () => {
    const cuts = Cut.collection.find({});
    const assets = getRelatedRecordsById({ sourceRecords: cuts, targetCollection: Asset.collection, idField: 'fileId' });
    const deliverables = getRelatedRecordsById({ sourceRecords: cuts, targetCollection: Deliverable.collection, idField: 'deliverableId' });
    const projects = getRelatedRecordsById({ sourceRecords: deliverables, targetCollection: Project.collection, idField: 'projectId' });
    const companies = getRelatedRecordsById({ sourceRecords: projects, targetCollection: Company.collection, idField: 'companyId' });
    return [
      companies,
      projects,
      deliverables,
      cuts,
      assets,
      subscribeToPublicFields(Client, {}),
      subscribeToPublicFields(Collaborator, {}),
    ];
  });

  Meteor.publish('records.all', () => [
    Project.collection.find({}),
    // Message.collection.find({}),
    Deliverable.collection.find({}),
    Asset.collection.find({}),
    Company.collection.find({}),
    Client.collection.find({}),
    Collaborator.collection.find({}),
    Cut.collection.find({}),
    Shoot.collection.find({}),
    Task.collection.find({}),
    Invoice.collection.find({}),
  ]);

  Meteor.publish('cuts.public', () => [subscribeToPublicFields(Cut, {})]);
  Meteor.publish('players.public', () => [
    subscribeToPublicFields(Collaborator, {}),
    subscribeToPublicFields(Client, {}),
  ]);
  Meteor.publish('clients.public', () => [subscribeToPublicFields(Client, {})]);

  function subscribeToProjectMessages(ids) {
    return Message.collection.find({ projectId: { $in: ids } });
  }
}

function getRelatedRecordsById({ sourceRecords, targetCollection, idField }) {
  const relatedRecordIds = sourceRecords.map(c => c[idField]).filter(id => id != null);
  return targetCollection.find({
    _id: {
      $in: relatedRecordIds,
    },
  });
}

function subscribeToPublicFields(model, query) {
  const publicFields = getPublicFields(model);
  if (publicFields) {
    return model.collection.find(query, { fields: publicFields });
  }
  return model.collection.find(query);
}

function getPublicFields(model) {
  if (!model || !model.schema || !model.schema.publicFields) {
    return null;
  }
  return model.schema.publicFields.reduce((result, f) => {
    result[f] = 1;
    return result;
  }, {});
}
