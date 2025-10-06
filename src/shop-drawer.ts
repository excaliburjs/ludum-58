
import { html, css, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { DigLevel } from './level';
import { Player } from './player';
import { Resources } from './resources';

@customElement('shop-drawer')
export class Shop extends LitElement {
  public visible = false;

  public enabled = false;

  enable(enabled: boolean) {
    if (this.enabled !== enabled) {
      enabled ? Resources.ShopOpen.play(.25) : Resources.ShopClose.play(.25);
    }
    this.enabled = enabled;
    this.requestUpdate();
  }

  left = 0;
  top = 0;
  
  setPos(x: number, y: number) {
    this.left = x;
    this.top = y;

    this.requestUpdate();
  }
  
  show() {
    this.visible = true;
    this.requestUpdate();
  }
  hide() {

    this.visible = false;
    this.requestUpdate();
  }
  static styles = css`
            :host {
                font-family: "PressStart2P", sans-serif;
                color: black;
            }


            .toggle-shop {
                position: absolute;
                visibility: hidden;
                opacity: 0;
                transition: opacity 1s ease-in-out; 
                display: flex;
                flex-direction: column;
                align-items: normal;
                background-color: white;
                border-radius: 5px;
                color: black;
                padding: .5rem;
                gap: 10px;
                font-size: 24px;
                transform-origin: 0 0;
                transform: scale(calc(var(--ex-pixel-ratio)), calc(var(--ex-pixel-ratio)));
            }

            h2 {
              font-size: 16px;

            }

            .container {
                position: absolute;
                visibility: hidden;
                left: 50%;
                right: 50%;
                width: 500px;
                // pointer-events: none;
                display: flex;
                flex-direction: column;
                align-items: center;
                background-color: #42002077;
                border-radius: 5px;
                color: white;
                padding: .5rem;
                font-size: 24px;
                // transform-origin: 0 0;
                transform: translate(-50%, 200%) scale(calc(var(--ex-pixel-ratio)), calc(var(--ex-pixel-ratio)));
            }`;

  level!: DigLevel;
  player!: Player;
  // @property({type: Number}) score = 100;
  //

  closeShop() {
    this.requestUpdate();
  }

  buyHeart() {
    if (this.player.score >= 400) {
      this.player.health++;
      this.player.score -= 400;
      Resources.ShopPurchase.play(.5);
    } else {
      Resources.BagFull.play();

    }
  }

  buyWalkFaster() {
    if (this.player.score >= 2000) {
      this.player.walkSpeed = Math.min(this.player.walkSpeed - 20, 50);
      this.player.score -= 2000;
      Resources.ShopPurchase.play(.5);
    } else {
      Resources.BagFull.play();

    }
  }

  buyFasterPick() {
    if (this.player.score >= 1000) {
      this.player.digSpeed= Math.min(this.player.digSpeed - 100, 50);
      this.player.score -= 1000;
      Resources.ShopPurchase.play(.5);
    } else {
      Resources.BagFull.play();
    }
  }

  render() {
    const styles = {
            visibility: this.visible ? 'visible' : 'hidden',
            left: `${this.left}px`,
            top: `${this.top}px`
        };

    const toggleStyles = {
        visibility: this.enabled ? 'visible' : 'hidden',
        opacity: this.enabled ? 1 : 0,
        left: `${this.left}px`,
        top: `${this.top}px`


    }
    return html`
    <div class="toggle-shop" style=${styleMap(toggleStyles)}>

      <h2>Upgrade Shop</h2>

      <button @click=${this.buyHeart}>Buy 1 Heart: 400</button>
      <button @click=${this.buyFasterPick}>Buy Faster Pick: 1000</button>
      <button @click=${this.buyWalkFaster}>Buy Speed Walk: 2000</button>
    </div>
    <div class="container" style=${styleMap(styles)}>
      <h1>Upgrade Shop</h1>

      <button>Buy 1 Heart: 400</button>
      <button>Buy Faster Pick: 1000</button>

      <button @click=${this.closeShop}>Close</button>
    </div>`;
  }
}
