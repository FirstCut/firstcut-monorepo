import React from 'react';
import {
  Grid, Modal, Header, Form, Responsive, Button, Embed, Container, Image,
} from 'firstcut-ui';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Analytics from 'firstcut-analytics';
import Loading from '../components/loading';
import Alert from '../components/alert';

export const GET_TEMPLATE_QUERY = gql`
  query projectTemplate($projectId: ID!) {
    projectTemplate(_id: $projectId) {
      title
      description
      exampleUrl
      _id
    }
  }
`;

#
#
function ContactPage(props) {
  const { projectId } = props;
  return (
    <Query query={GET_TEMPLATE_QUERY} variables={{ projectId }}>
      {({ loading, error, data }) => {
        if (loading) return <Loading />;
        if (error) return <Alert message={error.message} />;

        return <ContactFormPage {...data.projectTemplate} />;
      }}
    </Query>
  );
}

const ADD_REQUEST = gql`
  mutation addRequest(
    $firstName: String!,
    $lastName: String!,
    $projectId: String!,
    $email: String!,
    $company: String,
    $website: String,
    $location: String,
    $budget: String
    $about: String
  ) {
    addRequest(
      firstName: $firstName,
      lastName: $lastName,
      projectId: $projectId,
      email: $email,
      company: $company,
      website: $website,
      location: $location,
      budget: $budget,
      about: $about
    ) {
      _id
    }
  }
`;

function ContactFormPage(props) {
  return (
    <Mutation mutation={ADD_REQUEST}>
    {(addRequest, mutationState) => (
      <ContactFormPageComponent mutationState={mutationState} addRequest={addRequest} {...props} />
    )}
  </Mutation>
  )
}

class ContactFormPageComponent extends React.PureComponent {
  initialState = {
    confirm: false,
    error: null,
    website: '',
    company: '',
    firstName: '',
    lastName: '',
    budget: '',
    location: '',
    email: '',
    about: '',
  }

  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  restoreState = ()=>  this.setState(this.initialState)

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = () => {
    const { addRequest, title, _id } = this.props;
    const { confirm, error, ...request } = this.state;
    addRequest({ variables: { ...request, projectId: _id }});
    Analytics.trackFormSubmission({ name: 'CONTACT_FORM', projectId: _id, projectTitle: title, ...request });
    this.setState({ confirm: true });
  }

  render() {
    const {
      confirm, error, ...fields
    } = this.state;
    const { mutationState } = this.props;
    const columnStyle = { paddingTop: '100px' };
    return (
      <div style={{ height: '100%' }}>
        { mutationState.error &&
          <Alert visible={mutationState.error} type='error' message={mutationState.error.message} />
        }
        <ConfirmationModal
          open={confirm}
          onClick={this.restoreState}
          onConfirm={this.restoreState}
        />
        <Grid
          stackable
          style={{ height: '100%' }}
          reversed="computer"
        >
          <Grid.Column
            mobile={16}
            tablet={16}
            computer={8}
            style={columnStyle}
            align="center"
          >
            <Responsive
              as={Container}
              maxWidth={770}
              style={{
                height: '75px',
              }}
            />
            <ProjectDetails {...this.props} />
            <Responsive
              as={Image}
              minWidth={1085}
              src="/desktop.png"
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                height: '100%',
                width: '100%',
                opacity: 0.1,
                zIndex: -1000,
              }}
            />
          </Grid.Column>
          <Grid.Column
            style={columnStyle}
            align="center"
            mobile={16}
            tablet={16}
            computer={8}
          >
            <ContactForm
              fieldValues={fields}
              handleSubmit={this.handleSubmit}
              handleChange={this.handleChange}
            />
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

function ContactForm(props) {
  const { handleChange, handleSubmit, fieldValues } = props;
  const {
    firstName, lastName, website, company, email, budget, location, about,
  } = fieldValues;
  return (
    <div style={{ maxWidth: '400px' }}>
      <Header color="green" align="left">
        Contact us
      </Header>
      <Form>
        <Form.Group widths="equal">
          <Form.Field>
            <Form.Input
              onChange={handleChange}
              placeholder="First Name"
              name="firstName"
              value={firstName}
              required
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              onChange={handleChange}
              placeholder="Last Name"
              name="lastName"
              value={lastName}
              required
            />
          </Form.Field>
        </Form.Group>
        <Form.Field>
          <Form.Input
            onChange={handleChange}
            placeholder="Email"
            name="email"
            value={email}
            required
          />
        </Form.Field>
        <Form.Field>
          <Form.Input
            onChange={handleChange}
            placeholder="Company Name"
            name="company"
            value={company}
            required
          />
        </Form.Field>
        <Form.Field>
          <Form.Input
            onChange={handleChange}
            placeholder="Company Website"
            name="website"
            value={website}
          />
        </Form.Field>
        <Form.Field>
          <Form.Input
            onChange={handleChange}
            placeholder="Where would you like to shoot your video?"
            name="location"
            value={location}
          />
        </Form.Field>
        <Form.Field>
          <Form.Input
            onChange={handleChange}
            placeholder="What is your estimated budget range?"
            name="budget"
            value={budget}
          />
        </Form.Field>
        <Form.Field>
          <Form.TextArea
            onChange={handleChange}
            placeholder="Anything about this project you would like us to know before we contact you?"
            name="about"
            value={about}
          />
        </Form.Field>
        <Form.Button
          fluid
          color="green"
          content="SUBMIT"
          onClick={handleSubmit}
        />
      </Form>
    </div>
  );
}

function ConfirmationModal(props) {
  const { open, onConfirm, onClick } = props;
  return (
    <Modal open={open} basic size="small" onClick={onClick}>
      <Header icon="checkmark" content="Thank you for your request" />
      <Modal.Content>
        We will be in touch soon!
      </Modal.Content>
      <Modal.Actions>
        <Button color="green" inverted onClick={onConfirm}>
          CONFIRM
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

function ProjectDetails(props) {
  const { title, description, exampleUrl } = props;
  return (
    <div style={{ maxWidth: '500px' }}>
      <Header color="green" align="left">
        { title }
      </Header>
      <Embed url={exampleUrl} style={{ marginBottom: '20px' }} />
      <i>
        { description }
      </i>
    </div>
  );
}

export default ContactPage;
