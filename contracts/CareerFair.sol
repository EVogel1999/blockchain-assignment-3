//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract CareerFair {
    address private owner;

    address[] private students;
    string[] private companies;

    constructor() {
        companies.push("Amazon");
        companies.push("Google");
        companies.push("Apple");
        companies.push("Microsoft");
        companies.push("Meta");
        companies.push("Gemini");
        companies.push("SecureEd");

        owner = msg.sender;
    }

    // Public Functions

    function enroll() public Enrolled(false) {
        students.push(msg.sender);
    }

    function add(string memory companyName) public Owner CompanyDoesntExist(companyName) {
        companies.push(companyName);
    }

    function getAttendees() public view returns (address[] memory) {
        return students;
    }

    function unenroll() public Enrolled(true) {
        uint256 index = findStudentIndex();
        removeStudent(index);
    }

    // Private Functions

    function isEnrolled() private view returns (bool) {
        bool enrolled = false;
        for (uint256 i = 0; i < students.length; i++) {
            if (students[i] == msg.sender) {
                enrolled = true;
                break;
            }
        }
        return enrolled;
    }

    function findStudentIndex() private view returns (uint256) {
        uint256 index = 0;
        for (uint256 i = 0; i < students.length; i++){
            if (students[i] == msg.sender) {
                index = i;
                break;
            }
        }
        return index;
    }

    function removeStudent(uint index) private {
        if (index >= students.length) return;

        for (uint256 i = index; i < students.length - 1; i++){
            students[i] = students[i + 1];
        }

        delete students[students.length - 1];
    }

    // Modifiers

    modifier Owner() {
        require(msg.sender == owner, "must be the contract owner");
        _;
    }

    modifier CompanyDoesntExist(string memory companyName) {
        bool found = false;
        for (uint256 i = 0; i < companies.length; i++) {
            if (keccak256(bytes(companies[i])) == keccak256(bytes(companyName))) {
                found = true;
                break;
            }
        }
        require(!found, "company must not exist");
        _;
    }

    // State is true if the student needs to be enrolled
    // false if the student isn't in the enrolled list
    modifier Enrolled(bool state) {
        require(isEnrolled() == state, state == true ? "student needs to be enrolled" : "student can't be enrolled");
        _;
    }
}