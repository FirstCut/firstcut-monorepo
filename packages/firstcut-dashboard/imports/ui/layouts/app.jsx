import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router, Switch, Link,
} from 'react-router-dom';
import {
  Grid, Message, Menu, Image, Sidebar, Label, Container, Button,
} from 'semantic-ui-react';
import {
  routesForUser, userTabs, userHasPermission, userExperience,
} from '/imports/ui/config';
import TasksList from '/imports/ui/components/tasks';
import {
  userPlayer, numPendingTasks, getPendingPlayerTasks, inSimulationMode,
} from 'firstcut-players';
import { getRecordPath } from 'firstcut-retrieve-url';
import Loading from '../components/utils/loading';
import { StopSimulation, SimulateClientExperience, SimulateCollaboratorExperience } from '/imports/ui/components/view-as';

export default class App extends React.PureComponent {
  state = { activeItem: 'projects', sidebarVisible: false }

  onSelectTab = (routeName) => { this.setState({ activeItem: routeName }); }

  toggleSidebar = () => { this.setState({ sidebarVisible: !this.state.sidebarVisible }); }

  hideSidebar = () => { this.setState({ sidebarVisible: false }); }

  render() {
    const { doneLoading, playersDoneLoading } = this.props;
    const { activeItem, sidebarVisible } = this.state;
    return (
      <Router>
        <Switch>
          <Sidebar.Pushable>
            { userExperience().isInternal && <TasksSidebar visible={sidebarVisible} tasks={getPendingPlayerTasks(userPlayer())} /> }
            <Sidebar.Pusher>
              <AppBody
                playersDoneLoading={playersDoneLoading}
                doneLoading={doneLoading}
                onSelectTasks={this.toggleSidebar}
                activeItem={activeItem}
                onSelectTab={this.onSelectTab}
                hideSidebar={this.hideSidebar}
                sidebarVisible={sidebarVisible}
              />
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </Switch>
      </Router>
    );
  }
}

// yes this should be a pure function, but this hack prevents it from rerendering everytime I open the tasks sidebar
class AppBody extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    // if the update is the sidebar activation, then don't update. Hack for performance.
    return nextProps.sidebarVisible === this.props.sidebarVisible;
  }

  render() {
    const {
      doneLoading, onSelectTab, activeItem, onSelectTasks, playersDoneLoading, hideSidebar,
    } = this.props;
    const routes = routesForUser().map(R => <R />);
    if (!Meteor.user()) {
      return (
        <Container style={{ 'padding-top': '15px' }}>
          <LoginButton />
          {' '}
          { !doneLoading && <div /> }
          { playersDoneLoading && routes }
          {' '}
        </Container>
      );
    }
    const menuProps = {
      style: { padding: '10px' },
      text: true,
      fluid: true,
      vertical: true,
      tabular: true,
    };
    return (
      <Grid padded>
        <Grid.Column width={2} textAlign="right">
          <Menu {...menuProps}>
            <Menu.Item header>
              <Image src="/firstcut_logo.png" />
            </Menu.Item>
            { userExperience().isInternal
              && (
              <Menu.Item header onClick={onSelectTasks} as="a">
              My Tasks
              </Menu.Item>
              )
            }
            {
              userTabs().map((Tab, i) => {
                const reactKey = `menuitem-${i}`;
                return (
                  <Tab
                    key={reactKey}
                    onClick={() => onSelectTab(activeItem)}
                    activeItem={activeItem}
                  />
                );
              })
            }
            <Menu.Item direction="right" as={Link} to={getRecordPath(userPlayer())} header>
              My Account
            </Menu.Item>
            <LoginOrLogoutItem />
            { userHasPermission('EMULATE_OTHER_USERS')
            && (
              <Menu.Item>
                <SimulateClientExperience />
              </Menu.Item>
            )
            }
            { userHasPermission('EMULATE_OTHER_USERS')
            && (
              <Menu.Item>
                <SimulateCollaboratorExperience />
              </Menu.Item>
            )
            }
            { inSimulationMode()
            && (
              <Menu.Item>
                <StopSimulation />
              </Menu.Item>
            )
            }
          </Menu>
        </Grid.Column>
        <Grid.Column onClick={hideSidebar} stretched width={14} style={{ padding: '50px' }}>
          { inSimulationMode() && <SimulationEnvAlert /> }
          { isDevelopment() && <DevEnvAlert /> }
          { doneLoading && routes }
          { doneLoading && !userPlayer() && <NoProfileFoundAlert /> }
          { !doneLoading && <Loading /> }
        </Grid.Column>
      </Grid>
    );
  }
}

function LoginButton(props) {
  const loginStyle = {
    position: 'absolute',
    top: '5px',
    right: '10px',
  };
  return (
    <Button style={loginStyle} basic color="blue" className="right aligned" as={Link} to="/login" header>
      Login
    </Button>
  );
}

function LoginOrLogoutItem(props) {
  let item = (
    <Menu.Item className="right aligned" as={Link} to="/login" header>
      Login
    </Menu.Item>
  );
  if (Meteor.user()) {
    item = (
      <Menu.Item className="right aligned" onClick={() => Meteor.logout()} header>
      Logout
      </Menu.Item>
    );
  }
  return item;
}

function NoProfileFoundAlert(props) {
  return (
    <Message color="yellow">
      <Message.Header>
        We couldn't find a profile for you :(
      </Message.Header>
      <p>
        If you are a client, please contact teamfirstcut@firstcut.io or your producer so we can make you a client profile. If you are hoping to be a firstcut creator, visit our
        {' '}
        <a href="/apply" as={Link} to="/apply">
          {' '}
          application page
          {' '}
        </a>
        {' '}
        to submit an application.
      </p>
    </Message>);
}


function SimulationEnvAlert(props) {
  return (
    <Message color="yellow">
      <Message.Header>
        SIMULATION ENVIRONMENT
      </Message.Header>
      <p>
        You are currently simulating another user's experience. You will not be able to execute actions or modify records. This is a read-only environment.
      </p>
    </Message>);
}


function DevEnvAlert(props) {
  return (
    <Message color="green">
      <Message.Header>
      DEVELOPMENT ENVIRONMENT
      </Message.Header>
      <p>
      Some small features (such as checkin, checkout, and screenshot fields in the shoot form),
      are different in the development environment to expedite testing. Also all actions are available
      on records. In production, actions are only available when the record meets specific criteria.
      </p>
    </Message>);
}

function TasksSidebar(props) {
  const { visible, onHide, tasks } = props;
  return (
    <Sidebar
      as={Menu}
      animation="overlay"
      direction="right"
      icon="labeled"
      vertical
      onHide={onHide}
      width="wide"
      visible={visible}
    >
      <TasksList tasks={tasks} />
    </Sidebar>
  );
}
