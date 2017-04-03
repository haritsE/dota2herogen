import heroes from '../data/herodata.json';
import Head from 'next/head';
import heroService from '../service/heroService';
import config from '../config.js';
import { Button, Collapse, Well, Checkbox, FormGroup, Grid, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import ReactGA from 'react-ga';

const IS_SERVER = typeof window === 'undefined';
const IS_BROWSER = !IS_SERVER;

export default class extends React.Component {
    static async getInitialProps () {
        const heroOptions = [];
        for (var key in heroes) {
          heroOptions.push({
            value: key,
            label: heroes[key].displayname,
          });
        }

        return {
          hero: heroService.getRandomHero(heroes),
          heroOptions,
        }
    }

    logEvent(eventName) {
      if (IS_BROWSER) {
        switch (eventName) {
          case 'randomize':
            ReactGA.event({
              category: 'user',
              action: 'randomize',
              label: 'Click Randomizing Hero Button'
            });
            break;
          case 'adv_opts':
            ReactGA.event({
              category: 'user',
              action: 'adv_opts',
              label: 'Click Advanced Options Button'
            });
            break;
          default:
            break;
        }
      }
    }

    constructor (props) {
        super(props)
        this.state = {
          hero: props.hero,
          excludedHeroes: [],
          attr: {
            str: false,
            agi: false,
            int: false,
          },
          atk: {
            melee: false,
            ranged: false,
          }
        }

        if (IS_BROWSER) {
          ReactGA.initialize(config.GA_ID);
        }
    }

    randomize() {
      this.logEvent('randomize');
      const attr = [];
      const atk = [];

      if (this.checkboxStr.checked) attr.push('strength');
      if (this.checkboxAgi.checked) attr.push('agility');
      if (this.checkboxInt.checked) attr.push('intelligence');

      if (this.checkboxMelee.checked) atk.push('melee');
      if (this.checkboxRanged.checked) atk.push('ranged');

      this.setState({ hero: heroService.getRandomHero(heroes, {
        excludedHeroes: this.state.excludedHeroes,
        includedAttackType: atk,
        includedAttrType: attr,
      })});
    }

    handleExcludedChange(val) {
      this.setState({
        excludedHeroes: val.split(','),
      });
    }

    render() {
      const hero = this.state.hero;
      return (
        <div style={{ textAlign: 'center' }}>
          <Head>
            <title>DOTA 2 Random Hero Generator</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap-theme.min.css" />
            <link rel="stylesheet" href="/static/react-select.min.css" />
          </Head>
          <h1>Your random hero is <b>{ hero.displayname }</b>.</h1>
          <br/>
          <img src={hero.image}/>
          <br/><br/>
          <a href={ 'http://howdoiplay.com/?' + hero.displayname}>How to play { hero.displayname }</a>
          <br/><br/>
          <Button onClick={() => { this.randomize() }} bsStyle="primary">Generate another</Button>{'  '}
          <Button onClick={() => {
              if (!this.state.optionOpen) {
                this.logEvent('adv_opts');
              }
              this.setState({ optionOpen: !!!this.state.optionOpen });
            }} >Advanced options</Button>
          <br/><br/>
          <Grid>
            <Row>
              <Col md={6} mdOffset={3}>
                <Collapse in={this.state.optionOpen}>
                  <div>
                    <Well>
                      <h3> Filters </h3>
                      Exclude Hero:
                      <Select
                        name='excluded-heroes'
                        multi={true}
                        value={this.state.excludedHeroes}
                        options={this.props.heroOptions}
                        onChange={this.handleExcludedChange.bind(this)}
                      />
                      By Primary Attribute:
                      <FormGroup>
                        <Checkbox inputRef={ref => { this.checkboxStr = ref; }} inline>
                          <img src='/static/pip_str.png'/> Strength
                        </Checkbox>
                        {' '}
                        <Checkbox inputRef={ref => { this.checkboxAgi = ref; }} inline>
                          <img src='/static/pip_agi.png'/> Agility
                        </Checkbox>
                        {' '}
                        <Checkbox inputRef={ref => { this.checkboxInt = ref; }} inline>
                          <img src='/static/pip_int.png'/> Intelligence
                        </Checkbox>
                      </FormGroup>
                      By Attack Type:
                      <FormGroup>
                        <Checkbox inputRef={ref => { this.checkboxMelee = ref; }} inline>Melee</Checkbox>
                        {' '}
                        <Checkbox inputRef={ref => { this.checkboxRanged = ref; }} inline>Ranged</Checkbox>
                      </FormGroup>
                    </Well>
                  </div>
                </Collapse>
              </Col>
            </Row>
          </Grid>
        </div>
      );
    }
}