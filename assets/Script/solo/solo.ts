import Slap from '../slap';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Match extends cc.Component {
    @property(cc.Node)
    readyNode: cc.Node = null;

    @property(cc.Node)
    slapNode: cc.Node = null;
    slap: Slap;

    @property(cc.Node)
    bottomBtnNode: cc.Node = null; // 此节点拥有两个子节点， 第一个是打耳光按钮， 第二个是提交
    bottomButtons: [cc.Button, cc.Button]; // [打耳光按钮组件， 提交按钮组件]

    @property(cc.Node)
    outNode: cc.Node = null;
    onOut: () => void;

    @property(cc.Node)
    succeedNode: cc.Node = null;
    onSucceed: (time: number, isScore?: boolean) => void;

    @property(cc.Node)
    hintBox: cc.Node = null;
    @property(cc.Node)
    closeHintBtn: cc.Node = null;

    @property(cc.Node)
    timer: cc.Node = null;

    @property(cc.Label)
    countLabel: cc.Label = null;
    isShowCount: boolean = true;

    @property(cc.Node)
    rest: cc.Node = null;

    onTimer: (dt: number) => number[];

    isEnd: boolean = false;
    isStart: boolean = false;

    @property(cc.Node)
    pauseNode: cc.Node = null;
    isPause: boolean = false;

    onLoad() {
        const { children } = this.bottomBtnNode;

        this.bottomButtons = [
            children[0].getComponent(cc.Button),
            children[1].getComponent(cc.Button),
        ];
        this.slap = this.slapNode.getComponent('slap');
        this.slap.init(37);

        if (window.Global.isSoloHint) {
            this.hintBox.active = true;
        } else {
            this.playReady();
            this.hintBox.active = false;
        }
        this.onOut = this.outNode.getComponent('out').onOut;
        this.onSucceed = this.succeedNode.getComponent('succeed').onSucceed;

        window.Global.slapNum = 0;
        window.Global.setThemeVolume(0.3);
        cc.director.preloadScene('fail');
    }

    update(dt: number) {
        const { node } = this.countLabel;
        if (!this.isShowCount && node.opacity > 0) {
            // node.opacity -= 40;
        }
        if (this.isStart && !this.isEnd) {
            this.onTimer(dt);
        }
    }

    handlerTimer() {
        const [ssNode, mmNode] = this.timer.children;
        const ssLabel = ssNode.getComponent(cc.Label);
        const mmLabel = mmNode.getComponent(cc.Label);

        let ss = 0;
        let mm = 0;
        cc.tween(this.timer)
            .by(0.5, { position: cc.v2(25, 0) })
            .start();
        return (dt: number) => {
            const _mm = dt * 100;
            mm += _mm;
            if (mm >= 99) {
                ss++;
                mm = 0;
            }
            ssLabel.string = ss < 10 ? '0' + ss : '' + ss;
            mmLabel.string = mm < 10 ? '0' + Math.round(mm) : '' + Math.round(mm);
            return [ss, mm];
        };
    }

    onSlap() {
        if (!this.isStart) {
            this.isStart = true;
            this.onTimer = this.handlerTimer();
        }
        const count = this.slap.onSlap();
        this.countLabel.string = count + '';
        if (count === 8) {
            this.isShowCount = false;
        }
        
        if (count === 38) {
            this.isEnd = true;

            const { bottomButtons } = this;
            bottomButtons[0].interactable = false;
            bottomButtons[1].interactable = false;

            this.jumpFailPage(count);
        }
    }

    onDone() {
        this.isEnd = true;
        const count = this.slap.count;
        if (this.onTimer) {
            const times = this.onTimer(0);
            const time = times[0] + Math.round(times[1]) / 100;
            if (count === 37) {
                this.onSucceed(time);
                let solo = cc.sys.localStorage.getItem('solo');
                solo = solo ? JSON.parse(solo) : [];
                const len = solo.length;
                if (len && time < solo[len - 1].time) {
                    solo.push({
                        time,
                        day: Date.now(),
                    });
                    solo.sort((a, b) => a.time - b.time);
                } else {
                    solo.push({
                        time,
                        day: Date.now(),
                    });
                }
                cc.sys.localStorage.setItem('solo', JSON.stringify(solo));
                this.scheduleOnce(() => cc.director.loadScene('victory'), 2);
            } else {
                this.jumpFailPage(count);
            }
        } else {
            this.jumpFailPage(count);
        }
        const { bottomButtons } = this;

        bottomButtons[0].interactable = false;
        bottomButtons[1].interactable = false;
    }

    jumpFailPage(slapNum: number) {
        this.isShowCount = true;
        this.countLabel.node.opacity = 255;
        window.Global.slapNum = slapNum;
        cc.tween(this.rest)
            .to(0.2, { rotation: -5, scale: 1.1 })
            .to(0.2, { rotation: 4, scale: 0.9 })
            .to(0.2, { rotation: -5, scale: 1 })
            .start();
        this.onOut();
        this.scheduleOnce(() => cc.director.loadScene('fail'), 2.3);
    }

    playReady() {
        const [ready, go] = this.readyNode.children;
        const { tween } = cc;
        this.readyNode.active = true;
        const countNode = this.countLabel.node;
        countNode.active = true;
        cc.tween(countNode)
            .to(0.5, { position: cc.v2(0, -320) }, { easing: 'sineIn' })
            .start();
        tween(this.timer)
            .to(0.5, { position: cc.v2(60, -115), rotation: 3 })
            .start();
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

        window.Global.play('ready');
        this.scheduleOnce(() => {
            const { bottomButtons } = this;
            bottomButtons[0].interactable = true;
            bottomButtons[1].interactable = true;
        }, 0.9);
    }

    closeHintBox() {
        this.playReady();
        window.Global.isSoloHint = false;
        cc.tween(this.hintBox)
            .to(0.25, { scale: 0 })
            .start();
        this.scheduleOnce(() => this.hintBox.active = false, 0.25);
    }

    goToHome() {
        cc.director.resume();
        window.Global.play('click');
        cc.director.loadScene('home');
    }

    onReset() {
        window.Global.play('click');
        cc.director.loadScene('solo');
    }

    onPause() {
        window.Global.play('click');
        if (this.isPause) {
            cc.director.resume();
            cc.tween(this.pauseNode)
                .to(0.2, { position: cc.v2(900, 0) })
                .start();
            this.scheduleOnce(() => (this.pauseNode.active = false), 0.23);
            this.isPause = false;
            return;
        }
        this.pauseNode.active = true;
        cc.tween(this.pauseNode)
            .to(0.2, { position: cc.v2(0, 0) })
            .start();
        this.isPause = true;
        this.scheduleOnce(() => cc.director.pause(), 0.23);
    }
}
