//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */
contract YourContract {
    // State Variables
    address public immutable owner;
    string public greeting = "Building Unstoppable Apps!!!";
    bool public premium = false;
    uint256 public totalCounter = 0;
    mapping(address => uint) public userGreetingCounter;
    address private company;
    address private government;

    // Events: a way to emit log statements from smart contract that can be listened to by external parties
    event GreetingChange(address indexed greetingSetter, string newGreeting, bool premium, uint256 value);

    // Constructor: Called once on contract deployment
    // Check packages/hardhat/deploy/00_deploy_your_contract.ts
    constructor(address _owner) {
        owner = _owner;
    }

    // Modifier: used to define a set of rules that must be met before or after a function is executed
    // Check the withdraw() function
    modifier isOwner() {
        // msg.sender: predefined variable that represents address of the account that called the current function
        require(msg.sender == owner, "Not the Owner");
        _;
    }
    modifier isGovernment() {
        require(msg.sender == government, "Not the Government");
        _;
    }
    /**
     * Function that allows anyone to change the state variable "greeting" of the contract and increase the counters
     *
     * @param _newGreeting (string memory) - new greeting to save on the contract
     */
    function setGreeting(string memory _newGreeting) public payable {
        // Print data to the hardhat chain console. Remove when deploying to a live network.
        console.log("Setting new greeting '%s' from %s", _newGreeting, msg.sender);

        // Change state variables
        greeting = _newGreeting;
        totalCounter += 1;
        userGreetingCounter[msg.sender] += 1;

        // msg.value: built-in global variable that represents the amount of ether sent with the transaction
        if (msg.value > 0) {
            premium = true;
        } else {
            premium = false;
        }

        // emit: keyword used to trigger an event
        emit GreetingChange(msg.sender, _newGreeting, msg.value > 0, msg.value);
    }

    function setCompany() public {
        company = msg.sender;
    }
    function getCompany() public view returns (address) {
        return company;
    }

    function setGovernment() public {
        government = msg.sender;
    }
    function getGovernment() public view returns (address) {
        return government;
    }
    /**
     * Function that allows the owner to withdraw all the Ether in the contract
     * The function can only be called by the owner of the contract as defined by the isOwner modifier
     */

    function withdraw(uint256 amount) public isGovernment {
        require(amount > 0, "Amount must be greater than zero");
        require(address(this).balance >= amount, "Insufficient contract balance");

        (bool success, ) = government.call{ value: amount }("");
        require(success, "Failed to send Ether");
    }
    function companyPayGovernment(uint256 amount) public {
        require(msg.sender == company, "Only the company can pay the government");
        require(government != address(0), "Government address not set");
        require(amount > 0, "Amount must be greater than zero");
        require(address(this).balance >= amount, "Insufficient contract balance");

        (bool success, ) = payable(government).call{ value: amount }("");
        require(success, "Failed to send funds to government");
    }

    // Event to log transactions
    event Transfer(address indexed from, address indexed to, uint256 amount);

    // Function to transfer Ether from one wallet to another
    function pay(address payable recipient) public payable {
        require(msg.value > 0, "Amount should be greater than 0");

        // Transfer the Ether to the recipient
        recipient.transfer(msg.value);

        // Emit the transfer event
        emit Transfer(msg.sender, recipient, msg.value);
    }

    

    // Function to check the contract balance
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getContractAddress() public view returns (address) {
        return address(this);
    }
    /**
     * Function that allows the contract to receive ETH
     */
    receive() external payable {}
}
/*
- 
*/