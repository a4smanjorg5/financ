import { ByteArray, Hex, Address } from "viem";

export interface AmountOfT {
  expense: boolean;
  amount: BigNumber;
  qty: number;
}

export type BigNumber = bigint | number

export type BytesLike = ByteArray | Hex

export interface DescriptionOfT {
  description: string;
  unit: string;
}

export interface IndexedSecret {
  dest: Address;
  secret: BytesLike;
}

export interface RTargetArgs extends ReportArgs {
  target: Address;
}

export interface ReportArgs { reportId: Hex }

export interface TransactArgs extends ReportArgs {
  transactId: BigNumber;
}

export interface SecretArgs {
  secret: BytesLike;
}

export interface SecretsTransactArgs extends TransactArgs {
  secrets: IndexedSecret[];
}

interface AListAuth { name: 'listAuth' }
interface AListReport { name: 'listReport' }
interface ATxDecimals { name: 'txDecimals' }
interface AGetProblemOfT { name: 'getProblemOfT' }
interface ListTransactionA extends SecretArgs {
  name: 'listTransaction';
}
interface ListTransactionB {
  name: 'listTransaction';
  countDay: number;
}

export type ReadArgs = AListReport
| (ReportArgs & AListAuth)
| (ReportArgs & ATxDecimals)
| (SecretArgs & TransactArgs & AGetProblemOfT)
| (ListTransactionA & {
  start: BigNumber;
  limit: number;
} & ReportArgs)
| (ListTransactionB & {
  year: number;
  month: number;
} & ReportArgs)

export type ReadResult<T> =
  T extends AListAuth ? Address[] :
  T extends AListReport ? Hex[] :
  T extends ATxDecimals ? number :
  T extends AGetProblemOfT ? string :
  T extends ListTransactionA ? {
    data: Transaction[];
    count: number;
  } :
  T extends ListTransactionB ? {
    start: bigint;
    count: bigint;
  } :
  never

export interface BaseTransaction extends DescriptionOfT, AmountOfT {
  recap: number;
}

export interface Transaction extends Omit<BaseTransaction, 'recap'> {
  problem: string;
  created: bigint;
  modified: bigint;
}

export type WriteArgs = {
  name: 'addReport';
  decimals: number;
}
| (RTargetArgs & { name: 'removeAuth' })
| (RTargetArgs & {
  name: 'setAuthLevel';
  level: number;
  signature: BytesLike;
})
| (RTargetArgs & {
  name: 'addEditor';
  signature: BytesLike
})
| (RTargetArgs & { name: 'removeEditor' })
| (Omit<SecretsTransactArgs, 'transactId'> & BaseTransaction & { name: 'addTransaction' })
| (TransactArgs & { name: 'approveTransaction' })
| (ReportArgs & {
  name: 'interceptReport';
  forMins: number;
})
| (TransactArgs & { name: 'removeTransaction' })
| (SecretsTransactArgs & DescriptionOfT & { name: 'updateDescOfT' })
| (SecretsTransactArgs & AmountOfT & { name: 'updateAmountOfT' })
| (SecretsTransactArgs & {
  name: 'setProblemOfT';
  description: string;
})

export const contractABI = () => [
  {
    "inputs": [
      {
        "internalType": "uint16",
        "name": "year",
        "type": "uint16"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "ECDSAInvalidSignature",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "length",
        "type": "uint256"
      }
    ],
    "name": "ECDSAInvalidSignatureLength",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "s",
        "type": "bytes32"
      }
    ],
    "name": "ECDSAInvalidSignatureS",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "name": "Recovered",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "reportId_",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "target",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      }
    ],
    "name": "addEditor",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "decimals",
        "type": "uint8"
      }
    ],
    "name": "addReport",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "reportId_",
        "type": "bytes32"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "dest",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
          }
        ],
        "internalType": "struct FinancialReport.EncryptedData[]",
        "name": "description",
        "type": "tuple[]"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "dest",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
          }
        ],
        "internalType": "struct FinancialReport.EncryptedData[]",
        "name": "amount",
        "type": "tuple[]"
      },
      {
        "internalType": "uint8",
        "name": "recap",
        "type": "uint8"
      }
    ],
    "name": "addTransaction",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "reportId_",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "transactId_",
        "type": "uint256"
      }
    ],
    "name": "approveTransaction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "reportId_",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "transactionId_",
        "type": "uint256"
      }
    ],
    "name": "getProblemOfT",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "initYear",
    "outputs": [
      {
        "internalType": "uint16",
        "name": "",
        "type": "uint16"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "reportId_",
        "type": "bytes32"
      },
      {
        "internalType": "uint16",
        "name": "forMins",
        "type": "uint16"
      }
    ],
    "name": "interceptReport",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "reportId_",
        "type": "bytes32"
      }
    ],
    "name": "listAuth",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "data",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "listReport",
    "outputs": [
      {
        "internalType": "bytes32[]",
        "name": "data",
        "type": "bytes32[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "reportId_",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "start",
        "type": "uint256"
      },
      {
        "internalType": "uint16",
        "name": "limit",
        "type": "uint16"
      }
    ],
    "name": "listTransaction",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bytes",
            "name": "description",
            "type": "bytes"
          },
          {
            "internalType": "bytes",
            "name": "amount",
            "type": "bytes"
          },
          {
            "internalType": "bytes",
            "name": "problem",
            "type": "bytes"
          },
          {
            "internalType": "uint256",
            "name": "created",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "modified",
            "type": "uint256"
          }
        ],
        "internalType": "struct FinancialReport.Transaction[]",
        "name": "data",
        "type": "tuple[]"
      },
      {
        "internalType": "uint16",
        "name": "count",
        "type": "uint16"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "reportId_",
        "type": "bytes32"
      },
      {
        "internalType": "uint16",
        "name": "year",
        "type": "uint16"
      },
      {
        "internalType": "uint8",
        "name": "month",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "countDay",
        "type": "uint8"
      }
    ],
    "name": "listTransaction",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "start",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "count",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "reportId_",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "target",
        "type": "address"
      }
    ],
    "name": "removeAuth",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "reportId_",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "target",
        "type": "address"
      }
    ],
    "name": "removeEditor",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "id",
        "type": "bytes32"
      }
    ],
    "name": "removeReport",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "reportId_",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "transactionId_",
        "type": "uint256"
      }
    ],
    "name": "removeTransaction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "reportId_",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "candidate",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "level",
        "type": "uint8"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      }
    ],
    "name": "setAuthLevel",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "reportId_",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "transactionId_",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "dest",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
          }
        ],
        "internalType": "struct FinancialReport.EncryptedData[]",
        "name": "description",
        "type": "tuple[]"
      }
    ],
    "name": "setProblemOfT",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "reportId_",
        "type": "bytes32"
      }
    ],
    "name": "txDecimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "reportId_",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "transactionId_",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "dest",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
          }
        ],
        "internalType": "struct FinancialReport.EncryptedData[]",
        "name": "amount",
        "type": "tuple[]"
      }
    ],
    "name": "updateAmountOfT",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "reportId_",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "transactionId_",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "dest",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
          }
        ],
        "internalType": "struct FinancialReport.EncryptedData[]",
        "name": "description",
        "type": "tuple[]"
      }
    ],
    "name": "updateDescOfT",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
