//SPDX-License-Identifier: UNLICENSED
pragma solidity >0.5.0;

contract Donation {
    string public name = 'Donation';

    //Create id=>struct mapping
    uint256 public eventCount = 0;
    mapping(uint256 => Event) public events;

    uint256 public contributorCount = 0;
    mapping(uint256 => Contributor) public contributors;

    // 1. Model the Event
    struct Contributor {
        uint256 id;
        address contributor;
        uint256 donatedTip;
        uint256 eventId;
    }
    //Create Struct
    struct Event {
        uint256 id;
        string hash;
        string title;
        string description;
        uint256 goalAmount;
        uint256 tipAmount;
        address author;
    }

    //Create TriggerEvents
    event EventCreated(
        uint256 id,
        string hash,
        string title,
        string description,
        uint256 goalAmount,
        uint256 tipAmount,
        address author
    );
    event EventTipped(
        uint256 id,
        string hash,
        string title,
        string description,
        uint256 tipAmount,
        address author
    );
    event EventContributors(
        uint256 id,
        address contributor,
        uint256 donatedTip,
        uint256 eventId
    );

    //Create Event
    function uploadEvent(
        string memory _imgHash,
        string memory _title,
        string memory _description,
        uint256 _goalAmount
    ) public {
        // Make sure the image hash exists
        require(bytes(_imgHash).length > 0);

        // Make sure details exists
        require(bytes(_title).length > 0);
        require(bytes(_description).length > 0);

        // Make goal amount exists
        require(_goalAmount > 0);

        // Make sure uploader address exists
        require(msg.sender != address(0));

        // Increment event id
        eventCount++;

        // Add video to the contract
        events[eventCount] = Event(
            eventCount,
            _imgHash,
            _title,
            _description,
            _goalAmount,
            0,
            msg.sender
        );

        // Trigger an event
        emit EventCreated(
            eventCount,
            _imgHash,
            _title,
            _description,
            _goalAmount,
            0,
            msg.sender
        );
    }

    //Tip Images
    function tipEventOwner(uint256 _id) public payable {
        // Make sure the id is valid
        require(_id > 0 && _id <= eventCount);

        Event memory _event = events[_id]; //Fetch the event
        address _author = _event.author; //Fetch the author

        payable(_author).transfer(msg.value); //Tipping the author

        _event.tipAmount += msg.value; //Update tip amount
        events[_id] = _event; //Update the blockchain

        // Increment contributor id
        contributorCount++;

        // Add contributor to the contract
        contributors[contributorCount] = Contributor(
            contributorCount,
            msg.sender,
            msg.value,
            _id
        );

        // Trigger an event
        emit EventContributors(contributorCount, msg.sender, msg.value, _id);

        // Trigger an event
        emit EventTipped(
            _id,
            _event.hash,
            _event.title,
            _event.description,
            _event.tipAmount,
            _author
        );
    }
}
