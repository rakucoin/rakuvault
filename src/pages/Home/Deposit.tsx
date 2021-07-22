import React, { useState } from 'react';
import {
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	LinearProgress,
	makeStyles,
	TextField,
	Typography,
} from '@material-ui/core';
import { useStaking } from 'contexts';

const useStyles = makeStyles(() => ({
	container: {
		margin: '20px 0',
	},
	input: {
		margin: 10,
	},
}));

export const Deposit = () => {
	const classes = useStyles();

	const { poolList, deposit, getTokenName } = useStaking();

	const [loading, setLoading] = useState(false);
	const [poolId, setPoolId] = useState('0');
	const [amount, setAmount] = useState('0');

	const getDescription = () => {
		if (isNaN(Number(poolId)) || Number(poolId) < 0 || Number(poolId) >= poolList.length) {
			return 'Pool does not exist';
		}

		let rewardAmount = poolList[Number(poolId)].rewardRate * Number(amount);
		return `You will get ${rewardAmount} ${getTokenName(poolList[Number(poolId)].rewardToken)}`;
	};

	const handleSubmit = async () => {
		setLoading(true);
		await deposit(Number(poolId), Number(amount));
		setLoading(false);
	};

	return (
		<Card className={classes.container} aria-disabled={loading}>
			{loading && <LinearProgress />}

			<CardHeader title="Deposit" />

			<CardContent>
				<TextField
					id="poolId"
					label="Pool Id"
					className={classes.input}
					value={poolId}
					onChange={e => setPoolId(e.target.value)}
					disabled={loading}
				/>

				<TextField
					id="amount"
					label="Amount"
					className={classes.input}
					value={amount}
					onChange={e => setAmount(e.target.value)}
					disabled={loading}
				/>

				<Typography style={{ margin: 10 }}>{getDescription()}</Typography>
			</CardContent>

			<CardActions>
				<Button
					variant="contained"
					color="primary"
					onClick={handleSubmit}
					disabled={!(Number(amount) >= 0 && Number(poolId) >= 0 && Number(poolId) < poolList.length) || loading}
				>
					Deposit
				</Button>
			</CardActions>
		</Card>
	);
};
