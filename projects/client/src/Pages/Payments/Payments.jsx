import {
    Box,
    Button,
    Flex,
    Image,
    Text,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    RadioGroup,
    Radio,
    Stack,
    FormControl,
    FormLabel,
    HStack,
    Input,
    Icon,
    Spinner
} from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { StarIcon } from '@chakra-ui/icons';
import { MdPeople } from 'react-icons/md';
import CardImage from '../../assets/card_img.png'
import { LockIcon } from '@chakra-ui/icons'
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../helper';


export default function Payments() {
    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate()
    let token = localStorage.getItem("tempatku_login");
    console.log("params : ", params);
    const [checkIn, setCheckIn] = useState(location?.state?.inputCheckIn)
    const [checkOut, setCheckOut] = useState(location?.state?.inputCheckOut)
    const [selectedPayment, setSelectedPayment] = useState('')
    console.log("payment method : ", selectedPayment)

    const diff = new Date(checkOut) - new Date(checkIn)
    const days = (diff / 86400000);

    const [details, setDetails] = useState([])
    const getDetails = async () => {
        let get = await axios.post(`${API_URL}/room/roompayment`, {
            uuid: params.uuid
        });
        setDetails(get.data[0]);
        console.log("payments get rooms detail transaction", get)
    }
    console.log("details", details);

    const [loadingConfirm, setLoadingConfirm] = useState(false)
    const btnConfirm = async () => {
        if (!selectedPayment || checkIn == '' || checkOut == '') {
            alert('Choose payment and date first!')
        } else {
            setLoadingConfirm(true);
            let addTransaction = await axios.post(`${API_URL}/transaction/`, {
                start: checkIn,
                end: checkOut,
                price: details.price, // INI DI KALI DAYS APA TIDAK ???
                roomId: details.id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setLoadingConfirm(false);
            navigate(`/payment/detail/${addTransaction.data.data1.uuid}`)

            console.log("add transactionnnn",addTransaction)
        }
    }
    let now = new Date();
    now.getTime()
    console.log("nowwwww", now.getTime())

    useEffect(() => {
        getDetails()
    }, [])
    return (
        <Box mt='3' px='3'>
            {
                loadingConfirm ?
                    <Flex justifyContent={'center'} alignItems='center'>
                        <Spinner color='red'/>
                    </Flex>
                    :
                    <Box>
                        <Flex justifyContent={'center'} mb='5'>
                            {/* <Text fontSize={'2xl'} fontWeight='bold'>
                    Secure Payment
                </Text> */}
                            <Text fontSize={'2xl'} fontWeight='bold'>
                                Booking Details
                            </Text>
                        </Flex>

                        {/* PAYMENTS & BOOKING DETAILS */}
                        <Flex gap='10' display={{ base: 'block', md: 'flex' }} justifyContent='center' mb='20'>
                            {/* PAYMENTS */}
                            <Box w={{ base: 'full', md: '50%' }} mb='10'>
                                <Text fontSize={'xl'} mb='3'>
                                    Choose Payments :
                                </Text>
                                <Box my='3'>
                                    <Image
                                        src={
                                            CardImage
                                        }
                                        w="200px" h="30px"
                                    />
                                </Box>
                                <RadioGroup onChange={setSelectedPayment}>
                                    <Stack display='block'>
                                        <Accordion allowToggle defaultIndex={[1]}>
                                            {/* MANUAL PAYMENT */}
                                            <AccordionItem>
                                                <h2 >
                                                    <AccordionButton >
                                                        <Box as="span" flex='1' textAlign='left' fontWeight={'semibold'}>
                                                            <Radio value='1'>
                                                                Bank Transfer
                                                            </Radio>
                                                        </Box>
                                                        <AccordionIcon />
                                                    </AccordionButton>
                                                </h2>
                                                <AccordionPanel pb={4}>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                                    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                                    commodo consequat.
                                                </AccordionPanel>
                                            </AccordionItem>

                                            {/* CARD PAYMENT */}
                                            <AccordionItem>
                                                <h2>
                                                    <AccordionButton>
                                                        <Box as="span" flex='1' textAlign='left' fontWeight={'semibold'}>
                                                            <Radio value='2' isDisabled>
                                                                Credit / Debit Card
                                                            </Radio>
                                                        </Box>
                                                        <AccordionIcon />
                                                    </AccordionButton>
                                                </h2>
                                                <AccordionPanel pb={4}>
                                                    <Stack spacing={4}>
                                                        <HStack >
                                                            <FormControl id="Name">
                                                                <FormLabel>Name</FormLabel>
                                                                <Input type="text" />
                                                            </FormControl>
                                                            <FormControl id="email">
                                                                <FormLabel>Email address</FormLabel>
                                                                <Input type="email" />
                                                            </FormControl>

                                                        </HStack>
                                                        <FormControl id="cardinfo">
                                                            <FormLabel>Card Info</FormLabel>
                                                            <Input type="text" placeholder='Card number' />
                                                        </FormControl>
                                                        <HStack>
                                                            <FormControl id="expiration">
                                                                <Input type="text" placeholder='Expiration' />
                                                            </FormControl>

                                                            <FormControl id="cvv">
                                                                <Input type="text" placeholder='CVV' />
                                                            </FormControl>
                                                        </HStack>
                                                        <HStack>
                                                            <FormControl id="billing">
                                                                <FormLabel>Billing Info</FormLabel>
                                                                <Input type="text" placeholder='ZIP code' />
                                                            </FormControl>

                                                            <FormControl id="country">
                                                                <FormLabel>Country/region</FormLabel>
                                                                <Input type='text' />
                                                            </FormControl>
                                                        </HStack>
                                                        <HStack pt={2} justifyContent='end'>
                                                            <Button
                                                                loadingText="Submitting"
                                                                size="lg"
                                                                bg={'red.500'}
                                                                color={'white'}
                                                                _hover={{
                                                                    bg: 'blue.500',
                                                                }}
                                                                leftIcon={<Icon as={LockIcon} />}
                                                            >
                                                                Done
                                                            </Button>
                                                            <Button
                                                                loadingText="Submitting"
                                                                size="lg"
                                                                color={'#D3212D'}
                                                                variant='outline'
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </HStack>
                                                    </Stack>
                                                </AccordionPanel>
                                            </AccordionItem>

                                            {/* DIGITAL PAYMENT */}
                                            <AccordionItem isDisabled='true'>
                                                <h2>
                                                    <AccordionButton>
                                                        <Box as="span" flex='1' textAlign='left' fontWeight={'semibold'}>
                                                            <Radio value='3' isDisabled>
                                                                Digital Payment
                                                            </Radio>
                                                        </Box>
                                                        <AccordionIcon />
                                                    </AccordionButton>
                                                </h2>
                                                <AccordionPanel pb={4}>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                                    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                                    commodo consequat.
                                                </AccordionPanel>
                                            </AccordionItem>

                                        </Accordion>
                                    </Stack>
                                </RadioGroup>
                            </Box>


                            {/* CARD PAYMENT DETAIL */}
                            <Box px='5' py='3' border={'1px solid black'} rounded='xl' h='500px'>
                                <Box>
                                    <Flex gap='3' my='3' justifyContent={'center'}>

                                        {/* BOX 1 */}
                                        <Box flex='1'>
                                            <Image src='https://images.unsplash.com/photo-1589834390005-5d4fb9bf3d32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80'
                                                w='full' h='120px' objectFit={'cover'} />
                                        </Box>

                                        {/* BOX 2 */}
                                        <Box flex='2'>
                                            <Text fontSize={'2xl'}>{details?.property?.property}</Text>
                                            {/* RATING */}
                                            <Flex my='2'>
                                                <StarIcon color='yellow.500' />
                                                <StarIcon color='yellow.500' />
                                                <StarIcon color='yellow.500' />
                                                <StarIcon color='yellow.500' />
                                                <StarIcon color='gray.500' />
                                            </Flex>
                                            <Text fontSize={'sm'} fontWeight='light'>{details?.property?.property_location?.regency?.name}, {details?.property?.property_location?.country}</Text>
                                        </Box>
                                    </Flex>
                                </Box>

                                <Box bgColor={'#feefef'} p='3'>
                                    <Text textAlign={'center'} fontSize='sm'>Book your property before they are all gone.</Text>
                                </Box>

                                {/* BOOKING DATE */}
                                <Box p='3'>
                                    <Text fontWeight={'semibold'} fontSize='xl'>{details?.room_category?.name}</Text>
                                    <Flex justify={'space-between'}>
                                        <Text>{checkIn} -  {checkOut}</Text>
                                        <Text>{days} night</Text>
                                    </Flex>
                                    <Text>Price : Rp {details?.price} / night</Text>
                                </Box>
                                <hr />

                                {/* CAPACITY */}
                                <Box my='3'>
                                    <Flex gap='3' alignItems={'center'}>
                                        <Text fontSize={'3xl'}><MdPeople /></Text>
                                        <Text>Max {details?.capacity} adults</Text>
                                    </Flex>
                                </Box>
                                <hr />

                                {/* PRICE */}
                                <Box my='3'>
                                    <Text fontSize={'2xl'}>Total : Rp {details?.price * parseInt(days)}</Text>
                                </Box>

                                {/* BUTTON */}
                                <Flex justifyContent={'center'} w='full' mt='5' mb='8'>
                                    <Button w='full' colorScheme={'red'} onClick={btnConfirm}>
                                        Confirm
                                    </Button>
                                </Flex>

                            </Box>
                        </Flex>
                    </Box>
            }
            {/* TITLE */}
        </Box>
    )
}
