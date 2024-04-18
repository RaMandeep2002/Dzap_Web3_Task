import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// here is the contract address
const contractAddress = '0x80172E1828fEB51267a7B938AE5a61cA6c0946CE';
// here is the token contract address in which we have to user to stake and unstake a token
const tokencontractaddress = '0x3eaC1E98dd13F76DC238DBbfe2F1A5E5672C14db';
// here is the contract abi for  our staking and unstaking smart contract
const contractAbi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'previousAdmin',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'newAdmin',
        type: 'address',
      },
    ],
    name: 'AdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'beacon',
        type: 'address',
      },
    ],
    name: 'BeaconUpgraded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'staker',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'RewardClaimed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'staker',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'stakedAmount',
        type: 'uint256',
      },
    ],
    name: 'Staked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'TokensRecovered',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'staker',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'stakedAmount',
        type: 'uint256',
      },
    ],
    name: 'Unstaked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'implementation',
        type: 'address',
      },
    ],
    name: 'Upgraded',
    type: 'event',
  },
  {
    inputs: [],
    name: 'claimRewards',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'closeStaking',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'newStartBlock_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'newEndBlock_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'newTotalRewards_',
        type: 'uint256',
      },
    ],
    name: 'extendStaking',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllStakers',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getDetails',
    outputs: [
      {
        internalType: 'bool',
        name: 'isPaused',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'resetClaimDelay',
        type: 'bool',
      },
      {
        internalType: 'address',
        name: 'stakeToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'rewardToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'startBlock',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'endBlock',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'claimDelay',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalRewards',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalFundsStaked',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalRewardsDistributed',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getRewardDetails',
    outputs: [
      {
        internalType: 'uint256',
        name: 'rewardPerBlock',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'accRewardPerShare',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lastCheckpoint',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'staker_',
        type: 'address',
      },
    ],
    name: 'getStakerInfo',
    outputs: [
      {
        internalType: 'bool',
        name: 'exist',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'stakedAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'unclaimedRewards',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'claimCheckpoint',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalRewardsClaimed',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'staker_',
        type: 'address',
      },
    ],
    name: 'getUnclaimedRewardsFor',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner_',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'stakeToken_',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'rewardToken_',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'startBlock_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'endBlock_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'claimDelay_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalRewards_',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'resetClaimDelay_',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'purgedRewards_',
        type: 'bool',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'isLocked',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'proxiableUUID',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'purgedRewards',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to_',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'token_',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount_',
        type: 'uint256',
      },
    ],
    name: 'recoverTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount_',
        type: 'uint256',
      },
    ],
    name: 'stake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'stakerInfo',
    outputs: [
      {
        internalType: 'bool',
        name: 'exist',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'stakedAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'rewardDebt',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'unclaimedRewards',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'claimCheckpoint',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalRewardsClaimed',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner_',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'unstake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'newClaimDelay_',
        type: 'uint256',
      },
    ],
    name: 'updateClaimDelay',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'startBlock_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'endBlock_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalRewards_',
        type: 'uint256',
      },
    ],
    name: 'updateConfig',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: 'purgedRewards_',
        type: 'bool',
      },
    ],
    name: 'updatePurgedReward',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: 'resetClaimDelay_',
        type: 'bool',
      },
    ],
    name: 'updateResetClaimDelay',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: 'isPaused_',
        type: 'bool',
      },
    ],
    name: 'updateStakingStatus',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newImplementation',
        type: 'address',
      },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newImplementation',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'usersProcessed',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
// here is the token contract abi for our approve the token to the contract
const tokencontractabi = [
  {
    inputs: [
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'string', name: 'symbol', type: 'string' },
      { internalType: 'uint8', name: 'decimal', type: 'uint8' },
      { internalType: 'uint256', name: 'supply', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  { inputs: [], name: 'InvalidShortString', type: 'error' },
  {
    inputs: [{ internalType: 'string', name: 'str', type: 'string' }],
    name: 'StringTooLong',
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
  { anonymous: false, inputs: [], name: 'EIP712DomainChanged', type: 'event' },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
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
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
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
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
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
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { internalType: 'bytes1', name: 'fields', type: 'bytes1' },
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'string', name: 'version', type: 'string' },
      { internalType: 'uint256', name: 'chainId', type: 'uint256' },
      { internalType: 'address', name: 'verifyingContract', type: 'address' },
      { internalType: 'bytes32', name: 'salt', type: 'bytes32' },
      { internalType: 'uint256[]', name: 'extensions', type: 'uint256[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_to', type: 'address' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
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
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'nonces',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
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
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' },
      { internalType: 'uint8', name: 'v', type: 'uint8' },
      { internalType: 'bytes32', name: 'r', type: 'bytes32' },
      { internalType: 'bytes32', name: 's', type: 'bytes32' },
    ],
    name: 'permit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
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
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
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
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

function App() {
  const [provider, setProvider] = useState(null);
  const [contractstaking, setContractstaking] = useState(null);
  const [contracttoken, setContracttoken] = useState(null);
  const [account, setAccount] = useState('');
  const [stakeAmount, setAmountstake] = useState('0');
  const [contractDetails, setContractDetails] = useState('');
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
        const stakecontract = new ethers.Contract(
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
        setContractstaking(stakecontract);
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

  const stakeing = async () => {
    try {
      // await contracttoken.approve(account, stakeAmount);
      await contracttoken.approve(contractAddress, stakeAmount);
      await contractstaking.stake(stakeAmount, { gasLimit: 500000 });
      alert('Staking successful');
    } catch (err) {
      alert('Some erroe happing in contract!!!');
    }
  };

  // In this function we perfrom the unstaking function
  // fisrtly, we have to get the amountstaked form contractstaking
  //then we approve the ammount to spendby contracttoken
  // then call the unstake function in contract
  const unstaking = async () => {
    try {
      const getinfo = await contractstaking.getStakerInfo(account);

      const amountstaked = await getinfo.stakedAmount;
      await contracttoken.approve(contractAddress, amountstaked);

      await contractstaking.unstake();
      alert('Successfull Unstake');
    } catch (err) {
      alert('Eroor: UNSTAKING');
    }
  };

  // In this function we perform the claimreward function
  // fisrtly, we have to get the amountstaked form contractstaking
  // then we approve the ammount to spend by contracttoken
  // and finally call the claimReward
  const claimRewards = async () => {
    try {
      const getinfo = await contractstaking.getStakerInfo(account);
      const amountstaked = await getinfo.stakedAmount;
      await contracttoken.approve(contractAddress, amountstaked);
      await contractstaking.claimRewards();

      alert('Successfull claimed Rewards');
    } catch (err) {}
  };
  // read function
  // getDetails  is a function that returns an object with all the information like
  // it includes : isPaused , resetClaimDelay , stakeToken , rewardToken , endBlock, claimDelay, totalRewards , totalFundsStaked, totalRewardsDistributed
  const getDetails = async () => {
    const details = await contractstaking.getDetails();
    const formattedDetails = {
      isPaused: details[0].toString(),
      resetClaimDelay: details[1].toString(),
      stakeToken: details[2],
      rewardToken: details[3],
      startBlock: details[4].toNumber(),
      endBlock: details[5].toNumber(),
      claimDelay: details[6].toNumber(),
      totalRewards: details[7].toString(),
      totalFundsStaked: details[8].toString(),
      totalRewardsDistributed: details[9].toString(),
    };
    setContractDetails(formattedDetails);
  };
  // read function
  // GetStakerInfo  is a function that returns an object with all the information of the staker
  // it includes : exist , stakedAmount , unclaimedRewards , nextclaimtime , claimCheckpoint, totalRewardsClaimed
  const GetStakerInfo = async () => {
    const details = await contractstaking.getStakerInfo(account);
    const getdetails = await contractstaking.getDetails();

    const formattedDetails = {
      exist: details[0].toString(),
      stakedAmount: details[1].toString(),
      unclaimedRewards: details[2].toString(),
      nextclaimtime: details[3].toNumber() + getdetails[6].toNumber(),
      claimCheckpoint: details[3].toString(),
      totalRewardsClaimed: details[4].toNumber(),
    };
    setContractDetails(formattedDetails);
  };
  return (
    <div className="App">
      <h1 className="text-2xl text-center font-bold tracking-wider mt-3">
        Dzap WEB3 Task
      </h1>
      <div className="w-[800px] mx-auto mt-6 p-8 rounded shadow-lg bg-white border border-gray-200">
        <button
          className="bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-700 focus:outline-none"
          onClick={connectWallet}
        >
          Connect Metamask
        </button>
        <p className="text-md mt-4 font-medium leading-normal tracking-tight text-gray-700">
          {walletAddress && walletAddress.length > 0
            ? `Connected Account: ${walletAddress.substring(
                0,
                6
              )}xxx${walletAddress.substring(38)}`
            : 'Connect Wallet'}
        </p>
        <form className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Stake Amount
          </h2>
          <h4 className="font-bold mb-4 text-gray-600">1 MT3 = 1000000</h4>
          <div className="mb-4">
            <label className="block text-gray-600">Amount to Stake:</label>
            <input
              type="number"
              id="stakeAmount"
              placeholder="Enter an amount (1 MT3 = 1000000)"
              className="w-full border rounded-md p-2 focus:outline-none focus:border-blue-500"
              onChange={(e) => setAmountstake(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-700 focus:outline-none"
            onClick={stakeing}
          >
            Stake
          </button>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">
            Unstake Amount
          </h2>

          <button
            type="button"
            className="bg-red-500 text-white rounded-md py-2 px-4 hover:bg-red-700 focus:outline-none"
            onClick={unstaking}
          >
            Unstake
          </button>

          <h2 className="text-2xl mt-8 font-bold mb-4 text-gray-800">
            Claim Rewards
          </h2>

          <button
            type="button"
            className="bg-red-500 text-white rounded-md py-2 px-4 hover:bg-red-700 focus:outline-none"
            onClick={claimRewards}
          >
            Claim Rewards
          </button>

          <h2 className="text-2xl mt-8 font-bold mb-4 text-gray-800">
            Read Function
          </h2>

          <button
            type="button"
            className="bg-red-500 text-white rounded-md py-2 px-4 hover:bg-red-700 focus:outline-none"
            onClick={getDetails}
          >
            Get Details
          </button>
          <button
            type="button"
            className="bg-red-500 ml-4 text-white rounded-md py-2 px-4 hover:bg-red-700 focus:outline-none"
            onClick={GetStakerInfo}
          >
            Get Staker Info
          </button>

          <div className="mt-8">
            <p className="text-gray-700">
              Is Paused: {contractDetails.isPaused}
            </p>
            <p className="text-gray-700">
              Reset Claim Delay: {contractDetails.resetClaimDelay}
            </p>
            <p className="text-gray-700">
              Stake Token: {contractDetails.stakeToken}
            </p>
            <p className="text-gray-700">
              Rewards token: {contractDetails.rewardToken}
            </p>
            <p className="text-gray-700">
              Start Block: {contractDetails.startBlock}
            </p>
            <p className="text-gray-700">
              End Block: {contractDetails.endBlock}
            </p>
            <p className="text-gray-700">
              Claim Delay: {contractDetails.claimDelay}
            </p>
            <p className="text-gray-700">
              Total Rewards: {contractDetails.totalRewards}
            </p>
            <p className="text-gray-700">
              Total Funds Staked: {contractDetails.totalFundsStaked}
            </p>
            <p className="text-gray-700">
              Total Rewards Distributed:{' '}
              {contractDetails.totalRewardsDistributed}
            </p>
          </div>

          <div className="mt-8">
            <p className="text-gray-700">Is exist: {contractDetails.exist}</p>
            <p className="text-gray-700">
              Staked Amount: {contractDetails.stakedAmount}
            </p>
            <p className="text-gray-700">
              Unclaimed Rewards: {contractDetails.unclaimedRewards}
            </p>
            <p className="text-gray-700">
              Claim Checkpoint: {contractDetails.claimCheckpoint}
            </p>
            <p className="text-gray-700">
              Next Claim Time: {contractDetails.nextclaimtime}
            </p>
            <p className="text-gray-700">
              Total Rewards Claimed: {contractDetails.totalRewardsClaimed}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
