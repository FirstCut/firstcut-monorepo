
import { Meteor } from 'meteor/meteor';
import { _ } from 'lodash';
import VideoEditorConfig from './editor.config';
import { SuperuserConfig, VideoProjectManagerConfig } from './projectmanager.config';
import ClientConfig from './client.config';
import VideographerConfig from './videographer.config';
import DefaultConfig, { PublicConfig } from './default.config';
import { userPlayer, userPlayerId, playerIsClient } from 'firstcut-players';
import Routes from '../components/routing/routes';
import { UNIVERSAL_PERMISSIONS } from './config.enum';
import { fulfillsPrerequisites } from '/imports/api/pipeline';

export {
  UNIVERSAL_PERMISSIONS,
};

export const USER_IS_UPLOADING = 'user_is_uploading';
export const UPLOAD_SUCCESSFUL = 'upload_successful';

export function userHasPermission(action) {
  const skills = getQualifiedSkills();
  let result = false;
  skills.forEach((skill) => {
    if (skillHasPermission(skill, action)) {
      result = true;
    }
  });
  return result;
}

export function getVisibleEvents() {
  const skills = getQualifiedSkills();
  let events = skills.map(skill => visibleEventsForSkill(skill));
  events = _.flatten(events);
  return events;
}


export function getSubscriptions() {
  const skills = getQualifiedSkills();
  let subs = skills.map(skill => subscriptionsForSkill(skill));
  subs.push('base.all');
  subs = _.flatten(subs);
  if (subs.includes('records.all') || Meteor.settings.public.skillsOverride) {
    subs = ['records.all'];
  }
  return subs;
}

export function canTriggerAction(event) {
  const skills = getQualifiedSkills();
  let actions = skills.map(skill => availableActionsForSkill(skill));
  actions = _.flatten(actions);
  return actions.includes(event) || actions.includes(UNIVERSAL_PERMISSIONS);
}

export function userHomePage() {
  const skills = getQualifiedSkills();
  let availableRoutes = skills.map(skill => homePageForSkill(skill));
  availableRoutes = _.flatten(availableRoutes);
  return _.first(availableRoutes);
}

export function userTabs() {
  const skills = getQualifiedSkills();
  let tabs = skills.map(skill => tabsForSkill(skill));
  tabs = _.flatten(tabs);
  tabs = _.uniqBy(tabs, t => t.name);
  tabs = _.sortBy(tabs, t => t.order);
  tabs = tabs.map(t => t.component);
  return tabs;
}

export function isPublicAccess(routeName) {
  let userRoutes = routesForSkill('NOUSER');
  userRoutes = userRoutes.map(r => r.name);
  return userRoutes.includes(routeName);
}

export function userHasAccess(routeName) {
  const skills = getQualifiedSkills();
  let userRoutes = skills.map(skill => routesForSkill(skill));
  userRoutes = _.flatten(userRoutes);
  userRoutes = userRoutes.map(r => r.name);
  return userRoutes.includes(routeName);
}

export function getUserActions(record) {
  let actions = mapSkills(getActionsForSkill.bind(null, record));
  actions = _.flatten(actions);
  actions = _.uniqBy(actions, a => a);
  actions = actions.filter(a => fulfillsPrerequisites({
    record,
    event: a,
    initiator: userPlayerId(),
  }));
  return actions;
}

export function userExperience() {
  if (Meteor.settings.public.userExperienceOverride) {
    return Meteor.settings.public.userExperienceOverride;
  }
  const experiences = getSupportedUserExperiences();
  const exp = getExperienceWithBroadestPermissions(experiences);
  const isInternal = exp === 'EDITOR' || exp === 'PROJECT_MANAGER';
  return {
    isClient: exp === 'CLIENT',
    isVideographer: exp === 'VIDEOGRAPHER',
    isPublic: exp === 'PUBLIC',
    isEditor: exp === 'EDITOR',
    isProjectManager: exp === 'PROJECT_MANAGER',
    isExternal: !isInternal,
    isInternal,
  };
}

export function routesForUser() {
  return Object.values(Routes.toArray()).map(r => r.route);
}

function homePageForSkill(skill) {
  let page = getConfig(skill).homePage;
  if (typeof page === 'function') {
    page = page();
  }
  return page;
}

function visibleEventsForSkill(skill) {
  const { visibleEvents } = getConfig(skill);
  return (visibleEvents) ? visibleEvents.toArray() : [];
}

function tabsForSkill(skill) {
  return getConfig(skill).tabs.toArray();
}

function getActionsForSkill(record, skill) {
  const { getActions } = getConfig(skill);
  return (getActions) ? getActions(record).toArray() : [];
}

function availableActionsForSkill(skill) {
  return getConfig(skill).manualActionsAvailable.toArray();
}

function mapSkills(func) {
  const skills = getQualifiedSkills();
  return skills.map(func);
}

function routesForSkill(skill) {
  return getConfig(skill).routes.toArray();
}

function skillHasPermission(skill, action) {
  return getConfig(skill).hasPermission(action);
}

function getSupportedUserExperiences() {
  const skills = getQualifiedSkills();
  const experiences = skills.map(skill => experienceForSkill(skill));
  return experiences;
}

function getExperienceWithBroadestPermissions(experiences) {
  const permissions = ['PROJECT_MANAGER', 'EDITOR', 'VIDEOGRAPHER', 'CLIENT', 'PUBLIC'];
  const sortedExperiences = _.sortBy(experiences, e => permissions.indexOf(e));
  return _.first(sortedExperiences);
}

function experienceForSkill(skill) {
  return getConfig(skill).userExperience;
}

function subscriptionsForSkill(skill) {
  return getConfig(skill).subscriptions.toArray();
}

function getConfig(skill) {
  switch (skill) {
    case 'CORPORATE_VIDEOGRAPHY':
      return VideographerConfig;
    case 'CONDUCTING_INTERVIEWS':
      return VideographerConfig;
    case 'VIDEO_PROJECT_MANAGEMENT':
      return VideoProjectManagerConfig;
    case 'VIDEO_EDITING':
      return VideoEditorConfig;
    case 'MOTIONGRAPHICS':
      return VideoEditorConfig;
    case 'CLIENT':
      return ClientConfig;
    case 'NOUSER':
      return PublicConfig;
    case 'DASHBOARD_SUPERUSER':
      return SuperuserConfig;
    default:
      return DefaultConfig;
  }
}

export function getQualifiedSkills() {
  if (Meteor.settings.public.skillsOverride) {
    return [Meteor.settings.public.skillsOverride];
  }
  if (!Meteor.user()) {
    return ['NOUSER'];
  }
  const player = userPlayer();
  if (!player) {
    return ['DEFAULT'];
  }
  if (playerIsClient(player)) {
    return ['CLIENT', 'DEFAULT'];
  }
  const skillObjects = (player)
    ? player.skills.filter(skill => skill.isQualified)
    : [];
  if (skillObjects.length === 0) {
    return ['DEFAULT'];
  }
  return skillObjects.map(obj => obj.type);
}
