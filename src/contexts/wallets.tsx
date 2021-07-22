import React, { useCallback, useContext, useEffect, useState } from 'react';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { useWeb3React } from '@web3-react/core';
import { toast } from 'react-toastify';
import config from '../config';
import { WalletType } from 'types';
import { useLocalStorageState } from 'hooks';

export interface IWalletContext {
	connected: boolean;
	address: Maybe<string>;
	connect: (type: WalletType) => void;
}

export const metamaskInjected = new InjectedConnector({
	supportedChainIds: [1, 3, 4, 5, 42, 56, 97],
});

export const walletconnect = new WalletConnectConnector({
	supportedChainIds: [1, 3, 4, 5, 42, 56, 97],
	rpc: {
		1: 'https://mainnet.infura.io/v3/961c775726df4f76b11322b5ee449613',
		3: 'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
		56: 'https://bsc-dataseed.binance.org/',
	},
	bridge: 'https://bridge.walletconnect.org',
	qrcode: true,
	pollingInterval: 12000,
});

const WalletContext = React.createContext<Maybe<IWalletContext>>(null);

export const WalletProvider = ({ children = null as any }) => {
	const [walletType, setWalletType] = useLocalStorageState('wallet_type', '');
	const [connected, setConnected] = useState<boolean>(false);
	const [address, setAddress] = useState<Maybe<string>>(null);

	const { activate, deactivate, active, chainId, account } = useWeb3React();

	const connect = useCallback(
		async (type: WalletType = WalletType.MetaMask) => {
			try {
				if (type === WalletType.MetaMask) {
					await activate(metamaskInjected);
				} else if (type === WalletType.WalletConnect) {
					await activate(walletconnect);
				}
				setWalletType(type.toString());
			} catch (err) {
				toast.error('Wallet connect failed!');
			}
		},
		[activate, setWalletType],
	);

	useEffect(() => {
		if (walletType) {
			if (walletType === 'metamask') {
				connect(WalletType.MetaMask);
			} else if (walletType === 'walletconnect') {
				connect(WalletType.WalletConnect);
			}
		}
	}, [connect, activate, walletType]);

	useEffect(() => {
		if (active) {
			if (chainId) {
				if (chainId === config.networkId) {
					setConnected(true);
					toast.success('Wallet connected successfully!');
				} else {
					deactivate();
					toast.error(`Please connect ${config.networkName}!`);
				}
			}
		} else {
			setConnected(false);
		}
	}, [active, chainId, deactivate]);

	useEffect(() => {
		setAddress(account);
	}, [account]);

	return <WalletContext.Provider value={{ connected, address, connect }}>{children}</WalletContext.Provider>;
};

export const useWallet = () => {
	const context = useContext(WalletContext);

	if (!context) {
		throw new Error('Component rendered outside the provider tree');
	}

	return context;
};
