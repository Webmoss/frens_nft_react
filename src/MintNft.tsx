import { TransactionBlock } from "@mysten/sui.js/transactions";
import { Box, Button, Heading, Container, Flex, Text, Strong } from "@radix-ui/themes";
import { useSignAndExecuteTransactionBlock, useSuiClient } from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";

import frensLogo from './assets/images/Frens-NFT-Logo.png';

export function MintNft({ count }: { count: number }) {
  const client = useSuiClient();
  const minterPackageId = useNetworkVariable("minterPackageId");
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();

  const mintCount = count;
  console.log("mintCount", mintCount);

  return (
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
              color:" #1a1a1a",
              paddingTop: '5px',
              textAlign: "center"
            }}
          >
            Mint Frens NFT
          </Heading>
        </Box>
        <Box
          style={{
            padding: '10px',
          }}
        >
          <Container size="1">
            <img 
              src={frensLogo} 
              alt="Logo" 
              width="500px" 
            />
          </Container>
        </Box>
        
        {mintCount <= 100 ? (
          <Box>
            <Button
              size="3"
              onClick={() => {
                mint_nft();
              }}
            >
              Mint NFT
            </Button>
          </Box>        
        ) : ( 
          <Box>
            <Text as="p">Mint <Strong>Completed</Strong>.</Text>
          </Box>        
        )}
      </Flex>
    </Container>
  );

  function mint_nft() {

    if( mintCount <=100 ) {
      const txb = new TransactionBlock();

      txb.moveCall({
        arguments: [],
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
              });
          },
        },
      );
    }
  }
}
