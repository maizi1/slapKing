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

    @property(sp.Skeleton)
    skeleton: sp.Skeleton = null;

    @property(cc.Sprite)
    dan: cc.Sprite = null;
    @property(cc.Node)
    score: cc.Node = null;

    onSucceed = (ss: number) => {
        let starNum = 0;
        if (ss < 10) {
            this.dan.spriteFrame = this.crown;
            starNum = Math.ceil(10 - ss);
        } else if (ss < 15) {
            this.dan.spriteFrame = this.gold;
            starNum = Math.ceil(15 - ss);
        } else if (ss < 25) {
            this.dan.spriteFrame = this.silver;
            starNum = Math.ceil((25 - ss) / 2);
        }

        const [_, ...stars] = this.score.children;

        this.skeleton.setStartListener(() => {
            starNum = starNum > 5 ? 5 : starNum;
            for (let i = 0; i < starNum; i++) {
                stars[i].getComponent(cc.Sprite).spriteFrame = this.starYellow;
            }
            cc.tween(this.score)
                .to(0.6, { position: cc.v2(0, -320) }, { easing: 'sineInOut' })
                .to(0.3, { rotation: 0 }, { easing: 'sineInOut' })
                .start();
        });

        this.node.active = true;
    };
}
