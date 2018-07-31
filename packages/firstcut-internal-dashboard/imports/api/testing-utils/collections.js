
import { Deliverable, Project, Cut, Shoot, Collaborator, Client } from 'firstcut-models';
import StubCollections from 'meteor/hwillson:stub-collections';

export const CLIENT_OWNER_ID_FOR_DELIVERABLE = 'qzsXiiMGZcy23YuvE';
export const POSTPO_OWNER_ID = 'uQ7kZnnQWXNJxrozB';
export const DELIVERABLE_ID = 'j5Jrj5pmgejFx77cz';
export const PROJECT_ID = 'FqBAGBN44irmTNfmN';

export const TEST_POSTPO_OWNER_OF_DELIVERABLE = {
  "_id": POSTPO_OWNER_ID,
  "firstName": "FirstCut",
  "lastName": "Editor",
  "type": "EDITOR",
  "email": "editor@firstcut.io",
  "isActive": true,
  "location": {
      "lat": -34.60368440000001,
      "lng": -58.381559100000004,
      "place_id": "ChIJvQz5TjvKvJURh47oiC6Bs6A",
      "name": "Buenos Aires",
      "url": "https://maps.google.com/?q=Buenos+Aires,+Argentina&ftid=0x95bcca3b4ef90cbd:0xa0b3812e88e88e87",
      "locality": "Buenos Aires",
      "administrative_area_level_1": "Buenos Aires",
      "country": "Argentina",
      "street_address": "Buenos Aires, Argentina",
      "timezone": "America/Buenos_Aires"
  },
  "paymentMethod": [],
  "createdBy": "wRdqkjp5HXuWzihzN",
  "phone": "+54 911 61110243",
  "skills": [
      {
          "type": "VIDEO_EDITING",
          "isQualified": true,
          "rating": 5
      },
      {
          "type": "CORPORATE_VIDEOGRAPHY",
          "isQualified": true,
          "rating": 3
      }
  ]
}

export const TEST_CLIENT_OWNER_OF_DELIVERABLE = {
  "_id": CLIENT_OWNER_ID_FOR_DELIVERABLE,
  "location": {},
  "firstName": "Lucy",
  "lastName": "Richards",
  "email": "lucy@firstcut.io",
  "companyId": "GgpnPTo5vet8uDJSw",
  "createdBy": "wRdqkjp5HXuWzihzN",
}

export const TEST_DELIVERABLE = {
  "_id": DELIVERABLE_ID,
  "blueprint": "TESTIMONIAL_SNIPPET",
  "name": "Test",
  "projectId": PROJECT_ID,
  "clientOwnerId": CLIENT_OWNER_ID_FOR_DELIVERABLE,
  "postpoOwnerId": POSTPO_OWNER_ID,
  "estimatedDuration": 30,
  "songs": [],
  "createdBy": "wRdqkjp5HXuWzihzN",
}

export const TEST_PROJECT = {
  "_id": PROJECT_ID,
  "blueprint": "CUSTOMER_TESTIMONIAL",
  "isDummy": true,
  "name": "Office",
  "clientOwnerId": "b4QSRJkhHd4mqpmz3",
  "adminOwnerId": "p3eGR6CjEbzPS3uZr",
  "stage": "STAGE_1",
  "companyId": "iRRyf7yrr2ThTTuKs",
  "assets": [],
  "createdBy": "wRdqkjp5HXuWzihzN",
  "createdAt": {
      "$date": "2018-04-26T21:09:51.197Z"
  },
  "updatedAt": {
      "$date": "2018-04-26T21:09:51.715Z"
  }
}


export function insertTestData() {
  Mongo.Collection.prototype.attachSchema = function () {};

  this.deliverables = (this.deliverables) ? this.deliverables: new Mongo.Collection(Deliverable.collection_name);
  this.projects = (this.projects) ? this.projects: new Mongo.Collection(Project.collection_name);
  this.clients = (this.clients) ? this.clients: new Mongo.Collection(Client.collection_name);
  this.collaborators = (this.collaborators) ? this.collaborators: new Mongo.Collection(Collaborator.collection_name);

  StubCollections.add([this.deliverables, this.projects, this.clients, this.collaborators])
  StubCollections.stub();

  if (Meteor.isServer) {
    this.deliverables.remove({});
    this.deliverables.insert(TEST_DELIVERABLE);

    this.projects.remove({});
    this.projects.insert(TEST_PROJECT);

    this.clients.remove({});
    this.clients.insert(TEST_CLIENT_OWNER_OF_DELIVERABLE);

    this.collaborators.remove({});
    this.collaborators.insert(TEST_POSTPO_OWNER_OF_DELIVERABLE);
  }
}

export function restoreTestData() {
  StubCollections.restore();
}
