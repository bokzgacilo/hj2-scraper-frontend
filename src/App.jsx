import { useEffect, useState } from 'react'
import './App.css'
import { Button, Container, Flex, Grid, Heading, Stack, Text, Textarea, useToast } from '@chakra-ui/react'
import axios from 'axios'

function App() {
  const maxLines = 2500;
  const toast = useToast()

  const [Keyword, SetKeyword] = useState("")
  const [KeywordCount, SetKeywordCounter] = useState(0)

  const [Textarea1, SetTextarea1] = useState("")
  const [Textarea1CurrentCount, SetTextarea1CurrentCount] = useState(0)
  const [Textarea1Count, SetTextarea1Count] = useState(0)
  const [Textarea1Results, SetTextarea1Results] = useState([])
  const [isScanning1, setIsScanning1] = useState(false);

  const [Textarea2, SetTextarea2] = useState("")
  const [Textarea2Count, SetTextarea2Count] = useState(0)
  const [Textarea2CurrentCount, SetTextarea2CurrentCount] = useState(0)
  const [Textarea2Results, SetTextarea2Results] = useState([])
  const [isScanning2, setIsScanning2] = useState(false);

  const [Textarea3, SetTextarea3] = useState("")
  const [Textarea3Count, SetTextarea3Count] = useState(0)
  const [Textarea3CurrentCount, SetTextarea3CurrentCount] = useState(0)
  const [Textarea3Results, SetTextarea3Results] = useState([])
  const [isScanning3, setIsScanning3] = useState(false);

  const [Textarea4, SetTextarea4] = useState("")
  const [Textarea4Count, SetTextarea4Count] = useState(0)
  const [Textarea4CurrentCount, SetTextarea4CurrentCount] = useState(0)
  const [Textarea4Results, SetTextarea4Results] = useState([])
  const [isScanning4, setIsScanning4] = useState(false);
  
  const [Textarea5, SetTextarea5] = useState("")
  const [Textarea5Count, SetTextarea5Count] = useState(0)
  const [Textarea5CurrentCount, SetTextarea5CurrentCount] = useState(0)
  const [Textarea5Results, SetTextarea5Results] = useState([])
  const [isScanning5, setIsScanning5] = useState(false);

  useEffect(() => {
    if(Textarea1CurrentCount === Textarea1Count) {setIsScanning1(false)}
    if(Textarea2CurrentCount === Textarea2Count) {setIsScanning2(false)}
    if(Textarea3CurrentCount === Textarea3Count) {setIsScanning3(false)}
    if(Textarea4CurrentCount === Textarea4Count) {setIsScanning4(false)}
    if(Textarea5CurrentCount === Textarea5Count) {setIsScanning5(false)}
  }, [Textarea1CurrentCount, Textarea2CurrentCount, Textarea3CurrentCount, Textarea4CurrentCount, Textarea5CurrentCount])

  const handleDownloadResult = async (instanceNumber) => {
    let downloadableResults;

    switch(instanceNumber){
      case 1:
        downloadableResults = Textarea1Results;
        break;
      case 2:
        downloadableResults = Textarea2Results;
        break;
      case 3:
        downloadableResults = Textarea3Results;
        break;
      case 4:
        downloadableResults = Textarea4Results;
        break;
      case 5:
        downloadableResults = Textarea5Results;
        break;
    }

    try {
      // Example POST request to your API endpoint
      const response = await axios.post('http://62.72.29.28/excel', { 
        keywords: Keyword, 
        instanceNumber: instanceNumber,
        json: downloadableResults
        }, {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'blob'
      })
        const blob = new Blob([response.data], { type: response.data.type });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;

        link.setAttribute('download', `RESULT_${instanceNumber}.xlsx`);

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error sending line to API:', error);
    }
  }

  const StartScan = async (instanceNumber) => {
    let textareaArray;

    switch(instanceNumber){
      case 1 :
        textareaArray = Textarea1.split('\n')
        setIsScanning1(true);
        break;
      case 2 :
        textareaArray = Textarea2.split('\n')
        setIsScanning2(true);
        break;
      case 3 :
        textareaArray = Textarea3.split('\n')
        setIsScanning3(true);
        break;
      case 4 :
        textareaArray = Textarea4.split('\n')
        setIsScanning4(true);
        break;
      case 5 :
        textareaArray = Textarea5.split('\n')
        setIsScanning5(true);
        break;
    }

    for(const url of textareaArray){
      await axios.post('http://62.72.29.28/check', {
        keyword : Keyword,
        url : url,
        instanceNumber : instanceNumber
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        switch(response.data.instanceNumber){
          case 1 :
            SetTextarea1CurrentCount(prevCount => prevCount + 1)
            SetTextarea1Results(prev => [...prev, response.data]);
            break;
          case 2 :
            SetTextarea2CurrentCount(prevCount => prevCount + 1)
            SetTextarea2Results(prev => [...prev, response.data]);
            break;
          case 3 :
            SetTextarea3CurrentCount(prevCount => prevCount + 1)
            SetTextarea3Results(prev => [...prev, response.data]);
            break;
          case 4 :
            SetTextarea4CurrentCount(prevCount => prevCount + 1)
            SetTextarea4Results(prev => [...prev, response.data]);
            break;
          case 5 :
            SetTextarea5CurrentCount(prevCount => prevCount + 1)
            SetTextarea5Results(prev => [...prev, response.data]);
            break;
        }
      })
    }
  }

  const lineCheck = (lines, instanceNumber) => {
    let LINES = lines.split('\n')
    
    if (LINES.length > maxLines) {
      toast({
        title: `Lines should be less than or equal to 2500`,
        status: 'error',
        isClosable: true,
      })
    } else {
      switch(instanceNumber){
        case 1 :
          SetTextarea1(lines)
          SetTextarea1Count(LINES.length)
          break;
        case 2 :
          SetTextarea2(lines)
          SetTextarea2Count(LINES.length)
          break;
        case 3 :
          SetTextarea3(lines)
          SetTextarea3Count(LINES.length)
          break;
        case 4 :
          SetTextarea4(lines)
          SetTextarea4Count(LINES.length)
          break;
        case 5 :
          SetTextarea5(lines)
          SetTextarea5Count(LINES.length)
          break;
      }
    }
  }

  return (
    <Container p={0} maxW='full'>
      <Flex p={4} backgroundColor="blue.700">
        <Heading size="md" color="#fff">Page Source Checker Using Keyword</Heading>
      </Flex>
      <Grid p={4} templateColumns='1fr 1fr 1fr 1fr 1fr 1fr' gap={4}>
        <Stack spacing={0}>
          <Heading size='md'>Keyword</Heading>
          <Text>Separated by lines.</Text>
          <Textarea 
          onChange={(e) => {
            const lines = e.target.value.split('\n');
            SetKeyword(e.target.value)
            SetKeywordCounter(lines.length)
          }}
          mt={2} size='sm' />
          <Text mt={4}>{KeywordCount} word/s detected</Text>
          {Keyword !== "" ? Keyword.split('\n').map(keyword => (
            <>
              <Text>{keyword}</Text>
            </>
          )) : <Text>No keyword detected.</Text>}
        </Stack>

        <Stack spacing={0}>
          <Heading size='md'>URL List 1</Heading>
          <Text>Separated by lines.</Text>
          <Textarea onChange={(e) => {lineCheck(e.target.value, 1)}} mt={2} size='sm' />
          <Button mt={4} isDisabled={isScanning1} colorScheme="green" onClick={() => StartScan(1)}>{isScanning1 ? 'Scanning...' : 'Start Scan'}</Button>
          <Button mt={2} onClick={() => handleDownloadResult(1)}>Download Results</Button>
          <Text mt={4}>Scanning: {Textarea1CurrentCount} of {Textarea1Count}</Text>
        </Stack>
        <Stack spacing={0}>
          <Heading size='md'>URL List 2</Heading>
          <Text>Separated by lines.</Text>
          <Textarea onChange={(e) => {lineCheck(e.target.value, 2)}} mt={2} size='sm' />
          <Button mt={4} isDisabled={isScanning2} colorScheme="green" onClick={() => StartScan(2)}>Start Scan</Button>
          <Button mt={2} onClick={() => handleDownloadResult(2)}>Download Results</Button>
          <Text mt={4}>Scanning: {Textarea2CurrentCount} of {Textarea2Count}</Text>
        </Stack>
        <Stack spacing={0}>
          <Heading size='md'>URL List 3</Heading>
          <Text>Separated by lines.</Text>
          <Textarea onChange={(e) => {lineCheck(e.target.value, 3)}} mt={2} size='sm' />
          <Button mt={4} isDisabled={isScanning3} colorScheme="green" onClick={() => StartScan(3)}>Start Scan</Button>
          <Button mt={2} onClick={() => handleDownloadResult(3)}>Download Results</Button>
          <Text mt={4}>Scanning: {Textarea3CurrentCount} of {Textarea3Count}</Text>
        </Stack>
        <Stack spacing={0}>
          <Heading size='md'>URL List 4</Heading>
          <Text>Separated by lines.</Text>
          <Textarea onChange={(e) => {lineCheck(e.target.value, 4)}} mt={2} size='sm' />
          <Button mt={4} isDisabled={isScanning4} colorScheme="green" onClick={() => StartScan(4)}>Start Scan</Button>
          <Button mt={2} onClick={() => handleDownloadResult(4)}>Download Results</Button>
          <Text mt={4}>Scanning: {Textarea4CurrentCount} of {Textarea4Count}</Text>
        </Stack>
        <Stack spacing={0}>
          <Heading size='md'>URL List 5</Heading>
          <Text>Separated by lines.</Text>
          <Textarea onChange={(e) => {lineCheck(e.target.value, 5)}} mt={2} size='sm' />
          <Button mt={4} isDisabled={isScanning5} colorScheme="green" onClick={() => StartScan(5)}>Start Scan</Button>
          <Button mt={2} onClick={() => handleDownloadResult(5)}>Download Results</Button>
          <Text mt={4}>Scanning: {Textarea5CurrentCount} of {Textarea5Count}</Text>
        </Stack>
      </Grid>
    </Container>
  )
}

export default App