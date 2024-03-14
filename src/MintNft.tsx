import { TransactionBlock } from "@mysten/sui.js/transactions";
import { Box, Button, Heading, Container, Flex } from "@radix-ui/themes";
import {
  useSignAndExecuteTransactionBlock,
  useSuiClient,
} from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";

import frensLogo from './assets/images/Frens-NFT-Logo.png';

export function MintNft({
  onCreated,
}: {
  onCreated: (id: string) => void;
}) {
  const client = useSuiClient();
  const minterPackageId = useNetworkVariable("minterPackageId");
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();

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
        <Box>
          <Button
            size="3"
            onClick={() => {
              create();
            }}
          >
            Mint NFT
          </Button>
        </Box>        
      </Flex>
    </Container>
  );

  function create() {
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
                onCreated(objectId);
              }
            });
        },
      },
    );
  }
}
