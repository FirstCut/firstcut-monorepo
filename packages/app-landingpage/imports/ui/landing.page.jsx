
import React from 'react';
import PropTypes from 'prop-types';
import {
  Image, Header, Grid, Button, Form, Responsive, Modal, Icon,
} from 'semantic-ui-react';
import { HTTP } from 'meteor/http';

const TAGLINES = {
  1: 'This is the number1 tagline',
};

class LandingPage extends React.Component {
  state = { confirm: false, error: null }

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  hideModal = () => { this.setState({ confirm: false }); }

  handleSubmit = () => {
    const data = { event: 'landing_page_submit', ...this.state, adId: this.props.id };
    // HTTP.post('/postRequest', { data }, (err, res) => {
    Meteor.call('postRequest', data, (err, res) => {
      console.log(err);
      console.log('POSTED');
      console.log(res);
      if (err) {
        this.setState({ error: err });
      } else {
        this.setState({ confirm: true });
      }
    });
  }

  render() {
    const { confirm } = this.state;
    return (
      <div className="signup" style={{ height: '100%' }} onClick={this.hideSidebar}>
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
            width={8}
          >
            <Grid stackable>
              <Grid.Row>
                <Grid.Column
                  width={16}
                  align="center"
                  style={{ paddingTop: '50px' }}
                >
                  <Image src="/firstcut_logo.png" fluid className="signup__header" />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column
                  width={16}
                  align="center"
                  className="signup__form__container"
                >
                  <div className="signup__form">
                    <Header align="left" as="h2">
                      Contact Us
                    </Header>
                    <Form onSubmit={this.handleSubmit}>
                      <Form.Group widths="equal">
                        <Form.Field>
                          <Form.Input
                            onChange={this.handleChange}
                            placeholder="First Name"
                            name="first"
                            required
                          />
                        </Form.Field>
                        <Form.Field>
                          <Form.Input
                            onChange={this.handleChange}
                            placeholder="Last Name"
                            name="last"
                            required
                          />
                        </Form.Field>
                      </Form.Group>
                      <Form.Field>
                        <Form.Input
                          onChange={this.handleChange}
                          placeholder="Email"
                          name="email"
                          required
                        />
                      </Form.Field>
                      <Form.Field>
                        <Form.Input
                          onChange={this.handleChange}
                          placeholder="Company Name"
                          name="company"
                          required
                        />
                      </Form.Field>
                      <Form.Field>
                        <Form.TextArea
                          onChange={this.handleChange}
                          placeholder="Tell us about your needs"
                          name="about"
                          required
                        />
                      </Form.Field>
                      <Responsive
                        as={Form.Button}
                        fluid
                        color="green"
                        maxWidth={1085}
                        content="SUBMIT"
                        onClick={this.handleSubmit}
                      />
                    </Form>
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
          <Grid.Column
            width={8}
            color="green"
            style={{ height: '100%' }}
            align="center"
          >
            <Header as="h4" align="center" className="signup__tagline"> This is a tag line about the ad you selected. Maybe we can put an image here in the background... </Header>
          </Grid.Column>
        </Grid>
        <Responsive
          as={Button}
          minWidth={1086}
          content="SUBMIT"
          className="signup__centered signup__raised"
          onClick={this.handleSubmit}
        />
      </div>
    );
  }
}

export default LandingPage;
