module frens_mint::frens_nft {
    
    // Part 1: Imports
    // use std::option::{Self, Option};
    use std::string::{Self, String};
    
    use sui::transfer;
    use sui::object::{Self, ID, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::url::{Self, Url};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::object_table::{Self, ObjectTable};
    use sui::event;

    // const NOT_THE_OWNER: u64 = 0;
    const INSUFFICIENT_FUNDS: u64 = 1;
    const MIN_CARD_COST: u64 = 1;

    // Part 2: Struct definitions
    struct FrensCollection has key {
        id: UID,
        owner: address,
        nfts: ObjectTable<u64, FrenNFT>,
        counter: u64
    }

    /// A Frens NFT is freely-transferable object. Owner can make updates 
    /// to their fren at any time and even change the image to their liking
    struct FrenNFT has key, store {
        id: UID,
        /// Owner of the Frens NFT
        owner: address,
        /// Name of the Fren NFT
        name: String,
        /// Description of the fren
        description: String,
        /// Fren Traits Grumpy or chill?
        traits: String,
        /// URL for the token
        img_url: Url,
    }

    // Part 3: Module initializer to be executed when this module is published
    fun init(ctx: &mut TxContext) {
        transfer::share_object(
            FrensCollection {
                id: object::new(ctx),
                owner: tx_context::sender(ctx),
                nfts: object_table::new(ctx),
                counter: 0,
            }
        );
    }

    /// Event: emitted when a new Fren is minted.
    struct FrenMinted has copy, drop {
        // The Object ID of the NFT
        id: ID,
        // The address of the NFT minter
        owner: address,
        // The name of the NFT
        name: String,
        // The description of the NFT
        description: String,
        // The traits of the NFT
        traits: String,
        // The url of the NFT
        img_url: Url,
    }

    // struct DescriptionUpdated has copy, drop {
    //     // The Object ID of the NFT
    //     id: ID,
    //     // The address of the NFT minter
    //     owner: address,
    //     // The name of the NFT
    //     name: String,
    //     // The description of the NFT
    //     description: String,
    // }

    // struct TraitsnUpdated has copy, drop {
    //     // The Object ID of the NFT
    //     id: ID,
    //     // The address of the NFT minter
    //     owner: address,
    //     // The name of the NFT
    //     name: String,
    //     // The traits of the NFT
    //     traits: String,
    // }

    // ===== Public view functions =====
    // Part 4: Accessors required to read the struct attributes

    /// Get the NFT's `name`
    public fun name(nft: &FrenNFT): &string::String {
        &nft.name
    }

    /// Get the NFT's `description`
    public fun description(nft: &FrenNFT): &string::String {
        &nft.description
    }

    /// Get the NFT's `traits`
    public fun traits(nft: &FrenNFT): &string::String {
        &nft.traits
    }

    /// Get the NFT's `url`
    public fun url(nft: &FrenNFT): &Url {
        &nft.img_url
    }

    // ===== Entrypoints =====
    /// Mint a new Fren with the given `name`, `traits` and `url`.
    /// The object is returned to sender and they're free to transfer
    /// it to themselves or anyone else.
    public entry fun mint(
        name: vector<u8>,
        description: vector<u8>,
        traits: vector<u8>,
        img_url: vector<u8>,
        payment: Coin<SUI>,
        collection: &mut FrensCollection,
        ctx: &mut TxContext
    ) {
        // Get the tokens transferred with the transaction
        let value = coin::value(&payment); 

        // Check if the sent amount is correct
        assert!(value == MIN_CARD_COST, INSUFFICIENT_FUNDS); 

        // Tranfer the tokens to FrensCollection Owner
        transfer::public_transfer(payment, collection.owner); 

        // Here we increase the counter before adding the NFT to the table
        collection.counter = collection.counter + 1;

        // Mint and send the Frens NFT to the caller
        let sender = tx_context::sender(ctx);

        // Create the new NFT
        let nft = FrenNFT {
            id: object::new(ctx),
            owner: sender,
            name: string::utf8(name),
            description: string::utf8(description),
            traits: string::utf8(traits),
            img_url: url::new_unsafe_from_bytes(img_url),
        };

        event::emit(FrenMinted {
            id: object::id(&nft),
            owner: sender,
            name: nft.name,
            description: nft.description,
            traits: nft.traits,
            img_url: nft.img_url,
        });

        // Adding Frens NFT to the table
        object_table::add(&mut collection.nfts, collection.counter, nft);

        // Transfer the NFT to the caller
        // transfer::public_transfer(nft, sender);
    }

    /// Transfer `nft` to `recipient`
    public fun transfer(
        nft: FrenNFT, recipient: address, _: &mut TxContext
    ) {
        transfer::public_transfer(nft, recipient)
    }

    /// Update the `name` of `nft` to `new_name`
    public fun update_name(
        nft: &mut FrenNFT,
        new_name: vector<u8>,
        _: &mut TxContext
    ) {
        nft.name = string::utf8(new_name)
    }

    /// Update the `description` of `nft` to `new_description`
    public fun update_description(
        nft: &mut FrenNFT,
        new_description: vector<u8>,
        _: &mut TxContext
    ) {
        nft.description = string::utf8(new_description)
    }

    // With this function the user can change their Frens NFT description
    // public entry fun update_description(
    //     collection: &mut FrensCollection, 
    //     new_description: vector<u8>, 
    //     id: u64, 
    //     ctx: &mut TxContext
    // ) {

    //     let user_nft = object_table::borrow_mut(&mut collection.nfts, id);
    //     assert!(tx_context::sender(ctx) == user_nft.owner, NOT_THE_OWNER);
    //     let old_value = option::swap_or_fill(&mut user_nft.description, string::utf8(new_description));

    //     event::emit(DescriptionUpdated {
    //         id: object::id(user_nft),
    //         name: user_nft.name,
    //         owner: user_nft.owner,
    //         description: string::utf8(new_description)
    //     });
    //     _ = old_value;
    // }

    /// Update the `traits` of `nft` to `new_traits`
    public fun update_traits(
        nft: &mut FrenNFT,
        new_traits: vector<u8>,
        _: &mut TxContext
    ) {
        nft.traits = string::utf8(new_traits)
    }

    // With this function the user can change their Frens NFT description
    // public entry fun update_traits(collection: &mut FrensCollection, new_trait: vector<u8>, id: u64, ctx: &mut TxContext) {

    //     let user_nft = object_table::borrow_mut(&mut collection.nfts, id);
    //     assert!(tx_context::sender(ctx) == user_nft.owner, NOT_THE_OWNER);
    //     let old_value = option::swap_or_fill(&mut user_nft.traits, string::utf8(new_trait));

    //     event::emit(TraitsnUpdated {
    //         id: object::id(user_nft),
    //         name: user_nft.name,
    //         owner: user_nft.owner,
    //         traits: string::utf8(new_trait)
    //     });
    //     _ = old_value;
    // }


    /// Update the `url` of `nft` to `new_url`
    public fun update_url(
        nft: &mut FrenNFT,
        new_url: vector<u8>,
        _: &mut TxContext
    ) {
        nft.img_url = url::new_unsafe_from_bytes(new_url)
    }

    /// Some frens get new traits over time... 
    /// owner of one can add a new trait to their fren at any time.
    // public fun add_trait(
    //     nft: &mut FrenNFT, 
    //     _trait: String) {
    //     vector::push_back(&mut nft._traits, _trait);
    // }

    // This function returns the NFT based on the id provided
    public fun get_nft_info(collection: &FrensCollection, id: u64): (
        address,
        String,
        String,
        String,
        Url,
    ) {
        let nft = object_table::borrow(&collection.nfts, id);
        (
            nft.owner,
            nft.name,
            nft.description,
            nft.traits,
            nft.img_url,
        )
    }

    /// Permanently delete `nft`
    public fun burn(nft: FrenNFT, _: &mut TxContext) {
        let FrenNFT { id, owner: _, name: _, description: _, traits: _, img_url: _  } = nft;
        object::delete(id)
    }
}

//     #[test_only]
//     module frens_mint::frens_nftTests {
//     use frens_mint::frens_nft::{Self, FrenNFT};
//     use sui::test_scenario as ts;
//     use sui::transfer;
//     use std::string;
//     use sui::coin::{Self};
//     use sui::sui::SUI;

//     #[test]
//     fun mint_transfer_update() {
//         let addr1 = @0xA;
//         let addr2 = @0xB;
//         // create the NFT
//         let scenario = ts::begin(addr1);
//         {
//             let coin = coin::mint_for_testing<SUI>(10_000_000_000, ts::ctx(&mut scenario));
//             frens_nft::mint(b"test", b"a test", b"a test", b"https://www.sui.io", coin, 0xbace50bb4e1369c302fab17e27a961b99b321848f0472672a4f7bca3e54fd01b, ts::ctx(&mut scenario))
//         };
//         // send it from A to B
//         ts::next_tx(&mut scenario, addr1);
//         {
//             let nft = ts::take_from_sender<FrenNFT>(&scenario);
//             transfer::public_transfer(nft, addr2);
//         };
//         // update its description
//         ts::next_tx(&mut scenario, addr2);
//         {
//             let nft = ts::take_from_sender<FrenNFT>(&scenario);
//             frens_nft::update_description(&mut nft, b"a new description", ts::ctx(&mut scenario)) ;
//             assert!(*string::bytes(frens_nft::description(&nft)) == b"a new description", 0);
//             ts::return_to_sender(&scenario, nft);
//         };
//         // burn it
//         ts::next_tx(&mut scenario, addr2);
//         {
//             let nft = ts::take_from_sender<FrenNFT>(&scenario);
//             frens_nft::burn(nft, ts::ctx(&mut scenario))
//         };
//         ts::end(scenario);
//     }
// }