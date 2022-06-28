import Web3 from 'web3'
import { newKitFromWeb3 } from '@celo/contractkit'
import BigNumber from 'bignumber.js'
import marketplaceAbi from '../contract/marketplace.abi.json'

const ERC20_DECIMALS = 18

const MPContractAddress = "0x88ce8d258E2B3be3A149BaF11B68B02772E7D058"

let kit
let contract
let _whitelist = []


const connectCeloWallet = async function () {
  if (window.celo) {
    try {
      notification("⚠️ Please approve this DApp to use it.")
      await window.celo.enable()
      notificationOff()
      const web3 = new Web3(window.celo)
      kit = newKitFromWeb3(web3)

      const accounts = await kit.web3.eth.getAccounts()
      kit.defaultAccount = accounts[0]

      contract = new kit.web3.eth.Contract(marketplaceAbi, MPContractAddress)
    } catch (error) {
      notification(`⚠️ ${error}.`)
    }
  } else {
    notification("⚠️ Please install the CeloExtensionWallet.")
  }
}

const getBalance = async function (){
  const totalBalance = await kit.getTotalBalance(kit.defaultAccount)
  const cUSDBalance = totalBalance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2)
  document.querySelector("#balance").textContent = cUSDBalance
}

function notification(_texts) {
  document.querySelector("#notification").textContent = _texts
}

function notificationOff(){
  document.querySelector("#notification").style.display = "none"
}

const getRemainingWhitelist = async function(){
  const _userlistlength = await contract.methods.whitelistRemaining().call()
  document.querySelector("#whitelist").textContent = _userlistlength
}

const getClosingTime = async function(){
  //getting the closing time from the contract
  const _timeToClose = await contract.methods.closingTime().call()
  //multiply it by 1000 to get the time in milliseconds
  const readtime = _timeToClose * 1000
  //Obtain the current time so that you can find the difference between the current time and and the closing time
  const rightnow = new Date().getTime()

    // Find the distance between now and the count down date
    var distance = readtime - rightnow;
      
    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
    // Output the result in an element with id="demo"
    document.getElementById("daysleft").innerHTML = days + "d " + hours + "h "
    + minutes + "m " + seconds + "s ";
      
    // If the count down is over, write some text 
    if (distance < 0) {
      clearInterval(x);
      document.getElementById("daysleft").innerHTML = "EXPIRED";
    }

}

// call the beta_tester function to know how many people have taken up whitelist space

const getListofPeople = async function (){
  const _peopleSize = await contract.methods.beta_tester().call()
  const _sizeOfPeople = []

  for(let i = 0; i < _peopleSize; i++ ){
    let _sizeOfPpl = new Promise(async (resolve, reject) => {
      let ppl = await contract.methods.users(i).call()
      resolve({
        index: i + 1,
        handle: ppl[0],
        walletaddress: ppl[1],
      })
    })
    _sizeOfPeople.push(_sizeOfPpl)
  }
  _whitelist = await Promise.all(_sizeOfPeople)

  renderTableWithList()
}

function renderTableWithList(){
  document.getElementById("listedppl").innerHTML=`

        <tr>
          <th>S/N</th>
          <th>Address</th>
          <th>Alias</th>
        </tr>

  `
  _whitelist.forEach((_sizeOfPpl) => {
    const newrow = document.createElement("tr")
    newrow.innerHTML = tabletemplate(_sizeOfPpl)
    document.getElementById("listedppl").appendChild(newrow)
  })
}

function tabletemplate(_sizeOfPpl){
  return `
  <td>${_sizeOfPpl.index} </td>
  <td>${_sizeOfPpl.walletaddress} </td>
  <td>${_sizeOfPpl.handle} </td>
  `
}

window.addEventListener('load', async () => {
  //Run this function before you connect the wallet
    notification("⌛ Loading...")
    // wait for the wallet connection function to run
    await connectCeloWallet()
    //The balance function is next to wait for after the connection is done without error
    await getBalance()
    //This function runs and show you the number of whitelist position available in the top left of the app
    await getRemainingWhitelist()
    notificationOff()

    await getListofPeople()


    // makes sure this runs every second for the counter to show per second
    await setInterval(function(){
      getClosingTime()
    },1000) 
})

document.querySelector("#joinlist").addEventListener("click", async (e) => {

  const params = document.getElementById("blck_handle").value

  if(!params.length){
    notification("Please enter an alias");
    return;
  }

  try{
    const result = await contract.methods
    .addToWaitList(params)
    .send({from: kit.defaultAccount})
  }
  catch (error){
    notification(`⚠️ ${error}.`)
  }

  notification(`You have succeffuly been added to the whitelist`)

  getListofPeople()

})
