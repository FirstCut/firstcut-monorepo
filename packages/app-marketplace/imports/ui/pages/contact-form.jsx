import React from 'react';
import {
  Grid, Modal, Header, Form, Responsive, Button, Embed, Container, Image,
} from 'semantic-ui-react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

function Contact(props) {
  const { projectId } = props;
  return (
    <Query
      query={gql`
      {
        project(_id: "${projectId}") {
          title
          description
          exampleUrl
          _id
        }
      }
    `}
    >
      {({ loading, error, data }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error :(</p>;

        return <ContactFormPage {...data.project} />;
      }}
    </Query>
  );
}

class ContactFormPage extends React.PureComponent {
  state = { confirm: false, error: null }

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = () => {
    const { projectId } = this.props;
    const { confirm, error, ...fields } = this.state;
    const data = { event: 'project_contact_submission', ...fields, projectId };
    Analytics.trackFormSubmission({ projectId, ...fields });
    Meteor.call('postRequest', data, (err) => {
      if (err) {
        this.setState({ error: err });
      } else {
        this.setState({
          confirm: true, first: '', last: '', company: '', email: '', budget: '', location: '', about: '',
        });
      }
    });
  }

  render() {
    const { title, description, exampleUrl } = this.props;
    const {
      confirm, error, ...fields
    } = this.state;
    const columnStyle = { paddingTop: '100px' };
    return (
      <div style={{ height: '100%' }}>
        <Modal open={confirm} basic size="small" onClick={this.hideModal}>
          <Header icon="checkmark" content="Thank you for your request" />
          <Modal.Content>
            We will be in touch soon!
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted onClick={this.hideModal}>
              CONFIRM
            </Button>
          </Modal.Actions>
        </Modal>

        <Grid
          stackable
          style={{ height: '100%' }}
          onClick={this.hideModal}
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
              formFields={fields}
              onSubmit={this.onSubmit}
              onChange={this.onChange}
            />
          </Grid.Column>
        </Grid>
        <Responsive
          as={Button}
          minWidth={100000000}
          content="SUBMIT"
          color="green"
          className="signup__centered signup__raised"
          onClick={this.handleSubmit}
        />
      </div>
    );
  }
}

function ContactForm(props) {
  const { handleChange, handleSubmit, formFields } = props;
  const {
    first, last, website, company, email, budget, location, about,
  } = formFields;
  return (
    <div className="signup__form">
      <Header align="center">
        Contact us
      </Header>
      <Form onSubmit={handleSubmit}>
        <Form.Group widths="equal">
          <Form.Field>
            <Form.Input
              onChange={handleChange}
              placeholder="First Name"
              name="first"
              value={first}
              required
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              onChange={handleChange}
              placeholder="Last Name"
              name="last"
              value={last}
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
            required
          />
        </Form.Field>
        <Form.Field>
          <Form.Input
            onChange={handleChange}
            placeholder="What is your estimated budget range?"
            name="budget"
            value={budget}
            required
          />
        </Form.Field>
        <Form.Field>
          <Form.TextArea
            onChange={handleChange}
            placeholder="Anything about this project you would like us to know before we contact you?"
            name="about"
            value={about}
            required
          />
        </Form.Field>
        <Responsive
          as={Form.Button}
          fluid
          color="green"
          maxWidth={100000}
          content="SUBMIT"
          onClick={handleSubmit}
        />
      </Form>
    </div>
  );
}


function ProjectDetails(props) {
  const { title, description, exampleUrl } = props;
  return (
    <div style={{ maxWidth: '500px' }}>
      <Header align="center">
        { title }
      </Header>
      <Embed url={exampleUrl} style={{ marginBottom: '20px' }} />
      <i>
        { description }
      </i>
    </div>
  );
}
export default Contact;
