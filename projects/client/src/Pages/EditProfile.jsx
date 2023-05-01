import React, { useRef, useState } from 'react';
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    Avatar,
    Center, Radio, RadioGroup, Box, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Text, FormErrorMessage
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { API_URL, API_URL_IMG } from '../helper';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from "yup";


export default function EditProfile(props) {
    const currentName = useSelector((state) => state.authReducer.name);
    const currentEmail = useSelector((state) => state.authReducer.email);
    const currentGender = useSelector((state) => state.authReducer.gender);
    const currentBirth = useSelector((state) => state.authReducer.birth);
    const currentProfileImage = useSelector((state) => state.authReducer.image_profile);
    const role = useSelector((state) => state.authReducer.role);
    const [name, setName] = useState(currentName);
    const [email, setEmail] = useState(currentEmail);
    const [gender, setGender] = useState(currentGender);
    const [birth, setBirth] = useState(currentBirth);
    const modalProfileImage = useDisclosure()
    const [profileImage, setProfileImage] = useState(null);
    const inputFile = useRef(null);
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    
    console.log("ini isi dari role edit profile:", role); //testing

    const handleGenderChange = (value) => {
        setGender(value);
    }

    const handleBirthChange = (event) => {
        const selectedDate = event.target.value;
        setBirth(selectedDate);
        console.log(selectedDate);
    }

    const onBtnEditProfile = async () => {
        try {
            setLoading1(true);
            await formik.validateForm();
            let token = localStorage.getItem("tempatku_login");
            if (formik.values.name.trim() === "") {
                formik.setErrors({ name: "Name is a required field" });
                return;
            }
            if (formik.values.email.trim() === "") {
                formik.setErrors({ email: "Email is a required field" });
                return;
            }
            if (!formik.isValid) {
                return;
            }
            let response = await axios.patch(`${API_URL}/user/editprofile`,
                {
                    name: formik.values.name,
                    email: formik.values.email,
                    gender: gender,
                    birth: birth,
                }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            );
            console.log("response onbtneditprofile :", response); //testing purposes
            console.log("response onbtneditprofile message from be :", response.data.message); //testing purposes
            alert(response.data.message);
            props.keeplogin(); //refresh once updated
        } catch (error) {
            console.log("ini error dari onBtnEditProfile : ", error); //testing purposes
            // alert(error.response.data.message);
            alert(error.response.data.error[0].msg);
        } finally {
            setLoading1(false); 
        }
    }

    const formik = useFormik({
        initialValues: {
            name: currentName || "",
            email: currentEmail || "",
        },
        onSubmit: onBtnEditProfile,
        validationSchema: yup.object().shape({
            name: yup
                .string()
                .required("Name is a required field")
                .matches(
                    /^[a-zA-Z ]+$/,
                    "Name must only contain letters and spaces"
                ),
            email: yup
                .string()
                .required("Email is a required field")
                .matches(
                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    "Please enter a valid email address"
                ),
        })
    });

    const handleForm = (event) => {
        formik.setFieldValue(event.target.name, event.target.value);
    };

    //untuk change state image profile
    const onChangeFile = (event) => {
        console.log("ini isi dari event.target.files onchangefile :", event.target.files);
        modalProfileImage.onOpen();
        setProfileImage(event.target.files[0]);
    };

    const onBtnEditProfileImage = async () => {
        try {
            setLoading2(true);
            let token = localStorage.getItem("tempatku_login");
            let formData = new FormData();
            // image max size is 1 MB
            if (profileImage.size > 1000000) {
                throw new Error("Image size should not exceed 1MB");
            }
            // image has to be .jpg .png .gif (.jpg = .jpeg)
            if (
                !["image/jpg", "image/png", "image/jpeg", "image/gif"].includes(profileImage.type)
            ) {
                throw new Error("Only .jpg, .png, .gif, and .jpeg format allowed!");
            }
            formData.append("image_profile", profileImage);
            console.log("ini isi dari formData", formData);
            console.log("ini tipe dari image_profile :", profileImage.type)
            let response = await axios.patch(`${API_URL}/user/updateprofileimage`, formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("response onbtneditprofileimage :", response);
            console.log("response onbtneditprofileimage message be :", response.data.message);
            alert(response.data.message);
            modalProfileImage.onClose();
            props.keeplogin(); //refresh immediately once profpic updated
        } catch (error) {
            console.log("ini error dari onBtnEditProfileImage : ", error);
            alert(error.message);
        } finally {
            setLoading2(false); 
        } 
    };

    const onBtnShowKTP = async () => {
        try {
            let token = localStorage.getItem("tempatku_login");
            let response = await axios.get(`${API_URL}/user/showktp`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("response onbtnshowktp :", response.data);
            
            //1. Decode Base64 string into binary data
            const binaryData = atob(response.data);

            //2. Convert the binary data into an array of numeric values
            const array = [];
            for (let i = 0; i < binaryData.length; i++) {
                array.push(binaryData.charCodeAt(i));
            }

            //3. Create Blob object from the num val array, with specified MIME type
            const blob = new Blob([new Uint8Array(array)], { type: "image/png" });

            //4. Create a URL from the Blob object
            const imageUrl = URL.createObjectURL(blob);

            // Open the image in a new tab
            window.open(imageUrl, "_blank");
        } catch (error) {
            console.log("ini error dari onBtnShowKTP : ", error);
            alert(error.message)
        }
    };

    return (
        <>
            <Flex
                minH={'100vh'}
                align={'center'}
                justify={'center'}
                bg={'gray.50'}
            >
                <Stack
                    bg='white'
                    spacing={4}
                    w={'full'}
                    maxW={'md'}
                    rounded={'xl'}
                    boxShadow={'lg'}
                    p={6}
                    my={12}>
                    <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
                        Profile Page
                    </Heading>
                    <FormControl id="userName">
                        {/* <FormLabel>User Icon</FormLabel> */}
                        <Stack direction={['column', 'row']}
                            spacing={6}
                        >
                            <Center>
                                <Avatar size="xl"
                                    src={currentProfileImage ? `${API_URL_IMG}${currentProfileImage}` : ""}
                                >
                                </Avatar>
                            </Center>
                            <Box w="full">
                                <Center w="full"
                                    mt={{ base: '0', sm: '8' }}
                                >
                                    <Button w="full" onClick={() =>
                                        inputFile.current.click()}>Change Profile Photo
                                        <Input
                                            my='4'
                                            ml='6'
                                            type="file"
                                            id="file"
                                            ref={inputFile}
                                            style={{ display: "none" }}
                                            onChange={onChangeFile}
                                            accept="image/*"
                                            variant='unstyled'
                                        ></Input>
                                    </Button>
                                </Center>
                                <Text fontSize='xs'>Image size: max. 1 MB</Text>
                                <Text fontSize='xs'>Image format: .jpg, .jpeg, .png, .gif</Text>
                            </Box>
                        </Stack>
                        {/* Modal Open */}
                        <Modal isOpen={modalProfileImage.isOpen} onClose={modalProfileImage.onClose}>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>Change Profile Photo</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody textAlign='center'>
                                    <Avatar objectFit='cover' size='2xl' src={profileImage ? URL.createObjectURL(profileImage) : ''}></Avatar>
                                </ModalBody>

                                <ModalFooter>
                                    <Button colorScheme='red' mr={3} onClick={() => {
                                        modalProfileImage.onClose();
                                        setProfileImage(null);
                                    }} variant='solid'>
                                        Cancel
                                    </Button>
                                    <Button 
                                    onClick={onBtnEditProfileImage}
                                    isLoading={loading2} 
                                    colorScheme='green' 
                                    variant='outline'
                                    >Save</Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>

                    </FormControl>
                    <FormControl id="Name" isInvalid={formik.errors.name}>
                        <FormLabel>Name</FormLabel>
                        <Input
                            placeholder={currentName}
                            _placeholder={{ color: 'black' }}
                            type="text"
                            onChange={handleForm}
                            name="name"
                        />
                        <FormErrorMessage fontSize='xs'>{formik.errors.name}</FormErrorMessage>
                    </FormControl>
                    <FormControl id="email" isInvalid={formik.errors.email}>
                        <FormLabel>Email address</FormLabel>
                        <Input
                            placeholder={currentEmail}
                            _placeholder={{ color: 'black' }}
                            type="email"
                            onChange={handleForm}
                            name="email"
                        />
                        <FormErrorMessage fontSize='xs'>{formik.errors.email}</FormErrorMessage>
                    </FormControl>
                    <FormControl id="gender">
                        <FormLabel>Gender</FormLabel>
                        <Box justifyContent='space-between'>
                            <RadioGroup
                                value={gender} onChange={handleGenderChange}
                            >
                                <Radio value="Male" mr={2}>Male</Radio>
                                <Radio value="Female">Female</Radio>
                            </RadioGroup>
                        </Box>
                    </FormControl>
                    <FormControl id="birth">
                        <FormLabel>Birthdate</FormLabel>
                        <Input
                            placeholder={currentBirth} //your current birthdate
                            _placeholder={{ color: 'gray.800' }}
                            type="date"
                            value={birth}
                            onChange={handleBirthChange}
                        />
                    </FormControl>
                    {
                        // Tenant
                        role == "Tenant" ? (
                            <Stack spacing={3} direction={['column']}>
                                <Button
                                    bg={'#D3212D'}
                                    color={'white'}
                                    _hover={{
                                        bg: '#D3212D',
                                    }}
                                    type='button'
                                    w='full'
                                    onClick={onBtnEditProfile}
                                    isLoading={loading1}
                                >
                                    Save
                                </Button>
                                <Button
                                    variant={'outline'}
                                    color={'#D3212D'}
                                    _hover={{
                                        bg: 'gray.200',
                                    }}
                                    type='button'
                                    w='full'
                                    borderColor='#D3212D'
                                    onClick={onBtnShowKTP}
                                >
                                    Show KTP Photo
                                </Button>
                            </Stack>
                        ) : (
                            // User
                            <Stack spacing={3} direction={['column']}>
                                <Button
                                    bg={'#D3212D'}
                                    color={'white'}
                                    _hover={{
                                        bg: '#D3212D',
                                    }}
                                    type='button'
                                    w='full'
                                    onClick={onBtnEditProfile}
                                    isLoading={loading1}
                                >
                                    Save
                                </Button>
                            </Stack>
                        )
                    }
                </Stack>
            </Flex>
        </>
    )
}