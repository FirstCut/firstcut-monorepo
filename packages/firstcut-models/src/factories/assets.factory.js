
import sanitize from 'sanitize-filename';
import {Random} from 'meteor-random';
import {upload} from 'firstcut-uploader';
import {_} from 'lodash';
import EventEmitter from 'events';

const snippet_extension = 'mp4';
const VIDEO_MIME_TYPES = ['video/x-flv', 'video/mp4', 'video/webm', 'video/ogg'];

export default function AssetFactory(Base, schema) {
  class Asset extends Base {
    static get collection_name() {
      return 'assets';
    }

    static footageFilesFolder(bucket) {
      return bucket + '/footage-folders/';
    }

    static buildS3AssetPath(file_ref, version) {
      let name = getAssetnameWithoutExtension(file_ref);
      name = sanitize(name);
      let path = file_ref.root + '/' + name + '-' + version + '-' + file_ref._id + '.' + file_ref.extension;
      path = path.replace(/\/\//g, '/')
      return path;
    }

    static buildSnippetRequestFilePath({cut_file_ref, version='original', start, end}) {
      const filename = this.getSnippetRequestFilename({cut_file_ref, start, end});
      const root = cut_file_ref.root;
      return root + '/' + filename;
    }

    static getSnippetRequestFilename({cut_file_ref, start, end}) {
      const snippet_request_prefix = 'snippet';
      const name = getAssetnameWithoutExtension(cut_file_ref);
      return `${snippet_request_prefix}_${name}_${start}_${end}_${Random.id()}.${snippet_extension}` ;
    }

    static insert(options) {
      let record = this.createNew({});
      const {file, meta} = options;
      const version = "original";
      const properties = extractPropertiesOfFile(file);

      console.log(meta);
      const {name, mime, type, size, extension} = properties;
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
      const promise = record.save()
      promise.catch(err => emitter.emit('error', err))
      upload({file, path, emitter, bucket: record.bucket})
      emitter.on('uploaded', (awsKey)=> {
        record = record.setPath(version, awsKey);
        record.save();
        emitter.emit('progress', 1);
      });
      return {emitter, record};
    }

    addToVersionReference(version_name, data={}) {
      let self = this;
      let versions = self.versions;
      let existing_data = versions[version_name] || {};
      let combined_data = {...existing_data, ...data};
      versions[version_name] = combined_data;
      self = self.set('versions', versions);
      return self;
    }

    setPath(version, path) {
      return this.addToVersionReference(version, {meta: {pipePath: path}});
    }

    getPath(version='original') {
      if (!this.versions || !this.versions[version] || !this.versions[version].meta) {
        return '';
      }
      return this.versions[version].meta.pipePath;
    }

    get displayName() { return this.name; }
    get bucket() { return this.meta.bucket || Meteor.settings.public.s3.assets_bucket;}
    set bucket(bucket) { this.set('meta.bucket', bucket); }
    get root() { return this.meta.root }

    get isVideo() { return VIDEO_MIME_TYPES.includes(this.type); }
  }

  Asset.schema = schema;
  return Asset;
}

// function buildS3AssetPath(file_ref, version) {
//   let name = getAssetnameWithoutExtension(file_ref);
//   name = sanitize(name);
//   return getAssetRoot({file_ref}) + '/' + name + '-' + version + '-' + (Random.id()) + '.' + file_ref.extension;
// }
//
// export function getAssetRoot({file_ref}) {
//   return (file_ref.meta) ? file_ref.meta.root: '';
// }

function extractPropertiesOfFile(file) {
  return {
    name: file.name,
    mime: file.type,
    type: file.type,
    extension: getExtension(file),
    fileSize: file.size
  };
}

function getAssetnameWithoutExtension(file_ref) {
  return removeExtension(file_ref.name);
}

function removeExtension(name) {
  const pieces = name.split('.');
  return _.first(pieces);
}

function getExtension(file) {
  const pieces = file.name.split('.');
  return _.last(pieces);
}
