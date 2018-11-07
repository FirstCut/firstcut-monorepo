
import React from 'react';
import { Item, Container } from 'semantic-ui-react';
import Cards from '/imports/ui/components/utils/cards';
import { asLinkToRecord } from '/imports/ui/components/utils/utils';
import { isEmpty } from 'firstcut-utils';
import { ShootInfo } from '../shoot';
import InfoPage from '/imports/ui/pages/info.page';
import ProjectChatWindow from './project.chat';
import { FilePortal, FileView } from '/imports/ui/components/utils/file.portal';

export default function ClientProjectInfoPage(props) {
  const { record } = props;
  let sections = [getClientProjectInfo(props)];

  const latestCuts = record.getLatestCuts();
  if (!isEmpty(latestCuts)) {
    const cutCards = latestCuts.map((c, i) => {
      let imageProps = {};
      if (i === 0) {
        imageProps = { style: { width: '100px' } };
      }
      const WithLink = asLinkToRecord(Container);
      return {
        subtitle: '',
        body: (
          <WithLink record={c}>
            <Cards.Cut record={c} imageProps={imageProps} />
          </WithLink>
        ),
      };
    });
    const cutSection = { title: 'Latest Cuts', record, subsections: cutCards };
    sections = [
      ...sections,
      cutSection,
    ];
  }

  if (!isEmpty(record.getShoots())) {
    const shootInfoSections = record.getShoots().map((s) => {
      const WithLink = asLinkToRecord(Container);
      return {
        subtitle: '',
        body: (
          <WithLink record={s} style={{ color: 'black' }}>
            <ShootInfo.BasicInfo shoot={s} />
          </WithLink>
        ),
      };
    });
    const shootSection = { title: 'Shoots', record, subsections: shootInfoSections };
    sections = [
      ...sections,
      shootSection,
    ];
  }


  return (
    <div>
      <InfoPage
        sections={sections}
        record={record}
      />
      <ProjectChatWindow project={record} />
    </div>
  );
}

function getClientProjectInfo(props) {
  const { record } = props;
  const subsections = [_basicClientInfo(props)];
  return { title: record.displayName, record, subsections };
}

function _basicClientInfo(props) {
  const { record } = props;
  const body = (
    <Item>
      <Item.Content>
        <Item.Header>
          <b>
          Stage
          </b>
          {' '}
          {record.latestKeyEventLabel}
        </Item.Header>
        <Item.Header>
          <b>
            Producer
          </b>
          {' '}
          {record.adminOwnerDisplayName}
        </Item.Header>
        <Item.Header>
          <b>
            Producer Email
          </b>
          {' '}
          {record.adminOwnerEmail}
        </Item.Header>
        <Item.Header>
          <b>
            Project Assets
          </b>
          {' '}
          <FilePortal record={record} fieldname="assets" view={FileView} />
        </Item.Header>
      </Item.Content>
    </Item>
  );
  return { subtitle: '', body };
}
