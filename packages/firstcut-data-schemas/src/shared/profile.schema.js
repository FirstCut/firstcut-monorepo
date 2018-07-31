
import RegEx from 'firstcut-regex';

const ProfileSchema = Object.freeze({
	"firstName": {
		type: String,
		label: "First Name",
		required: true,
	},
	"lastName": {
		type: String,
		label: "Last Name",
		required: true,
	},
	"email": {
		type: String,
		label: "Email",
		regEx: RegEx.Email,
		unique: true,
		required: true,
	},
	"slackHandle": {
		type: String,
		label: "Slack Handle",
	},
	"phone": {
		type: String,
		label: "Phone Number",
	 	regEx: RegEx.Phone
	},
	"profilePicture": {
		type: String,
		label: "Thumbnail URL",
	 	regEx: RegEx.Url
	},
});

export default ProfileSchema;
