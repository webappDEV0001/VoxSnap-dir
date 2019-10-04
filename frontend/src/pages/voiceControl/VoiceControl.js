import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/button';
import Hero from '../../components/hero';
import './VoiceControl.scss';

import ImgLights from '../../media/img/voice-controls/lights.jpg';
import ImgSmartPlugs from '../../media/img/voice-controls/smart-plugs.jpg';
import ImgThermostatIdevice from '../../media/img/voice-controls/thermostat-idevice.jpg';
import ImgThermostatNest from '../../media/img/voice-controls/thermostat-nest.jpg';
import ImgCameras from '../../media/img/voice-controls/cameras.jpg';
import ImgLockDoorsNest from '../../media/img/voice-controls/lock-doors-nest.jpg';
import ImgLockDoorsAugust from '../../media/img/voice-controls/lock-doors-august.jpg';

const VoiceControl = () => {
  return (
    <section className="VoiceControl">
      <Hero
        title="Voice control your home"
      />
      <div className="VoiceControl-wrapper">
        <section className="VoiceControl-section">
          <div className="VoiceControl-title">Lights</div>
          <div className="VoiceControl-img">
            <img src={ImgLights} alt="" />
          </div>
          <div className="VoiceControl-row">
            <div className="VoiceControl-col VoiceControl-col--3">
              <p>Amazon's Echo line of smart speakers can be used to control a plethora of different supported lights. If you have an Echo and supported smart lights (with the smart hub for those that need it), it's easy to get set up.</p>
              <p>You can use:<br />Amazon: Amazon Echo ($100)<br />Amazon: Philips Hue White Light starter kit 4-pack ($96)</p>
              <Button>
                <Link to="/">List of supported lights</Link>
              </Button>
            </div>
            <div className="VoiceControl-col VoiceControl-col--3">
              <div className="VoiceControl-subtitle">How to integrate with the Philips Hue smart lights</div>
              <p>Once your smart lights are connected to your home wi-fi (follow the manufacturer&apos;s instructions), you&apos;re ready to connect your lights with your Echo so that you can ask Alexa to control them. Here's how.</p>
              <ul>
                <li>1 - Launch the Alexa app on your iPhone or iPad.</li>
                <li>2 - Tap the menu icon in the top left corner of the screen.</li>
                <li>3 - Tap Smart Home.</li>
                <li>4 - Tap Add Device. Wait for Alexa to discover your device.</li>
                <li>5 - Scroll down to select your newly added smart light. It will appear in the Your Devices list.</li>
              </ul>
            </div>
            <div className="VoiceControl-col VoiceControl-col--3">
              <div className="VoiceControl-subtitle">You can also group lights</div>
              <p>One of the best things you can do with your smart lights is to group them so that, with a single instruction, you can tell Alexa to turn all of them on or off. Decide which lights you want to group (ie., two bedroom lights, all the lights in the back half of the house, your kitchen and dining room) and group them to make a one-stop action across all of them.</p>
              <ul>
                <li>1 - Launch the Alexa app on your iPhone or iPad.</li>
                <li>2 - Tap the menu icon in the top left corner of the screen.</li>
                <li>3 - Tap Smart Home.</li>
                <li>4 - Tap Groups at the top of the screen.</li>
                <li>5 - Tap Add Group.</li>
                <li>6 - Tap Smart Home Group.</li>
                <li>7 - Enter a name for your group (like living room or bathroom).</li>
                <li>8 - Tap Next.</li>
                <li>9 - Select the lights you want in the group.</li>
                <li>10 - Tap Save.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="VoiceControl-section">
          <div className="VoiceControl-title">Smart Plugs</div>
          <div className="VoiceControl-row">
            <div className="VoiceControl-col VoiceControl-col--6">
              <div className="VoiceControl-img">
                <img src={ImgSmartPlugs} alt="" />
              </div>
            </div>
            <div className="VoiceControl-col VoiceControl-col--6">
              <p>Another way to control lights and other appliances is using Smart Plugs. For example: TanTan smart plugs ($18.99 at Amazon)</p>
              <p>Use your dumb lights with Alexa, no hub required. You can turn anything into a smart home appliance with a smart plug.</p>
              <Button>
                <Link to="/">Buy - <span>$18.99</span></Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="VoiceControl-section">
          <div className="VoiceControl-title">Thermostats</div>
          <div className="VoiceControl-row">
            <div className="VoiceControl-col VoiceControl-col--6">
              <div className="VoiceControl-img">
                <img src={ImgThermostatIdevice} alt="" />
              </div>
              <div className="VoiceControl-subtitle">iDevices Thermostat</div>
              <p>The original iDevices Thermostat was compatible with Apple’s Siri and Amazon’s Alexa. Adding Google Assistant to the mix broadens the product’s reach. Whether you have an Amazon Echo, Apple HomePod, or Google Home smart speaker, you can issue voice commands to check or set the temperature in your house.</p>
              <Button>
                <Link to="/">Buy - <span>$49</span></Link>
              </Button>
            </div>
            <div className="VoiceControl-col VoiceControl-col--6">
              <div className="VoiceControl-img">
                <img src={ImgThermostatNest} alt="" />
              </div>
              <div className="VoiceControl-subtitle">Nest Learning Thermostat </div>
              <p>The Nest Learning Thermostat is already pretty good at knowing the temperature at which you're most comfortable, but if you want even more precise control, you can command it through Amazon's Alexa voice assistant. Using nothing but your voice, you can raise and lower the temperature, without leaving the comfort of your couch or bed. Here's how to link the Nest and Alexa.</p>
              <p>Google Assistant makes it easy to control and interact with many of your Nest products. Nest thermostats can be controlled by a number of voice commands, each starting with the phrase, “Hey Google.”</p>
              <Button>
                <Link to="/">Buy - <span>$49</span></Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="VoiceControl-section">
          <div className="VoiceControl-title">Cameras</div>
          <div className="VoiceControl-row">
            <div className="VoiceControl-col VoiceControl-col--6">
              <div className="VoiceControl-img">
                <img src={ImgCameras} alt="" />
              </div>
              <p>“Alexa, show me the kitchen.”</p>
              <p>“OK Google, disable the night vision of cameras at the front door.”</p>
            </div>
            <div className="VoiceControl-col VoiceControl-col--6">
              <p>Thanks to the security cameras that work with Alexa & Google Home, such “fictional” scenes have become real.</p>
              <p>There is no doubt that these CCTV cameras will bring more convenience to your daily life and also build a smarter home. So will you be enticed into buying one for your home? If yes, how to select the best IP cameras that are compatible with Alexa or Google Assistant?</p>
              <p>To make a wise purchase, continue reading to learn more about their benefits and also the top items to consider when buying smart security cameras that work with Alexa and Google Home/Assistant (a cost-effective option is also included).</p>
              <Button>
                <Link to="/"><span>Check Compatible Cameras</span></Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="VoiceControl-section">
          <div className="VoiceControl-title">Lock Doors</div>
          <div className="VoiceControl-row">
            <div className="VoiceControl-col VoiceControl-col--6">
              <div className="VoiceControl-img">
                <img src={ImgLockDoorsNest} alt="" />
              </div>
              <div className="VoiceControl-subtitle">Nest x Yale Smart Lock</div>
              <p>These smart locks can be controlled from anywhere through Google Assistant, and ties in beautifully with other Nest products with automated features like disabling your Nest Secure alarm when you come home. It can unlock automatically with your phone, and has a backup number pad. $230 at Amazon</p>
              <Button>
                <Link to="/">Buy - <span>$49</span></Link>
              </Button>
            </div>
            <div className="VoiceControl-col VoiceControl-col--6">
              <div className="VoiceControl-img">
                <img src={ImgLockDoorsAugust} alt="" />
              </div>
              <div className="VoiceControl-subtitle">August Smart Lock Pro + Connect </div>
              <p>The Smart Lock Pro is an upgraded version of the regular August lock and comes bundled with the Connect bridge for Google Assistant integration. It comes in a stylish circular housing, and unlike its cheaper counterpart, the Pro supports HomeKit and Alexa as well, in case you live in a cross-platform household. $240 at Amazon</p>
              <Button>
                <Link to="/">Buy - <span>$49</span></Link>
              </Button>
            </div>
          </div>
        </section>

      </div>
    </section>
  );
}

export default VoiceControl;
