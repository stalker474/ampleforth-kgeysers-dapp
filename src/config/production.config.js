const config = {
	infuraProvider: 'wss://kovan.infura.io/ws/v3/00233ca8f2c74d0c97ae3af7b9f80953',
	erc20ABI: [{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"showMeTheMoney","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}],
	uFragmentABI: [
	  {
		"constant": true,
		"inputs": [],
		"name": "BONUS_DECIMALS",
		"outputs": [
		  {
			"name": "",
			"type": "uint256"
		  }
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	  },
	  {
		"constant": true,
		"inputs": [],
		"name": "startBonus",
		"outputs": [
		  {
			"name": "",
			"type": "uint256"
		  }
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	  },
	  {
		"constant": true,
		"inputs": [
		  {
			"name": "",
			"type": "uint256"
		  }
		],
		"name": "unlockSchedules",
		"outputs": [
		  {
			"name": "initialLockedShares",
			"type": "uint256"
		  },
		  {
			"name": "unlockedShares",
			"type": "uint256"
		  },
		  {
			"name": "lastUnlockTimestampSec",
			"type": "uint256"
		  },
		  {
			"name": "endAtSec",
			"type": "uint256"
		  },
		  {
			"name": "durationSec",
			"type": "uint256"
		  },
		  {
			"name": "positiveRebaseBonus",
			"type": "uint256"
		  },
		  {
			"name": "negativeRebaseBonus",
			"type": "uint256"
		  },
		  {
			"name": "deltaCounter",
			"type": "int256"
		  }
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	  },
	  {
		"constant": true,
		"inputs": [],
		"name": "supportsHistory",
		"outputs": [
		  {
			"name": "",
			"type": "bool"
		  }
		],
		"payable": false,
		"stateMutability": "pure",
		"type": "function"
	  },
	  {
		"constant": true,
		"inputs": [],
		"name": "totalStakingShares",
		"outputs": [
		  {
			"name": "",
			"type": "uint256"
		  }
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	  },
	  {
		"constant": false,
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	  },
	  {
		"constant": true,
		"inputs": [],
		"name": "bonusPeriodSec",
		"outputs": [
		  {
			"name": "",
			"type": "uint256"
		  }
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	  },
	  {
		"constant": true,
		"inputs": [],
		"name": "totalLockedShares",
		"outputs": [
		  {
			"name": "",
			"type": "uint256"
		  }
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	  },
	  {
		"constant": true,
		"inputs": [],
		"name": "REBASE_BONUS_DECIMALS",
		"outputs": [
		  {
			"name": "",
			"type": "uint256"
		  }
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	  },
	  {
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
		  {
			"name": "",
			"type": "address"
		  }
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	  },
	  {
		"constant": true,
		"inputs": [],
		"name": "isOwner",
		"outputs": [
		  {
			"name": "",
			"type": "bool"
		  }
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	  },
	  {
		"constant": true,
		"inputs": [],
		"name": "AMPLContract",
		"outputs": [
		  {
			"name": "",
			"type": "address"
		  }
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	  },
	  {
		"constant": false,
		"inputs": [
		  {
			"name": "newOwner",
			"type": "address"
		  }
		],
		"name": "transferOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	  },
	  {
		"inputs": [
		  {
			"name": "stakingToken",
			"type": "address"
		  },
		  {
			"name": "distributionToken",
			"type": "address"
		  },
		  {
			"name": "maxUnlockSchedules",
			"type": "uint256"
		  },
		  {
			"name": "startBonus_",
			"type": "uint256"
		  },
		  {
			"name": "bonusPeriodSec_",
			"type": "uint256"
		  },
		  {
			"name": "initialSharesPerToken",
			"type": "uint256"
		  },
		  {
			"name": "AMPLContractAddress",
			"type": "address"
		  }
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	  },
	  {
		"anonymous": false,
		"inputs": [
		  {
			"indexed": true,
			"name": "user",
			"type": "address"
		  },
		  {
			"indexed": false,
			"name": "amount",
			"type": "uint256"
		  },
		  {
			"indexed": false,
			"name": "total",
			"type": "uint256"
		  },
		  {
			"indexed": false,
			"name": "data",
			"type": "bytes"
		  }
		],
		"name": "Staked",
		"type": "event"
	  },
	  {
		"anonymous": false,
		"inputs": [
		  {
			"indexed": true,
			"name": "user",
			"type": "address"
		  },
		  {
			"indexed": false,
			"name": "amount",
			"type": "uint256"
		  },
		  {
			"indexed": false,
			"name": "total",
			"type": "uint256"
		  },
		  {
			"indexed": false,
			"name": "data",
			"type": "bytes"
		  }
		],
		"name": "Unstaked",
		"type": "event"
	  },
	  {
		"anonymous": false,
		"inputs": [
		  {
			"indexed": true,
			"name": "user",
			"type": "address"
		  },
		  {
			"indexed": false,
			"name": "amount",
			"type": "uint256"
		  }
		],
		"name": "TokensClaimed",
		"type": "event"
	  },
	  {
		"anonymous": false,
		"inputs": [
		  {
			"indexed": false,
			"name": "amount",
			"type": "uint256"
		  },
		  {
			"indexed": false,
			"name": "durationSec",
			"type": "uint256"
		  },
		  {
			"indexed": false,
			"name": "total",
			"type": "uint256"
		  }
		],
		"name": "TokensLocked",
		"type": "event"
	  },
	  {
		"anonymous": false,
		"inputs": [
		  {
			"indexed": false,
			"name": "amount",
			"type": "uint256"
		  },
		  {
			"indexed": false,
			"name": "total",
			"type": "uint256"
		  }
		],
		"name": "TokensUnlocked",
		"type": "event"
	  },
	  {
		"anonymous": false,
		"inputs": [
		  {
			"indexed": false,
			"name": "id",
			"type": "uint256"
		  },
		  {
			"indexed": false,
			"name": "bonusShares",
			"type": "uint256"
		  }
		],
		"name": "ScheduleRebaseReward",
		"type": "event"
	  },
	  {
		"anonymous": false,
		"inputs": [
		  {
			"indexed": true,
			"name": "previousOwner",
			"type": "address"
		  },
		  {
			"indexed": true,
			"name": "newOwner",
			"type": "address"
		  }
		],
		"name": "OwnershipTransferred",
		"type": "event"
	  },
	  {
		"constant": false,
		"inputs": [],
		"name": "rewardRebase",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	  },
	  {
		"constant": true,
		"inputs": [],
		"name": "getStakingToken",
		"outputs": [
		  {
			"name": "",
			"type": "address"
		  }
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	  },
	  {
		"constant": true,
		"inputs": [],
		"name": "getDistributionToken",
		"outputs": [
		  {
			"name": "",
			"type": "address"
		  }
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	  },
	  {
		"constant": false,
		"inputs": [
		  {
			"name": "amount",
			"type": "uint256"
		  },
		  {
			"name": "data",
			"type": "bytes"
		  }
		],
		"name": "stake",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	  },
	  {
		"constant": false,
		"inputs": [
		  {
			"name": "user",
			"type": "address"
		  },
		  {
			"name": "amount",
			"type": "uint256"
		  },
		  {
			"name": "data",
			"type": "bytes"
		  }
		],
		"name": "stakeFor",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	  },
	  {
		"constant": false,
		"inputs": [
		  {
			"name": "amount",
			"type": "uint256"
		  },
		  {
			"name": "data",
			"type": "bytes"
		  }
		],
		"name": "unstake",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	  },
	  {
		"constant": false,
		"inputs": [
		  {
			"name": "amount",
			"type": "uint256"
		  }
		],
		"name": "unstakeQuery",
		"outputs": [
		  {
			"name": "",
			"type": "uint256"
		  }
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	  },
	  {
		"constant": true,
		"inputs": [
		  {
			"name": "addr",
			"type": "address"
		  }
		],
		"name": "totalStakedFor",
		"outputs": [
		  {
			"name": "",
			"type": "uint256"
		  }
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	  },
	  {
		"constant": true,
		"inputs": [],
		"name": "totalStaked",
		"outputs": [
		  {
			"name": "",
			"type": "uint256"
		  }
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	  },
	  {
		"constant": true,
		"inputs": [],
		"name": "token",
		"outputs": [
		  {
			"name": "",
			"type": "address"
		  }
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	  },
	  {
		"constant": false,
		"inputs": [],
		"name": "updateAccounting",
		"outputs": [
		  {
			"name": "",
			"type": "uint256"
		  },
		  {
			"name": "",
			"type": "uint256"
		  },
		  {
			"name": "",
			"type": "uint256"
		  },
		  {
			"name": "",
			"type": "uint256"
		  },
		  {
			"name": "",
			"type": "uint256"
		  },
		  {
			"name": "",
			"type": "uint256"
		  }
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	  },
	  {
		"constant": true,
		"inputs": [],
		"name": "totalLocked",
		"outputs": [
		  {
			"name": "",
			"type": "uint256"
		  }
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	  },
	  {
		"constant": true,
		"inputs": [],
		"name": "totalUnlocked",
		"outputs": [
		  {
			"name": "",
			"type": "uint256"
		  }
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	  },
	  {
		"constant": true,
		"inputs": [],
		"name": "unlockScheduleCount",
		"outputs": [
		  {
			"name": "",
			"type": "uint256"
		  }
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	  },
	  {
		"constant": false,
		"inputs": [
		  {
			"name": "amount",
			"type": "uint256"
		  },
		  {
			"name": "durationSec",
			"type": "uint256"
		  },
		  {
			"name": "bonusPositiveRebase",
			"type": "uint256"
		  },
		  {
			"name": "bonusNegativeRebase",
			"type": "uint256"
		  }
		],
		"name": "lockTokens",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	  },
	  {
		"constant": false,
		"inputs": [],
		"name": "unlockTokens",
		"outputs": [
		  {
			"name": "",
			"type": "uint256"
		  }
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	  }
	],
	GeyserABI: [
		{
		  "constant": false,
		  "inputs": [
			{
			  "name": "amount",
			  "type": "uint256"
			},
			{
			  "name": "data",
			  "type": "bytes"
			}
		  ],
		  "name": "stake",
		  "outputs": [],
		  "payable": false,
		  "stateMutability": "nonpayable",
		  "type": "function"
		},
		{
		  "constant": false,
		  "inputs": [
			{
			  "name": "user",
			  "type": "address"
			},
			{
			  "name": "amount",
			  "type": "uint256"
			},
			{
			  "name": "data",
			  "type": "bytes"
			}
		  ],
		  "name": "stakeFor",
		  "outputs": [],
		  "payable": false,
		  "stateMutability": "nonpayable",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [],
		  "name": "totalRewardTokens",
		  "outputs": [
			{
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [],
		  "name": "BONUS_DECIMALS",
		  "outputs": [
			{
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [],
		  "name": "getDistributionToken",
		  "outputs": [
			{
			  "name": "",
			  "type": "address"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [],
		  "name": "bonusNegativeRebase",
		  "outputs": [
			{
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [],
		  "name": "startBonus",
		  "outputs": [
			{
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": false,
		  "inputs": [],
		  "name": "updateAccounting",
		  "outputs": [
			{
			  "name": "",
			  "type": "uint256"
			},
			{
			  "name": "",
			  "type": "uint256"
			},
			{
			  "name": "",
			  "type": "uint256"
			},
			{
			  "name": "",
			  "type": "uint256"
			},
			{
			  "name": "",
			  "type": "uint256"
			},
			{
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "payable": false,
		  "stateMutability": "nonpayable",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [
			{
			  "name": "addr",
			  "type": "address"
			}
		  ],
		  "name": "totalStakedFor",
		  "outputs": [
			{
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [],
		  "name": "totalLocked",
		  "outputs": [
			{
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [
			{
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "name": "unlockSchedules",
		  "outputs": [
			{
			  "name": "initialLockedShares",
			  "type": "uint256"
			},
			{
			  "name": "unlockedShares",
			  "type": "uint256"
			},
			{
			  "name": "lastUnlockTimestampSec",
			  "type": "uint256"
			},
			{
			  "name": "endAtSec",
			  "type": "uint256"
			},
			{
			  "name": "durationSec",
			  "type": "uint256"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [],
		  "name": "supportsHistory",
		  "outputs": [
			{
			  "name": "",
			  "type": "bool"
			}
		  ],
		  "payable": false,
		  "stateMutability": "pure",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [],
		  "name": "totalStakingShares",
		  "outputs": [
			{
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": false,
		  "inputs": [],
		  "name": "renounceOwnership",
		  "outputs": [],
		  "payable": false,
		  "stateMutability": "nonpayable",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [],
		  "name": "lastAMPLTotalSupply",
		  "outputs": [
			{
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [],
		  "name": "bonusPeriodSec",
		  "outputs": [
			{
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [],
		  "name": "totalStaked",
		  "outputs": [
			{
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [],
		  "name": "totalLockedShares",
		  "outputs": [
			{
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": false,
		  "inputs": [
			{
			  "name": "amount",
			  "type": "uint256"
			}
		  ],
		  "name": "unstakeQuery",
		  "outputs": [
			{
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "payable": false,
		  "stateMutability": "nonpayable",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [],
		  "name": "bonusPositiveRebase",
		  "outputs": [
			{
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": false,
		  "inputs": [
			{
			  "name": "amount",
			  "type": "uint256"
			},
			{
			  "name": "durationSec",
			  "type": "uint256"
			}
		  ],
		  "name": "lockTokens",
		  "outputs": [],
		  "payable": false,
		  "stateMutability": "nonpayable",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [],
		  "name": "REBASE_BONUS_DECIMALS",
		  "outputs": [
			{
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [],
		  "name": "owner",
		  "outputs": [
			{
			  "name": "",
			  "type": "address"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [],
		  "name": "isOwner",
		  "outputs": [
			{
			  "name": "",
			  "type": "bool"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [],
		  "name": "getStakingToken",
		  "outputs": [
			{
			  "name": "",
			  "type": "address"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [],
		  "name": "totalUnlocked",
		  "outputs": [
			{
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [],
		  "name": "AMPLContract",
		  "outputs": [
			{
			  "name": "",
			  "type": "address"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [],
		  "name": "unlockScheduleCount",
		  "outputs": [
			{
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": false,
		  "inputs": [
			{
			  "name": "amount",
			  "type": "uint256"
			},
			{
			  "name": "data",
			  "type": "bytes"
			}
		  ],
		  "name": "unstake",
		  "outputs": [],
		  "payable": false,
		  "stateMutability": "nonpayable",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [],
		  "name": "_unlockedPool",
		  "outputs": [
			{
			  "name": "",
			  "type": "address"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": false,
		  "inputs": [
			{
			  "name": "newOwner",
			  "type": "address"
			}
		  ],
		  "name": "transferOwnership",
		  "outputs": [],
		  "payable": false,
		  "stateMutability": "nonpayable",
		  "type": "function"
		},
		{
		  "constant": false,
		  "inputs": [],
		  "name": "unlockTokens",
		  "outputs": [
			{
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "payable": false,
		  "stateMutability": "nonpayable",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [],
		  "name": "token",
		  "outputs": [
			{
			  "name": "",
			  "type": "address"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "inputs": [
			{
			  "name": "stakingToken",
			  "type": "address"
			},
			{
			  "name": "distributionToken",
			  "type": "address"
			},
			{
			  "name": "maxUnlockSchedules",
			  "type": "uint256"
			},
			{
			  "name": "startBonus_",
			  "type": "uint256"
			},
			{
			  "name": "bonusPeriodSec_",
			  "type": "uint256"
			},
			{
			  "name": "initialSharesPerToken",
			  "type": "uint256"
			},
			{
			  "name": "AMPLContractAddress",
			  "type": "address"
			},
			{
			  "name": "bonusPositiveRebase_",
			  "type": "uint256"
			},
			{
			  "name": "bonusNegativeRebase_",
			  "type": "uint256"
			}
		  ],
		  "payable": false,
		  "stateMutability": "nonpayable",
		  "type": "constructor"
		},
		{
		  "anonymous": false,
		  "inputs": [
			{
			  "indexed": false,
			  "name": "amount",
			  "type": "uint256"
			},
			{
			  "indexed": false,
			  "name": "total",
			  "type": "uint256"
			}
		  ],
		  "name": "RebaseReward",
		  "type": "event"
		},
		{
		  "anonymous": false,
		  "inputs": [
			{
			  "indexed": true,
			  "name": "user",
			  "type": "address"
			},
			{
			  "indexed": false,
			  "name": "amount",
			  "type": "uint256"
			},
			{
			  "indexed": false,
			  "name": "total",
			  "type": "uint256"
			},
			{
			  "indexed": false,
			  "name": "data",
			  "type": "bytes"
			}
		  ],
		  "name": "Staked",
		  "type": "event"
		},
		{
		  "anonymous": false,
		  "inputs": [
			{
			  "indexed": true,
			  "name": "user",
			  "type": "address"
			},
			{
			  "indexed": false,
			  "name": "amount",
			  "type": "uint256"
			},
			{
			  "indexed": false,
			  "name": "total",
			  "type": "uint256"
			},
			{
			  "indexed": false,
			  "name": "data",
			  "type": "bytes"
			}
		  ],
		  "name": "Unstaked",
		  "type": "event"
		},
		{
		  "anonymous": false,
		  "inputs": [
			{
			  "indexed": true,
			  "name": "user",
			  "type": "address"
			},
			{
			  "indexed": false,
			  "name": "amount",
			  "type": "uint256"
			}
		  ],
		  "name": "TokensClaimed",
		  "type": "event"
		},
		{
		  "anonymous": false,
		  "inputs": [
			{
			  "indexed": false,
			  "name": "amount",
			  "type": "uint256"
			},
			{
			  "indexed": false,
			  "name": "durationSec",
			  "type": "uint256"
			},
			{
			  "indexed": false,
			  "name": "total",
			  "type": "uint256"
			}
		  ],
		  "name": "TokensLocked",
		  "type": "event"
		},
		{
		  "anonymous": false,
		  "inputs": [
			{
			  "indexed": false,
			  "name": "amount",
			  "type": "uint256"
			},
			{
			  "indexed": false,
			  "name": "total",
			  "type": "uint256"
			}
		  ],
		  "name": "TokensUnlocked",
		  "type": "event"
		},
		{
		  "anonymous": false,
		  "inputs": [
			{
			  "indexed": true,
			  "name": "previousOwner",
			  "type": "address"
			},
			{
			  "indexed": true,
			  "name": "newOwner",
			  "type": "address"
			}
		  ],
		  "name": "OwnershipTransferred",
		  "type": "event"
		},
		{
		  "constant": false,
		  "inputs": [
			{
			  "name": "amount",
			  "type": "uint256"
			}
		  ],
		  "name": "addRewardRebase",
		  "outputs": [],
		  "payable": false,
		  "stateMutability": "nonpayable",
		  "type": "function"
		},
		{
		  "constant": false,
		  "inputs": [],
		  "name": "rewardRebase",
		  "outputs": [],
		  "payable": false,
		  "stateMutability": "nonpayable",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [],
		  "name": "rewardLeft",
		  "outputs": [
			{
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		}
	  ],
  
	  cryptocompareApiKey : "c4c1fd1cfa02fdf9b785bbb96117210437af260a6f733a1575b36335a770aea4",
	  network : "main"
  };
  
  export default config;
  