import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Box, makeStyles } from '@material-ui/core';
import { ToastContainer } from 'react-toastify';
import { StakingProvider, useWallet } from 'contexts';
import { Header } from 'components/Header';
import { ConnectPage } from './ConnectPage';
import { Home } from './Home';

import BgImg from 'assets/image/bg.jpg';

import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles(theme => ({
	root: {
		height: '100vh',
		background: `url(${BgImg})`,
		backgroundSize: 'cover',
	},
	content: {
		padding: theme.spacing(3),
		boxSizing: 'border-box',
		height: 'calc(100% - 64px)',
	},
}));

export const AppRouter = () => {
	const classes = useStyles();
	const { connected } = useWallet();

	return (
		<StakingProvider>
			<Box className={classes.root}>
				<Header />

				<main className={classes.content}>
					{!connected ? (
						<ConnectPage />
					) : (
						<Switch>
							<Route path="/" component={Home} />
							<Redirect to="/" />
						</Switch>
					)}
				</main>

				<ToastContainer />
			</Box>
		</StakingProvider>
	);
};
