// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title Logistics Delivery Tracking Contract
/// @author
/// @notice Smart contract to track package delivery status transparently and immutably
contract DeliveryTracking {
    /// @dev Enum for delivery status
    enum Status {
        Pending,
        Dispatched,
        InTransit,
        Delivered,
        Cancelled
    }

    /// @dev Struct to store delivery record
    struct Delivery {
        string packageId;
        Status status;
        string meta;
        bool exists;
    }

    /// @dev Admin of the contract (e.g., logistics company)
    address private admin;

    /// @dev Mapping from package ID to Delivery record
    mapping(string => Delivery) private deliveries;

    /// @dev Event emitted when a new delivery is recorded
    event DeliveryCreated(string packageId);

    /// @dev Event emitted when a delivery status is updated
    event StatusUpdated(string packageId, Status newStatus);

    /// @notice Function to receive Ether. msg.data must be empty
    /// @dev This is executed on plain Ether transfers (e.g., via send() or transfer())
    receive() external payable {}

    /// @notice Fallback function to receive Ether when msg.data is not empty
    /// @dev Called when no other function matches or when data is sent with Ether
    fallback() external payable {}

    /// @dev Modifier to restrict functions to only admin
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    // Change the admin address
    /// @notice Allows the current admin to change the admin address
    /// @param _admin The new admin address
    function changeAdmin(address _admin) public onlyAdmin {
        require(_admin != address(0), "Wallet address is not valid");
        admin = _admin;
    }

    /// @notice Allows the admin to withdraw all Ether from the contract
    function withdraw() public onlyAdmin {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");

        // Transfer all Ether to the admin
        payable(admin).transfer(balance);
    }

    /// @notice Create a new delivery record
    /// @param _packageId Unique ID of the package
    /// @param _meta Meta data of teh package
    function createDelivery(
        string memory _packageId,
        string memory _meta
    ) external {
        require(!deliveries[_packageId].exists, "Package already exists");

        deliveries[_packageId] = Delivery({
            packageId: _packageId,
            status: Status.Dispatched,
            meta: _meta,
            exists: true
        });

        emit DeliveryCreated(_packageId);
        emit StatusUpdated(_packageId, Status.Dispatched);
    }

    /// @notice Update the status of a package
    /// @param _packageId ID of the package
    /// @param _status New status to update
    function updateStatus(
        string memory _packageId,
        Status _status,
        string memory _meta
    ) external onlyAdmin {
        require(deliveries[_packageId].exists, "Package not found");

        if (_status == Status.Delivered) {
            deliveries[_packageId].meta = _meta;
        }

        deliveries[_packageId].status = _status;
        emit StatusUpdated(_packageId, _status);
    }

    /// @notice Get the current status of a delivery
    function getStatus(
        string memory _packageId
    ) external view returns (Status) {
        require(deliveries[_packageId].exists, "Package not found");
        return deliveries[_packageId].status;
    }

    /// @notice Get full delivery details
    function getDelivery(
        string memory _packageId
    ) external view returns (string memory, Status, string memory) {
        require(deliveries[_packageId].exists, "Package not found");
        Delivery memory d = deliveries[_packageId];

        return (d.packageId, d.status, d.meta);
    }
}
