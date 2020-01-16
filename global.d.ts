interface Window {
    Global: {
        state: {
            isAudio: boolean;
            name: string; //当前玩家名字
        };
        isSoloHint: boolean;
        slapNum: number;
        click: cc.AudioClip;
        ready: cc.AudioClip = null;
        whistle: cc.AudioClip = null;
        out: cc.AudioClip = null;
        slap: cc.AudioClip = null;
        theme: cc.AudioClip;
        themeId: number;
        /**
         * 根据音频开关决定是否播放音乐
         * @param sceneName Global对象下保存音频的属性名
         */
        play(audioName: string): void;
        /**
         * 播放||暂停背景音乐
         */
        palyBackAudio(): void;
        /**
         * 设置背景音乐音量
         * @param volume 0.0 - 1.0
         */
        setThemeVolume(volume: number): void;
        [key: string]: any;
    };

    i18n: {
        [key: string]: any;
    }
}
