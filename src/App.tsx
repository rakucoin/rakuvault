import React from 'react';
import { HashRouter } from 'react-router-dom';
import { ContractProvider, WalletProvider } from 'contexts';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { AppRouter } from 'pages/AppRouter';

function App() {
	const getLibrary = (provider: any) => {
		const library = new Web3Provider(provider);
		library.pollingInterval = 8000;
		return library;
	};

	return (
		<Web3ReactProvider getLibrary={getLibrary}>
			<WalletProvider>
				<ContractProvider>
					<HashRouter>
						<AppRouter />
					</HashRouter>
				</ContractProvider>
			</WalletProvider>
		</Web3ReactProvider>
	);
}

export default App;
