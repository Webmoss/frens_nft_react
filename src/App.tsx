import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { isValidSuiObjectId } from "@mysten/sui.js/utils";
import { Box, Grid, Container, Flex, Heading } from "@radix-ui/themes";
import { useState } from "react";
import { Minter } from "./Minter";
import { MintNft } from "./MintNft";

import frensLogo from './assets/images/Frens-NFT-Logo.png';

function App() {
  const currentAccount = useCurrentAccount();
  
  const [counterId, setCounter] = useState(() => {
    const hash = window.location.hash.slice(1);
    return isValidSuiObjectId(hash) ? hash : null;
  });

  const [page, setPage] = useState('mint');

  return (
    <>
      <Flex
        position="sticky"
        mx="auto"
        px="4"
        py="2"
        justify="between"
        style={{
          backgroundColor:" #e2201e",
          borderBottom: "1px solid var(--gray-a2)",
          maxWidth: 800
        }}
      >
        <Box>
          <Heading
            style={{
              color:" #ffffff",
              paddingTop: '5px'
            }}
          >
            Frens NFT
          </Heading>
        </Box>
        <Box>
          <button 
            style={{
              border: "none",
              backgroundColor: "transparent",
              color: "#ffffff",
              marginTop: "10px",
              marginRight: "10px",
              cursor: "pointer"
            }}
            onClick={() => {
              setPage("home");
            }}
          >
            About
          </button>
          <button 
            style={{
              border: "none",
              backgroundColor: "transparent",
              color: "#ffffff",
              marginTop: "10px",
              marginRight: "10px",
              cursor: "pointer"
            }}
            onClick={() => {
              setPage("mint");
            }}
          >
            Mint
          </button>
        </Box>
        <Box>
          <ConnectButton />
        </Box>        
      </Flex>
      
      
      <Container
        mt="5"
        mx="auto"
        pt="2"
        px="4"
        style={{ background: 'var(--gray-a2)', borderRadius: 'var(--radius-3)', maxWidth: 800, minHeight: 500 }}
      >
        {page === 'home' ? (
          <Box>
            <Container size="1">
              <Grid columns="3" gap="3" width="auto">
                <Box><img src={frensLogo} alt="Logo" /></Box>
                <Box><img src={frensLogo} alt="Logo" /></Box>
                <Box><img src={frensLogo} alt="Logo" /></Box>
                <Box><img src={frensLogo} alt="Logo" /></Box>
                <Box><img src={frensLogo} alt="Logo" /></Box>
                <Box><img src={frensLogo} alt="Logo" /></Box>
                <Box><img src={frensLogo} alt="Logo" /></Box>
                <Box><img src={frensLogo} alt="Logo" /></Box>
                <Box><img src={frensLogo} alt="Logo" /></Box>
             </Grid>
           </Container>
         </Box>
        ) : (
          <Box>
            {currentAccount ? (
              counterId ? (
                <Minter id={counterId} />
              ) : (
                <MintNft
                  onCreated={(id) => {
                    window.location.hash = id;
                    setCounter(id);
                  }}
                />
              )
            ) : (
              <Heading>Please connect your wallet</Heading>
            )}
          </Box>
        )}
      </Container>
    </>
  );
}

export default App;
