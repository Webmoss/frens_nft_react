module frens::frens_hero {
    use sui::tx_context::{sender, TxContext};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::package;
    use sui::display;
    use std::string::{utf8, String};

    /// The Fren - an outstanding collection of digital art.
    struct Fren has key, store {
        id: UID,
        /// Name for the token
        name: String,
        /// Description of the token
        description: String,
        /// Trait of the token
        trait: String,
        /// URL for the token
        img_url: String,
    }

    /// One-Time-Witness for the module.
    struct FRENS_HERO has drop {}

    /// In the module initializer we claim the `Publisher` object
    /// to then create a `Display`. The `Display` is initialized with
    /// a set of fields (but can be modified later) and published via
    /// the `update_version` call.
    ///
    /// Keys and values are set in the initializer but could also be
    /// set after publishing if a `Publisher` object was created.
    fun init(otw: FRENS_HERO, ctx: &mut TxContext) {
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
            utf8(b"ipfs/{img_url}"),
            // Description is static for all `Fren` objects.
            utf8(b"A true Fren of the Sui Geek-o-system!"),
            // Project URL is usually static
            utf8(b"https://frens-nft.netlify.app"),
            // Creator field can be any
            utf8(b"Boss Moss")
        ];

        // Claim the `Publisher` for the package!
        let publisher = package::claim(otw, ctx);

        // Get a new `Display` object for the `Fren` type.
        let display = display::new_with_fields<Fren>(
            &publisher, keys, values, ctx
        );
        // Commit first version of `Display` to apply changes.
        display::update_version(&mut display);

        transfer::public_transfer(publisher, sender(ctx));
        transfer::public_transfer(display, sender(ctx));
    }

    /// Anyone can mint a `Fren`!
    public fun mint(
        name: String, 
        description: String, 
        trait: String, 
        img_url: String, 
        ctx: &mut TxContext
    ): Fren {
        let id = object::new(ctx);
        Fren { 
            id, 
            name,
            description,
            trait,
            img_url 
        }
    }
}
