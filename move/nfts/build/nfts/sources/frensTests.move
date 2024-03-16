// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// TODO: consider renaming this to `example_nft`
/// A minimalist example to demonstrate how to create an NFT like object
/// on Sui.
module nfts::frens {
    use sui::url::{Self, Url};
    use std::string;
    use sui::object::{Self, ID, UID};
    use sui::event;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    /// An example NFT that can be minted by anybody
    struct FrenNFT has key, store {
        id: UID,
        /// Name for the token
        name: string::String,
        /// Description of the token
        description: string::String,
        /// Trait of the token
        trait: string::String,
        /// URL for the token
        url: Url,
    }

    struct MintNFTEvent has copy, drop {
        // The Object ID of the NFT
        object_id: ID,
        // The creator of the NFT
        creator: address,
        // The name of the NFT
        name: string::String,
        // The description of the NFT
        description: string::String,
        // The trait of the NFT
        trait: string::String,
        /// URL for the token
        url: Url
    }

    /// Create a new frens
    public entry fun mint(
        name: vector<u8>,
        description: vector<u8>,
        trait: vector<u8>,
        url: vector<u8>,
        ctx: &mut TxContext
    ) {
        let nft = FrenNFT {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            trait: string::utf8(trait),
            url: url::new_unsafe_from_bytes(url)
        };
        let sender = tx_context::sender(ctx);
        event::emit(MintNFTEvent {
            object_id: object::uid_to_inner(&nft.id),
            creator: sender,
            name: nft.name,
            description: nft.description,
            trait: nft.trait,
            url: nft.url,
        });
        transfer::public_transfer(nft, sender);
    }

    /// Update the `description` of `nft` to `new_description`
    public entry fun update_description(
        nft: &mut FrenNFT,
        new_description: vector<u8>,
    ) {
        nft.description = string::utf8(new_description)
    }

    /// Update the `trait` of `nft` to `new_trait`
    public entry fun update_trait(
        nft: &mut FrenNFT,
        new_trait: vector<u8>,
    ) {
        nft.trait = string::utf8(new_trait)
    }

    /// Permanently delete `nft`
    public entry fun burn(nft: FrenNFT) {
        let FrenNFT { id, name: _, description: _, trait: _, url: _ } = nft;
        object::delete(id)
    }

    /// Get the NFT's `name`
    public fun name(nft: &FrenNFT): &string::String {
        &nft.name
    }

    /// Get the NFT's `description`
    public fun description(nft: &FrenNFT): &string::String {
        &nft.description
    }

    /// Get the NFT's `trait`
    public fun trait(nft: &FrenNFT): &string::String {
        &nft.trait
    }

    /// Get the NFT's `url`
    public fun url(nft: &FrenNFT): &Url {
        &nft.url
    }
}

#[test_only]
module nfts::frensTests {
    use nfts::frens::{Self, FrenNFT};
    use sui::test_scenario as ts;
    use sui::transfer;
    use std::string;

    #[test]
    fun mint_transfer_update() {
        let addr1 = @0xA;
        let addr2 = @0xB;
        // create the NFT
        let scenario = ts::begin(addr1);
        {
            frens::mint(b"Frenly", b"A cool fren he is indeed!", b"BOSS fren", b"https://www.sui.io", ts::ctx(&mut scenario))
        };
        // send it from A to B
        ts::next_tx(&mut scenario, addr1);
        {
            let nft = ts::take_from_sender<FrenNFT>(&scenario);
            transfer::public_transfer(nft, addr2);
        };
        // update its description
        ts::next_tx(&mut scenario, addr2);
        {
            let nft = ts::take_from_sender<FrenNFT>(&scenario);
            frens::update_description(&mut nft, b"a new description") ;
            assert!(*string::bytes(frens::description(&nft)) == b"a new description", 0);
            ts::return_to_sender(&scenario, nft);
        };
        // update its trait
        ts::next_tx(&mut scenario, addr2);
        {
            let nft = ts::take_from_sender<FrenNFT>(&scenario);
            frens::update_trait(&mut nft, b"a new trait") ;
            assert!(*string::bytes(frens::trait(&nft)) == b"a new trait", 0);
            ts::return_to_sender(&scenario, nft);
        };
        // burn it
        ts::next_tx(&mut scenario, addr2);
        {
            let nft = ts::take_from_sender<FrenNFT>(&scenario);
            frens::burn(nft)
        };
        ts::end(scenario);
    }
}