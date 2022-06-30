import React from "react";
import { useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/MultiSigWallet.json";
import './App.css';

function App() {

  const [account, setAccount] = useState("");
  const [walletContract, setWalletContract] = useState("");
  const [ownersList, setOwnersList] = useState([]);
  const [recepient, setRecepient] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState("");
  const [txnId, setTxnId] = useState("");
  const [connectText, setConnectText] = useState("Connect Wallet");
  const [displayText, setDisplayText] = useState("Connect To Metamask");

  const contractAddress = "0x3b9C5427D3a8E7552D4524BCFDfAeb81B62019fC";
  const ABI = abi.abi;

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
    loadContracts(signer)
    getOwners();
    setConnectText("Connected!");
    setDisplayText("Start a New Transaction")
  }

  const loadContracts = async (signer) => {
    // Get deployed copies of contracts

    setWalletContract(new ethers.Contract(contractAddress, ABI, signer));
  }

  const getOwners = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {

        console.log("fetching Owners");

        setOwnersList(await walletContract.getOwners());
        console.log("fetched!");

      } else {
        console.log("Metamask is not connected");
      }

    } catch (error) {
      console.log(error);
    }
  };

  const getBalance = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {

        console.log("fetching Balance");

        setBalance(await walletContract.getWalletBalance());
        console.log("fetched!");

      } else {
        console.log("Metamask is not connected");
      }

    } catch (error) {
      console.log(error);
    }
  };


  const submitTransaction = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {

        console.log("submitting transactions");

        setDisplayText("Mining Your Request! Please Wait");

        const submitTxn = await walletContract.submit(recepient, parseInt(amount));


        await submitTxn.wait();

        console.log("submitted!");

        setRecepient("");
        setAmount("");
        setDisplayText("");

      } else {
        console.log("Metamask is not connected");
      }

    } catch (error) {
      console.log(error);
    }
  };


  const approveTransaction = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {

        console.log("approving transactions");

        setDisplayText("Mining Your Request! Please Wait");

        const approveTxn = await walletContract.approve(txnId);
        console.log("fetched!");

        await approveTxn.wait();

        setTxnId("");
        setDisplayText("");

      } else {
        console.log("Metamask is not connected");
      }

    } catch (error) {
      console.log(error);
    }
  };


  const revokeTransaction = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {

        console.log("executing transactions");

        setDisplayText("Mining Your Request! Please Wait");

        const revokeTxn = await walletContract.revoke(txnId);
        console.log("revoked!");

        await revokeTxn.wait();

        setTxnId("");
        setDisplayText("");

      } else {
        console.log("Metamask is not connected");
      }

    } catch (error) {
      console.log(error);
    }
  };


  const executeTransaction = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {

        console.log("executing transactions");

        setDisplayText("Mining Your Request! Please Wait");

        const executeTxn = await walletContract.execute(txnId);
        console.log("executed!");

        await executeTxn.wait();

        setTxnId("");
        getBalance();
        setDisplayText("");

      } else {
        console.log("Metamask is not connected");
      }

    } catch (error) {
      console.log(error);
    }
  };

  const recepientEvent = (event) => {
    setRecepient(event.target.value)
  };

  const amountEvent = (event) => {
    setAmount(String(event.target.value))
  };

  const txnIdEvent = (event) => {
    setTxnId(event.target.value)
  };



  const owners = ownersList.map((item, index) => {
    return (
      <div key={index} className="owners">
        <li>{item}</li>
      </div>
    );
  })




  return (
    <div className="App">
      <h1 className="main-title">MultiSig Wallet</h1>
      <button className="connect-wallet-btn" onClick={web3Handler}>{connectText}</button><br />

      <button className="balance" onClick={getBalance}>Get Balance</button>
      <p>{`Balance is ${balance} Wei`}</p>



      <button className="owners" onClick={getOwners}>Show Owners List</button>
      <ol>
        {owners}
      </ol>
      <div className="submit-div">
        <label for="input-address">Send To</label>
        <input type="text" name="input-address" placeholder="Recepient Address"
          onFocus={(e) => e.target.placeholder = ''}
          onBlur={(e) => e.target.placeholder = 'Recepient Address'}
          value={recepient} onChange={recepientEvent} /><br />

        <label for="amount">Amount in Wei</label>
        <input type="number" name="input-address" placeholder="Amount in Wei"
          onFocus={(e) => e.target.placeholder = ''}
          onBlur={(e) => e.target.placeholder = 'Amount in Wei'}
          value={amount} onChange={amountEvent} /><br />

        <button className="submit" onClick={submitTransaction}>Submit Transaction</button> <br />
      </div>

      <div className="approve-div">
        <input type="number" name="transaction id" placeholder="Transaction ID"
          onFocus={(e) => e.target.placeholder = ''}
          onBlur={(e) => e.target.placeholder = 'Transaction ID'}
          value={txnId} onChange={txnIdEvent} /><br />

        <button className="approve" onClick={approveTransaction}>Approve Transaction</button> <br />
      </div>

      <div className="revoke-div">
        <input type="number" name="transaction id" placeholder="Transaction ID"
          onFocus={(e) => e.target.placeholder = ''}
          onBlur={(e) => e.target.placeholder = 'Transaction ID'}
          value={txnId} onChange={txnIdEvent} /><br />

        <button className="revoke" onClick={revokeTransaction}>Revoke Transaction</button> <br />
      </div>

      <div className="execute-div">
        <input type="number" name="transaction id" placeholder="Transaction ID"
          onFocus={(e) => e.target.placeholder = ''}
          onBlur={(e) => e.target.placeholder = 'Transaction ID'}
          value={txnId} onChange={txnIdEvent} /><br />

        <button className="execute" onClick={executeTransaction}>Execute Transaction</button> <br />
      </div> <br />
      <br />

      <h1>{displayText}</h1>





    </div >
  );
}



export default App;
