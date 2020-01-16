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
export default class Succeed extends cc.Component {
    @property(cc.SpriteFrame)
    starYellow: cc.SpriteFrame;

    skeleton: sp.Skeleton = null;

    @property(sp.Skeleton)
    en: sp.Skeleton = null;
    @property(sp.Skeleton)
    zh: sp.Skeleton = null;
    @property(sp.Skeleton)
    hi: sp.Skeleton = null;
    @property(sp.Skeleton)
    ru: sp.Skeleton = null;

    @property(cc.Node)
    score: cc.Node = null;

    onLoad() {
        console.log(1)
    }

    onSucceed = (ss: number, isScore: boolean = true) => {
        switch (cc.sys.language) {
            case 'zh':
                this.skeleton = this.zh;
                break;
            case 'hi':
                this.skeleton = this.hi;
                break;
            case 'ru':
                this.skeleton = this.ru;
                break;
            default:
                this.skeleton = this.en;
        }

        this.skeleton.node.active = true;
        const [crown, gold, silver, ...stars] = this.score.children;

        let starNum = 0;
        if (ss < 10) {
            crown.active = true;
            starNum = Math.ceil(10 - ss);
        } else if (ss < 15) {
            gold.active = true;
            starNum = Math.ceil(15 - ss);
        } else if (ss < 25) {
            silver.active = true;
            starNum = Math.ceil((25 - ss) / 2);
        }

        this.skeleton.setStartListener(() => {
            starNum = starNum > 5 ? 5 : starNum;
            for (let i = 0; i < starNum; i++) {
                stars[i].getComponent(cc.Sprite).spriteFrame = this.starYellow;
            }
            if (isScore) {
                cc.tween(this.score)
                    .to(0.6, { position: cc.v2(0, -320) }, { easing: 'sineInOut' })
                    .to(0.3, { rotation: 0 }, { easing: 'sineInOut' })
                    .start();
            }
        });

        this.node.active = true;
        this.scheduleOnce(() => window.Global.play('hiScore'), 0.15);
    };
}
