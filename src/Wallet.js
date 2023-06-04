import {React,useEffect,useState} from 'react'
import { ethers } from 'ethers';
import styles from './Wallet.module.css'
import Interaction from './Interaction';
import token_thang_abi from './Contracts/token_thang_abi.json';


const Wallet = () => {

  const contractAddress = '0x8D8E46d19e5c49C5C92f9B563F2B6E437C953C5d'; 

  const [tokenName,setTokenName] = useState("Token");
  const [connButtonText,setConnButtonText] = useState("Connect Wallet");
  const [errorMetamask,setErrorMetamask] = useState(null);
  const [defaultAccount,setDefaultAccount] = useState(null);
  const [balance,setBalance] = useState(null);

  const [provider, setProvider] = useState(null);
  const [signer,setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const connectWalletHandler = () => {
    if(window.ethereum && window.ethereum.isMetaMask) {

      window.ethereum.request({method: 'eth_requestAccounts'}).then(result => {
        accountChangeHandler(result[0])
        setConnButtonText('Wallet Connected');
      })
      .catch(error => {
        setErrorMetamask(error.message);
      })

    } else {
      console.log("install metamask now");
      setErrorMetamask('please install metamask');
    }
  }

  const accountChangeHandler = (newAddress) => {
    setDefaultAccount(newAddress);
    updateEthers();
  }

  const updateEthers = () => {
    let temProvaider = new ethers.providers.Web3Provider(window.ethereum);

    let tempSigner = temProvaider.getSigner();

    let tempContract = new ethers.Contract(contractAddress, token_thang_abi, tempSigner);

    setProvider(temProvaider);
    setSigner(tempSigner);
    setContract(tempContract);
  }

  const updateBalance = async () => {
    let balanceBigN = await contract.balanceOf(defaultAccount);

    let decimals = await contract.decimals();
    let tokenBalance = balanceBigN / Math.pow(10, decimals);

    setBalance(tokenBalance);
    console.log(tokenBalance)
  }

  const updateTokenName = async () => {
    setTokenName(await contract.name());

  }

  useEffect(() => {
    if(contract != null) {
      updateBalance();
      updateTokenName();
    }
  }, [contract])



  return (
    <div>
      <h2> {tokenName + "ERC20 Wallet"}</h2>
      <button className={styles.button6} onClick={connectWalletHandler}>{connButtonText}</button>

      <div className={styles.WalletCard}></div>
      <div>
        <h3> Address: {defaultAccount}</h3>
      </div>
      <div>
        <h3>{tokenName}Balance : {balance}</h3>
      </div>
      {errorMetamask}
    </div>
  );
}

export default Wallet;