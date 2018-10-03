
import sanitize from 'sanitize-filename';
import { Random } from 'meteor-standalone-random';
import { upload } from 'firstcut-uploader';
import { _ } from 'lodash';
import EventEmitter from 'events';
import AssetSchema from './assets.schema';
import { createBaseModel } from 'firstcut-model-base';

const Base = createBaseModel(AssetSchema);

const snippetExtension = 'mp4';
const VIDEO_MIME_TYPES = ['video/x-flv', 'video/mp4', 'video/webm', 'video/ogg'];

class Asset extends Base {
  static get collectionName() {
    return 'assets';
  }

  static get schema() { return AssetSchema; }

  static footageFilesFolder(bucket) {
    return `${bucket}/footage-folders/`;
  }

  static buildS3AssetPath(fileRef, version) {
    let name = getAssetnameWithoutExtension(fileRef);
    name = sanitize(name);
    let path = `${fileRef.root}/${name}-${version}-${fileRef._id}.${fileRef.extension}`;
    path = path.replace(/\/\//g, '/');
    return path;
  }

  static buildSnippetRequestFilePath({
    cutFileRef, start, end,
  }) {
    const filename = this.getSnippetRequestFilename({ cutFileRef, start, end });
    return `${cutFileRef.root}/${filename}`;
  }

  static getSnippetRequestFilename({ cutFileRef, start, end }) {
    const snippetRequestPrefix = 'snippet';
    const name = getAssetnameWithoutExtension(cutFileRef);
    return `${snippetRequestPrefix}_${name}_${start}_${end}_${Random.id()}.${snippetExtension}`;
  }

  static insert(options) {
    let record = this.createNew({});
    const { file, meta } = options;
    const version = 'original';
    const properties = extractPropertiesOfFile(file);
    const {
      extension,
    } = properties;

    record = record.set('_id', Random.id());
    record = record.set('name', file.name);
    record = record.set('mime', file.type);
    record = record.set('type', file.type);
    record = record.set('fileSize', file.size);
    record = record.set('meta', meta);
    record = record.set('extension', extension);
    record = record.set('ext', extension);
    record = record.set('isVideo', record.isVideo);
    record = record.addToVersionReference(version, properties);

    const path = (options.path) ? options.path : this.buildS3AssetPath(record, version);
    record = record.setPath(version, path);

    const emitter = new EventEmitter();
    const promise = record.save();
    promise.catch(err => emitter.emit('error', err));
    upload({
      file, path, emitter, bucket: record.bucket,
    });
    return { emitter, record };
  }

  addToVersionReference(versionName, data = {}) {
    let self = this;
    const existingData = self.versions[versionName] || {};
    const combinedData = { ...existingData, ...data };
    self.versions[versionName] = combinedData;
    self = self.set('versions', self.versions);
    return self;
  }

  setPath(version, path) {
    return this.addToVersionReference(version, { meta: { pipePath: path } });
  }

  getPath(version = 'original') {
    if (!this.versions || !this.versions[version] || !this.versions[version].meta) {
      return '';
    }
    return this.versions[version].meta.pipePath;
  }

  get displayName() { return this.name; }

  get bucket() { return this.meta.bucket || Meteor.settings.public.s3.assets_bucket; }

  set bucket(bucket) { this.set('meta.bucket', bucket); }

  get root() { return this.meta.root; }

  get isVideo() { return VIDEO_MIME_TYPES.includes(this.type); }
}


function extractPropertiesOfFile(file) {
  return {
    name: file.name,
    mime: file.type,
    type: file.type,
    extension: getExtension(file),
    fileSize: file.size,
  };
}

function getAssetnameWithoutExtension(fileRef) {
  return removeExtension(fileRef.name);
}

function removeExtension(name) {
  const pieces = name.split('.');
  return _.first(pieces);
}

function getExtension(file) {
  const pieces = file.name.split('.');
  return _.last(pieces);
}

export default Asset;
