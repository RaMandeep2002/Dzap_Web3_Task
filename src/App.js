import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// here is the contract address
const contractAddress = '0xaC4B76D96CD3074dB649D2c6DE9FcE973152DA6d';
// here is the token contract address in which we have to user to stake and unstake a token
const tokencontractaddress = '0x63F7a20eF2C7E5A77A578Ca97762cdd1fE710589';
// here is the contract abi for  our staking and unstaking smart contract
const contractAbi = [
  {
    inputs: [
      { internalType: 'address', name: '_tokenAddress', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'bitamount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_user', type: 'address' }],
    name: 'divideAmountToTwoWallet',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'exchange_wallet_one',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'exchange_wallet_two',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'mainAddress',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_userAddress', type: 'address' },
      { internalType: 'uint256', name: '_bitamount', type: 'uint256' },
      { internalType: 'uint256', name: '_benfitAmount', type: 'uint256' },
    ],
    name: 'onCloseBit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_userAddress', type: 'address' },
      { internalType: 'uint256', name: '_bitamount', type: 'uint256' },
      { internalType: 'address', name: '_exchangewalletone', type: 'address' },
      { internalType: 'address', name: '_exchangewallettwo', type: 'address' },
    ],
    name: 'onStartBit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'token',
    outputs: [{ internalType: 'contract ERC20', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'transfertomainWallet',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'useraddress',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
];
// here is the token contract abi for our approve the token to the contract
const tokencontractabi = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'allowance', type: 'uint256' },
      { internalType: 'uint256', name: 'needed', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'address', name: 'sender', type: 'address' },
      { internalType: 'uint256', name: 'balance', type: 'uint256' },
      { internalType: 'uint256', name: 'needed', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'approver', type: 'address' }],
    name: 'ERC20InvalidApprover',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'receiver', type: 'address' }],
    name: 'ERC20InvalidReceiver',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'sender', type: 'address' }],
    name: 'ERC20InvalidSender',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'spender', type: 'address' }],
    name: 'ERC20InvalidSpender',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

function App() {
  const [provider, setProvider] = useState(null);
  const [contractBit, setContractBit] = useState(null);
  const [contracttoken, setContracttoken] = useState(null);
  const [formType, setFormType] = useState('bitAmount');
  const [account, setAccount] = useState('');
  const [useraddress, setUserAddress] = useState('0');
  const [bitamount, setBitAmount] = useState('0');
  const [walletone, setWalletOne] = useState('0');
  const [wallettwo, setWalletTwo] = useState('0');
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    async function init() {
      // Connect to the Ethereum provider (e.g., MetaMask)
      if (window.ethereum) {
        const ethereumProvider = new ethers.providers.Web3Provider(
          window.ethereum
        );
        const signer = ethereumProvider.getSigner();

        // Create a contract instance
        const bitcontract = new ethers.Contract(
          contractAddress,
          contractAbi,
          signer
        );
        const tokencontract = new ethers.Contract(
          tokencontractaddress,
          tokencontractabi,
          signer
        );

        setProvider(ethereumProvider);
        setContractBit(bitcontract);
        setContracttoken(tokencontract);

        // Get the connected account
        const accounts = await ethereumProvider.listAccounts();
        setAccount(accounts[0]);
      } else {
        console.log('Please install MetaMask!');
      }
    }

    init();
  }, []);
  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
  }, [walletAddress]);
  // IN this following fiunction connected the metamask to our Dapp
  const connectWallet = async () => {
    if (typeof window != 'undefined' && typeof window.ethereum != 'undefined') {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setWalletAddress(accounts[0]);
        // console.log(accounts[0]);
      } catch (error) {
        console.error(error.message);
      }
    } else {
      alert('Please Install Metamask!');
    }
  };

  // IN this funciton we have  a function that will get current wallet connect
  const getCurrentWalletConnected = async () => {
    if (
      typeof window !== 'undefined' &&
      typeof window.ethereum !== 'undefined'
    ) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          // console.log(accounts[0]);
        } else {
          alert('Connect to MetaMask using the Connect button');
        }
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      alert('Please install MetaMask');
    }
  };

  const addWalletListener = async () => {
    if (
      typeof window !== 'undefined' &&
      typeof window.ethereum !== 'undefined'
    ) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setWalletAddress(accounts[0]);
      });
    } else {
      /* MetaMask is not installed */
      setWalletAddress('');
      alert('Please install MetaMask');
    }
  };

  //In this function we perform the staking function
  // firstly, we have to minted the supply token to our walllet
  // then, we will approve the contract to spend
  // then we can call the stake function

  const bitstart = async () => {
    try {
      // await contracttoken.approve(account, stakeAmount);
      await contracttoken.approve(contractAddress, bitamount);
      await contractBit.onStartBit(
        useraddress,
        bitamount,
        walletone,
        wallettwo,
        { gasLimit: 500000 }
      );
      alert('Staking successful');
    } catch (err) {
      alert('Some erroe happing in contract!!!');
    }
  };
  const divideamount = async () => {
    // console.log('It is a divide amount');
    try {
      // await contracttoken.approve(useraddress, ethers.utils.parseEther('1000'));
      // console.log('check1');
      // await contracttoken.approve(
      //   contractAddress,
      //   ethers.utils.parseEther('1000')
      // );
      // console.log('check2');
      // await contractBit.divideAmountToTwoWallet(useraddress, {
      //   gasLimit: 500000,
      // });
    } catch (err) {
      console.log('Some erroe happing in contract!!!', err);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 flex justify-center items-center">
      {/* <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 flex justify-center items-center py-12"> */}
      <div className="flex gap-8">
        <div className="bg-white rounded-lg shadow-lg p-8 w-[800px]">
          <h1 className="text-3xl font-bold text-center text-indigo-800 mb-6">
            Bit Contract Interaction
          </h1>
          <div className="mb-6 flex justify-center items-center">
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 w-[200px]"
              onClick={connectWallet}
            >
              Connect Metamask
            </button>
            <p className="text-md mt-4 mb-4 ml-5 font-medium text-gray-700 text-center">
              {walletAddress && walletAddress.length > 0
                ? `Connected: ${walletAddress.substring(
                    0,
                    6
                  )}...${walletAddress.substring(38)}`
                : 'Connect Wallet'}
            </p>
          </div>
          <div className="flex justify-center mb-6">
            <button
              className={`mr-2 py-2 px-4 rounded-full ${
                formType === 'bitAmount'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-300 text-gray-700'
              }`}
              onClick={() => setFormType('bitAmount')}
            >
              On start Bit
            </button>
          </div>
          <form>
            {formType === 'bitAmount' && (
              <div className="flex justify-center items-center">
                <form className="w-[500px]">
                  <h2 className="text-2xl font-bold mb-4 text-indigo-800">
                    On Start Bit Amount
                  </h2>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="userAddress"
                    >
                      User Address
                    </label>
                    <input
                      className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                      id="userAddress"
                      type="text"
                      placeholder="Enter user address"
                      onChange={(e) => setUserAddress(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="bitAmount"
                    >
                      Bit Amount
                    </label>
                    <input
                      className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                      id="bitAmount"
                      type="number"
                      placeholder="Enter bit amount"
                      onChange={(e) => setBitAmount(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="walletOne"
                    >
                      Wallet Address 1
                    </label>
                    <input
                      className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                      id="walletOne"
                      type="text"
                      placeholder="Enter wallet address 1"
                      onChange={(e) => setWalletOne(e.target.value)}
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="walletTwo"
                    >
                      Wallet Address 2
                    </label>
                    <input
                      className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                      id="walletTwo"
                      type="text"
                      placeholder="Enter wallet address 2"
                      onChange={(e) => setWalletTwo(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 w-full"
                    onClick={bitstart}
                  >
                    Start Bit
                  </button>
                </form>
              </div>
            )}
          </form>
        </div>

        {/* Other form components */}
      </div>
      {/* </div> */}
    </div>
  );
}

export default App;
