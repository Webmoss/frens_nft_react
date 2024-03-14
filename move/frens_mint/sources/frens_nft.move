module frens_mint::frens_nft {
    
    // Part 1: Imports
    use sui::url::{Self, Url};
    use std::string;
    use sui::object::{Self, ID, UID};
    use sui::event;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    
    // Part 2: Struct definitions
    /// A Frens NFT is freely-transferable object. Owner can make updates 
    /// to their fren at any time and even change the image to their liking
    struct FrenNFT has key, store {
        id: UID,
        /// Name of the Fren
        name: string::String,
        /// Description of the fren
        description: string::String,
        /// Grumpy or chill?
        traits: string::String,
        /// URL for the token
        url: Url,
    }

    struct Forge has key, store {
      id: UID,
      frens_created: u64,
    }

    // Part 3: Module initializer to be executed when this module is published
    fun init(ctx: &mut TxContext) {
      let admin = Forge {
        id: object::new(ctx),
        frens_created: 0,
      };
      // Transfer the forge object to the module/package publisher
      transfer::transfer(admin, tx_context::sender(ctx));
    }

    // ===== Events =====
    /// Event: emitted when a new Fren is minted.
    struct FrenMinted has copy, drop {
        // The Object ID of the NFT
        object_id: ID,
        // The address of the NFT minter
        minted_by: address,
        // The name of the NFT
        name: string::String,
        // The description of the NFT
        description: string::String,
        // The traits of the NFT
        traits: string::String,
        // The url of the NFT
        url: Url,
    }

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
        &nft.url
    }

    public fun frens_created(self: &Forge): u64 {
      self.frens_created
    }

    // ===== Entrypoints =====
    /// Mint a new Fren with the given `name`, `traits` and `url`.
    /// The object is returned to sender and they're free to transfer
    /// it to themselves or anyone else.
    public entry fun mint(
        name: vector<u8>,
        description: vector<u8>,
        traits: vector<u8>,
        url: vector<u8>,
        ctx: &mut TxContext
    ) {
        // Create the new NFT
        let nft = FrenNFT {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            traits: string::utf8(traits),
            url: url::new_unsafe_from_bytes(url),
        };

        // Mint and send the NFT to the caller
        let sender = tx_context::sender(ctx);

        event::emit(FrenMinted {
            object_id: object::id(&nft),
            minted_by: sender,
            name: nft.name,
            description: nft.description,
            traits: nft.traits,
            url: nft.url,
        });

        // Transfer the NFT to the caller
        transfer::public_transfer(nft, sender);
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

    /// Update the `traits` of `nft` to `new_traits`
    public fun update_traits(
        nft: &mut FrenNFT,
        new_traits: vector<u8>,
        _: &mut TxContext
    ) {
        nft.traits = string::utf8(new_traits)
    }

    /// Some frens get new traits over time... 
    /// owner of one can add a new trait to their fren at any time.
    // public fun add_trait(
    //     nft: &mut FrenNFT, 
    //     _trait: String) {
    //     vector::push_back(&mut nft._traits, _trait);
    // }

    /// Update the `url` of `nft` to `new_url`
    public fun update_url(
        nft: &mut FrenNFT,
        new_url: vector<u8>,
        _: &mut TxContext
    ) {
        nft.url = url::new_unsafe_from_bytes(new_url)
    }

    /// Permanently delete `nft`
    public fun burn(nft: FrenNFT, _: &mut TxContext) {
        let FrenNFT { id, name: _, description: _, traits: _, url: _  } = nft;
        object::delete(id)
    }


    // #[test]
    // public fun test_frens_create() {

    //   // Create a dummy TxContext for testing
    //   let ctx = tx_context::dummy();

    //   // Create a Fren Dummy
    //   let fren = FrenNFT {
    //       id: object::new(&mut ctx),
    //       name: utf8(b"Fren Moose"),
    //       description: utf8(b"Fren moose built this city"),
    //       traits: utf8(b"Super Trait"),
    //       url: utf8(b"https://ibb.co/9YqmL77"),
    //   };

    //   // Check if accessor functions return correct values
    //   assert!(name(&fren) == utf8(b"Fren Moose") 
    //     && description(&fren) == utf8(b"Fren moose built this city") 
    //     && traits(&fren) == utf8(b"Super Trait")
    //     && url(&fren) == utf8(b"https://ibb.co/9YqmL77"), 1);

    //   // Create a dummy address and transfer the fren
    //   let dummy_address = @0xCAFE;
    //   transfer::transfer(fren, dummy_address);
    // }
}