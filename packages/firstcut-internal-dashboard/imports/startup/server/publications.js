
import {SchemaParser} from 'firstcut-schema-builder';

function enableBasePublications(cls) {
  if( Meteor.isServer ){
    let name = cls.collection_name + '.all';
    Meteor.publish(name, function() {
      return cls.collection.find({});
    });
  }
}

export function initPublications(Models) {
  Models.allModels.forEach(m => enableBasePublications(m));

  const {
    Cut,
    Project,
    Client,
    Collaborator,
    Assets,
    Company,
    Deliverable,
    Shoot,
    Invoice
  } = Models;

  Meteor.publish('editor.all', function(playerId) {
    check(playerId, String);
    let deliverables = getRelatedRecords({
      model: Deliverable,
      related_models: [
        Client, Collaborator
      ],
      condition: playerId
    });
    const deliverable_ids = deliverables.map(record => record._id);
    let cuts = getRelatedRecords({
      model: Cut,
      related_models: [Deliverable],
      condition: {
        $in: deliverable_ids
      }
    });
    const cut_ids = cuts.map(record => record._id);
    const project_ids = deliverables.map(record => record.projectId);
    return [
      Project.collection.find({
        _id: {
          $in: project_ids
        }
      }),
      Company.collection.find({}),
      Assets.collection.find({}),
      Invoice.collection.find({payeeId: playerId}),
      Client.collection.find({}),
      Shoot.collection.find({projectId: {$in: project_ids}}),
      subscribeToPublicFields(Collaborator, {}),
      Cut.collection.find({
        _id: {
          $in: cut_ids
        }
      }),
      Deliverable.collection.find({
        _id: {
          $in: deliverable_ids
        }
      })
    ]
  });

  Meteor.publish('videographer.all', function(playerId) {
    check(playerId, String);
    const shoots = Shoot.collection.find({
      $or: [
        {
          videographerId: playerId
        }, {
          interviewerId: playerId
        }
      ]
    });
    const project_ids = shoots.map(record => record.projectId);
    const projects = Project.collection.find({
      _id: {
        $in: project_ids
      }
    });
    const deliverables = Deliverable.collection.find({
      projectId: {
        $in: project_ids
      }
    });
    const deliverable_ids = deliverables.map(r => r._id);
    const cuts = Cut.collection.find({
      deliverableId: {
        $in: deliverable_ids
      }
    });
    return [
      projects,
      deliverables,
      cuts,
      shoots,
      Invoice.collection.find({payeeId: playerId}),
      Company.collection.find({}),
      Client.collection.find({}),
      subscribeToPublicFields(Collaborator, {})
    ]
  });

  Meteor.publish('projectmanager.all', function(playerId) {
    check(playerId, String);
    const projects = Project.collection.find({adminOwnerId: playerId});
    const project_ids = projects.map(record => record._id);
    const deliverables = Deliverable.collection.find({
      projectId: {
        $in: project_ids
      }
    });
    const deliverable_ids = deliverables.map(r => r._id);
    return [
      projects,
      deliverables,
      Assets.collection.find({}),
      Company.collection.find({}),
      Client.collection.find({}),
      Collaborator.collection.find({}),
      Cut.collection.find({
        deliverableId: {
          $in: deliverable_ids
        }
      }),
      Shoot.collection.find({
        projectId: {
          $in: project_ids
        }
      }),
      Invoice.collection.find({})
    ]
  });

  Meteor.publish('client.all', function(playerId) {
    check(playerId, String);
    let shoots = Shoot.collection.find({clientOwnerId: playerId});
    let project_ids = shoots.map(shoot => shoot.projectId);
    const projects = Project.collection.find({
      $or: [
        {
          clientOwnerId: playerId
        }, {
          _id: {
            $in: project_ids
          }
        }
      ]
    });
    project_ids = projects.map(project => project._id);
    shoots = subscribeToPublicFields(Shoot, {
      $or: [
        {
          projectId: {
            $in: project_ids
          }
        }, {
          clientOwnerId: playerId
        }
      ]
    });
    const deliverables = Deliverable.collection.find({
      $or: [
        {
          projectId: {
            $in: project_ids
          }
        }, {
          clientOwnerId: playerId
        }
      ]
    });
    const deliverable_ids = deliverables.map(r => r._id);
    const cuts = Cut.collection.find({
      deliverableId: {
        $in: deliverable_ids
      }
    });
    return [
      shoots,
      projects,
      cuts,
      deliverables,
      Company.collection.find({}),
      Client.collection.find({_id: playerId}),
      subscribeToPublicFields(Collaborator, {})
    ]
  });

  Meteor.publish('public.all', function() {
    const cuts = Cut.collection.find({});
    const assets = getRelatedRecordsById({source_records: cuts, target_collection: Assets.collection, id_field: 'fileId'});
    const deliverables = getRelatedRecordsById({source_records: cuts, target_collection: Deliverable.collection, id_field: 'deliverableId'});
    const projects = getRelatedRecordsById({source_records: deliverables, target_collection: Project.collection, id_field: 'projectId'});
    const companies = getRelatedRecordsById({source_records: projects, target_collection: Company.collection, id_field: 'companyId'});
    return [companies, projects, deliverables, cuts, assets]
  });

  Meteor.publish('records.all', function() {
    return [
      Project.collection.find({}),
      Deliverable.collection.find({}),
      Assets.collection.find({}),
      Company.collection.find({}),
      Client.collection.find({}),
      Collaborator.collection.find({}),
      Cut.collection.find({}),
      Shoot.collection.find({}),
      Invoice.collection.find({})
    ]
  });
}

function getRelatedRecordsById({source_records, target_collection, id_field}) {
  const related_record_ids = source_records.map(c => c[id_field]).filter(id => id != null);
  return target_collection.find({
    _id: {
      $in: related_record_ids
    }
  });
}

function getRelatedRecords({model, related_models, condition}) {
  const related_record_keys = model.getRelatedRecordSchemaKeys({models: related_models});
  let or = [
    {
      _id: condition
    }
  ];
  related_record_keys.forEach(key => {
    if (SchemaParser.isObjectArrayField(key)) {
      const fieldname = SchemaParser.getLeastNestedFieldName(key);
      const inner_fieldname = SchemaParser.getMostNestedFieldName(key);
      or.push({
        [fieldname]: {
          $elemMatch: {
            [inner_fieldname]: condition
          }
        }
      });
    } else {
      or.push({[key]: condition});
    }
  });
  const query = {
    $or: or
  };
  return model.collection.find(query);
}

function subscribeToPublicFields(model, query) {
  const public_fields = getPublicFields(model);
  if (public_fields) {
    return model.collection.find(query, {fields: public_fields});
  } else {
    return model.collection.find(query);
  }
}

function getPublicFields(model) {
  if (!model || !model.schema || !model.schema.public_fields) {
    return null;
  }
  return model.schema.public_fields.reduce((result, f) => {
    result[f] = 1;
    return result;
  }, {});
}
