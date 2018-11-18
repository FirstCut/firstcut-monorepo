import React from 'react';
import PropTypes from 'prop-types';
import { StripeProvider } from 'react-stripe-elements';

import InjectedCheckoutForm from './checkout.form';

export default function PaymentForm(props) {
  console.log('Payment FORM');
  console.log(props);
  return (
    <StripeProvider apiKey={Meteor.settings.public.stripe.PUBLIC_KEY}>
      <InjectedCheckoutForm />
    </StripeProvider>
  );
}
