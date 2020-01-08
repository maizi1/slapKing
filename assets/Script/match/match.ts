import Slap from '../slap';
import MatchUser from './matchUser';

const { ccclass, property } = cc._decorator;

function UserStare(name: string) {
    this.name = name;
    this.duration = 0;
    this.isEnd = false;
}

@ccclass
export default class Match extends cc.Component {
    @property(cc.Node)
    readyNode: cc.Node = null;
    @property(cc.AudioClip)
    readyAudio: cc.AudioClip = null;

    @property(cc.Node)
    slapNode: cc.Node = null;
    slap: Slap;
    @property(cc.Node)
    matchUser1Node: cc.Node = null;
    matchUser1: MatchUser;
    @property(cc.Node)
    matchUser2Node: cc.Node = null;
    matchUser2: MatchUser;

    @property(cc.Node)
    bottomBtnNode: cc.Node = null; // 此节点拥有两个子节点， 第一个是打耳光按钮， 第二个是提交
    bottomButtons: [cc.Button, cc.Button]; // [打耳光按钮组件， 提交按钮组件]

    isStart: true;
    gameState = {
        currenUser: new UserStare('孙悟空'),
        matchUser1: new UserStare('猪八戒'),
        matchUser2: new UserStare('沙悟净'),
        setState(key: string) {
            this[key].isEnd = true;
        },
    };

    onLoad() {
        const { gameState } = this;
        const { children } = this.bottomBtnNode;
        this.bottomButtons = [
            children[0].getComponent(cc.Button),
            children[1].getComponent(cc.Button),
        ];
        this.slap = this.slapNode.getComponent('slap');
        this.matchUser1 = this.matchUser1Node.getComponent('matchUser');
        this.matchUser2 = this.matchUser2Node.getComponent('matchUser');
        this.slap.init(37);
        gameState.setState = gameState.setState.bind(gameState);
        this.matchUser1.init(gameState.matchUser1.name, 'matchUser1', gameState.setState);
        this.matchUser2.init(gameState.matchUser1.name, 'matchUser2', gameState.setState);

        this.playReady();
    }

    start() {}

    onSlap() {
        
        this.slap.onSlap();
    }
    // update (dt) {}
    playReady() {
        const [ready, go] = this.readyNode.children;
        const { tween } = cc;
        this.readyNode.active = true;
        tween(this.readyNode)
            .to(0.6, { position: cc.v2(0, -35) })
            .delay(1)
            .to(0.6, { position: cc.v2(-670, -35) })
            .start();
        tween(ready)
            .delay(0.8)
            .to(0.2, { opacity: 0 })
            .start();
        tween(go)
            .delay(0.9)
            .to(0.3, { opacity: 255 })
            .start();

        this.scheduleOnce(() => {
            const { bottomButtons } = this;
            cc.audioEngine.play(this.readyAudio, false, 1);
            console.log(bottomButtons[0])
            console.log(bottomButtons[0].interactable)

            bottomButtons[0].interactable = true;
            bottomButtons[1].interactable = true;

            this.matchUser1.onGo();
            this.matchUser2.onGo();
        }, 1.2);
    }
}
