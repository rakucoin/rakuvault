/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Pools } from './Pools';
import { Deposit } from './Deposit';
import { StakingList } from './StakingList';

export const Home = () => {
	return (
		<div>
			<Pools />
			<Deposit />
			<StakingList />
		</div>
	);
};
