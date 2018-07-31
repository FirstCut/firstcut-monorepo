
import SimpleSchema from 'simpl-schema';

const RegEx = {
  Email: SimpleSchema.RegEx.Email,
  Phone: SimpleSchema.RegEx.Phone,
  Url: SimpleSchema.RegEx.Url,
}

export default RegEx;
