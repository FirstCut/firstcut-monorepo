"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = initPublications;

var _lodash = require("lodash");

function initPublications(Models) {
  var Cut = Models.Cut,
      Project = Models.Project,
      Client = Models.Client,
      Collaborator = Models.Collaborator,
      Asset = Models.Asset,
      Company = Models.Company,
      Deliverable = Models.Deliverable,
      Shoot = Models.Shoot,
      Task = Models.Task,
      Invoice = Models.Invoice;
  Meteor.publish('editor.all', function (playerId) {
    check(playerId, String);
    var deliverables = Deliverable.collection.find({
      postpoOwnerId: playerId
    });
    var deliverableIds = deliverables.map(function (record) {
      return record._id;
    });
    var cuts = Cut.collection.find({
      deliverableId: {
        $in: deliverableIds
      }
    });

    var projectIds = _lodash._.uniq(deliverables.map(function (record) {
      return record.projectId;
    }));

    var projects = Project.collection.find({
      _id: {
        $in: projectIds
      }
    });
    return [Asset.collection.find({}), subscribeToPublicFields(Company, {}), subscribeToPublicFields(Client, {}), subscribeToPublicFields(Collaborator, {}), // Collaborator.collection.find({_id: playerId}),
    deliverables, cuts, projects, Invoice.collection.find({
      payeeId: playerId
    }), Shoot.collection.find({
      projectId: {
        $in: projectIds
      }
    })];
  });
  Meteor.publish('videographer.all', function (playerId) {
    check(playerId, String);
    var shoots = Shoot.collection.find({
      $or: [{
        videographerId: playerId
      }, {
        interviewerId: playerId
      }]
    });
    var projectIds = shoots.map(function (record) {
      return record.projectId;
    });
    var projects = Project.collection.find({
      _id: {
        $in: projectIds
      }
    });
    var deliverables = Deliverable.collection.find({
      projectId: {
        $in: projectIds
      }
    });
    var deliverableIds = deliverables.map(function (r) {
      return r._id;
    });
    var cuts = Cut.collection.find({
      deliverableId: {
        $in: deliverableIds
      }
    });
    return [projects, deliverables, cuts, shoots, Invoice.collection.find({
      payeeId: playerId
    }), subscribeToPublicFields(Company, {}), subscribeToPublicFields(Client, {}), subscribeToPublicFields(Collaborator, {})];
  });
  Meteor.publish('projectmanager.all', function (playerId) {
    check(playerId, String);
    var projects = Project.collection.find({
      adminOwnerId: playerId
    });
    var projectIds = projects.map(function (record) {
      return record._id;
    });
    var deliverables = Deliverable.collection.find({
      projectId: {
        $in: projectIds
      }
    });
    var deliverableIds = deliverables.map(function (r) {
      return r._id;
    });
    return [projects, deliverables, Asset.collection.find({}), Company.collection.find({}), Client.collection.find({}), Collaborator.collection.find({}), Cut.collection.find({
      deliverableId: {
        $in: deliverableIds
      }
    }), Shoot.collection.find({
      projectId: {
        $in: projectIds
      }
    }), Invoice.collection.find({})];
  });
  Meteor.publish('client.all', function (playerId) {
    check(playerId, String);
    var SISTER_COMPANY_IDS = ['BxEFi9JtChbZeS6KX', 'ZaHziWiQfrcKJp2D2'];
    var player = Client.findOne({
      _id: playerId
    });
    var companyIds = player ? [player.companyId] : [];

    if (player && SISTER_COMPANY_IDS.includes(player.companyId)) {
      companyIds = SISTER_COMPANY_IDS;
    }

    var shoots = Shoot.collection.find({
      clientOwnerId: playerId
    });
    var projectIds = shoots.map(function (shoot) {
      return shoot.projectId;
    });
    var projects = Project.collection.find({
      $or: [{
        companyId: {
          $in: companyIds
        }
      }, {
        _id: {
          $in: projectIds
        }
      }]
    });
    projectIds = projects.map(function (project) {
      return project._id;
    });
    shoots = subscribeToPublicFields(Shoot, {
      $or: [{
        projectId: {
          $in: projectIds
        }
      }, {
        clientOwnerId: playerId
      }]
    });
    var deliverables = Deliverable.collection.find({
      $or: [{
        projectId: {
          $in: projectIds
        }
      }, {
        clientOwnerId: playerId
      }]
    });
    var deliverableIds = deliverables.map(function (r) {
      return r._id;
    });
    var cuts = Cut.collection.find({
      deliverableId: {
        $in: deliverableIds
      }
    });
    return [shoots, projects, cuts, deliverables, Company.collection.find({}), Client.collection.find({
      _id: playerId
    }), subscribeToPublicFields(Collaborator, {})];
  });
  Meteor.publish('base.all', function (playerId) {
    if (!playerId) {
      return [];
    }

    check(playerId, String);
    return [Collaborator.collection.find({
      _id: playerId
    }), Client.collection.find({
      _id: playerId
    }), Task.collection.find({
      assignedToPlayerId: playerId
    })];
  });
  Meteor.publish('public.all', function () {
    var cuts = Cut.collection.find({});
    var assets = getRelatedRecordsById({
      sourceRecords: cuts,
      targetCollection: Asset.collection,
      idField: 'fileId'
    });
    var deliverables = getRelatedRecordsById({
      sourceRecords: cuts,
      targetCollection: Deliverable.collection,
      idField: 'deliverableId'
    });
    var projects = getRelatedRecordsById({
      sourceRecords: deliverables,
      targetCollection: Project.collection,
      idField: 'projectId'
    });
    var companies = getRelatedRecordsById({
      sourceRecords: projects,
      targetCollection: Company.collection,
      idField: 'companyId'
    });
    return [companies, projects, deliverables, cuts, assets, subscribeToPublicFields(Client, {}), subscribeToPublicFields(Collaborator, {})];
  });
  Meteor.publish('records.all', function () {
    return [Project.collection.find({}), Deliverable.collection.find({}), Asset.collection.find({}), Company.collection.find({}), Client.collection.find({}), Collaborator.collection.find({}), Cut.collection.find({}), Shoot.collection.find({}), Task.collection.find({}), Invoice.collection.find({})];
  });
  Meteor.publish('cuts.public', function () {
    return [subscribeToPublicFields(Cut, {})];
  });
  Meteor.publish('players.public', function () {
    return [subscribeToPublicFields(Collaborator, {})];
  });
  Meteor.publish('clients.public', function () {
    return [subscribeToPublicFields(Client, {})];
  });
}

function getRelatedRecordsById(_ref) {
  var sourceRecords = _ref.sourceRecords,
      targetCollection = _ref.targetCollection,
      idField = _ref.idField;
  var relatedRecordIds = sourceRecords.map(function (c) {
    return c[idField];
  }).filter(function (id) {
    return id != null;
  });
  return targetCollection.find({
    _id: {
      $in: relatedRecordIds
    }
  });
}

function subscribeToPublicFields(model, query) {
  var publicFields = getPublicFields(model);

  if (publicFields) {
    return model.collection.find(query, {
      fields: publicFields
    });
  }

  return model.collection.find(query);
}

function getPublicFields(model) {
  if (!model || !model.schema || !model.schema.publicFields) {
    return null;
  }

  return model.schema.publicFields.reduce(function (result, f) {
    result[f] = 1;
    return result;
  }, {});
}