import { html, css, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { DigLevel } from './level';

@customElement('game-over')
export class GameOver extends LitElement {
  public visible = false;
  
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
                background-color: #425500aa;
                border-radius: 5px;
                color: white;
                padding: .5rem;
                gap: 15px;
                font-size: 24px;
                // transform-origin: 0 0;
                transform: translate(-50%, 50%) scale(calc(var(--ex-pixel-ratio)), calc(var(--ex-pixel-ratio)));
            }`;

  level!: DigLevel;
  // @property({type: Number}) score = 100;
  //

  restartGame() {
    this.level.restart();
  }

  render() {
    const styles = {
            visibility: this.visible ? 'visible' : 'hidden',
            // left: `${this.left}px`,
            // top: `${this.top}px`
        };
    return html`
    <div class="container" style=${styleMap(styles)}>
      <h1>Game Over</h1>

      <h2>Loot: ${this.level.player.score}</h2>

      <p>You fear to go into those mines. You delved too greedily and too deep...</p>

      <a href="https://ldjam.com/events/ludum-dare/58/$416081">Rate our LD GAME!</a>

      <button @click=${this.restartGame}>Try Again?</button>
    </div>`;
  }
}
