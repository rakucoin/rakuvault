import { createMuiTheme } from '@material-ui/core';

export const myTheme = createMuiTheme();

myTheme.overrides = {
	MuiCard: {
		root: {
			borderRadius: 12,
			boxShadow: '0px 1px 4px grey',
			background: 'black',
			color: 'white',
		},
	},
	MuiCardHeader: {
		root: {
			borderBottom: '1px solid #ddd',
		},
	},
	MuiCardActions: {
		root: {
			padding: 16,
			borderTop: '1px solid #ddd',
		},
	},
	MuiInputLabel: {
		root: {
			color: 'white',
		},
	},
	MuiInputBase: {
		root: {
			color: 'white',
		},
	},
	MuiInput: {
		underline: {
			'&::before': {
				borderColor: 'white',
			},
		},
	},
};
