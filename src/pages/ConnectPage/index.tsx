import React from 'react';
import { Box, Button, makeStyles, Typography } from '@material-ui/core';
import { useWallet } from 'contexts';
import { WalletType } from 'types';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		height: '100%',
	},
	title: {
		marginBottom: theme.spacing(2),
	},
	button: {
		margin: '0.5rem',
		width: '20rem',
	},
}));

export const ConnectPage = () => {
	const classes = useStyles();
	const { connect } = useWallet();

	return (
		<Box className={classes.root}>
			<Typography variant="h5" className={classes.title}>
				Connect your wallet to continue!
			</Typography>

			<Button
				variant="contained"
				color="primary"
				className={classes.button}
				onClick={() => connect(WalletType.MetaMask)}
			>
				Connect To Metamask
			</Button>

			<Button
				variant="contained"
				color="primary"
				className={classes.button}
				onClick={() => connect(WalletType.WalletConnect)}
			>
				WalletConnect
			</Button>
		</Box>
	);
};
