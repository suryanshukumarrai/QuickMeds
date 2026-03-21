package com.quickmeds.service;

import com.quickmeds.dto.AddressDtos;
import com.quickmeds.entity.Address;
import com.quickmeds.entity.User;
import com.quickmeds.exception.ResourceNotFoundException;
import com.quickmeds.repository.AddressRepository;
import com.quickmeds.repository.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AddressService {
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public List<AddressDtos.AddressResponse> listUserAddresses(String username) {
        User user = findUserByEmail(username);
        return addressRepository.findByUserIdOrderByIdDesc(user.getId()).stream().map(this::toResponse).toList();
    }

    public AddressDtos.AddressResponse addAddress(String username, AddressDtos.AddressRequest request) {
        User user = findUserByEmail(username);
        Address address = Address.builder()
                .fullName(request.getFullName().trim())
                .phone(request.getPhone().trim())
                .street(request.getStreet().trim())
                .city(request.getCity().trim())
                .state(request.getState().trim())
                .pincode(request.getPincode().trim())
                .user(user)
                .build();
        return toResponse(addressRepository.save(address));
    }

    public AddressDtos.AddressResponse updateAddress(String username, Long id, AddressDtos.AddressRequest request) {
        User user = findUserByEmail(username);
        Address address = addressRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        address.setFullName(request.getFullName().trim());
        address.setPhone(request.getPhone().trim());
        address.setStreet(request.getStreet().trim());
        address.setCity(request.getCity().trim());
        address.setState(request.getState().trim());
        address.setPincode(request.getPincode().trim());
        return toResponse(addressRepository.save(address));
    }

    public void deleteAddress(String username, Long id) {
        User user = findUserByEmail(username);
        Address address = addressRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));
        addressRepository.delete(address);
    }

    public Address requireOwnedAddress(Long userId, Long addressId) {
        return addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));
    }

    private User findUserByEmail(String username) {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private AddressDtos.AddressResponse toResponse(Address address) {
        return AddressDtos.AddressResponse.builder()
                .id(address.getId())
                .fullName(address.getFullName())
                .phone(address.getPhone())
                .street(address.getStreet())
                .city(address.getCity())
                .state(address.getState())
                .pincode(address.getPincode())
                .build();
    }
}
