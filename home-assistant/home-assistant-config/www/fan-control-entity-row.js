window.customCards = window.customCards || [];
window.customCards.push({
  type: "fan-control-entity-row",
  name: "fan control entity row",
  description: "A plugin to display your fan controls in a button row.",
  preview: false,
});

class CustomFanRow extends Polymer.Element {

    static get template() {
        return Polymer.html`
            <style is="custom-style" include="iron-flex iron-flex-alignment"></style>
            <style>
                :host {
                    line-height: inherit;
                }
                .speed {
                    margin-left: 2px;
                    margin-right: 2px;
                    background-color: #759aaa;
                    border: 1px solid lightgrey; 
                    border-radius: 4px;
                    font-size: 10px !important;
                    color: inherit;
                    text-align: center;
                    float: right !important;
                    padding: 1px;
                    cursor: pointer;
                }
            </style>
            <hui-generic-entity-row hass="[[hass]]" config="[[_config]]">
                <div class='horizontal justified layout' on-click="stopPropagation">
                    <button
                        class='speed'
                        style='background-color: var([[_leftColor]]);min-width:[[_width]];max-width:[[_width]];height:[[_height]]'
                        toggles name="[[_leftName]]"
                        on-click='setSpeed'
                        disabled='[[_leftState]]'>
                        <ha-icon style='[[_leftHideIcon]]' icon='[[_leftIcon]]'></ha-icon>
                        [[_leftText]]
                    </button>
                    <button
                        class='speed'
                        style='background-color: var([[_midLeftColor]]);min-width:[[_width]];max-width:[[_width]];height:[[_height]]'
                        toggles name="[[_midLeftName]]"
                        on-click='setSpeed'
                        disabled='[[_midLeftState]]'>
                        <ha-icon style='[[_midLeftHideIcon]]' icon='[[_midLeftIcon]]'></ha-icon>
                        [[_midLeftText]]
                        </button>
                    <button
                        class='speed'
                        style='background-color: var([[_midRightColor]]);min-width:[[_width]];max-width:[[_width]];height:[[_height]]'
                        toggles name="[[_midRightName]]"
                        on-click='setSpeed'
                        disabled='[[_midRightState]]'>
                        <ha-icon style='[[_midRightHideIcon]]' icon='[[_midRightIcon]]'></ha-icon>
                        [[_midRightText]]
                        </button>
                    <button
                        class='speed'
                        style='background-color: var([[_rightColor]]);min-width:[[_width]];max-width:[[_width]];height:[[_height]]'
                        toggles name="[[_rightName]]"
                        on-click='setSpeed'
                        disabled='[[_rightState]]'>
                        <ha-icon style='[[_rightHideIcon]]' icon='[[_rightIcon]]'></ha-icon>
                        [[_rightText]]
                        </button>
                </div>
            </hui-generic-entity-row>
        `;
    }

    static get properties() {
        return {
            hass: {
                type: Object,
                observer: 'hassChanged'
            },
            _config: Object,
            _stateObj: Object,
            _width: String,
            _height: String,
            _leftColor: String,
            _midLeftColor: String,
            _midRightColor: String,
            _rightColor: String,
            _leftText: String,
            _midLeftText: String,
            _midRightText: String,
            _rightText: String,
            _leftName: String,
            _midLeftName: String,
            _midRightName: String,
            _rightName: String,
            _leftState: Boolean,
            _midLeftState: Boolean,
            _midRightState: Boolean,
            _rightState: Boolean,

        }
    }

    setConfig(config) {
        this._config = config;
        this._config = {
            width:         '30px',
            height:        '30px',
            customOffText: '',
            customLowText: '',
            customMedText: '',
            customHiText:  '',
            customOffIcon: 'mdi:fan-off',
            customLowIcon: 'mdi:fan-speed-1',
            customMedIcon: 'mdi:fan-speed-2',
            customHiIcon:  'mdi:fan-speed-3',
            customLowValue: 25,
            customMedValue: 50,
            customHiValue:  75,
            ...config
            };
    }

    hassChanged(hass) {
        const config = this._config;
        const stateObj = hass.states[config.entity];

        let fanState = 'off';
        if (stateObj && stateObj.attributes) {
            if (stateObj.state == 'on' && stateObj.attributes.percentage > 0 && stateObj.attributes.percentage < 33) {
                fanState = 'low';
            } else if (stateObj.state == 'on' && stateObj.attributes.percentage >= 33 && stateObj.attributes.percentage < 66) {
                fanState = 'medium';
            } else if (stateObj.state == 'on' && stateObj.attributes.percentage >= 66) {
                fanState = 'high';
            }
        }

        let nohide = 'display:block';
        let hide   = 'display:none';

        this.setProperties({
            _stateObj:         stateObj,
            _width:            config.width,
            _height:           config.height,
            _leftName:         'off',
            _leftText:         config.customOffText,
            _leftState:        (fanState == 'off'),
            _leftColor:        (fanState == 'off')    ? '--primary-color' : '--disabled-text-color',
            _leftIcon:         config.customOffIcon,
            _leftHideIcon:     config.customOffIcon ? '' : hide,
            _midLeftName:      'low',
            _midLeftText:      config.customLowText,
            _midLeftState:     (fanState == 'low'),
            _midLeftColor:     (fanState == 'low')    ? '--primary-color' : '--disabled-text-color',
            _midLeftIcon:      config.customLowIcon,
            _midLeftHideIcon:  config.customLowIcon ? '' : hide,
            _midRightName:     'medium',
            _midRightText:     config.customMedText,
            _midRightState:    (fanState == 'medium'),
            _midRightColor:    (fanState == 'medium') ? '--primary-color' : '--disabled-text-color',
            _midRightIcon:     config.customMedIcon,
            _midRightHideIcon: config.customMedIcon ? '' : hide,
            _rightName:        'high',
            _rightText:        config.customHiText,
            _rightState:       (fanState == 'high'),
            _rightColor:       (fanState == 'high')   ? '--primary-color' : '--disabled-text-color',
            _rightIcon:        config.customHiIcon,
            _rightHideIcon:    config.customHiIcon ? '' : hide,
        });
    }

    stopPropagation(e) {
        e.stopPropagation();
    }

    setSpeed(e) {
        const speed = e.currentTarget.getAttribute('name');
        if( speed == 'off' ){
            this.hass.callService('fan', 'set_percentage', {entity_id: this._config.entity, percentage: 0});
        } else {
            switch (speed) {
            case 'off':    this.hass.callService('fan', 'set_percentage', {entity_id: this._config.entity, percentage: 0});  break;
            case 'low':    this.hass.callService('fan', 'set_percentage', {entity_id: this._config.entity, percentage: 25}); break;
            case 'medium': this.hass.callService('fan', 'set_percentage', {entity_id: this._config.entity, percentage: 50}); break;
            case 'high':   this.hass.callService('fan', 'set_percentage', {entity_id: this._config.entity, percentage: 75}); break;
            }
        }
    }
}
    
customElements.define('fan-control-entity-row', CustomFanRow);
