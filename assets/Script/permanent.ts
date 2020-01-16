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
export default class Permanent extends cc.Component {
    state: { [key: string]: any };

    isSoloHint: boolean;
    slapNum: number;
    @property(cc.AudioClip)
    click: cc.AudioClip = null;
    @property(cc.AudioClip)
    ready: cc.AudioClip = null;
    @property(cc.AudioClip)
    whistle: cc.AudioClip = null;
    @property(cc.AudioClip)
    out: cc.AudioClip = null;
    @property(cc.AudioClip)
    slap: cc.AudioClip = null;
    @property(cc.AudioClip)
    hiScore: cc.AudioClip = null;
    @property(cc.AudioClip)
    theme: cc.AudioClip = null;
    themeId: number = null;

    init() {
        const state = cc.sys.localStorage.getItem('state');
        this.state = state
            ? JSON.parse(state)
            : {
                  isAudio: true,
              };
        this.palyBackAudio();
    }

    toggleAudio(toggle: { [key: string]: any }) {
        console.log(toggle)
        this.state.isAudio = toggle.isChecked;
        toggle.node.children[2].getComponent(cc.Label).string = toggle.isChecked ? 'on' : 'off';
        this.palyBackAudio();
        // cc.audioEngine.pause(this.themeId);
        cc.sys.localStorage.setItem('state', JSON.stringify(this.state));
    }

    play(audioName: string) {
        if (this.state.isAudio) {
            cc.audioEngine.play(this[audioName], false, 1);
        }
    }

    palyBackAudio() {
        const { isAudio } = this.state;
        const { themeId } = this;
        if (isAudio && themeId === null) {
            this.themeId = cc.audioEngine.play(this.theme, true, 1);
        } else if (isAudio && themeId !== null) {
            cc.audioEngine.resume(themeId);
        } else if (!isAudio && themeId !== null) {
            cc.audioEngine.pause(themeId);
        } else if (!isAudio && themeId === null) {
            return;
        }
    }

    setThemeVolume(volume: number) {
        cc.audioEngine.setVolume(this.themeId, volume);
    }
}
