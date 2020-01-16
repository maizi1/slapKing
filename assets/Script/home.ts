import Slap from './slap';

const { ccclass, property } = cc._decorator;

const i18n = require('LanguageData');
@ccclass
export default class Home extends cc.Component {
    @property(cc.SpriteFrame)
    crown: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    gold: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    silver: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    starYellow: cc.SpriteFrame;

    @property(cc.Node)
    slapNode: cc.Node = null;
    slap: Slap;

    @property(cc.Node)
    setingNode: cc.Node = null;

    @property(cc.Node)
    permanent: cc.Node = null;

    @property(cc.Sprite)
    dan: cc.Sprite = null;
    @property(cc.Node)
    stars: cc.Node = null;

    @property(cc.Sprite)
    settingDan: cc.Sprite = null;
    @property(cc.Node)
    settingStars: cc.Node = null;

    @property(cc.Node)
    messageBox: cc.Node = null;
    @property(cc.Node)
    lock: cc.Node = null;
    soloMaxScore: number = undefined;

    @property(cc.Label)
    userNameLabel1: cc.Label = null; // 顶部头像旁的当前玩家名字标签
    @property(cc.Label)
    userNameLabel2: cc.Label = null; // 设置框内的当前玩家名字标签

    langs = ['zh', 'en'];
    langIndex: number = 0;
    ss: number = 0;

    onLoad() {
        i18n.init('ru');
        cc.director.preloadScene('match');
        cc.director.preloadScene('solo');
        this.slap = this.slapNode.getComponent('slap');
        this.slap.init(Infinity, false);

        if (!window.Global) {
            cc.game.addPersistRootNode(this.permanent);

            window.Global = this.permanent.getComponent('permanent');
            window.Global.init();
        }
        const { isAudio } = window.Global.state;
        const toggleAudioNode = cc.find('backgroundBox/toggleAudio', this.setingNode);
        const toggleAudio = toggleAudioNode.getComponent(cc.Toggle);
        toggleAudioNode.children[2].getComponent(cc.Label).string = isAudio ? 'on' : 'off';

        toggleAudio.isChecked = isAudio;
        this.setBest();
        this.setUserName();

        const clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = window.Global.node;
        clickEventHandler.component = 'permanent';
        clickEventHandler.handler = 'toggleAudio';
        toggleAudio.checkEvents.push(clickEventHandler);
    }

    update(dt: number) {
        this.ss += dt;
        if (this.ss >= 0.5) {
            this.ss = 0;
            this.slap.onSlap();
        }
    }

    setUserName() {
        let name = cc.sys.localStorage.getItem('userName');

        if (!name) {
            name = new Date().getTime().toString(36);
            cc.sys.localStorage.setItem('userName', name);
        }

        window.Global.state.name = name;

        const { userNameLabel1, userNameLabel2 } = this;
        userNameLabel1.string = name;
        userNameLabel2.string = name;
    }

    setBest() {
        let solo = cc.sys.localStorage.getItem('solo');
        if (solo) {
            solo = JSON.parse(solo);
            if (!solo[0]) {
                return;
            }
            const ss = solo[0].time;
            this.soloMaxScore = ss;
            let starNum = 0;
            if (ss < 10) {
                this.dan.spriteFrame = this.crown;
                this.settingDan.spriteFrame = this.crown;
                this.lock.active = false;
                starNum = Math.ceil(10 - ss);
            } else if (ss < 15) {
                this.dan.spriteFrame = this.gold;
                this.settingDan.spriteFrame = this.gold;
                this.lock.active = false;
                starNum = Math.ceil(15 - ss);
            } else if (ss < 25) {
                this.dan.spriteFrame = this.silver;
                this.settingDan.spriteFrame = this.silver;
                starNum = Math.ceil((25 - ss) / 2);
            }

            starNum = starNum > 5 ? 5 : starNum;
            const stars = this.stars.children;
            const settingStars = this.settingStars.children;
            for (let i = 0; i < starNum; i++) {
                stars[i].getComponent(cc.Sprite).spriteFrame = this.starYellow;
                settingStars[i].getComponent(cc.Sprite).spriteFrame = this.starYellow;
            }
        }
    }
    openSetting() {
        cc.director.preloadScene('standings');
        cc.tween(this.setingNode)
            .to(0.3, { scale: 1 })
            .start();
    }

    jumpStandings() {
        window.Global.play('click');
        cc.director.loadScene('standings');
    }
    closeSetting() {
        cc.tween(this.setingNode)
            .to(0.3, { scale: 0 })
            .start();
    }
    onMatch() {
        window.Global.play('click');

        if (this.soloMaxScore === undefined || this.soloMaxScore >= 15) {
            this.messageBox.active = true;
            cc.tween(this.messageBox)
                .to(0.3, { scale: 2 })
                .delay(2)
                .to(0.3, { scale: 0 })
                .start();
        } else {
            cc.director.loadScene('match');
        }
    }

    onSolo() {
        window.Global.isSoloHint = true;
        window.Global.play('click');
        cc.director.loadScene('solo');
    }

    toggleLang() {
        const { langs, langIndex } = this;
        if (langIndex !== langs.length - 1) {
            this.langIndex++;
        } else {
            this.langIndex = 0;
        }

        cc.sys.localStorage.setItem('lang', this.langIndex);
        i18n.init(langs[this.langIndex]);
        i18n.updateSceneRenderers();
    }
}
