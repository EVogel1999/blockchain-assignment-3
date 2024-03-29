import './App.css';
import { ethers } from 'ethers';
import abi from './utils/career-fair.json';
import React, { useState } from 'react';

function App() {

  // State
  const [attendees, setAttendees, companyName, setCompanyName, currentAccount, setCurrentAccount] = useState('');

  // Ethereum info
  const ethereum = window.ethereum;
  const contractAddress = '0x8C30De044Bc4Ded6610b474fFBF798577680D69f';
  const contractABI = abi.abi;

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        console.log('No ETH wallet detected');
        return;
      }
      console.log('ETH detected');

      // Connect to metamask wallet
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setCurrentAccount(accounts[0]);
    } catch (e) {
      alert('Wallet could not be connected');
    }
  }

  const enroll = async () => {
    try {
      if (!ethereum) {
        console.log('No ETH wallet detected');
        return;
      }
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.enroll();
      await tx.wait();
    } catch (e) {
      alert('You are already enrolled in the career fair');
    }
  }

  const addCompany = async () => {
    try {
      if (!ethereum) {
        console.log('No ETH wallet detected');
        return;
      }
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.add(companyName);
      await tx.wait();
    } catch (e) {
      alert('Only the owner can add a company');
    }
  }

  const getAttendees = async () => {
    try {
      if (!ethereum) {
        console.log('No ETH wallet detected');
        return;
      }
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const attendees = await contract.getAttendees();
      setAttendees(attendees.filter(student => student !== '0x0000000000000000000000000000000000000000'));
    } catch (e) {
      console.error(e);
    }
  }

  const unenroll = async () => {
    try {
      if (!ethereum) {
        console.log('No ETH wallet detected');
        return;
      }
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.unenroll();
      await tx.wait();
    } catch (e) {
      alert('You are not enrolled in the career fair');
    }
  }

  const list = (
    <ul>
      {(attendees || []).map(student => <li key={student}>{student}</li>)}
    </ul>
  );

  return (
    <div className="App">
      {!currentAccount && (
        <button onClick={connectWallet}>
          Connect Wallet
        </button>
      )}
      <br />
      <div>
        <input value={companyName} onInput={e => setCompanyName(e.target.value)} placeholder='Coinbase'></input>
        <button onClick={addCompany}>Add Company</button>
      </div>
      <br />
      <button onClick={enroll}>Enroll</button>
      <button onClick={unenroll}>Unenroll</button>
      <br />
      <button onClick={getAttendees}>See Attendees</button>
      <hr />
      <h1>Career Fair Attendees</h1>
      {(attendees && attendees.length > 0) && list}
      {!(attendees && attendees.length > 0) && <p>No one is enrolled</p>}
    </div>
  );
}

export default App;
