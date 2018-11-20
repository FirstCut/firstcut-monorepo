"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var projectTemplates = [{
  title: 'First Project',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  exampleThumb: 'https://s3-us-west-2.amazonaws.com/firstcut-app-dev/branding/Hn_rz3SLtMQNy4sM4Dvd/comfykittens-original-5bda20f9421aa90NaN86359f.jpg',
  exampleUrl: 'https://firstcut-app.s3-accelerate.amazonaws.com/projects/5bd0fb955c4edf0008479f42/cuts/FULL%20INT%20-%20TrackMaven%20-%20Trackmaven%20__%20Skyword%20Event%20Coverage-original-5bec60a7e757f40NaN7643b5.mp4?AWSAccessKeyId=AKIAJPWDGE5BVBYIZP3Q&Expires=1544832040&Signature=29c237TVUXh7O%2FFcrKQUPPMTXpI%3D',
  _id: 'project1'
}, {
  title: 'Second Project',
  description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
  exampleUrl: 'https://firstcut-app.s3-accelerate.amazonaws.com/projects/5bd0fb955c4edf0008479f42/cuts/FULL%20INT%20-%20TrackMaven%20-%20Trackmaven%20__%20Skyword%20Event%20Coverage-original-5bec60a7e757f40NaN7643b5.mp4?AWSAccessKeyId=AKIAJPWDGE5BVBYIZP3Q&Expires=1544832040&Signature=29c237TVUXh7O%2FFcrKQUPPMTXpI%3D',
  exampleThumb: 'https://s3-us-west-2.amazonaws.com/firstcut-app-dev/branding/Hn_rz3SLtMQNy4sM4Dvd/comfykittens-original-5bda20f9421aa90NaN86359f.jpg',
  _id: 'project2'
}, {
  title: 'Third Project',
  description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
  exampleUrl: 'https://firstcut-app.s3-accelerate.amazonaws.com/projects/5bd0fb955c4edf0008479f42/cuts/FULL%20INT%20-%20TrackMaven%20-%20Trackmaven%20__%20Skyword%20Event%20Coverage-original-5bec60a7e757f40NaN7643b5.mp4?AWSAccessKeyId=AKIAJPWDGE5BVBYIZP3Q&Expires=1544832040&Signature=29c237TVUXh7O%2FFcrKQUPPMTXpI%3D',
  exampleThumb: 'https://s3-us-west-2.amazonaws.com/firstcut-app-dev/branding/Hn_rz3SLtMQNy4sM4Dvd/comfykittens-original-5bda20f9421aa90NaN86359f.jpg',
  _id: 'project3'
}, {
  title: 'Fourth Project',
  description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
  exampleUrl: 'https://firstcut-app.s3-accelerate.amazonaws.com/projects/5bd0fb955c4edf0008479f42/cuts/FULL%20INT%20-%20TrackMaven%20-%20Trackmaven%20__%20Skyword%20Event%20Coverage-original-5bec60a7e757f40NaN7643b5.mp4?AWSAccessKeyId=AKIAJPWDGE5BVBYIZP3Q&Expires=1544832040&Signature=29c237TVUXh7O%2FFcrKQUPPMTXpI%3D',
  exampleThumb: 'https://s3-us-west-2.amazonaws.com/firstcut-app-dev/branding/Hn_rz3SLtMQNy4sM4Dvd/comfykittens-original-5bda20f9421aa90NaN86359f.jpg',
  _id: 'project4'
}, {
  title: 'Fifth Project',
  description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
  exampleUrl: 'https://firstcut-app.s3-accelerate.amazonaws.com/projects/5bd0fb955c4edf0008479f42/cuts/FULL%20INT%20-%20TrackMaven%20-%20Trackmaven%20__%20Skyword%20Event%20Coverage-original-5bec60a7e757f40NaN7643b5.mp4?AWSAccessKeyId=AKIAJPWDGE5BVBYIZP3Q&Expires=1544832040&Signature=29c237TVUXh7O%2FFcrKQUPPMTXpI%3D',
  exampleThumb: 'https://s3-us-west-2.amazonaws.com/firstcut-app-dev/branding/Hn_rz3SLtMQNy4sM4Dvd/comfykittens-original-5bda20f9421aa90NaN86359f.jpg',
  _id: 'project5'
}];
var _default = projectTemplates;
exports.default = _default;