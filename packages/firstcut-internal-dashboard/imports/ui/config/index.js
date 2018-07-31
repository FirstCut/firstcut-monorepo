import VideoEditorConfig from './editor.config.js';
import {SuperuserConfig, VideoProjectManagerConfig} from './projectmanager.config.js';
import ClientConfig from './client.config.js';
import VideographerConfig from './videographer.config.js';
import DefaultConfig, {PublicConfig} from './default.config.js';
import {userPlayer, userPlayerId, playerIsClient} from 'firstcut-utils';
import Routes from '../components/routing/routes.jsx';
import {_} from 'lodash';
import {UNIVERSAL_PERMISSIONS} from './config.enum.js';
import {fulfillsPrerequisites} from 'firstcut-pipeline';

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

export function getSubscriptions() {
  const skills = getQualifiedSkills();
  let subs = skills.map(function(skill) {
    return subscriptionsForSkill(skill);
  });
  subs = _.flatten(subs);
  return subs;
}

export function canTriggerAction(event) {
  const skills = getQualifiedSkills();
  let actions = skills.map(function(skill) {
    return availableActionsForSkill(skill);
  });
  actions = _.flatten(actions);
  return actions.includes(event) || actions.includes(UNIVERSAL_PERMISSIONS);
}

export function userHomePage() {
  const skills = getQualifiedSkills();
  let available_routes = skills.map(function(skill) {
    return homePageForSkill(skill);
  });
  available_routes = _.flatten(available_routes);
  return _.first(available_routes);
}

export function userTabs() {
  const skills = getQualifiedSkills();
  let tabs = skills.map(function(skill) {
    return tabsForSkill(skill);
  });
  tabs = _.flatten(tabs);
  tabs = _.uniqBy(tabs, t => t.name);
  tabs = _.sortBy(tabs, t => t.order);
  tabs = tabs.map(t => t.component);
  return tabs;
}

export function isPublicAccess(route_name) {
  let routes = routesForSkill('NOUSER');
  routes = routes.map(r => r.name);
  return routes.includes(route_name);
}

export function userHasAccess(route_name) {
  const skills = getQualifiedSkills();
  let routes = skills.map(function(skill) {
    return routesForSkill(skill);
  });
  routes = _.flatten(routes);
  routes = routes.map(r => r.name);
  return routes.includes(route_name);
}

export function getUserActions(record) {
  let actions = mapSkills(getActionsForSkill.bind(null, record));
  actions = _.flatten(actions);
  actions = _.uniqBy(actions, a => a);
  actions = actions.filter(a => fulfillsPrerequisites({record: record, event: a, initiator: userPlayerId()}));
  return actions;
}

export function userExperience() {
  if (Meteor.settings.public.userExperienceOverride) {
    return Meteor.settings.public.userExperienceOverride;
  }
  const experiences = getSupportedUserExperiences();
  return getExperienceWithBroadestPermissions(experiences);
}

export function routes() {
  return Object.values(Routes.toArray()).map(r => r.route);
}

function homePageForSkill(skill) {
  return getConfig(skill).homePage;
}

function tabsForSkill(skill) {
  return getConfig(skill).tabs.toArray();
}

function getActionsForSkill(record, skill) {
  const getActions = getConfig(skill).getActions;
  return (getActions) ? getActions(record).toArray() : [];
}

function availableActionsForSkill(skill) {
  return getConfig(skill).manualActionsAvailable.toArray();
}

function mapSkills(func) {
  const skills = getQualifiedSkills();
  return skills.map(func)
}

function routesForSkill(skill) {
  return getConfig(skill).routes.toArray();
}

function skillHasPermission(skill, action) {
  return getConfig(skill).hasPermission(action);
}

function getSupportedUserExperiences() {
  const skills = getQualifiedSkills();
  let experiences = skills.map(function(skill) {
    return experienceForSkill(skill);
  });
  return experiences;
}

function getExperienceWithBroadestPermissions(experiences) {
  const permissions = ['INTERNAL', 'VIDEOGRAPHER', 'CLIENT', 'PUBLIC'];
  const sorted_experiences = _.sortBy(experiences, (e) => permissions.indexOf(e));
  return _.first(sorted_experiences);
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

function getQualifiedSkills() {
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
  const skill_objects = (player)
    ? player.skills.filter(skill => skill.isQualified)
    : [];
  if (skill_objects.length == 0) {
    return ['DEFAULT'];
  }
  if (Meteor.settings.public.skillsOverride) {
    return Meteor.settings.public.skillsOverride;
  }
  return skill_objects.map(obj => obj.type);
}
