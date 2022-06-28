// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.7;

contract Celo {
    // contains list of people that are signing up to be in the waitlist and we are only allowing 50
    uint256 public betaTester;

    //Total number of whitelist space
    uint256 public whitelistRemaining = 50;

    //The closing time when the contract is no longer availabe for users to perform transactions with it anymore.
    uint256 public closingTime = 1659182400;

    // Define variable for User who joins
    User[] public users;

    event AddUserEvent(address indexed user);

    struct User {
        string handle;
        address walletaddress;
    }

    //Get the balance of an account, This is what we would use to check if an accout has been added to the waitlist already so they wont take another position as it is limited
    mapping(address => bool) public userIsAdded;

    //Define variable for User wallet address
    address userAddress;

    //constructor that runs at the creation of this contract/when it is being deployed

    constructor() {
        userAddress = msg.sender;
    }

    //Set total Number of allowable users to 20
    modifier allowUser() {
        require(
            betaTester < 21,
            "Maximum amount of people for the waitlist reached"
        );
        _;
    }

    //This Modifier makes sure that the one account does not take all the waitlist position
    //Each account is only given one position in the waitlist
    modifier OnlyOneAccount() {
        require(
            !userIsAdded[msg.sender],
            "This User has already been added to the waitlist"
        );
        _;
    }

    //set when this contract can be used and when it is not usable again with time
    //This is for cases where the whitelist will open at a particular time and end at a particular time
    modifier openWhen() {
        //When the contract will be opened to being used for transactions
        uint256 openingTime = 1654911117;

        //The closing time when the contract is no longer availabe for users to perform transactions with it anymore.
        // uint256  closingTime = 1655739492;

        require(
            block.timestamp >= openingTime && block.timestamp <= closingTime,
            "You are not yet supposed to use this"
        );
        _;
    }

    // Add People to the waitlist but first we make sure that the users are not morre than 50 niether is the contract called when it is not in the time range scheduled for the contract to be up and running
    function addToWaitList(string memory _handle)
        public
        allowUser /* This handles the check for users not to be more than 50 */
        openWhen /* This check for the time when this function can be activated */
        OnlyOneAccount
    {
        userIsAdded[msg.sender] = true;
        increaseBetaTester();
        decreaseWhitelist();
        users.push(User(_handle, msg.sender));
        emit AddUserEvent(msg.sender);
    }

    // Make the increase of users internal, it shouldnt be a function that can be called outside the contract for security purpose
    function increaseBetaTester() internal {
        betaTester++;
    }

    //Function to Decrease the Number of Whitelist Available and this number will be dhow in the websuute as available whitelist
    function decreaseWhitelist() internal {
        whitelistRemaining--;
    }

    function getUserLength() public view returns (uint256) {
        return (whitelistRemaining);
    }
}
