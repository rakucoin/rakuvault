/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, CardHeader, LinearProgress, makeStyles, Typography } from '@material-ui/core';
import { useStaking } from 'contexts';
import { getDurationString } from 'utils';

const useStyles = makeStyles(() => ({
	container: {
		margin: '20px 0',
	},
	item: {
		width: '100%',
		height: 50,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderRadius: 10,
		boxSizing: 'border-box',
		border: '1px solid white',
		margin: '10px 0',
		padding: 10,
	},
}));

export const StakingList = () => {
	const classes = useStyles();

	const { timestamp, poolList, stakeList, getBlockTimestamp, getStakingList, withdraw, getTokenName } = useStaking();

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		getBlockTimestamp();
		getStakingList();
	}, []);

	const handleWithdraw = async (stakeId: number, claim: boolean) => {
		if (!claim) {
			window.alert('Lock period is not passed. You will get no reward.');
		}
		setLoading(true);
		await withdraw(stakeId);
		setLoading(false);
	};

	return (
		<Card className={classes.container}>
			{loading && <LinearProgress />}

			<CardHeader title="My Staking List" />

			<CardContent>
				{poolList &&
					poolList.length > 0 &&
					stakeList.map((item, idx) => {
						const remaining = item.endTime - timestamp;
						const passed = timestamp && remaining < 0;

						return (
							<Box className={classes.item} key={idx}>
								<Typography style={{ width: 300 }}>
									Amount:{' '}
									<b>
										{item.amount} {getTokenName(item.stakeToken)}
									</b>
								</Typography>
								<Typography style={{ width: 300 }}>
									Reward Amount:{' '}
									<b>
										{item.rewardAmount} {getTokenName(item.rewardToken)}
									</b>
								</Typography>
								<Typography style={{ width: 300 }}>
									{!passed && timestamp ? `${getDurationString(remaining)} remaining` : ''}
								</Typography>
								<Button
									variant="contained"
									color={passed ? 'primary' : 'secondary'}
									style={{ width: 100 }}
									onClick={() => handleWithdraw(idx, !!passed)}
									disabled={loading}
								>
									{passed ? 'Claim' : 'Withdraw'}
								</Button>
							</Box>
						);
					})}
			</CardContent>
		</Card>
	);
};
