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

    background: cc.Node;
    referee: cc.Node;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        const { children } = this.node;
        this.background = children[0];
        this.referee = children[1];
    }

    onOut = () => {
        const { tween } = cc;
        const {node, background, referee} = this
        tween(node)
            .to(0.6, { position: cc.v2(0, 0) }, { easing: 'sineInOut' })
            .start();
        tween(referee)
            .delay(1.2)
            .by(0.4, { position: cc.v2(-380, 0) }, { easing: 'sineInOut' })
            .start();
        tween(background)
            .delay(1.6)
            .by(0.4, { position: cc.v2(-380, 0) }, { easing: 'sineInOut' })
            .start();
        window.Global.play('whistle');
        this.scheduleOnce(() => {
            window.Global.play('out');
        }, 0.8);
    }
}
