import React from "react";
import { useState } from "react";
import { ethers } from "ethers";
import './App.css';

function App() {

  const [account, setAccount] = useState("");

  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0])
    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Set signer
    const signer = provider.getSigner()

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    })

    window.ethereum.on('accountsChanged', async function (accounts) {
      setAccount(accounts[0])
      await web3Handler()
    })
    // loadContracts(signer)
  }


  return (
    <div className="App">

      <button onClick={web3Handler}>Connect</button>

    </div>
  );
}



export default App;
