module frens_mint::frens_nft {
    
    use sui::url::{Self, Url};
    use std::string;
    use sui::object::{Self, ID, UID};
    use sui::event;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    struct FrenNFT has key, store {
        id: UID,
        name: string::String,
        description: string::String,
        traits: string::String,
        url: Url,
    }

    struct Forge has key, store {
      id: UID,
      frens_created: u64,
    }

    fun init(ctx: &mut TxContext) {
      let admin = Forge {
        id: object::new(ctx),
        frens_created: 0,
      };
      transfer::transfer(admin, tx_context::sender(ctx));
    }

    struct FrenMinted has copy, drop {
        object_id: ID,
        minted_by: address,
        name: string::String,
        description: string::String,
        traits: string::String,
        url: Url,
    }

    public fun name(nft: &FrenNFT): &string::String {
        &nft.name
    }

    public fun description(nft: &FrenNFT): &string::String {
        &nft.description
    }

    public fun traits(nft: &FrenNFT): &string::String {
        &nft.traits
    }

    public fun url(nft: &FrenNFT): &Url {
        &nft.url
    }

    public fun frens_created(self: &Forge): u64 {
      self.frens_created
    }

    public entry fun mint(
        name: vector<u8>,
        description: vector<u8>,
        traits: vector<u8>,
        url: vector<u8>,
        ctx: &mut TxContext
    ) {
        let nft = FrenNFT {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            traits: string::utf8(traits),
            url: url::new_unsafe_from_bytes(url),
        };

        let sender = tx_context::sender(ctx);

        event::emit(FrenMinted {
            object_id: object::id(&nft),
            minted_by: sender,
            name: nft.name,
            description: nft.description,
            traits: nft.traits,
            url: nft.url,
        });

        transfer::public_transfer(nft, sender);
    }

    public fun transfer(
        nft: FrenNFT, recipient: address, _: &mut TxContext
    ) {
        transfer::public_transfer(nft, recipient)
    }

    public fun update_name(
        nft: &mut FrenNFT,
        new_name: vector<u8>,
        _: &mut TxContext
    ) {
        nft.name = string::utf8(new_name)
    }

    public fun update_description(
        nft: &mut FrenNFT,
        new_description: vector<u8>,
        _: &mut TxContext
    ) {
        nft.description = string::utf8(new_description)
    }

    public fun update_traits(
        nft: &mut FrenNFT,
        new_traits: vector<u8>,
        _: &mut TxContext
    ) {
        nft.traits = string::utf8(new_traits)
    }

    public fun update_url(
        nft: &mut FrenNFT,
        new_url: vector<u8>,
        _: &mut TxContext
    ) {
        nft.url = url::new_unsafe_from_bytes(new_url)
    }

    public fun burn(nft: FrenNFT, _: &mut TxContext) {
        let FrenNFT { id, name: _, description: _, traits: _, url: _  } = nft;
        object::delete(id)
    }
}