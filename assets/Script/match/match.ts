import Slap from '../slap';
import MatchUser from './matchUser';
import pkMatch from './pkMatch';

const { ccclass, property } = cc._decorator;

class UserState {
    name: string;
    duration = 0;
    isEnd = false;
    isSucceed = false;
    id: number;
    icon: cc.SpriteFrame;
    constructor(id: number, name?: string,) {
        if (name) {
            UserState.setNames();
            this.name = name;
        } else {
            this.name = UserState.names[id - 1];
        }
        this.id = id;
    }

    static names = [];
    static setNames = function () {
        const names = [
            '夏天',
            '看起来很不错',
            '落叶华年',
            '途中相遇',
            '夏天的歌',
            '暖风昔人',
            '小瓶盖Ω',
            '头头',
            '旧时光',
            '安小言',
            'A-hurbery',
            'aliy',
            '牙牙',
            'clay',
            '幸福泡泡',
            '彼岸o天蓝',
            '微笑',
            '蓝廋',
            '落落',
            '沉彼岸花',
            'smile',
            '原味青春',
            'fier',
            '宝儿',
            '蓝了海',
            '回忆、',
            'babyル',
            '半夏、蔷薇',
            '梦幻的味道。',
            '小情绪゛',
            '夕阳下的情调',
            '永不毕业的友情',
            '°透过指尖的余光',
            '桶桶',
            '把温暖装进口袋',
            '游在岸边的鱼',
            '飞进宿舍的蚊子',
            '转身⌒花开半夏',
            '℉阳光下的小情绪',
            '画花',
            '叙说你的蜜语',
            '蓝色的思念°',
        ];
        function randomNme() {
            return names[Math.floor(Math.random() * names.length)];
        }
        const arr = [randomNme(), randomNme()];
        
        while(arr[0] === arr[1]) {
            arr[1] = randomNme()
        }
        UserState.names = arr;
    }
}

@ccclass
export default class Match extends cc.Component {
    @property(cc.Node)
    readyNode: cc.Node = null;

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

    @property(cc.Node)
    outNode: cc.Node = null;
    onOut: () => void;

    @property(cc.Node)
    succeedNode: cc.Node = null;
    onSucceed: (time: number, isScore: boolean) => void;

    @property(cc.Label)
    countLabel: cc.Label = null;

    @property(cc.Label)
    timeLabel: cc.Label = null;
    time: number = 30;

    @property(cc.Node)
    wait: cc.Node = null;

    @property(cc.Node)
    grade: cc.Node = null;

    @property(cc.Node)
    match: cc.Node = null;

    @property(cc.Node)
    currentUser: cc.Node = null;

    slapNum: number = 0;

    isEnd: boolean = false;
    gameState = {
        currenUser: new UserState(0, window.Global.state.name),
        matchUser1: new UserState(1),
        matchUser2: new UserState(2),
        showGrade: null,
        onEnd() {
            if (this.getIsEnd()) {
                this.showGrade();
            }
        },
        getIsEnd() {
            for (let key in this) {
                if (this[key].isEnd === false) {
                    return false;
                }
            }
            return true;
        },
    };

    onLoad() {
        const { gameState } = this;
        const { children } = this.bottomBtnNode;
        gameState.onEnd = gameState.onEnd.bind(gameState);
        gameState.showGrade = this.showGrade;

        this.bottomButtons = [
            children[0].getComponent(cc.Button),
            children[1].getComponent(cc.Button),
        ];
        this.slap = this.slapNode.getComponent('slap');
        this.slap.init(37);

        this.onOut = this.outNode.getComponent('out').onOut;
        this.onSucceed = this.succeedNode.getComponent('succeed').onSucceed;

        this.matchUser1 = this.matchUser1Node.getComponent('matchUser');
        this.matchUser2 = this.matchUser2Node.getComponent('matchUser');

        pkMatch(this.match, (arr: cc.SpriteFrame[]) => {
            gameState.matchUser1.icon = arr[0];
            gameState.matchUser2.icon = arr[1];
            this.matchUser1.init(gameState.matchUser1, gameState.onEnd);
            this.matchUser2.init(gameState.matchUser2, gameState.onEnd);
            this.scheduleOnce(() => {
                this.match.destroy();
                this.playReady();
            }, 1);
        }, this.gameState);

        window.Global.setThemeVolume(0.3);
    }

    update(dt: number) {
        if (!this.isEnd && this.slap.count > 8 && this.countLabel.node.opacity > 0) {
            this.countLabel.node.opacity -= 40;
        }
        if (this.time === 0 && !this.isEnd) {
            this.isEnd = true;
            this.countLabel.node.opacity = 255;
            this.gameState.currenUser.duration = 30 - this.time;
            this.gameState.currenUser.isEnd = true;
            if (this.slap.count === 37) {
                this.onSucceed(30 - this.time, false);
                this.gameState.currenUser.isSucceed = true;
                this.scheduleOnce(this.showGrade, 1.5);
            } else {
                this.onOut();
                this.scheduleOnce(this.showGrade, 2);
            }
        }
    }

    setNameAndIcon() {
        const {children: []} = this.currentUser;
    }

    onSlap() {
        const count = this.slap.onSlap();
        this.countLabel.string = count + '';
        if (count === 38) {
            this.isEnd = true;
            this.countLabel.node.opacity = 255;
            this.onOut();
            this.gameState.currenUser.isEnd = true;
            this.gameState.currenUser.isSucceed = false;
            this.gameState.currenUser.duration = 30 - this.time;
            if (!this.gameState.getIsEnd()) {
                this.wait.active = true;
                cc.tween(this.wait)
                    .delay(2)
                    .to(0.3, { scale: 1 })
                    .start();
            } else {
                this.scheduleOnce(this.showGrade, 2);
            }
            const { bottomButtons } = this;

            bottomButtons[0].interactable = false;
            bottomButtons[1].interactable = false;
        }
    }

    onDone() {
        const count = this.slap.count;
        this.isEnd = true;
        this.countLabel.node.opacity = 255;
        if (count === 37) {
            this.onSucceed(30 - this.time, false);
            this.gameState.currenUser.isEnd = true;
            this.gameState.currenUser.isSucceed = true;
            this.gameState.currenUser.duration = 30 - this.time;
            if (!this.gameState.getIsEnd()) {
                this.wait.active = true;
                cc.tween(this.wait)
                    .delay(2)
                    .to(0.3, { scale: 1 })
                    .start();
            } else {
                this.scheduleOnce(this.showGrade, 2);
            }
        } else {
            this.onOut();
            this.gameState.currenUser.isEnd = true;
            this.gameState.currenUser.isSucceed = false;
            this.gameState.currenUser.duration = 30 - this.time;

            if (!this.gameState.getIsEnd()) {
                this.wait.active = true;
                cc.tween(this.wait)
                    .delay(2)
                    .to(0.3, { scale: 1 })
                    .start();
            } else {
                this.scheduleOnce(this.showGrade, 2);
            }
        }
        const { bottomButtons } = this;

        bottomButtons[0].interactable = false;
        bottomButtons[1].interactable = false;
    }

    showGrade = () => {
        const children = this.grade.children[0].children;
        const { currenUser, matchUser1, matchUser2 } = this.gameState;
        const rankings = [currenUser, matchUser1, matchUser2];
        rankings.sort((a, b) => a.duration - b.duration);
        rankings.sort((a, b) => {
            const _a = a.isSucceed ? 1 : 0;
            const _b = b.isSucceed ? 1 : 0;
            return _b - _a;
        });
        this.grade.active = true;
        rankings.forEach((obj, index) => {
            const [name, time] = children[index].children;
            name.getComponent(cc.Label).string = obj.name;
            time.getComponent(cc.Label).string = obj.duration + 's';
        });

        let match = cc.sys.localStorage.getItem('match');
        match = match ? JSON.parse(match) : [];

        const log = {
            currenUser,
            matchUser1,
            matchUser2,
            isVictory: rankings[0].id === 0,
            day: Date.now(),
        };

        for (let key in log) {
            if (log[key].icon) {
                log[key].icon = null;
            }
        }
        match.unshift(log);
        cc.sys.localStorage.setItem('match', JSON.stringify(match));

        cc.tween(this.grade)
            .to(0.3, { position: cc.v2(0, 0) })
            .start();
    };
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

        window.Global.play('ready');
        this.scheduleOnce(() => {
            const { bottomButtons } = this;

            bottomButtons[0].interactable = true;
            bottomButtons[1].interactable = true;

            this.schedule(
                () => {
                    this.timeLabel.string = '' + --this.time;
                },
                1,
                29
            );
            this.matchUser1.onGo();
            this.matchUser2.onGo();
        }, 0.9);
    }

    goToHome() {
        window.Global.play('click');
        cc.director.loadScene('home');
    }

    onReset() {
        window.Global.play('click');
        cc.director.loadScene('match');
    }
}
