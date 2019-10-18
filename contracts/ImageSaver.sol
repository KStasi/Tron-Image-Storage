pragma solidity >=0.4.23 <0.6.0;

contract ImageSaver {
    mapping(bytes32 => bytes) public parts;
    mapping(bytes32 => bytes32[]) public images;

    function storeImagePart(bytes imagePart) public returns (bytes32) {
        bytes32 hash = keccak256(abi.encodePacked(imagePart));
        parts[hash] = imagePart;
        return hash;
    }

    function storeImage(bytes32[] imagePartArray) public returns (bytes32) {
        bytes32 hash = keccak256(abi.encodePacked(imagePartArray));
        images[hash] = imagePartArray;
        return hash;
    }

    function getImage(bytes32 hash) public view returns(bytes) {
        bytes memory image = new bytes(0);
        bytes32[] memory imageParts = images[hash];
        for (uint i = 0; i < imageParts.length; i++) {
            image = abi.encodePacked(image, parts[imageParts[i]]);
        }
        return image;
    }
}