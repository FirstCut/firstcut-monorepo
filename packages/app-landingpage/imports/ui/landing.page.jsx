
import React from 'react';
import PropTypes from 'prop-types';
import {
  Image, Header, Grid, Button, Form, Responsive, Modal, Container, Embed,
} from 'semantic-ui-react';

const ANALYTICS_OF_STRATEGY = [
  'Our experts would like to offer you a free data-backed analysis of your content strategy. Contact us to request your consultation. (Limited time only)',
  'Our experts are here to help! Contact us to request a free, data-backed analysis of your company\'s content strategy. (Limited time only)',
];

const CUSTOM_CONTENT_STRATEGY = [
  'Our experts can help you develop a content strategy that is optimized to your business. Request your free consultation below. (Limited time only)',
  'We can help you maximize the power of your editorial calendar. We are offering free consultations for a limited time.',
];

const SPECIFIC_VIDEO_IDEAS = [
  'Wondering what your company\'s next video should be? Our experts can help you identify marketing videos that are optimized to achieve your company goals. Request your free consultation below.',
];

const DEFAULT_TAGLINE = 'Need help with your b2b video?';

const ADS_TO_TAGLINES = {
  1: CUSTOM_CONTENT_STRATEGY,
  2: CUSTOM_CONTENT_STRATEGY,
  3: ANALYTICS_OF_STRATEGY,
  4: ANALYTICS_OF_STRATEGY,
  5: SPECIFIC_VIDEO_IDEAS,
  6: SPECIFIC_VIDEO_IDEAS,
  7: SPECIFIC_VIDEO_IDEAS,
};

class LandingPage extends React.Component {
  constructor(props) {
    super();
    const { adId } = props;
    let tagline = DEFAULT_TAGLINE;
    if (adId) {
      tagline = getRandomTagline(ADS_TO_TAGLINES[adId]);
    }
    this.state = { confirm: false, error: null, tagline };
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  hideModal = () => { this.setState({ confirm: false }); }

  handleSubmit = () => {
    const data = { event: 'landing_page_submit', ...this.state, adId: this.props.adId };
    Meteor.call('postRequest', data, (err) => {
      if (err) {
        this.setState({ error: err });
      } else {
        this.setState({
          confirm: true, first: '', last: '', company: '', email: '', website: '', about: '',
        });
      }
    });
  }

  render() {
    const {
      confirm, first, last, email, about, company, website, tagline,
    } = this.state;
    return (
      <div style={{ height: '100%' }} onClick={this.hideSidebar}>
        <Responsive
          as={Container}
          maxWidth={1085}
          style={{
            position: 'absolute', top: 0, left: 0, height: '100%', opacity: '.1',
          }}
          src="/mobile2.png"
        >
          <Image src="/mobile2.png" />
        </Responsive>
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
            className="signup"
            mobile={16}
            tablet={16}
            computer={8}
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
                  width={2}
                  align="center"
                  verticalAlign="middle"
                />
                <Grid.Column
                  width={12}
                  align="center"
                  verticalAlign="middle"
                >
                  <Header align="center" as="h4">
                    { tagline }
                  </Header>
                </Grid.Column>
                <Grid.Column
                  width={2}
                  align="center"
                  verticalAlign="middle"
                />
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
                        <Form.Input
                          onChange={this.handleChange}
                          placeholder="Company Website"
                          name="website"
                          value={website}
                          required
                        />
                      </Form.Field>
                      <Form.Field>
                        <Form.TextArea
                          onChange={this.handleChange}
                          placeholder="Anything else you would like to add?"
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
            style={{ height: '100%', padding: 0 }}
            align="center"
            verticalAlign="middle"
            mobile={16}
            tablet={16}
            computer={8}
          >
            <Responsive as={Image} minWidth={1086} src="/sidebar4.png" style={{ height: '100%', opacity: 0.7, width: '100%' }} />
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
        <span className="copyright"> Copyright Freedeo Corporation Inc. 2018-2019 </span>
      </div>
    );
  }
}

function getRandomTagline(taglines) {
  const min = 0;
  const max = taglines.length;
  // shamelessly copied from https://www.geeksforgeeks.org/javascript-math-random-function/
  const random = Math.random() * (+max - +min) + +min;
  const index = Math.floor(random);
  return taglines[index];
}

export default LandingPage;
