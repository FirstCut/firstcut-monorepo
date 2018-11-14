import React from 'react';
import {
  Grid, Modal, Header, Form, Responsive, Button, Embed,
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
    const data = { event: 'landing_page_submit', ...this.state, projectId: this.props.projectId };
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

        <Grid stackable style={{ height: '100%' }} onClick={this.hideModal}>
          <Grid.Column
            mobile={16}
            tablet={16}
            computer={8}
          >
            <Grid stackable>
              <Grid.Row>
                <Grid.Column
                  width={1}
                  align="center"
                  verticalAlign="middle"
                />
                <Grid.Column
                  width={14}
                  align="center"
                  verticalAlign="middle"
                >
                  <Header align="center">
                    { title }
                  </Header>
                  <Embed url={exampleUrl} style={{ marginBottom: '20px' }} />
                  <i>
                    { description }
                  </i>
                </Grid.Column>
                <Grid.Column
                  width={1}
                  align="center"
                  verticalAlign="middle"
                />
              </Grid.Row>

              <Grid.Row>
                <Grid.Column
                  width={16}
                  align="center"
                >
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
          <Grid.Column
            style={{ height: '100%' }}
            align="center"
            mobile={16}
            tablet={16}
            computer={8}
          >
            <div className="signup__form">
              <Header align="left">
                Lets Make It Happen
              </Header>
              <ContactForm
                formFields={fields}
                onSubmit={this.onSubmit}
                onChange={this.onChange}
              />
            </div>
          </Grid.Column>
        </Grid>
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
          placeholder="What is your estimated budget?"
          name="budget"
          value={budget}
          required
        />
      </Form.Field>
      <Form.Field>
        <Form.TextArea
          onChange={handleChange}
          placeholder="Anything about this project you would like us to know?"
          name="about"
          value={about}
          required
        />
      </Form.Field>
      <Responsive
        as={Form.Button}
        fluid
        color="green"
        maxWidth={1085}
        content="SUBMIT"
        onClick={handleSubmit}
      />
    </Form>
  );
}

export default Contact;
