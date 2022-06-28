// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.7;

contract celo {
    //counter for number of beta users
    mapping(uint256 => uint256) beta_testers;

    // Define variable for user who joins
    mapping(address => User) public users;
    uint256 public usersCount; // counter for total users registered

    struct User {
        string aliasName;
        address walletaddress;
    }

    struct Whitelists {
        string name;
        address contractAddress;
        address host;
        uint256 spots;
        uint256 openingTime;
        uint256 closingTime;
    }

    event NewUser(address indexed user, uint256 number);
    event NewWhitelist(uint256 number, address contractAddress, address host);

    mapping(uint256 => Whitelists) public whitelists; // maps whitelist events
    uint256 whitelistsCount;
    mapping(string => bool) public usedAliases; // ensures unique alias
    mapping(address => bool) public registered; // used to confirm if msg.sender is registered

    //This is what we would use to check if an accout has been added to the waitlist already so that only one spot is allocated for whitelisting
    mapping(address => mapping(uint256 => bool)) public isWhitelisted;

    //Define variable for owner
    address owner;

    constructor() {
        owner = msg.sender;
    }

    // Prevents unauthorized users from performing certain actions
    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only accessible to the owner of the smart contract"
        );
        _;
    }

    modifier onlyHost(uint256 whitelist) {
        require(
            msg.sender == whitelists[whitelist].host,
            "Only host is allowed to do that"
        );
        _;
    }

    function addWhiteListEvent(
        address _contractAddress,
        address _host,
        string memory _name,
        uint256 _spots
    ) public onlyOwner {
        require(
            _contractAddress != address(0) && _host != address(0),
            "Only valid addresses are accepted"
        );
        require(bytes(_name).length > 0, "Enter a valid name");
        require(_spots > 0, "Enter a valid number of spots available");
        whitelists[whitelistsCount] = Whitelists(
            _name,
            _contractAddress,
            _host,
            _spots,
            0,
            0
        );
        emit NewWhitelist(whitelistsCount, _contractAddress, _host);
        whitelistsCount++;
    }

    function OpenWhitelist(uint256 whitelist, uint256 _closingTime)
        public
        onlyHost(whitelist)
    {
        require(
            whitelists[whitelist].openingTime == 0 &&
                whitelists[whitelist].closingTime == 0,
            "Whitelist hasn't yet been started"
        );
        whitelists[whitelist].openingTime = block.timestamp;
        whitelists[whitelist].closingTime = block.timestamp + _closingTime;
    }

    // Add user to the waitlist but first we make sure that user isn't already whitelisted and the deadline for closingTime hasn't been reached
    function addToWaitList(uint256 whitelist) public {
        require(
            !isWhitelisted[msg.sender][whitelist],
            "This user has already been added to the waitlist"
        );
        require(
            whitelists[whitelist].openingTime > 0 &&
                whitelists[whitelist].closingTime > 0,
            "Whitelist hasn't yet been started"
        );
        require(
            block.timestamp >= whitelists[whitelist].openingTime &&
                block.timestamp <= whitelists[whitelist].closingTime,
            "You are not yet supposed to use this"
        );
        require(
            whitelists[whitelist].spots > 0,
            "Maximum amount of people for the waitlist reached"
        );

        isWhitelisted[msg.sender][whitelist] = true;
        whitelists[whitelist].spots--;
        beta_testers[whitelist]++;
    }

    function registUser(string memory _alias) external {
        require(!registered[msg.sender], "Already registered");
        require(bytes(_alias).length > 0, "Enter a valid alias");
        require(!usedAliases[_alias], "Alias is already taken");
        users[msg.sender] = User(_alias, msg.sender);
        usersCount++;
        emit NewUser(msg.sender, usersCount);
    }
}
