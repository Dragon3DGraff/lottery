// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract Lottery {
    address public manager;
    address[] public players;

    constructor(){
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value > 0.01 ether, "send me more!!!");
        players.push(msg.sender);
    }

    function random() private view returns (uint){
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }

    function pickWinner() public restricted payable {
        uint index = random() % players.length;
        sendMoney(address(players[index]), address(this).balance);
        // payable(players[index]).transfer(address(this).balance);
        // (bool sent, ) =  address(players[index]).call{value: address(this).balance}("");
        // require(sent, "Failed to send Ether");
        players = new address[](0);
    }

    function sendMoney(address _to, uint _value) private  {
        (bool sent, ) = _to.call{value: _value}("");
        require(sent, "Failed to send Ether");
    }

    function returnBalance() public payable {
       sendMoney(address(manager), address(this).balance);
      
       players = new address[](0);
    }

    modifier restricted {
        require(msg.sender == manager);
        _;
    }

    function getBalance() public view returns (uint){
        return address(this).balance;
    }

    function getPlayers() public view  returns (address[] memory){
        return players;
    }

  
}