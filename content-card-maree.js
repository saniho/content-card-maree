const LitElement = Object.getPrototypeOf(
  customElements.get("ha-panel-lovelace")
);
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

function hasConfigOrEntityChanged(element, changedProps) {
  if (changedProps.has("config")) {
    return true;
  }

  const oldHass = changedProps.get("hass");
  if (oldHass) {
    return (
      oldHass.states[element.config.entity] !==
        element.hass.states[element.config.entity]
    );
  }

  return true;
}

class ContentCardMaree extends LitElement {
  static get properties() {
    return {
      config: {},
      hass: {}
    };
  }

  render() {
    if (!this.config || !this.hass) {
      return html``;
    }

    const stateObj = this.hass.states[this.config.entity];

    if (!stateObj) {
      return html`
        <ha-card>
          <div class="card">
            <div id="states">
              <div class="name">
                <ha-icon id="icon" icon="mdi:flash" data-state="unavailable" data-domain="connection" style="color: var(--state-icon-unavailable-color)"></ha-icon>
                <span style="margin-right:2em">Maree : donnees inaccessible pour ${this.config.entity}</span>
              </div>
            </div>
          </div>
        </ha-card> 
      `
    }

    const attributes = stateObj.attributes;
    
    if (stateObj) {
        return html`
            <ha-card id="card">
              ${this.addEventListener('click', event => { this._showDetails(this.config.entity); })}
              ${this.renderTitle(this.config, attributes)}
              <div class="card">
                <div class="main-info">
                  ${this.config.showIcon
                    ? html`
                      <div class="icon-block">
                      <span class="Maree-icon bigger" style="background: none, url(https://github.com/saniho/content-card-maree/blob/main/images/maree.jpg?raw=true) no-repeat; background-size: contain;"></span>
                      </div>`
                    : html `` 
                  }
                  ${this.config.showNextMaree
                    ? html`
                      <div class="next-block">
                      <table>
                        <tr>
                        <td><span class="more-unit">Coefficiant : </span></td>
                        <td><span class="coeff">${attributes.next_coeff_1}</span></td>
                        <td><span class="more-unit">Horaire : </span><span class="heure">${attributes.next_maree_1}</span></td>
                        </tr>
                      </table>
                      </div>`
                    : html``
                  }
                  ${this.config.showNextMareesDetail
                    ? html`
                      <div class="next-block">
                      <table width="100%">
                        <tr>
                        <td><span class="more-unit">Coefficiant : </span></td>
                        <td><span class="coeff">${attributes.next_coeff_1}</span></td>
                        <td><span class="more-unit">Horaire : </span></td>
                        <td><span class="heure">${attributes.next_maree_1}</span></td>
                        <td><span class="etat" >${attributes.next_etat_1}</span></td>
                        </tr>
                        <tr>
                        <td><span class="more-unit">Coefficiant : </span></td>
                        <td><span class="coeff">${attributes.next_coeff_2}</span></td>
                        <td><span class="more-unit">Horaire : </span></td>
                        <td><span class="heure">${attributes.next_maree_2}</span></td>
                        <td><span class="etat" >${attributes.next_etat_2}</span></td>
                        </tr>
                      </table>
                      </div>`
                    : html``
                  }
                  ${this.config.showEtatNextMaree 
                    ? html `
                    <div class="next-etat-block">
                      <span class="etat" >${attributes.next_etat_1}</span>
                    </div>`
                    : html ``
                   }
                </div>
                <br>
                ${this.renderPrevision(attributes, this.config)}
                <div class="copyright-block">
                    <span class="copyright-etat" >${attributes.Copyright}</span>
                </div>
              </div>
            </ha-card>`
    }
  }
  
  renderPrevision(attributes, config) {
    if ( config.showPrevision ) {
        const forecast = attributes.prevision;
        const nbPrev = config.nbPrev ;
        return html
          `
          <table class="forecast clear" width="100%"><tr>
              ${this.renderDataTitle( "Heure" ) }
              ${forecast.slice(0, nbPrev ).map((daily, index ) => this.renderDaily( daily )) }
          </tr><tr>
              ${this.renderDataTitle( "T° ext" ) }
              ${forecast.slice(0, nbPrev ).map((daily, index ) => this.renderDailyData( daily.t )) }
          </tr><tr>
              ${this.renderDataTitle( "T° eau" ) }
              ${forecast.slice(0, nbPrev ).map((daily, index ) => this.renderDailyData( daily.teau )) }
          </tr><tr>
              ${this.renderDataTitle( "Précipitation" ) }
              ${forecast.slice(0, nbPrev ).map((daily, index ) => this.renderDailyData( daily.precipitation )) }
          </tr><tr>
              ${this.renderDataTitle( "Hauteur houle" ) }
              ${forecast.slice(0, nbPrev ).map((daily, index ) => this.renderDailyData( daily.hauteurhoule )) }
          </tr><tr>
              ${this.renderDataTitle( "Période houle" ) }
              ${forecast.slice(0, nbPrev ).map((daily, index ) => this.renderDailyData( daily.periodehoule )) }
          </tr><tr>
              ${this.renderDataTitle( "Force vent nds" ) }
              ${forecast.slice(0, nbPrev ).map((daily, index ) => this.renderDailyData( daily.forcevnds )) }
          </tr><tr>
              ${this.renderDataTitle( "Rafales vent nds" ) }
              ${forecast.slice(0, nbPrev ).map((daily, index ) => this.renderDailyData( daily.rafvnds )) }
          </tr><tr>
              ${this.renderDataTitle( "Couverture nuage" ) }
              ${forecast.slice(0, nbPrev ).map((daily, index ) => this.renderDailyData( daily.nuagecouverture )) }
          </tr><tr>
              ${this.renderDataTitle( "Risque d'orage" ) }
              ${forecast.slice(0, nbPrev ).map((daily, index ) => this.renderDailyData( daily.risqueorage )) }
          </tr><tr>
              ${this.renderDataTitle( "Hauteur vague" ) }
              ${forecast.slice(0, nbPrev ).map((daily, index ) => this.renderDailyData( daily.hauteurvague )) }
          </tr></table>`;
    }
  }
  renderDaily(daily) {
    return html
      `<td>
      <div class="day">
         <span class="time">${new Date(daily.datetime).toLocaleString('en-US', {hour: 'numeric', hour12: false} )}h</span>
      </div>
      </td>`;
  }
  renderDataTitle(title) {
    return html
      `<td><span class="hourlyTitre">${title}</span></td>`;
  }
  renderDailyData(item) {
    return html
      `<td class="hourlyData"><span class="hourlyData">${item}</span></td>`;
  }
  
  _showDetails(myEntity) {
    const event = new Event('hass-more-info', {
      bubbles: true,
      cancelable: false,
      composed: true
    });
    event.detail = {
      entityId: myEntity
    };
    this.dispatchEvent(event);
    return event;
  }
  renderTitle(config, attributes) {
    if (this.config.showTitle === true) {
      var title = this.config.titleName ;
      if ( this.config.titleName === "" ) {
      var title = attributes.nomPort ;
      }
      return html
        `
          <div class="card">
          <div class="main-title">
          <span>${title}</span>
          </div>
          </div>` 
       }
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('You need to define an entity');
    }
    
    const defaultConfig = {
      showNextMaree: true,
      showIcon: false,
      showEtatNextMaree: true,
      showNextMareesDetail: false,
      showTitle: false,
      showPrevision: false,
      nbPrev: 6,
      titleName: "",
    }

    this.config = {
      ...defaultConfig,
      ...config
    };
  }

  shouldUpdate(changedProps) {
    return hasConfigOrEntityChanged(this, changedProps);
  }

  // @TODO: This requires more intelligent logic
  getCardSize() {
    return 3;
  }
 

  static get styles() {
    return css`
      .card {
        margin: auto;
        padding: 1.5em 1em 1em 1em;
        position: relative;
        cursor: pointer;
      }

      .main-title {
        margin: auto;
        text-align: center;
        font-weight: 200;
        font-size: 2em;
        justify-content: space-between;
      }
      .main-info {
        display: flex;
        justify-content: space-between;
      }
    
      .ha-icon {
        margin-right: 5px;
        color: var(--paper-item-icon-color);
      }
      
      .next-block {
        width:100%;
      }
      .next-etat-block {
      }
    
      .heure, .coeff, .etat {
        font-weight: 200;
        font-size: 2em;
      }
    
      .more-unit {
        font-style: italic;
        font-size: 0.8em;
      }

      .variations-maree {
        display: inline-block;
        font-weight: 300;
        margin: 1em;
      }
      .icon-block {
      }
      .copyright-block{
        display: inline-block;
      }
      .copyright-etat {
        text-align: right;
        font-style: bold;
        font-weight: 50;
        font-size: 1em;
      }
    
      .Maree-icon.bigger {
        width: 3em;
        height: 2em;
        margin-top: -1em;
        margin-left: 1em;
        display: inline-block;
      }
      .error {
        font-size: 0.8em;
        font-style: bold;
        margin-left: 5px;
      }
      .clear {
        clear: both;
      }
      
      .forecast .day:first-child {
        margin-left: 0;
      }
      .forecast .day:nth-last-child(1) {
        border-right: none;
        margin-right: 0;
      }
      .hourlyTitre {
        font-weight: bold;
      }
      .hourlyData {
        text-align:center;
      }
      .day {
        display: block;
        float: left;
        text-align: center;
        color: var(--primary-text-color);
        line-height: 2;
        box-sizing: border-box;
      }
      .time {
        text-transform: uppercase;
        font-size: 1em;
      }

      `;
  }
}

customElements.define('content-card-maree', ContentCardMaree);
