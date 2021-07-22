import React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useWallet } from 'contexts/wallets';
import { Link } from 'react-router-dom';

import LogoImg from 'assets/image/logo.png';

const useStyles = makeStyles(theme => ({
	toolBar: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 64,
	},
	link: {
		color: 'white',
		textDecoration: 'none',
	},
}));

export const Header = () => {
	const classes = useStyles();
	const { connected, address } = useWallet();

	return (
		<AppBar position="relative" style={{ backgroundColor: 'transparent' }}>
			<Toolbar className={classes.toolBar}>
				<Link className={classes.link} to="/">
					<img src={LogoImg} style={{ width: 60 }} alt="" />
				</Link>

				{connected && <Typography>{address?.slice(0, 10)}...</Typography>}
			</Toolbar>
		</AppBar>
	);
};
