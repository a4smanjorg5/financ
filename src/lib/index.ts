import { decode, encode } from 'cborg'
import { decrypt, encrypt } from 'ethereum-cryptography/aes'
import { getRandomBytesSync } from 'ethereum-cryptography/random'
import { useCallback } from 'react'
import { toBytes, bytesToHex, concat } from 'viem/utils'
import type { Address, Hex } from 'viem'
import { useWalletClient, useReadContract, useWriteContract } from 'wagmi'
import {
  ReadArgs,
  ReadResult,
  WriteArgs,
  BytesLike,
  IndexedSecret,
  Transaction,
  contractABI as abi
} from './types'

export const useReadData = <T extends ReadArgs>(props: T) => {
  const { data: wallet } = useWalletClient()
  const { data, status, error } = useReadContract({
    abi: contractABI,
    account: wallet?.account,
    address: contractAddr,
    query: {
      select: data => processQueryResult(data, props) as ReadResult<T>,
    },
    ...processQueryArgs(props),
  })

  return { data, status, error }
}

const processQueryArgs = (props: ReadArgs) => {
  let args: unknown[]
  switch (props.name) {
    case 'listAuth':
    case 'txDecimals':
      args = [props.reportId]
      break

    case 'getProblemOfT':
      args = [props.reportId, props.transactId]
      break

    case 'listTransaction':
      args = 'secret' in props ? [
        props.reportId,
        props.start,
        props.limit,
      ] : [
        props.reportId,
        props.year,
        props.month,
        props.countDay
      ]
      break

    default:
      args = []
      break
  }

  return { functionName: props.name, args }
}

const processQueryResult = (result: any, props: ReadArgs) => {
  switch (props.name) {
    case 'listAuth':
    case 'listReport':
    case 'txDecimals':
      return result

    case 'getProblemOfT':
      return decryptData(result, props.secret)

    case 'listTransaction':
      const secret = 'secret' in props ? props.secret : null

      return secret ? {
        data: (result[0] as any[]).map<Transaction>(t => {
          const [aot, dot, pot] = [
            decryptData(t.amount, secret),
            decryptData(t.description, secret),
            decryptData(t.problem, secret),
          ]

          return {
            ...t,
            unit: dot?.[0],
            description: dot?.[1],
            qty: aot?.[0],
            expense: aot?.[1],
            amount: aot?.[2],
            problem: pot,
          }
        }),
        count: result[1],
      } : { start: result[0], count: result[1] }
  }
}

export const useWriteData = () => {
  const { writeContract, status, error } = useWriteContract()
  const writeData = useCallback((props: WriteArgs) => {
    let args: unknown[]
    switch (props.name) {
      case 'addReport':
        args = [props.decimals]
        break

      case 'removeReport':
      case 'switchTo':
        args = [props.reportId]
        break;

      case 'addAuthorizer':
        args = [
          props.reportId,
          props.target,
          props.level,
          props.signature,
        ]
        break

      case 'setAuthLevel':
        args = [props.reportId, props.target, props.level]
        break

      case 'docOwnership':
        args = [props.reportId, props.newOwner, props.signature]
        break

      case 'addEditor':
        args = [props.reportId, props.target, props.signature]
        break

      case 'removeEditor':
        args = [props.reportId, props.target]
        break

      case 'addTransaction':
        args = [
          props.reportId,
          bulkEncrypt(props.secrets, [props.unit, props.description]),
          bulkEncrypt(props.secrets, [props.qty, props.expense, props.amount]),
          props.recap
        ]
        break

      case 'approveTransaction':
        args = [props.reportId, props.transactId]
        break

      case 'interceptReport':
        args = [props.reportId, props.forMins]
        break

      case 'removeTransaction':
        args = [props.reportId, props.transactId]
        break

      case 'updateDescOfT':
        args = [
          props.reportId, props.transactId,
          bulkEncrypt(props.secrets, [props.unit, props.description]),
        ]
        break

      case 'updateAmountOfT':
        args = [
          props.reportId, props.transactId,
          bulkEncrypt(props.secrets, [props.qty, props.expense, props.amount]),
        ]
        break

      case 'setProblemOfT':
        args = [
          props.reportId, props.transactId,
          bulkEncrypt(props.secrets, props.description),
        ]
        break

      default:
        args = []
        break
    }
    writeContract({
      abi: contractABI,
      address: contractAddr,
      functionName: props.name,
      args,
    })
  }, [])

  return { status, writeData, error }
}

export const useDocAuths = (reportId: Hex) => {
  const { data: wallet } = useWalletClient()
  const { data, error, isSuccess } = useReadContract({
    abi: contractABI,
    account: wallet?.account,
    address: contractAddr,
    query: {
      select: (data: any) => ({
        isOwner: data[0] as boolean,
        isEditor: data[1] as boolean,
        isAuthorizer: data[2] as boolean,
      }),
    },
    functionName: 'docAuths',
    args: [reportId],
  })

  if (isSuccess) {
    return { ...data, error }
  }

  return { isOwner: false, isEditor: false, isAuthorizer: false, error }
}

const arrayify = (value: BytesLike) => typeof value === 'object' ? new Uint8Array(value) : toBytes(value)

const bulkEncrypt = (secrets: IndexedSecret[], data: unknown) => secrets.map(s => [s.dest, encryptData(s.secret, data)])

const decryptData = (encrypted: BytesLike, secret: BytesLike) => {
  const key = arrayify(secret)
  const buf = arrayify(encrypted)
  if (buf.length || buf.byteLength) {
    if (key.length || key.byteLength) {
      const iv = buf.slice(0, 16)
    
      return decode(decrypt(buf.slice(16), key, iv, 'aes-256-ctr'))
    }

    return decode(buf)
  }
}

const encryptData = (secret: BytesLike, data: unknown) => {
  const key = arrayify(secret)
  const iv = getRandomBytesSync(16)

  if (key.length || key.byteLength) {
    return bytesToHex(concat([iv, encrypt(encode(data), key, iv, 'aes-256-ctr')]))
  }

  return bytesToHex(encode(data))
}

const contractAddr: Address = import.meta.env.VITE_CONTRACT_ADDRESS || '0x65360BA6599c5355ce644A7539a32Cd9Bdf99fe8'

const contractABI = abi()
