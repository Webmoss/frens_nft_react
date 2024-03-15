import { TransactionBlock } from "@mysten/sui.js/transactions";
import { 
  ConnectButton, 
  useCurrentAccount,
  useSignAndExecuteTransactionBlock,
  useSuiClient,
  useSuiClientQuery,
  useSuiClientContext
} from "@mysten/dapp-kit";
import { Box, Button, Grid, Container, Flex, Heading, Text, Strong } from "@radix-ui/themes";
import { useNetworkVariable } from "./networkConfig";
import { useState } from "react";

// import styles from './assets/styles/styles.scss'; 

import frensLogo from './assets/images/Frens-NFT-Logo.png';

function App() {

  const client = useSuiClient();
  const minterPackageId = useNetworkVariable("minterPackageId");
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();
  const currentAccount = useCurrentAccount();
  
  const [page, setPage] = useState('mint');
  const [mintCount, setMintCount] = useState(0);
  const [digest, setDigest] = useState('');

  function mint_nft() {
    
    if( mintCount <=10 ) {
      console.log("Mint Nft Count: ", mintCount);

      const txb = new TransactionBlock();

      txb.moveCall({
        arguments: [
          txb.pure("GM Frens"),
          txb.pure("A Sui Frens NFT by LOR3LORD"),
          txb.pure("This is Fine"),
          txb.pure("ipfs://QmZhnkimthxvL32vin2mrQvnhN8ZbWFMvKMxRqHEq7dPz3"),
        ],
        target: `${minterPackageId}::frens_mint::mint`,
      });

      signAndExecute(
        {
          transactionBlock: txb,
          options: {
            showEffects: true,
            showObjectChanges: true,
          },
        },
        {
          onSuccess: (tx) => {
            client
              .waitForTransactionBlock({
                digest: tx.digest,
              })
              .then(() => {
                const objectId = tx.effects?.created?.[0]?.reference?.objectId;

                if (objectId) {
                  console.log("objectId", objectId);
                }

                setDigest(tx.digest);
                console.log("Digest", tx.digest);

                setMintCount( mintCount + 1 );
                console.log("Mint Count", mintCount);
              });
          },
        },
      );
    }
  }

  function OwnedObjects({ address }: { address: string }) {
    const { data } = useSuiClientQuery('getOwnedObjects', {
       owner: address,
    });
    if (!data) {
      return null;
    }
    return (
      <ul>
        {data.data.map((object) => (
          <li key={object.data?.objectId}>
            <a href={`https://suiexplorer.com/object/${object.data?.objectId}?network=devnet`} target="_blank">
              {object.data?.objectId}
            </a>
          </li>
        ))}
      </ul>
    );
  }

  function NetworkSelector() {
    const ctx = useSuiClientContext();
    return (
      <div>
        {Object.keys(ctx.networks).map((network) => (
          <button key={network} onClick={() => ctx.selectNetwork(network)}>
            {`select ${network}`}
          </button>
        ))}
      </div>
    );
  }  

  function ConnectedAccount() {
    const account = useCurrentAccount();
    if (!account) {
      return null;
    }
    return (
      <div>
        <div>Connected to {account.address}</div>;
        <OwnedObjects address={account.address} />
      </div>
    );
  }

  return (
    <>
      <Flex
        position="sticky"
        mx="auto"
        px="4"
        py="2"
        justify="between"
        style={{ backgroundColor:" #e2201e", borderBottom: "1px solid var(--gray-a2)", borderBottomLeftRadius: 'var(--radius-3)', borderBottomRightRadius: 'var(--radius-3)', maxWidth: 800 }}
      >
        <Box>
          <Heading style={{ color:" #ffffff", paddingTop: '5px' }}>
            Frens NFT
          </Heading>
        </Box>
        <Box>
        <button style={{ border: "none", backgroundColor: "transparent", color: "#ffffff", fontWeight: "600", marginTop: "10px", marginRight: "10px", cursor: "pointer" }}
            onClick={() => { setPage("mint") }}
          >Mint</button>
          <button style={{ border: "none", backgroundColor: "transparent", color: "#ffffff", fontWeight: "600", marginTop: "10px", marginRight: "10px", cursor: "pointer" }}
            onClick={() => { setPage("home") }}
          >Collection</button>
        </Box>
        <Box>
          <ConnectButton />
        </Box>        
      </Flex>
      <Container
        mt="5"
        mx="auto"
        p="4"
        style={{ background: '#e2201e', borderRadius: 'var(--radius-4)', maxWidth: 800, minHeight: 640 }}
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
            {/* {currentAccount ? (
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
            )} */}
            {currentAccount ? (
              <Container>
                <Flex
                  direction="column"
                  justify="center"
                  align="center"
                  mx="auto"
                  style={{
                    color:" #e2201e",
                  }}
                >
                  <Box>
                    <Heading
                      style={{
                        fontSize: "22px",
                        color: "#ffffff",
                        marginTop: '20px',
                        textAlign: "center"
                      }}
                    >
                      Welcome to LOR3LORD's Frens
                    </Heading>
                  </Box>
                  <Box style={{ marginTop: '20px' }}>
                    <Container size="1">
                      <img 
                        src={frensLogo} 
                        alt="Logo" 
                        width="500px" 
                      />
                    </Container>
                  </Box>

                  {mintCount <= 10 ? (
                    <Box style={{margin: '20px'}}>
                      <Button
                        size="4"
                        onClick={() => {
                          mint_nft();
                        }}
                      >
                        Mint a Fren
                      </Button>
                    </Box>        
                  ) : ( 
                    <Box>
                      <Text as="p">Max Mint <Strong>Completed</Strong>.</Text>
                    </Box>        
                  )}

                  {digest ? (
                    <Box style={{padding: '10px'}}>
                      <Text as="p">{digest}</Text>
                    </Box>        
                  ) : ( 
                    null
                  )}

                  {/* DEV STUFF to Remove */}
                  <NetworkSelector />
                  <ConnectedAccount />
                  {/* DEV STUFF to Remove */}

                </Flex>
              </Container>
            ) : (
              <Container>
                <Flex
                  direction="column"
                  justify="center"
                  align="center"
                  mx="auto"
                  style={{
                    color:" #e2201e",
                  }}
                >
                  <Box>
                    <Heading
                      style={{
                        fontSize: "20px",
                        color: "#ffffff",
                        marginTop: '20px',
                        textAlign: "center"
                      }}
                    >
                      A Sui NFT project by LOR3LORD
                    </Heading>
                  </Box>
                  <Box style={{ marginTop: '20px' }}>
                    <Container size="1">
                      <img 
                        src={frensLogo} 
                        alt="Logo" 
                        width="500px" 
                      />
                    </Container>
                  </Box>
                  <Box>
                    <Heading
                      style={{
                        fontSize: "18px",
                        color: "#ffffff",
                        paddingTop: '20px',
                        paddingBottom: '10px',
                        textAlign: "center"
                      }}
                    >
                      Please connect your Sui wallet to continue...
                    </Heading>
                  </Box>
                </Flex>
              </Container>
            )}
          </Box>
        )}
      </Container>
    </>
  );
}

export default App;
