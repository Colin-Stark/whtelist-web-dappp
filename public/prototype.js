
// import Web3 from 'web3'
// import { newKitFromWeb3 } from '@celo/contractkit'
// import marketplaceAbi from '../contract/marketplace.abi.json'
// import BigNumber from 'bignumber.js'

// const ERC20_DECIMALS = 18

// const MPContractAddress = "0x6E1B298787b4260F065e154C2057d8BFcb1e982D"



// let kit

// let contract

// // let userlist = []

// // const connectCeloWallet = async function () {
// //   if (window.celo) {
// //     // notification("⚠️ Please approve this DApp to use it.")
// //     try {
// //       await window.celo.enable()
// //       // notificationOff()

// //       const web3 = new Web3(window.celo)
// //       kit = newKitFromWeb3(web3)

// //       const accounts = await kit.web3.eth.getAccounts()
// //       kit.defaultAccount = accounts[0]

// //     } catch (error) {
// //       // notification(`⚠️ ${error}.`)
// //     }
// //   } else {
// //     // notification("⚠️ Please install the CeloExtensionWallet.")
// //   }
// // }

// const connectCeloWallet = async function () {
//   if (window.celo) {
//     try {
//       notification("⚠️ Please approve this DApp to use it.")
//       await window.celo.enable()
//       notificationOff()
//       const web3 = new Web3(window.celo)
//       kit = newKitFromWeb3(web3)

//       const accounts = await kit.web3.eth.getAccounts()
//       kit.defaultAccount = accounts[0]

//       contract = new kit.web3.eth.Contract(marketplaceAbi, MPContractAddress)
//     } catch (error) {
//       notification(`⚠️ ${error}.`)
//     }
//   } else {
//     notification("⚠️ Please install the CeloExtensionWallet.")
//   }
// }


// // i wrote this but javascript might be case sensitive so im going to copy and paste to see the error
// const getBalance = async function () {
//   const totalBalance = await kit.getTotalBalance(kit.defaultAccount)
//   const cUSDBalance = totalBalance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2)
//   document.querySelector("#balance").textContent = cUSDBalance
// }

// // const getUsers = async function()
// // {
// //   const _userlistlength = await contract.methods.call()
// //   const _userlist = []
// //   for(let i = 0; i < _userlistlength)
// // }
// // function notificationOff() {
// //     document.querySelector(".alert").style.display = "none"
// // }

// // function renderRemainingWhitelist(){

// // }

// function notification(_text) {
//   // document.querySelector(".alert").style.display = "block"
//   document.querySelector("#notification").textContent = _text
// }

// function notificationOff() {
//   document.querySelector("#notification").style.display = "none"
// }

// const getRemainingWhitelist = async function ()
// {
//   const _userlistlength = await contract.methods.whitelistRemaining().call()
//   document.querySelector("#whitelist").textContent = _userlistlength
// }

// window.addEventListener('load', async () => {
//     notification("⌛ Loading...")
//     await connectCeloWallet()
//     await getBalance()
//     await getRemainingWhitelist()
//     notificationOff()
// });