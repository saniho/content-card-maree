const fireEvent = (node, type, detail, options) => {
  options = options || {};
  detail = detail === null || detail === undefined ? {} : detail;
  const event = new Event(type, {
    bubbles: options.bubbles === undefined ? true : options.bubbles,
    cancelable: Boolean(options.cancelable),
    composed: options.composed === undefined ? true : options.composed,
  });
  event.detail = detail;
  node.dispatchEvent(event);
  return event;
};

if (
  !customElements.get("ha-switch") &&
  customElements.get("paper-toggle-button")
) {
  customElements.define("ha-switch", customElements.get("paper-toggle-button"));
}

const LitElement = customElements.get("hui-masonry-view") ? Object.getPrototypeOf(customElements.get("hui-masonry-view")) : Object.getPrototypeOf(customElements.get("hui-view"));
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

const HELPERS = window.loadCardHelpers();

export class contentCardMareeEditor extends LitElement {
  setConfig(config) {
    this._config = { ...config };
  }

  static get properties() {
    return { hass: {}, _config: {} };
  }

  get _entity() {
    return this._config.entity || "";
  }

  get _name() {
    return this._config.name || "";
  }

  get _icon() {
    return this._config.showIcon === true;
  }

  get _nextMaree() {
    return this._config.showNextMaree === true;
  }
  
  get _etatNextMaree() {
    return this._config.showEtatNextMaree === true;
  }
  
  get _prevision() {
    return this._config.showPrevision === true;
  }

  get _title() {
    return this._config.showTitle === true;
  }

  get _nextMareesDetail() {
    return this._config.showNextMareesDetail === true;
  }

  get _current() {
    return this._config.current !== false;
  }

  get _details() {
    return this._config.details !== false;
  }

  get _forecast() {
    return this._config.forecast !== false;
  }

  get _nbPrev() {
    return this._config.nbPrev || 5;
  }

  firstUpdated() {
    HELPERS.then(help => {
      if (help.importMoreInfoControl) {
        help.importMoreInfoControl("fan");
      }
    })
  }

  render() {
    if (!this.hass) {
      return html``;
    }

    return html`
      <div class="card-config">
        <div>
          <paper-input
            label="Name"
            .value="${this._name}"
            .configValue="${"name"}"
            @value-changed="${this._valueChanged}"
          ></paper-input>
          <!-- Switches -->
          <ul class="switches">
            ${this.renderSwitchOption("Show icon", this._icon, "showIcon")}
            ${this.renderSwitchOption("Show next Maree", this._nextMaree, "showNextMaree")}
            ${this.renderSwitchOption("Show Etat Next Maree", this._etatNextMaree, "showEtatNextMaree")}
            ${this.renderSwitchOption("Show title", this._title, "showTitle")}
            ${this.renderSwitchOption("Show Next Maree Detail", this._nextMareesDetail, "showNextMareesDetail")}
            ${this.renderSwitchOption("Show Prevision", this._prevision, "showPrevision")}
            <!--${this.renderSwitchOption("Show details", this._details, "details")}
            ${this.renderSwitchOption("Show one hour forecast", this._one_hour_forecast, "one_hour_forecast")}
            ${this.renderSwitchOption("Show alert", this._alert_forecast, "alert_forecast")}
            ${this.renderSwitchOption("Show forecast", this._forecast, "forecast")}
          -->
          </ul>
          <!-- -->
          <paper-input
            label="nombre d'heures de prevision"
            type="number"
            min="1"
            max="12"
            value=${this._nbPrev}
            .configValue="${"nbPrev"}"
            @value-changed="${this._valueChanged}"
          ></paper-input>
        </div>
      </div>
    `;
  }
  
  renderSwitchOption(label, state, configAttr) {
    return html`
      <li class="switch">
              <ha-switch
                .checked=${state}
                .configValue="${configAttr}"
                @change="${this._valueChanged}"
              ></ha-switch
              ><span>${label}</span>
            </div>
          </li>
    `
  }
  _valueChanged(ev) {
    if (!this._config || !this.hass) {
      return;
    }
    const target = ev.target;
    if (target.configValue) {
      if (target.value === "") {
        delete this._config[target.configValue];
      } else {
        this._config = {
          ...this._config,
          [target.configValue]:
            target.checked !== undefined ? target.checked : target.value,
        };
      }
    }
    fireEvent(this, "config-changed", { config: this._config });
  }

  static get styles() {
    return css`
      .switches {
        margin: 8px 0;
        display: flex;
        flex-flow: row wrap;
        list-style: none;
        padding: 0;
      }
      .switch {
        display: flex;
        align-items: center;
        width: 50%;
        height: 40px;
      }
      .switches span {
        padding: 0 16px;
      }
    `;
  }
}

customElements.define("content-card-maree-editor", contentCardMareeEditor);