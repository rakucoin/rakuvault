/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, CardHeader, makeStyles, Typography } from '@material-ui/core';
import { useStaking } from 'contexts';
import { getDurationString } from 'utils';
import { PoolInfo } from 'types';

const useStyles = makeStyles(() => ({
	container: {
		margin: '20px 0',
	},
	content: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	pool: {
		width: 400,
		minHeight: 160,
		borderRadius: 10,
		boxSizing: 'border-box',
		border: '1px solid white',
		padding: 10,
		margin: 10,
	},
}));

export const Pools = () => {
	const classes = useStyles();

	const { poolList, getPoolList } = useStaking();

	useEffect(() => {
		getPoolList();
	}, []);

	return (
		<Card className={classes.container}>
			<CardHeader title="Pools" />

			<CardContent className={classes.content}>
				{poolList.map((pool, pid) => (
					<PoolItem pid={pid} pool={pool} key={pid} />
				))}
			</CardContent>
		</Card>
	);
};

interface IPoolItem {
	pid: number;
	pool: PoolInfo;
}

const PoolItem: React.FC<IPoolItem> = ({ pid, pool }) => {
	const classes = useStyles();

	const { getRemainingReward, getTokenName } = useStaking();

	const [remainingRewards, setRemainingRewards] = useState('0');

	useEffect(() => {
		const updateRemainingReward = async () => {
			const res = await getRemainingReward(pool.rewardToken);
			setRemainingRewards(res);
		};

		updateRemainingReward();
	}, [pool]);

	return (
		<Box className={classes.pool}>
			<Typography>
				<b>Pool ID: {pid}</b>
			</Typography>
			<Typography>
				Staking Token: <b>{getTokenName(pool.stakeToken)}</b>
			</Typography>
			<Typography>
				Reward Token: <b>{getTokenName(pool.rewardToken)}</b>
			</Typography>
			<Typography>
				Reward: <b>{pool.rewardRate}</b> {getTokenName(pool.rewardToken)} for 1 {getTokenName(pool.stakeToken)}
			</Typography>
			<Typography>
				Lockup Duration: <b>{getDurationString(pool.lockupDuration)}</b>
			</Typography>
			<Typography>
				Remaining Reward: <b>{remainingRewards}</b> {getTokenName(pool.rewardToken)}
			</Typography>
		</Box>
	);
};
