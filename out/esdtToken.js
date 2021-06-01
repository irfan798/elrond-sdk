"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ESDTToken = void 0;
class ESDTToken {
    constructor(init) {
        this.token = '';
        this.name = '';
        this.owner = '';
        this.minted = '';
        this.burnt = '';
        this.decimals = 18;
        this.isPaused = false;
        this.canUpgrade = false;
        this.canMint = false;
        this.canBurn = false;
        this.canChangeOwner = false;
        this.canPause = false;
        this.canFreeze = false;
        this.canWipe = false;
        Object.assign(this, init);
    }
    static fromHttpResponse(response) {
        let esdtToken = new ESDTToken(response);
        return esdtToken;
    }
    getTokenName() {
        return this.name;
    }
    getTokenIdentifier() {
        return this.token;
    }
}
exports.ESDTToken = ESDTToken;
//# sourceMappingURL=esdtToken.js.map