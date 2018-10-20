
import React from 'react';
import PropTypes from 'prop-types';
import {
  Image, Header, Grid, Button, Form, Responsive,
} from 'semantic-ui-react';
import { emitPipelineEvent } from 'firstcut-event-emitter';

const TAGLINES = {
  1: 'This is the number1 tagline',
};

class LandingPage extends React.Component {
  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = () => {
    emitPipelineEvent({ event: 'landing_page_submit', ...this.state, adId: this.props.id });
  }

  render() {
    return (
      <div className="signup" style={{ height: '100%' }}>
        <Grid stackable style={{ height: '100%' }}>
          <Grid.Column
            width={8}
          >
            <Grid stackable>
              <Grid.Row>
                <Grid.Column
                  width={16}
                  align="center"
                  style={{ 'padding-top': '50px' }}
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
          />

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
