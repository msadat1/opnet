import { u256 } from '@btc-vision/as-bignum/assembly';
import {
    Address,
    Blockchain,
    BytesWriter,
    Calldata,
    EMPTY_POINTER,
    OP721,
    OP721InitParameters,
    Revert,
    SafeMath,
    StoredBoolean,
    StoredU256,
} from '@btc-vision/btc-runtime/runtime';

@final
export class MyNFTCollection extends OP721 {
    private readonly pricePointer: u16 = Blockchain.nextPointer;
    private readonly mintingOpenPointer: u16 = Blockchain.nextPointer;
    private readonly maxPerWalletPointer: u16 = Blockchain.nextPointer;

    private readonly _price: StoredU256;
    private readonly _mintingOpen: StoredBoolean;
    private readonly _maxPerWallet: StoredU256;

    public constructor() {
        super();
        this._price = new StoredU256(this.pricePointer, EMPTY_POINTER);
        this._mintingOpen = new StoredBoolean(this.mintingOpenPointer, false);
        this._maxPerWallet = new StoredU256(this.maxPerWalletPointer, EMPTY_POINTER);
    }

    public override onDeployment(_calldata: Calldata): void {
        this.instantiate(
            new OP721InitParameters(
                'MyNFTCollection',
                'MNFT',
                'https://mynft.example.com/metadata/',
                u256.fromU64(10000),
                'https://mynft.example.com/banner.png',
                'https://mynft.example.com/icon.png',
                'https://mynft.example.com',
                'A 10,000-piece NFT collection on Bitcoin via OPNet',
            ),
        );
        this._price.value = u256.fromU64(100000);
        this._maxPerWallet.value = u256.fromU64(10);
    }

    @method({ name: 'quantity', type: 'uint256' })
    @returns({ name: 'firstTokenId', type: 'uint256' })
    @emit('Transferred')
    public mint(calldata: Calldata): BytesWriter {
        if (!this._mintingOpen.value) {
            throw new Revert('Minting is not open yet');
        }
        const quantity: u256 = calldata.readU256();
        if (quantity == u256.Zero || quantity > u256.fromU64(10)) {
            throw new Revert('Quantity must be between 1 and 10');
        }
        const currentSupply: u256 = this.totalSupply;
        const max: u256 = this.maxSupply;
        if (SafeMath.add(currentSupply, quantity) > max) {
            throw new Revert('Exceeds max supply');
        }
        const sender: Address = Blockchain.tx.sender;
        const walletBalance: u256 = this.balanceOf(sender);
        if (SafeMath.add(walletBalance, quantity) > this._maxPerWallet.value) {
            throw new Revert('Exceeds per-wallet limit');
        }
        const firstTokenId: u256 = this._nextTokenId.value;
        for (let i: u256 = u256.Zero; i < quantity; i = SafeMath.add(i, u256.One)) {
            const tokenId: u256 = this._nextTokenId.value;
            this._mint(sender, tokenId);
            this._nextTokenId.value = SafeMath.add(tokenId, u256.One);
        }
        const writer: BytesWriter = new BytesWriter(32);
        writer.writeU256(firstTokenId);
        return writer;
    }

    @method()
    @returns({ name: 'success', type: 'bool' })
    public openMinting(_calldata: Calldata): BytesWriter {
        this.onlyDeployer(Blockchain.tx.sender);
        this._mintingOpen.value = true;
        const writer: BytesWriter = new BytesWriter(1);
        writer.writeBoolean(true);
        return writer;
    }

    @method()
    @returns({ name: 'success', type: 'bool' })
    public pauseMinting(_calldata: Calldata): BytesWriter {
        this.onlyDeployer(Blockchain.tx.sender);
        this._mintingOpen.value = false;
        const writer: BytesWriter = new BytesWriter(1);
        writer.writeBoolean(true);
        return writer;
    }

    @method({ name: 'newPriceSats', type: 'uint256' })
    @returns({ name: 'success', type: 'bool' })
    public setPrice(calldata: Calldata): BytesWriter {
        this.onlyDeployer(Blockchain.tx.sender);
        const newPrice: u256 = calldata.readU256();
        this._price.value = newPrice;
        const writer: BytesWriter = new BytesWriter(1);
        writer.writeBoolean(true);
        return writer;
    }

    @method()
    @returns({ name: 'priceSats', type: 'uint256' })
    public mintPrice(_calldata: Calldata): BytesWriter {
        const writer: BytesWriter = new BytesWriter(32);
        writer.writeU256(this._price.value);
        return writer;
    }

    @method()
    @returns({ name: 'isOpen', type: 'bool' })
    public mintingOpen(_calldata: Calldata): BytesWriter {
        const writer: BytesWriter = new BytesWriter(1);
        writer.writeBoolean(this._mintingOpen.value);
        return writer;
    }
}
