import {Random} from 'meteor-random';
import RecordPersister from './record.persister.js';
import SimpleSchema from 'simpl-schema';

export function enableCrud(cls) {
  const persister = new RecordPersister({
    cls,
    namespace: cls.collection_name,
    onSave: (record) => {
      return new Promise((resolve, reject) => {
        if (!record._id) {
          record._id = Random.id();
        }
        console.log('CALLING PERSIST SAVE 111');
        cls._persist_save.call(record, (err, updated_record)=> {
          // console.log(err);
          console.log('PRE_ERROR: in the callback from persist save');
          if(err) reject(err);
          // console.log('The new record has been returned');
          const new_record = new cls(updated_record);
          // console.log(new_record);
          console.log('in the callback from persist save');
        });
        resolve(new cls(record));
      });
    },
    onRemove: (record) => {
      return new Promise((resolve, reject) => {
        cls._persist_remove.call(record, (err, res)=> {
          if(err) reject(err);
          resolve();
        });
      });
    }
  });
}

//   let name = cls.collection_name + '.upsert';
//   cls._persist_save = new ValidatedMethod({
//     name: name,
//     validate: cls.schema.validator(),
//     run(record) {
//       if (!record._id) {
//         record._id = Random.id();
//       }
//       console.log('in the persist save client');
//       this.unblock();
//       if (cls.model_name == 'Asset') {
//         cls.collection.remove({_id: record._id});
//         cls.collection.insert(record);
//       } else {
//         console.log('before upsert');
//         cls.collection.upsert(record._id, {$set: record});
//         console.log('after upsert');
//       }
//       // if (Meteor.isServer) {
//       //   console.log('in the persist save server');
//       //   if (cls.model_name == 'Asset') {
//       //     cls.collection.remove({_id: record._id});
//       //     cls.collection.insert(record);
//       //   } else {
//       //     cls.collection.upsert(record._id, {$set: record});
//       //   }
//       //   // console.log('getting the record');
//       //   // return cls.collection.findOne(record._id);
//       // }
//       console.log('returning');
//       return record;
//     }
//   });
//
//   name = cls.collection_name + '.remove';
//   cls._persist_remove = new ValidatedMethod({
//     name: name,
//     validate: cls._schema.validator(),
//     run(record) {
//       if(Meteor.isServer) {
//         cls.collection.remove(record._id);
//       }
//     }
//   });
//   cls.persister = persister;
// }
//
// export const setPlayerId = new ValidatedMethod({
//   name: 'set-player-id',
//   validate: new SimpleSchema({playerId: String}).validator(),
//   run({playerId}) {
//     //update on the client for immediate, synchronous use
//     //if a playerId is already set
//     if (Meteor.user().profile.playerId) {
//       return;
//     }
//     //if a user already exists with that playerId already set
//     if (Meteor.users.findOne({'profile.playerId': playerId})) {
//       return;
//     }
//     Meteor.user().profile.playerId = playerId;
//     Meteor.users.update(Meteor.userId(), {$set: {'profile.playerId': playerId}});
//   }
// });
