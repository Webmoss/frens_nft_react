import { TransactionBlock } from "@mysten/sui.js/transactions";
import { ConnectButton, useCurrentAccount, useSignAndExecuteTransactionBlock, useSuiClient, 
  // useSuiClientQuery, 
  // useSuiClientContext 
} from "@mysten/dapp-kit";
import { Box, Button, Grid, Container, Flex, Heading, Text } from "@radix-ui/themes";
import { useNetworkVariable } from "./networkConfig";
import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';

import data from "./data/frens-metadata.json";
import prizes from "./data/prizes-metadata.json";

import frensGallery1 from './assets/images/KING.png';
import frensGallery2 from './assets/images/ECANEM.png';
import frensGallery3 from './assets/images/MOONING.png';
import frensGallery4 from './assets/images/69.png';
import frensGallery5 from './assets/images/FIRE.png';
import frensGallery6 from './assets/images/LOR3LORD.png';
import frensGallery7 from './assets/images/LEGION-OF-DEGENS.png';
import frensGallery8 from './assets/images/PLANET-X.png';
import frensGallery9 from './assets/images/TWITTERS_DED.png';
import frensGallery10 from './assets/images/THE-BAG.png';
import frensGallery11 from './assets/images/FOMO.png';
import frensGallery12 from './assets/images/THEY-DO-EXIST.png';
import frensGallery13 from './assets/images/ZIRCONIUM.png';
import frensGallery14 from './assets/images/MIC.png';
import frensGallery15 from './assets/images/GARY.png';
import frensGallery16 from './assets/images/DOWN-BAD-BUNNY.png';

import frensLogo from './assets/images/Frens-NFT-Logo.png';
import homeGallery2 from './assets/images/LORE1.png';
// import homeGallery3 from './assets/images/LEGION-OF-DEGENS.png';
import homeGallery4 from './assets/images/THINK_SUI.png';
import homeGallery5 from './assets/images/SHINE-BRIGHT.png';
import homeGallery6 from './assets/images/CHAOS1.png';

import homeGallery7 from './assets/images/BA_NA_NA_NA.png';
import homeGallery8 from './assets/images/LORE2.png';
import homeGallery9 from './assets/images/MIC.png';
import homeGallery10 from './assets/images/LORD1.png';
import homeGallery11 from './assets/images/LEGION-OF-DEGENS.png';
import homeGallery12 from './assets/images/CHAOS2.png';

import homeGallery13 from './assets/images/WARCHEST.png';
import homeGallery14 from './assets/images/LORE3.png';
import homeGallery15 from './assets/images/TORNADO_CASH.png';
import homeGallery16 from './assets/images/LORD2.png';
import homeGallery17 from './assets/images/SHT_COINS.png';
import homeGallery18 from './assets/images/CHAOS3.png';

import homeGallery19 from './assets/images/WEB3_FASHION.png';
import homeGallery20 from './assets/images/LORE4.png';
import homeGallery21 from './assets/images/ZIRCONIUM.png';
import homeGallery22 from './assets/images/LORD3.png';
import homeGallery23 from './assets/images/WILD_RIDE.png';
import homeGallery24 from './assets/images/CHAOS4.png';

import homeGallery25 from './assets/images/MOONING.png';
import homeGallery26 from './assets/images/HODL1.png';
import homeGallery27 from './assets/images/HODL2.png';
import homeGallery28 from './assets/images/LORD4.png';
import homeGallery29 from './assets/images/HODL4.png';
import homeGallery30 from './assets/images/CHAOS5.png';

import homeGallery31 from './assets/images/MAYHEM1.png';
import homeGallery32 from './assets/images/MAYHEM2.png';
import homeGallery33 from './assets/images/MAYHEM3.png';
import homeGallery34 from './assets/images/MAYHEM4.png';
import homeGallery35 from './assets/images/MAYHEM5.png';
import homeGallery36 from './assets/images/MAYHEM6.png';

function App() {

  const client = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();
  
  const minterPackageId = useNetworkVariable("minterPackageId");
  const currentAccount = useCurrentAccount();
  
  const [page] = useState('mint');
  const [mintCount, setMintCount] = useState(0);
  const [digest, setDigest] = useState('');
  const [nftObjectId, setNftObjectId] = useState('');
  const [mintImage, setMintImage] = useState('');
  const [claimed, setClaimed] = useState(false);


  function mint_nft() {

    const frensData = data.frens as any;
    let keys = Object.keys(frensData);
    let randomProperty = keys[Math.floor(keys.length*Math.random())]
    let fren = frensData[randomProperty]

    try {
      const txb = new TransactionBlock();
      txb.moveCall({
        target: `${minterPackageId}::frens::mint_to_sender`,
        arguments: [
          txb.pure.string(fren.name),
          txb.pure.string(fren.description),
          txb.pure.string(fren.trait),
          txb.pure.string(fren.image_ipfs)
        ],        
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
                const nftObjectId = tx.effects?.created?.[0]?.reference?.objectId;
                if (nftObjectId) {
                  setNftObjectId(nftObjectId)
                }
                const txnDigest = tx.digest;
                if (txnDigest) {
                  setDigest(txnDigest);
                  console.log("digest", digest);
                  setMintCount( mintCount + 1 );
                }
                setMintImage(fren.image_url);
                toast.success('Successfully minted a new Fren');
              }
            );
          },
        },
      );
    } catch (error) {
      console.error(error);
      toast.error('Error minting a new Fren');
    }   
  }

  function claim_nft() {

    const frensPrizes = prizes.frens as any;
    var keys = Object.keys(frensPrizes);
    var randomProperty = keys[Math.floor(keys.length*Math.random())]
    var prize = frensPrizes[randomProperty]
    console.log("Fren Prize", prize);
    
    try {
      const txb = new TransactionBlock();
      txb.moveCall({
        target: `${minterPackageId}::frens::mint_to_sender`,
        arguments: [
          txb.pure.string(prize.name),
          txb.pure.string(prize.description),
          txb.pure.string(prize.trait),
          txb.pure.string(prize.image_ipfs)
        ],        
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
                const nftObjectId = tx.effects?.created?.[0]?.reference?.objectId;
                if (nftObjectId) {
                  console.log("Nft Object Id", nftObjectId);
                  setNftObjectId(nftObjectId)
                }

                const txnDigest = tx.digest;
                if (txnDigest) {
                  setDigest(txnDigest);
                  setClaimed( true );
                }
                setMintImage(prize.image_url);
                toast.success('Congrats Fren, you claimed a Bonus Letter. Reload the page to try again!');
              }
            );
          },
        },
      );
    } catch (error) {
      console.error(error);
      toast.error('Error minting a new Fren');
    }   
  }

  // function OwnedObjects({ address }: { address: string }) {
  //   const { data } = useSuiClientQuery('getOwnedObjects', {
  //     filter: {
  //       StructType: `${minterPackageId}::frens::Fren`,
  //     },
  //     owner: address,
  //     options: {
  //       showContent: true,
  //       showOwner: true,
  //     },
  //   });
  //   if (!data) {
  //     return null;
  //   }
  //   return (
  //     <ul>
  //       {data.data.map((object) => (
  //         <li key={object.data?.objectId}>
  //           <a href={`https://suiscan.xyz/mainnet/object/${object.data?.objectId}`} target="_blank">
  //             {object.data?.objectId}
  //           </a>
  //         </li>
  //       ))}
  //     </ul>
  //   );
  // }

  // function NetworkSelector() {
  //   const ctx = useSuiClientContext();
  //   return (
  //     <div>
  //       {Object.keys(ctx.networks).map((network) => (
  //         <button key={network} onClick={() => ctx.selectNetwork(network)}>
  //           {`select ${network}`}
  //         </button>
  //       ))}
  //     </div>
  //   );
  // }  

  function ConnectedAccount() {
    const account = useCurrentAccount();
    if (!account) {
      return null;
    }
    return (
      <Box style={{ color: "#ffffff", marginTop: '20px'}}>
        <Text as="p">Connected: {account.address}</Text>
      </Box>         
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
        {/* <Box>
        <button style={{ border: "none", backgroundColor: "transparent", color: "#ffffff", fontWeight: "600", marginTop: "10px", marginRight: "10px", cursor: "pointer" }}
            onClick={() => { setPage("mint") }}
          >Mint</button>
          <button style={{ border: "none", backgroundColor: "transparent", color: "#ffffff", fontWeight: "600", marginTop: "10px", marginRight: "10px", cursor: "pointer" }}
            onClick={() => { setPage("home") }}
          >Collection</button>
        </Box> */}
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
              <Grid columns="4" gap="3" width="auto">
                <Box><img src={frensGallery1} alt="Logo" /></Box>
                <Box><img src={frensGallery2} alt="Logo" /></Box>
                <Box><img src={frensGallery3} alt="Logo" /></Box>
                <Box><img src={frensGallery4} alt="Logo" /></Box>
                <Box><img src={frensGallery5} alt="Logo" /></Box>
                <Box><img src={frensGallery6} alt="Logo" /></Box>
                <Box><img src={frensGallery7} alt="Logo" /></Box>
                <Box><img src={frensGallery8} alt="Logo" /></Box>
                <Box><img src={frensGallery9} alt="Logo" /></Box>
                <Box><img src={frensGallery10} alt="Logo" /></Box>
                <Box><img src={frensGallery11} alt="Logo" /></Box>
                <Box><img src={frensGallery12} alt="Logo" /></Box>
                <Box><img src={frensGallery13} alt="Logo" /></Box>
                <Box><img src={frensGallery14} alt="Logo" /></Box>
                <Box><img src={frensGallery15} alt="Logo" /></Box>
                <Box><img src={frensGallery16} alt="Logo" /></Box>
             </Grid>
           </Container>
         </Box>
        ) : (
          <Box>
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
                        fontSize: "24px",
                        color: "#ffffff",
                        marginTop: '20px',
                        textAlign: "center"
                      }}
                    >
                      Welcome to LOR3LORD's Frens
                    </Heading>
                    <Heading
                      style={{
                        fontSize: "18px",
                        color: "#ffffff",
                        marginTop: '10px',
                        textAlign: "center"
                      }}
                    >
                      Mint 3 Frens NFTs to claim your Bonus Letter<br />
                      Collect all the letters and spell LOR3, LORD, HODL, CHAOS<br /> or MAYHEM
                      and win a Bonus Prize in Sui.<br /> Minting is 100% FREE, only pay for gas
                    </Heading>
                  </Box>
                  {mintCount <= 2 ? (
                    <Box style={{margin: '30px'}}>
                      {/* <Button
                        size="4"
                        onClick={() => {
                          mint_nft();
                        }}
                      >
                        Mint Frens
                      </Button> */}
                      Mint Completed
                    </Box>        
                  ) : ( 
                    <Box>
                      <Heading
                      style={{
                        fontSize: "22px",
                        color: "#ffffff",
                        marginTop: '20px',
                        textAlign: "center"
                      }}
                    >
                      Thanks for minting Frens,<br /> reload your browser to run it again!
                    </Heading>
                    {nftObjectId && !claimed && (
                      <Box style={{margin: '20px', textAlign: 'center' }}>
                        {/* <Button
                          size="4"
                          onClick={() => {
                            claim_nft();
                          }}
                        >
                          Claim
                        </Button> */}
                      </Box>        
                    )}
                    </Box>        
                  )} 
                  { mintImage ? (
                    <Box style={{ marginTop: '20px' }}>
                      <Container size="1">
                        <img 
                          src={mintImage} 
                          alt="Logo" 
                          width="500px" 
                        />
                      </Container>
                    </Box>
                  ) : (
                    <Container style={{ marginTop: '0' }} size="1">
                      <Grid columns="6" gap="3" width="auto">
                        <Box><img src={frensLogo} alt="Logo" /></Box>
                        <Box><img src={homeGallery2} alt="Logo" /></Box>
                        <Box><img src={frensGallery16} alt="Logo" /></Box>
                        <Box><img src={homeGallery4} alt="Logo" /></Box>
                        <Box><img src={homeGallery5} alt="Logo" /></Box>
                        <Box><img src={homeGallery6} alt="Logo" /></Box>
                        <Box><img src={homeGallery7} alt="Logo" /></Box>
                        <Box><img src={homeGallery8} alt="Logo" /></Box>
                        <Box><img src={homeGallery9} alt="Logo" /></Box>
                        <Box><img src={homeGallery10} alt="Logo" /></Box>
                        <Box><img src={homeGallery11} alt="Logo" /></Box>
                        <Box><img src={homeGallery12} alt="Logo" /></Box>
                        
                        <Box><img src={homeGallery13} alt="Logo" /></Box>
                        <Box><img src={homeGallery14} alt="Logo" /></Box>
                        <Box><img src={homeGallery15} alt="Logo" /></Box>
                        <Box><img src={homeGallery16} alt="Logo" /></Box>
                        <Box><img src={homeGallery17} alt="Logo" /></Box>
                        <Box><img src={homeGallery18} alt="Logo" /></Box>
                        
                        <Box><img src={homeGallery19} alt="Logo" /></Box>
                        <Box><img src={homeGallery20} alt="Logo" /></Box>
                        <Box><img src={homeGallery21} alt="Logo" /></Box>
                        <Box><img src={homeGallery22} alt="Logo" /></Box>
                        <Box><img src={homeGallery23} alt="Logo" /></Box>
                        <Box><img src={homeGallery24} alt="Logo" /></Box>
                        
                        <Box><img src={homeGallery25} alt="Logo" /></Box>
                        <Box><img src={homeGallery26} alt="Logo" /></Box>
                        <Box><img src={homeGallery27} alt="Logo" /></Box>
                        <Box><img src={homeGallery28} alt="Logo" /></Box>
                        <Box><img src={homeGallery29} alt="Logo" /></Box>
                        <Box><img src={homeGallery30} alt="Logo" /></Box>

                        <Box><img src={frensGallery1} alt="Logo" /></Box>
                        <Box><img src={frensGallery2} alt="Logo" /></Box>
                        <Box><img src={frensGallery4} alt="Logo" /></Box>
                        <Box><img src={frensGallery5} alt="Logo" /></Box>
                        <Box><img src={frensGallery6} alt="Logo" /></Box>
                        <Box><img src={frensGallery8} alt="Logo" /></Box>

                        <Box><img src={homeGallery31} alt="Logo" /></Box>
                        <Box><img src={homeGallery32} alt="Logo" /></Box>
                        <Box><img src={homeGallery33} alt="Logo" /></Box>
                        <Box><img src={homeGallery34} alt="Logo" /></Box>
                        <Box><img src={homeGallery35} alt="Logo" /></Box>
                        <Box><img src={homeGallery36} alt="Logo" /></Box>
                        
                        <Box><img src={frensGallery9} alt="Logo" /></Box>
                        <Box><img src={frensGallery10} alt="Logo" /></Box>
                        <Box><img src={frensGallery11} alt="Logo" /></Box>
                        <Box><img src={frensGallery12} alt="Logo" /></Box>
                        <Box><img src={frensGallery13} alt="Logo" /></Box>
                        <Box><img src={frensGallery15} alt="Logo" /></Box>                        
                      </Grid>
                    </Container>
                  )}                               
                  {/* DEV STUFF to Remove */}
                  {/* <NetworkSelector /> */}
                  <ConnectedAccount />
                  {/* DEV STUFF to Remove */}
                  {/* {digest ? (
                    <Box style={{ color: "#ffffff"}}>
                      <Text as="p">Txn Digest: {digest}</Text>
                    </Box>        
                  ) : ( 
                    null
                  )} */}
                {/* <OwnedObjects address={currentAccount.address} /> */}
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
                      A Sui NFT project by LOR3LORD for ThinkSui
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
                        fontSize: "17px",
                        color: "#ffffff",
                        paddingTop: '20px',
                        paddingBottom: '10px',
                        textAlign: "center"
                      }}
                    >
                      Please connect your Sui wallet to begin
                    </Heading>
                  </Box>
                </Flex>
              </Container>
            )}
          </Box>
        )}
      </Container>
      <Toaster />
    </>
  );
}

export default App;
