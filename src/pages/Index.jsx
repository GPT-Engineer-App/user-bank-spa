import React, { useState, useEffect } from "react";
import { ChakraProvider, Container, VStack, Text, Button, Table, Thead, Tbody, Tr, Th, Td, IconButton, HStack, Input, FormControl, FormLabel, Select, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const fetchRandomUsers = async (count) => {
  const response = await fetch(`https://random-data-api.com/api/users/random_user?size=${count}`);
  return response.json();
};

const fetchRandomBanks = async (count) => {
  const response = await fetch(`https://random-data-api.com/api/bank/random_bank?size=${count}`);
  return response.json();
};

const Index = () => {
  const [users, setUsers] = useState([]);
  const [banks, setBanks] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editingBank, setEditingBank] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchRandomUsers(5).then(setUsers);
    fetchRandomBanks(5).then(setBanks);
  }, []);

  const handleAddUsers = async (count) => {
    const newUsers = await fetchRandomUsers(count);
    setUsers([...users, ...newUsers]);
  };

  const handleAddBanks = async (count) => {
    const newBanks = await fetchRandomBanks(count);
    setBanks([...banks, ...newBanks]);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    onOpen();
  };

  const handleEditBank = (bank) => {
    setEditingBank(bank);
    onOpen();
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  const handleDeleteBank = (bankId) => {
    if (users.some((user) => user.bank_id === bankId)) {
      alert("Cannot delete bank with associated users.");
      return;
    }
    setBanks(banks.filter((bank) => bank.id !== bankId));
  };

  const handleSave = () => {
    if (editingUser) {
      setUsers(users.map((user) => (user.id === editingUser.id ? editingUser : user)));
    } else if (editingBank) {
      setBanks(banks.map((bank) => (bank.id === editingBank.id ? editingBank : bank)));
    }
    onClose();
  };

  return (
    <ChakraProvider>
      <Container centerContent maxW="container.md" py={4}>
        <VStack spacing={4} width="100%">
          <Text fontSize="2xl">Users</Text>
          <Button leftIcon={<FaPlus />} colorScheme="teal" onClick={() => handleAddUsers(1)}>
            Add User
          </Button>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>First Name</Th>
                <Th>Last Name</Th>
                <Th>Username</Th>
                <Th>Email</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => (
                <Tr key={user.id}>
                  <Td>{user.id}</Td>
                  <Td>{user.first_name}</Td>
                  <Td>{user.last_name}</Td>
                  <Td>{user.username}</Td>
                  <Td>{user.email}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton icon={<FaEdit />} onClick={() => handleEditUser(user)} />
                      <IconButton icon={<FaTrash />} onClick={() => handleDeleteUser(user.id)} />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          <Text fontSize="2xl">Banks</Text>
          <Button leftIcon={<FaPlus />} colorScheme="teal" onClick={() => handleAddBanks(1)}>
            Add Bank
          </Button>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Bank Name</Th>
                <Th>Routing Number</Th>
                <Th>SWIFT/BIC</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {banks.map((bank) => (
                <Tr key={bank.id}>
                  <Td>{bank.id}</Td>
                  <Td>{bank.bank_name}</Td>
                  <Td>{bank.routing_number}</Td>
                  <Td>{bank.swift_bic}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton icon={<FaEdit />} onClick={() => handleEditBank(bank)} />
                      <IconButton icon={<FaTrash />} onClick={() => handleDeleteBank(bank.id)} />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </VStack>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{editingUser ? "Edit User" : "Edit Bank"}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {editingUser && (
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>First Name</FormLabel>
                    <Input value={editingUser.first_name} onChange={(e) => setEditingUser({ ...editingUser, first_name: e.target.value })} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Last Name</FormLabel>
                    <Input value={editingUser.last_name} onChange={(e) => setEditingUser({ ...editingUser, last_name: e.target.value })} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Username</FormLabel>
                    <Input value={editingUser.username} onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Bank</FormLabel>
                    <Select value={editingUser.bank_id || ""} onChange={(e) => setEditingUser({ ...editingUser, bank_id: e.target.value })}>
                      <option value="">None</option>
                      {banks.map((bank) => (
                        <option key={bank.id} value={bank.id}>
                          {bank.bank_name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </VStack>
              )}
              {editingBank && (
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>Bank Name</FormLabel>
                    <Input value={editingBank.bank_name} onChange={(e) => setEditingBank({ ...editingBank, bank_name: e.target.value })} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Routing Number</FormLabel>
                    <Input value={editingBank.routing_number} onChange={(e) => setEditingBank({ ...editingBank, routing_number: e.target.value })} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>SWIFT/BIC</FormLabel>
                    <Input value={editingBank.swift_bic} onChange={(e) => setEditingBank({ ...editingBank, swift_bic: e.target.value })} />
                  </FormControl>
                </VStack>
              )}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleSave}>
                Save
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </ChakraProvider>
  );
};

export default Index;
