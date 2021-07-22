/* eslint-disable react-hooks/exhaustive-deps */
import BigNumber from 'bignumber.js';
import config from 'config';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { PoolInfo, StakeInfo } from 'types';
import { useContracts } from './contracts';
import { useWallet } from './wallets';

export interface IStakingContext {
	timestamp: number;
	poolList: PoolInfo[];
	stakeList: StakeInfo[];
	getTokenName: (tokenAddress: string) => string;
	getBlockTimestamp: () => void;
	getPoolList: () => void;
	getStakingList: () => void;
	getRemainingReward: (tokenAddress: string) => Promise<string>;
	deposit: (poolId: number, amount: number) => void;
	withdraw: (stakeId: number) => void;
}

const StakingContext = React.createContext<Maybe<IStakingContext>>(null);

export const StakingProvider = ({ children = null as any }) => {
	const { address } = useWallet();
	const { web3, stakingContract } = useContracts();

	const [timestamp, setTimestamp] = useState<number>(0);
	const [poolList, setPoolList] = useState<PoolInfo[]>([]);
	const [stakeList, setStakeList] = useState<StakeInfo[]>([]);
	const [tokenNames, setTokenNames] = useState<{ [key: string]: string }>({});

	const getBlockTimestamp = async () => {
		try {
			const blockNumber = await web3.eth.getBlockNumber();
			const block = await web3.eth.getBlock(blockNumber);
			setTimestamp(Number(block.timestamp));
		} catch (e) {
			console.error('get block timestamp error:', e);
		}
	};

	const getRemainingReward = async (tokenAddress: string) => {
		try {
			const res = await stakingContract.contract.methods.getRemainingRewards(tokenAddress).call();
			return web3.utils.fromWei(res);
		} catch (e) {
			console.error('get remaining reward error:', e);
		}
		return '0';
	};

	const getPoolList = async () => {
		let poolCount = 0;
		try {
			poolCount = await stakingContract.contract.methods.getPoolCount().call();
		} catch (e) {
			console.error('get conversion rate error:', e);
		}

		if (Number(poolCount) > 0) {
			const promises = new Array(Number(poolCount))
				.fill(0)
				.map((_, pid) => stakingContract.contract.methods.poolInfo(pid).call());
			await Promise.all(promises).then(res => {
				setPoolList(
					res.map(item => ({
						stakeToken: item[0],
						rewardToken: item[1],
						rewardRate: new BigNumber(item[2]).div(new BigNumber(10).pow(12)).toNumber(),
						lockupDuration: Number(item[3]),
					})),
				);
			});
		} else {
			setPoolList([]);
		}
	};

	const getStakingList = async () => {
		let stakeCount;
		try {
			stakeCount = await stakingContract.contract.methods.getUserStakeCount(address).call();
		} catch (e) {
			console.error('get conversion rate error:', e);
		}

		if (Number(stakeCount) > 0) {
			const promises = new Array(Number(stakeCount))
				.fill(0)
				.map((_, stakeId) => stakingContract.contract.methods.stakeInfo(address, stakeId).call());
			await Promise.all(promises).then(res => {
				const list = res.map(item => ({
					stakeToken: item[0],
					rewardToken: item[1],
					amount: Number(web3.utils.fromWei(item[2])),
					rewardAmount: Number(web3.utils.fromWei(item[3])),
					endTime: Number(item[4]),
				}));

				setStakeList(list.sort((a, b) => a.endTime - b.endTime));
			});
		} else {
			setStakeList([]);
		}
	};

	const deposit = async (poolId: number, amount: number) => {
		if (poolId < 0 || poolId >= poolList.length) {
			toast.error('Pool does not exist');
			return;
		}

		const tokenContract = new web3.eth.Contract(config.tokenAbi as any, poolList[poolId].stakeToken);

		let allowedAmount = 0;

		try {
			allowedAmount = await tokenContract.methods.allowance(address, stakingContract.address).call();
		} catch (err) {
			toast.error(err.message);
			console.error(err);
		}

		if (Number(web3.utils.fromWei(allowedAmount.toString())) < amount) {
			try {
				await tokenContract.methods
					.approve(stakingContract.address, '1000000000000000000000000000000000000000000000000000000')
					.send({ from: address });
			} catch (err) {
				toast.error(err.message);
				console.error(err);
				return;
			}
		}

		try {
			await stakingContract.contract.methods
				.deposit(poolId, web3.utils.toWei(amount.toString()))
				.send({ from: address });

			toast.success('Deposited successfully');

			getPoolList();
			getStakingList();
		} catch (err) {
			toast.error(err.message);
			console.error(err);
		}
	};

	const withdraw = async (stakeId: number) => {
		try {
			await stakingContract.contract.methods.withdraw(stakeId).send({ from: address });

			toast.success('Withdraw successfully');

			getPoolList();
			getStakingList();
		} catch (err) {
			toast.error(err.message);
			console.error(err);
		}
	};

	const updateTokenNames = async () => {
		try {
			const promises = poolList.map(pool => {
				const tokenContract = new web3.eth.Contract(config.tokenAbi as any, pool.rewardToken);
				const tokenName = tokenContract.methods.name().call();
				return tokenName;
			});
			await Promise.all(promises).then(res => {
				let names = {};
				res.forEach((name: string, idx: number) => {
					names = { ...names, [poolList[idx].rewardToken]: name };
				});
				setTokenNames(names);
			});
		} catch (e) {
			console.error('update token names error');
		}
	};

	useEffect(() => {
		updateTokenNames();
	}, [poolList]);

	const getTokenName = (tokenAddress: string) => {
		return tokenNames[tokenAddress] || `Unknown(${tokenAddress})`;
	};

	return (
		<StakingContext.Provider
			value={{
				timestamp,
				poolList,
				stakeList,
				getTokenName,
				getBlockTimestamp,
				getPoolList,
				getStakingList,
				getRemainingReward,
				deposit,
				withdraw,
			}}
		>
			{children}
		</StakingContext.Provider>
	);
};

export const useStaking = () => {
	const context = useContext(StakingContext);

	if (!context) {
		throw new Error('Component rendered outside the provider tree');
	}

	return context;
};
