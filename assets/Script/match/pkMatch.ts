// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default function play(node: cc.Node, callback: (arr: cc.SpriteFrame[]) => void, gameState) {
    vs(node.children, () => match(node.children[2], callback, gameState));
}

function vs(nodes: cc.Node[], callback: () => void) {
    const skeleton = nodes[1].getComponent(sp.Skeleton);
    const track = skeleton.setAnimation(0, 'animation', false);
    const bgs = nodes[0].children; // 匹配动画的三个色块背景, [0] 黄色块, [1] 青色块, [2] 紫色块

    const { tween, v2 } = cc;
    const easing = { easing: 'easeOut' };
    tween(bgs[0])
        .to(0.3, { position: v2(0, -461) })
        .start();
    tween(bgs[1])
        .to(0.3, { position: v2(187.5, 0) })
        .start();
    tween(bgs[2])
        .to(0.3, { position: v2(-187.5, 0) })
        .start();

    window.Global.scheduleOnce(callback, 0.2);

    nodes[1].active = true;
}

function match(node: cc.Node, callback: (arr: cc.SpriteFrame[]) => void, gameState) {
    console.time('1')
    const {
        children: [{ children: animations }, { children: icons }],
    } = node;
    const isLoad = [];

    zoom(icons[0], icons[1]);

    let animationsLan = animations[2];

    switch (cc.sys.language) {
        case 'zh':
            animationsLan = animations[0];
            break;
        case 'hi':
            animationsLan = animations[1];
            break;
        case 'ru':
            animationsLan = animations[2];
            break;
        default:
            animationsLan = animations[3];
    }

    animationsLan.active = true;
    const random = Math.random() * 1 + 1.5;
    const isDelay = Math.random() < 0.5;
    const skeleton1 = animationsLan.children[0].getComponent(sp.Skeleton);
    const skeleton2 = animationsLan.children[1].getComponent(sp.Skeleton);

    icons[3].getComponent(cc.Label).string = gameState.matchUser1.name;
    icons[5].getComponent(cc.Label).string = gameState.matchUser2.name;

    const spr: cc.SpriteFrame[] = [];
    const iconPaths = (() => {
        const arr = [];
        function random() {
            const ran = Math.floor(Math.random() * 90);

            if (arr.indexOf(ran) === -1) {
                arr.push(ran);
                return;
            }
            return random();
        }

        for (let i = 0; i < 2; i++) {
            random();
        }
        return [`icon/icon${arr[0]}`, `icon/icon${arr[1]}`];
    })();
    loadRes(
        iconPaths[0],
        icons[2],
        handlerSkeleton(skeleton1, icons[2], icons[3], isDelay ? random : 0, isLoad, callback),
        spr
    );
    loadRes(
        iconPaths[1],
        icons[4],
        handlerSkeleton(skeleton2, icons[4], icons[5], isDelay ? 0 : random, isLoad, callback),
        spr
    );
}

function handlerSkeleton(
    skeleton: sp.Skeleton,
    iconNode: cc.Node,
    nameNode: cc.Node,
    random: number,
    isLoad: boolean[],
    callback: (arr: cc.SpriteFrame[]) => void
) {
    skeleton.setAnimation(0, 'Match1', true);
    return function(arr) {
        skeleton.addAnimation(0, 'Match2', false, 1.5 + random);
        const track = skeleton.addAnimation(0, 'Match3', false, 0.6);

        window.Global.scheduleOnce(() => {
            zoom(iconNode, nameNode);
            isLoad.push(true);
            if (isLoad.length === 2) {
                callback(arr);
            }
        }, 1.5 + random + 1);
    };
}

function zoom(node1: cc.Node, node2: cc.Node) {
    const { tween } = cc;
    tween(node1)
        .to(0.6, { scale: 1 })
        .start();
    tween(node2)
        .to(0.6, { scale: 1 })
        .start();
}

function loadRes(path: string, node: cc.Node, callback, arr: cc.SpriteFrame[]) {
    let index = arr.length;
    arr[index] = null;
    cc.loader.loadRes(path, cc.SpriteFrame, (err, spr: cc.SpriteFrame) => {
        if (!err) {
            node.getComponent(cc.Sprite).spriteFrame = spr;
            arr[index] = spr;
            callback(arr);
        }
    });
}
