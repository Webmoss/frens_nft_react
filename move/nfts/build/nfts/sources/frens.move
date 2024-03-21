module nfts::frens {
    use sui::url::{Self, Url};
    use std::string::{utf8, String};
    use sui::object::{Self, ID, UID};
    use sui::event;
    use sui::transfer::{public_transfer};
    use sui::package;
    use sui::display;
    use sui::tx_context::{sender, Self, TxContext};

    /// A Fren NFT that can be minted by anybody
    struct Fren has key, store {
        id: UID,
        /// Name for the token
        name: String,
        /// Description of the token
        description: String,
        /// Trait of the token
        trait: String,
        /// URL for the token
        image_url: Url,
    }

    /// Can I get a witness
    struct FRENS has drop {}

    // ===== Events =====
    struct MintNFTEvent has copy, drop {
        // The Object ID of the NFT
        object_id: ID,
        // The creator of the NFT
        creator: address,
        // The name of the NFT
        name: String,
        // The description of the NFT
        description: String,
        // The trait of the NFT
        trait: String,
        /// URL for the token
        image_url: Url
    }

    fun init(otw: FRENS, ctx: &mut TxContext) {
        let keys = vector[
            utf8(b"name"),
            utf8(b"link"),
            utf8(b"image_url"),
            utf8(b"description"),
            utf8(b"project_url"),
            utf8(b"creator"),
        ];

        let values = vector[
            // For `name` we can use the `Fren.name` property
            utf8(b"{name}"),
            // For `link` we can build a URL using an `id` property
            utf8(b"https://frens-nft.netlify.app/fren/{id}"),
            // For `image_url` we use an IPFS template + `img_url` property.
            utf8(b"{image_url}"),
            // Description is static for all `Fren` objects.
            utf8(b"{description}"),
            // Project URL is usually static
            utf8(b"https://frens-nft.netlify.app"),
            // Creator field can be any
            utf8(b"LOR3LORD")
        ];

        // Claim the `Publisher` for the package
        let publisher = package::claim(otw, ctx);

        // Get a new `Display` object for the `Fren` type
        let display = display::new_with_fields<Fren>(
            &publisher, keys, values, ctx
        );
        // Commit first version of `Display` to apply changes
        display::update_version(&mut display);

        public_transfer(publisher, sender(ctx));
        public_transfer(display, sender(ctx));
    }

    // ===== Public view functions =====

    /// Get the NFT's `name`
    public fun name(nft: &Fren): &std::string::String {
        &nft.name
    }

    /// Get the NFT's `description`
    public fun description(nft: &Fren): &std::string::String {
        &nft.description
    }

    /// Get the NFT's `trait`
    public fun trait(nft: &Fren): &std::string::String {
        &nft.trait
    }

    /// Get the NFT's `url`
    public fun image_url(nft: &Fren): &Url {
        &nft.image_url
    }

    /// Create a new Fren NFT
    public entry fun mint_to_sender(
        name: vector<u8>,
        description: vector<u8>,
        trait: vector<u8>,
        image_url: vector<u8>,
        ctx: &mut TxContext
    ) {
        let sender = sender(ctx);
        let nft = mint(name, description, trait, image_url, ctx);
        public_transfer(nft, sender);
    }

    public fun mint(
        name: vector<u8>,
        description: vector<u8>,
        trait: vector<u8>,
        image_url: vector<u8>,
        ctx: &mut TxContext
    ): Fren {
        let sender = tx_context::sender(ctx);

        let nft = Fren {
            id: object::new(ctx),
            name: utf8(name),
            description: utf8(description),
            trait: utf8(trait),
            image_url: url::new_unsafe_from_bytes(image_url)
        };

        event::emit(MintNFTEvent {
            object_id: object::id(&nft),
            creator: sender,
            name: nft.name,
            description: nft.description,
            trait: nft.trait,
            image_url: nft.image_url,
        });

        nft
    }

    /// Update the `description` of `nft` to `new_description`
    public entry fun update_description(
        nft: &mut Fren,
        new_description: vector<u8>,
    ) {
        nft.description = utf8(new_description)
    }

    /// Update the `trait` of `nft` to `new_trait`
    public entry fun update_trait(
        nft: &mut Fren,
        new_trait: vector<u8>,
    ) {
        nft.trait = utf8(new_trait)
    }

    /// Update the `image_url` of `nft` to `image_url`
    public entry fun update_image_url(
        nft: &mut Fren,
        image_url: vector<u8>,
    ) {
        nft.image_url = url::new_unsafe_from_bytes(image_url)
    }

    /// Permanently delete `nft`
    public entry fun burn(nft: Fren, _: &mut TxContext) {
        let Fren { id, name: _, description: _, trait: _, image_url: _ } = nft;
        object::delete(id)
    }
}

#[test_only]
module nfts::frensTests {
    use nfts::frens::{Self, Fren};
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
            frens::mint_to_sender(b"Frenly", b"A cool fren he is indeed!", b"BOSS fren", b"https://www.sui.io", ts::ctx(&mut scenario))
        };
        // send it from A to B
        ts::next_tx(&mut scenario, addr1);
        {
            let nft = ts::take_from_sender<Fren>(&scenario);
            transfer::public_transfer(nft, addr2);
        };
        // update its description
        ts::next_tx(&mut scenario, addr2);
        {
            let nft = ts::take_from_sender<Fren>(&scenario);
            frens::update_description(&mut nft, b"a new description") ;
            assert!(*string::bytes(frens::description(&nft)) == b"a new description", 0);
            ts::return_to_sender(&scenario, nft);
        };
        // update its trait
        ts::next_tx(&mut scenario, addr2);
        {
            let nft = ts::take_from_sender<Fren>(&scenario);
            frens::update_trait(&mut nft, b"a new trait") ;
            assert!(*string::bytes(frens::trait(&nft)) == b"a new trait", 0);
            ts::return_to_sender(&scenario, nft);
        };
        // update its image_url
        ts::next_tx(&mut scenario, addr2);
        {
            let nft = ts::take_from_sender<Fren>(&scenario);
            frens::update_image_url(&mut nft, b"https://cloudflare-ipfs.com/ipfs/QmTnqhoPuTSZ2KSW6nbKqKDvkAfmNoAZLZzf2Yt3cRGvPA") ;
            assert!(*string::bytes(frens::image_url(&nft)) == b"https://cloudflare-ipfs.com/ipfs/QmTnqhoPuTSZ2KSW6nbKqKDvkAfmNoAZLZzf2Yt3cRGvPA", 0);
            ts::return_to_sender(&scenario, nft);
        };
        // burn it
        ts::next_tx(&mut scenario, addr2);
        {
            let nft = ts::take_from_sender<Fren>(&scenario);
            frens::burn(nft, ts::ctx(&mut scenario))
        };
        ts::end(scenario);
    }
}