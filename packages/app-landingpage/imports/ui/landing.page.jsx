
import React from 'react';
import PropTypes from 'prop-types';
import {
  Image, Header, Grid, Button, Form, Responsive, Modal, Icon, Embed,
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
    const data = { event: 'landing_page_submit', ...this.state, adId: this.props.adId };
    Meteor.call('postRequest', data, (err) => {
      if (err) {
        this.setState({ error: err });
      } else {
        this.setState({
          confirm: true, first: '', last: '', company: '', email: '', about: '',
        });
      }
    });
  }

  render() {
    const {
      confirm, first, last, email, about, company,
    } = this.state;
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
              <Grid.Row style={{ height: '100px', padding: '20px !important' }}>
                <Grid.Column
                  width={16}
                  align="center"
                  verticalAlign="middle"
                >
                  <Image style={{ height: '100%' }} fluid src="/firstcut_logo.png" className="signup__header" href="https://www.firstcut.io" />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column
                  width={16}
                  align="center"
                  verticalAlign="middle"
                >
                  <Header align="center" as="h4">
                      Need help with your b2b video?
                  </Header>
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
                            value={first}
                            required
                          />
                        </Form.Field>
                        <Form.Field>
                          <Form.Input
                            onChange={this.handleChange}
                            placeholder="Last Name"
                            name="last"
                            value={last}
                            required
                          />
                        </Form.Field>
                      </Form.Group>
                      <Form.Field>
                        <Form.Input
                          onChange={this.handleChange}
                          placeholder="Email"
                          name="email"
                          value={email}
                          required
                        />
                      </Form.Field>
                      <Form.Field>
                        <Form.Input
                          onChange={this.handleChange}
                          placeholder="Company Name"
                          name="company"
                          value={company}
                          required
                        />
                      </Form.Field>
                      <Form.Field>
                        <Form.TextArea
                          onChange={this.handleChange}
                          placeholder="Tell us about your needs"
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
            style={{ height: '100%', padding: 0 }}
            align="center"
            verticalAlign="middle"
          >
            <Image src="/sidebar4.png" style={{ height: '100%' }} />
          </Grid.Column>
        </Grid>
        <Responsive
          as={Button}
          minWidth={1086}
          content="SUBMIT"
          color="green"
          className="signup__centered signup__raised"
          onClick={this.handleSubmit}
        />
      </div>
    );
  }
}

export default LandingPage;
