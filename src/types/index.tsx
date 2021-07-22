import { Contract } from 'web3-eth-contract';

export interface IContract {
	contract: Contract;
	address: string;
}

export interface PoolInfo {
	stakeToken: string;
	rewardToken: string;
	rewardRate: number;
	lockupDuration: number;
}

export interface StakeInfo {
	stakeToken: string;
	rewardToken: string;
	amount: number;
	rewardAmount: number;
	endTime: number;
}

export enum WalletType {
	MetaMask = 'metamask',
	WalletConnect = 'walletconnect',
}
