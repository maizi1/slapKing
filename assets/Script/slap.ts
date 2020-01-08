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
export default class Slap extends cc.Component {
    @property(cc.Node)
    left: cc.Node = null;
    @property(cc.Node)
    right: cc.Node = null;
    @property(cc.Node)
    fron: cc.Node = null;

    @property(cc.AudioClip)
    audio: cc.AudioClip = null;

    isleftOrRight: boolean = false;
    isStart: boolean = false;
    isPlayAudio: boolean;
    
    count: number = 0;
    maxNumber: number;

    /**
     * 初始设置
     * @param maxNumber 最大耳光数
     * @param isPlayAudio 是否播放音频 默认播放
     */
    init(maxNumber: number, isPlayAudio: boolean = true) {
        this.maxNumber  = maxNumber;
        this.isPlayAudio = isPlayAudio;
    }

    /**
     * !#zh 切换左右耳光
     */
    onSlap() {
        if (this.count <= this.maxNumber) {
            const { isStart, left, right, isleftOrRight, isPlayAudio } = this;
            if (!isStart) {
                this.isStart = true;
                this.fron.active = false;
            }

            left.active = !isleftOrRight;
            right.active = isleftOrRight;
            if (isPlayAudio) {
                cc.audioEngine.play(this.audio, false, 1);
            }

            this.isleftOrRight = !isleftOrRight;
            this.count++;
        }
        return this.count;
    }
}
