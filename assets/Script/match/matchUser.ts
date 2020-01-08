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
export default class MatchUser extends cc.Component {
    numberLabel: cc.Label = null;
    nameLabel: cc.Label = null;

    name: string = '';
    count: number = 0;
    maxNumber: number = 37;
    diffNumber: number;
    callback: (name: string) => void;
    isSucceed: boolean;
    duration: number;
    key: string;

    init(name: string, key: string, callback: (key: string) => void) {
        //this.node 有3个子节点， 第一个起依次是当前耳光次数、名字、头像Sprite Frame
        const { children } = this.node;
        this.name = name;
        this.key = key;
        this.callback = callback;
        this.isSucceed = Math.random() < 0.5;
        this.duration = Math.random() * 4 + 4;
        this.diffNumber = this.isSucceed
            ? 0
            : Math.random() < 0.5
            ? Math.floor(Math.random() * 5)
            : -1;
        this.numberLabel = children[0].getComponent(cc.Label);
        this.nameLabel = children[1].getComponent(cc.Label);
        this.nameLabel.string = name;
    }

    onGo() {
        const repeat = this.maxNumber - this.diffNumber
        console.log(this.maxNumber, this.diffNumber)
        this.schedule(() => {
            this.numberLabel.string = ++this.count + '';
            if (this.count === repeat) {
                this.callback(this.key)
            }
        }, this.duration / repeat, repeat - 1);
    }

    // start () {

    // }

    // update (dt) {}
}
