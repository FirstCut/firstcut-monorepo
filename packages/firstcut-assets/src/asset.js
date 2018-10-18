
import sanitize from 'sanitize-filename';
import oid from 'mdbid';
import { _ } from 'lodash';
import EventEmitter from 'events';
import { createBaseModel } from 'firstcut-model-base';
import AssetSchema from './assets.schema';

const Base = createBaseModel(AssetSchema);

const snippetExtension = 'mp4';
const VIDEO_MIME_TYPES = ['video/x-flv', 'video/mp4', 'video/webm', 'video/ogg'];

class Asset extends Base {
  static setUploader(uploader) {
    this.uploader = uploader;
  }

  static get collectionName() {
    return 'assets';
  }

  static get schema() { return AssetSchema; }

  static footageFilesFolder(bucket) {
    return `${bucket}/footage-folders/`;
  }

  buildS3AssetPath(version) {
    let name = getAssetnameWithoutExtension(this);
    name = sanitize(name);
    let path = `${this.root}/${name}-${version}-${this._id}.${this.extension}`;
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
    return `${snippetRequestPrefix}_${name}_${start}_${end}_${oid()}.${snippetExtension}`;
  }

  upload(options) {
    let asset = this;
    asset = asset.set('versions', {});
    const { file, meta } = options;
    const version = 'original';
    const properties = extractPropertiesOfFile(file);
    const {
      extension,
    } = properties;

    asset = asset.set('_id', oid());
    asset = asset.set('name', file.name);
    asset = asset.set('mime', file.type);
    asset = asset.set('type', file.type);
    asset = asset.set('fileSize', file.size);
    asset = asset.set('meta', meta);
    asset = asset.set('extension', extension);
    asset = asset.set('ext', extension);
    asset = asset.set('isVideo', asset.isVideo);
    asset = asset.addToVersionReference(version, properties);
    const path = (options.path) ? options.path : asset.buildS3AssetPath(version);
    asset = asset.setPath(version, path);

    const emitter = new EventEmitter();
    const promise = asset.save();
    promise.catch(err => emitter.emit('error', err));
    asset.constructor.uploader.upload({
      file, path, emitter, bucket: asset.bucket,
    });
    return { emitter, asset };
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

  addToVersionReference(versionName, data = {}) {
    let self = this;
    const existingData = { ...self.versions[versionName] } || {};
    const combinedData = { ...existingData, ...data };
    self.versions[versionName] = combinedData;
    self = self.set('versions', self.versions);
    return self;
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
