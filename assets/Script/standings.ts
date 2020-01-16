// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.SpriteFrame)
    crown: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    gold: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    silver: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    starYellow: cc.SpriteFrame;

    @property(cc.Node)
    matchList: cc.Node = null;
    @property(cc.Prefab)
    matchItem: cc.Prefab = null;

    @property(cc.Node)
    soloList: cc.Node = null;
    @property(cc.Prefab)
    soloItem: cc.Prefab = null;

    @property(cc.Node)
    soloNode: cc.Node = null;
    @property(cc.Node)
    matchNode: cc.Node = null;

    isSoloNode: boolean = true;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.setSoloItem();
        this.setMatchItem();
    }

    setMatchItem() {
        let match = cc.sys.localStorage.getItem('match');
        if (match) {
            match = JSON.parse(match);
            match.forEach(({ currenUser, matchUser1, matchUser2, isVictory, day }) => {
                const item = cc.instantiate(this.matchItem);
                const {
                    children: [{ children: names }, dateNode, victory, fail],
                } = item;

                names[0].getComponent(cc.Label).string = currenUser.name;
                names[1].getComponent(cc.Label).string = matchUser1.name;
                names[2].getComponent(cc.Label).string = matchUser2.name;
                dateNode.getComponent(cc.Label).string = this.format(day, 'MM-dd hh:mm');

                if (isVictory) {
                    victory.active = true;
                } else {
                    fail.active = true;
                }
                this.matchList.addChild(item);
            });
            this.matchList.height = 130 * (match.length + 2);
        }
    }

    setSoloItem() {
        let solo = cc.sys.localStorage.getItem('solo');
        if (solo) {
            solo = JSON.parse(solo);
            solo.forEach(({ time, day }) => {
                const item = cc.instantiate(this.soloItem);
                const {
                    children: [timeNode, dateNode, startsNode, danNode],
                } = item;
                let starNum = 0;
                timeNode.getComponent(cc.Label).string = time + 's';
                dateNode.getComponent(cc.Label).string = this.format(day, 'yyyy-MM-dd hh:mm:ss');

                if (time < 10) {
                    danNode.getComponent(cc.Sprite).spriteFrame = this.crown;
                    starNum = Math.ceil(10 - time);
                } else if (time < 15) {
                    danNode.getComponent(cc.Sprite).spriteFrame = this.gold;
                    starNum = Math.ceil(15 - time);
                } else if (time < 25) {
                    danNode.getComponent(cc.Sprite).spriteFrame = this.silver;
                    starNum = Math.ceil((25 - time) / 2);
                }

                starNum = starNum > 5 ? 5 : starNum;
                const stars = startsNode.children;
                for (let i = 0; i < starNum; i++) {
                    stars[i].getComponent(cc.Sprite).spriteFrame = this.starYellow;
                }

                this.soloList.addChild(item);
            });
            this.soloList.height = 130 * (solo.length + 2);
        }
    }

    toggle() {
        if (this.isSoloNode) {
            this.soloNode.active = false;
            this.matchNode.active = true;
            this.isSoloNode = false;
        } else {
            this.soloNode.active = true;
            this.matchNode.active = false;
            this.isSoloNode = true;
        }
    }

    goToHome() {
        cc.director.resume();
        window.Global.play('click');
        cc.director.loadScene('home');
    }

    format = function(timestamp: number, fmt: string) {
        const date = new Date(timestamp);
        var o = {
            'M+': date.getMonth() + 1, //月份
            'd+': date.getDate(), //日
            'h+': date.getHours(), //小时
            'm+': date.getMinutes(), //分
            's+': date.getSeconds(), //秒
            'q+': Math.floor((date.getMonth() + 3) / 3), //季度
            S: date.getMilliseconds(), //毫秒
        };

        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(
                    RegExp.$1,
                    RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
                );
            }
        }

        return fmt;
    };

    // update (dt) {}
}
