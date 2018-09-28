
import React from 'react';
import Models from 'firstcut-models';
import Modals from '/imports/ui/components/utils/modals';
import { SimpleSchemaWrapper } from '/imports/api/schema';
import { RecordWithSchemaFactory } from '/imports/api/model-base';
import { Record } from 'immutable';
import { Button } from 'semantic-ui-react';
import { setSimulationPlayerId } from 'firstcut-players';

const { Client, Collaborator } = Models;

export function SimulateClientExperience() {
  return <SimulatePlayerExperience playerType={Client.modelName} />;
}

export function SimulateCollaboratorExperience() {
  return <SimulatePlayerExperience playerType={Collaborator.modelName} />;
}

export function StopSimulation() {
  return (
    <Button color="red" onClick={() => setSimulationPlayerId(null)}>
      Stop Simulation
    </Button>
  );
}


class SimulatePlayerExperience extends React.Component {
  constructor(props) {
    super(props);
    const schema = new SimpleSchemaWrapper({
      playerId: {
        type: String,
        label: 'Player',
        serviceDependency: props.playerType,
      },
    });
    const PlayerSelect = RecordWithSchemaFactory(Record, schema);
    const playerSelect = new PlayerSelect({});
    this.state = {
      confirmed: false,
      playerSelect,
    };
  }

  onConfirm = (playerSelect) => {
    setSimulationPlayerId(playerSelect.playerId);
    this.toggleModal();
  }

  toggleModal = () => {
    const confirmed = !this.state.confirmed;
    this.setState({ confirmed });
  }

  render() {
    const { confirmed, playerSelect } = this.state;
    const { playerType } = this.props;
    const fields = playerSelect.schema.allFields() || [];
    const trigger = (
      <Button color="yellow" basic>
        {' '}
        Simulate
        {' '}
        {playerType}
        {' '}
        Experience
        {' '}
      </Button>
    );
    if (confirmed) {
      return trigger;
    }
    return (
      <Modals.UpdateField
        record={playerSelect}
        fields={fields}
        trigger={trigger}
        onSaveSuccess={this.onConfirm}
        headerText="Select player to emulate"
        rejectText="Cancel"
        confirmText="Confirm"
      />
    );
  }
}
