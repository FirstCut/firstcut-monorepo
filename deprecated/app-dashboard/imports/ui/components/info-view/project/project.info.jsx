import React from 'react';
import {
  Item, Message, Button,
} from 'semantic-ui-react';

import InfoPage from '/imports/ui/pages/info.page';
import { FilePortal, FileView } from '/imports/ui/components/utils/file.portal';
import { isEmpty } from 'firstcut-utils';
import { getRecordPath } from 'firstcut-retrieve-url';
import ClientProjectInfoPage from './project.client';
import { asLinkToRecord } from '/imports/ui/components/utils/utils';
import { getTaskInfo } from '/imports/ui/components/tasks';
import { getClientInfo } from '../client.info';
import { getCompanyInfo } from '../company.info';
import { getDeliverableInfo } from '../deliverable.info';
import { getInvoiceInfo } from '../invoice.info';
import { getShootInfo } from '../shoot';
import { InfoPageProps } from '../utils/shared.props';
import { userExperience } from '/imports/ui/config';
import ProjectChatWindow from './project.chat';

export function ProjectInfoPage(props) {
  const { record } = props;
  if (userExperience().isClient) {
    return <ClientProjectInfoPage {...props} />;
  }

  let sections = [getProjectInfo(props), getTaskInfo(props)];

  if (record.clientOwner) {
    sections.push(getClientInfo({ record: record.clientOwner }));
  }

  if (record.company) {
    sections.push(getCompanyInfo({ record: record.company }));
  }

  if (!isEmpty(record.getDeliverables())) {
    const deliverableSections = record.getDeliverables().map(d => getDeliverableInfo({ record: d }));
    sections = [
      ...sections,
      ...deliverableSections,
    ];
  }

  if (!isEmpty(record.getShoots())) {
    const shootSections = record.getShoots().map(s => getShootInfo({ record: s }));
    sections = [
      ...sections,
      ...shootSections,
    ];
  }

  if (!isEmpty(record.invoices)) {
    const invoiceSections = record.invoices.map(i => getInvoiceInfo({ record: i }));
    sections = [
      ...sections,
      ...invoiceSections,
    ];
  }

  const clientsNotYetInvited = record.getClientTeamMembersNotYetInvited();
  return (
    <div>
      { clientsNotYetInvited.length > 0
        && userExperience().isProjectManager
        && <ClientsNotInvitedWarning clients={clientsNotYetInvited} />
      }
      <InfoPage
        sections={sections}
        record={record}
      />
      <ProjectChatWindow project={record} />
    </div>
  );
}

ProjectInfoPage.propTypes = InfoPageProps;

export function getProjectInfo(props) {
  const { record } = props;
  const subsections = [_basicInternalInfo(props)];
  if (!isEmpty(record.assets)) {
    subsections.push(_assets(props));
  }
  if (!isEmpty(record.SOWFile)) {
    subsections.push(_SOW(props));
  }
  return { title: record.displayName, record, subsections };
}

function _basicInternalInfo(props) {
  const { record } = props;
  const body = (
    <Item>
      <Item.Content>
        { record.type && (
          <Item.Header>
            <b>
              {record.getFieldLabel('blueprint')}
              {' '}
            </b>
            {record.blueprintLabel}
          </Item.Header>
        )
        }
        { record.getSalesforceLink() && (
          <Item.Header>
            <b>
              Link to project in salesforce:
              {' '}
            </b>
            <a href={record.getSalesforceLink()}>
              {record.getSalesforceLink()}
              {' '}
            </a>
          </Item.Header>
        )
        }
        <Item.Header>
          <b>
          Stage
          </b>
          {' '}
          {record.latestKeyEventLabel}
        </Item.Header>
        { record.invoiceAmount
          && (
          <Item.Header>
            <b>
          Invoice Amount
            </b>
            $
            {record.invoiceAmount}
          </Item.Header>
          )
        }
        <Item.Header>
          <b>
            {record.getFieldLabel('adminOwnerId')}
            {' '}
          </b>
          <a href={getRecordPath(record.adminOwner)}>
            {record.adminOwnerDisplayName}
          </a>
        </Item.Header>
        { record.additionalClientTeamMemberIds && record.additionalClientTeamMemberIds.length > 0
        && (
        <Item.Header>
          <b>
            {record.getFieldLabel('additionalClientTeamMemberIds')}
            {' '}
          </b>
          {
            record.getAdditionalClientTeamMembers().map(player => (
              <a href={getRecordPath(player)}>
                {player.displayName}
                {', '}
              </a>
            ))
          }
        </Item.Header>
        )
      }
      </Item.Content>
    </Item>
  );
  return { subtitle: '', body };
}

function _assets(props) {
  const { record } = props;
  const body = (<FilePortal record={record} fieldname="assets" view={FileView} />);
  return { subtitle: 'Asset', body };
}

function _SOW(props) {
  const { record } = props;
  const body = (<FilePortal record={record} fieldname="SOWFile" view={FileView} />);
  return { subtitle: 'SOW File', body };
}

function ClientsNotInvitedWarning(props) {
  const { clients } = props;
  const LinkToRecord = asLinkToRecord(Button);
  return (
    <Message color="red">
      <Message.Header>
        Client team members need to be invited to the platform
      </Message.Header>
      {clients.map(c => (
        <LinkToRecord record={c} color="green">
          {c.displayName}
        </LinkToRecord>
      ))}
      have not yet been invited to the platform and have not yet created user profiles. Remember to invite them so they can access projects, shoots, and cuts. Click the button to view their client profile, and then click 'Send Invite Link' in the action bar to the right to send them an invitation to the platform.
    </Message>);
}
