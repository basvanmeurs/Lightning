const EXAMPLE_SHORT_TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nibh augue, suscipit a, scelerisque sed, lacinia in, mi.'

const EXAMPLE_TEXT =
'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nibh augue, \
suscipit a, scelerisque sed, lacinia in, mi. Cras vel lorem. Etiam pellentesque \
aliquet tellus. Phasellus pharetra nulla ac diam. Quisque semper justo at risus. \
Donec venenatis, turpis vel hendrerit interdum, dui ligula ultricies purus, sed \
posueru libero dui id orci. Nam congue, pede vitae dapibus aliquet, elit magna \
vulputate arcu, vel tempus metus leo non est. Etiam sit amet lectus quis est congue \
mollis. Phasellus congue lacus eget neque. Phasellus ornare, ante vitae consectetuer \
consequat, purus sapien ultricies dolor, et mollis pede metus eget nisi. Praesent \
sodales velit quis augue. Cras suscipit, urna at aliquam rhoncus, urna quam viverra \
nisi, in interdum massa nibh nec erat.';

describe('text', function() {
    this.timeout(0);

    let root;
    let stage;

    class TestTexture extends lng.textures.TextTexture {}

    before(() => {
        stage = new lng.Stage({w: 1000, h: 1000, clearColor: 0xFFFF0000, autostart: true});
        root = stage.root
        document.body.appendChild(stage.getCanvas());
    });

    describe('entry check', function() {
        it('should render', function() {
            const element = stage.createElement({
                Item: {texture: {type: TestTexture, text: 'hello', async: false}, visible: true}
            });
            root.children = [element];
            const texture = root.tag("Item").texture;

            stage.drawFrame();
            chai.assert(texture.text == 'hello', "Texture must render");
            chai.assert(texture.source.w > 0);
            chai.assert(texture.source.h > 0);
            chai.assert(texture.source.renderInfo.lines.length == 1);
        });
    });

    describe('newline', function() {
        it('should wrap newline character', function() {
            const element = stage.createElement({
                Item: {texture: {type: TestTexture, text: 'hello \n world', async: false}, visible: true},
            });
            root.children = [element];
            const texture = root.tag("Item").texture;
            stage.drawFrame();
            chai.assert(texture.source.renderInfo.lines.length === 2);
        });
    });

    describe('wordWrap - break word', function() {
        it('should wrap paragraph [unlimited]', function() {
            const element = stage.createElement({
                Item: {
                    texture: {
                        type: TestTexture,
                        wordWrapWidth: 950,
                        text: EXAMPLE_TEXT,
                        async: false
                    }, visible: true},
            });
            root.children = [element];
            const texture = root.tag("Item").texture;
            stage.drawFrame();
            chai.assert(texture.source.renderInfo.lines.length > 1);
            chai.assert(texture.source.renderInfo.lines.slice(-1)[0].substr(-5) == 'erat.');
        });

        it('wrap paragraph [maxLines=10]', function() {
            const element = stage.createElement({
                Item: {
                    texture: {
                        type: TestTexture,
                        wordWrapWidth: 950,
                        text: EXAMPLE_TEXT,
                        maxLines: 10,
                        async: false
                    }, visible: true},
            });
            root.children = [element];
            const texture = root.tag("Item").texture;
            stage.drawFrame();
            chai.assert(texture.source.renderInfo.lines.length === 10);
            chai.assert(texture.source.renderInfo.lines.slice(-1)[0].substr(-2) == '..');
        });
    });

    describe('wordWrap - false', function() {

        it('should not apply textOverflow (by default)', function() {
            const element = stage.createElement({
                Item: {
                    texture: {
                        type: TestTexture,
                        wordWrap: false,
                        wordWrapWidth: 900,
                        text: EXAMPLE_SHORT_TEXT,
                        async: false
                    }, visible: true},
            });
            root.children = [element];
            const texture = root.tag("Item").texture;
            stage.drawFrame();
            chai.assert(texture.source.renderInfo.lines.length === 1);
            chai.assert(texture.source.renderInfo.lines[0].substr(-5) == ', mi.');
        });

        it('should ignore textOverflow when wordWrap is enabled (by default)', function() {
            const element = stage.createElement({
                Item: {
                    texture: {
                        type: TestTexture,
                        wordWrapWidth: 900,
                        text: EXAMPLE_TEXT,
                        textOverflow: '(...)',
                        maxLines: 5,
                        async: false
                    }, visible: true},
            });
            root.children = [element];
            const texture = root.tag("Item").texture;
            stage.drawFrame();
            chai.assert(texture.source.renderInfo.lines.length === 5);
            chai.assert(texture.source.renderInfo.lines.slice(-1)[0].substr(-2) == '..');
        });

        [
            'AAAAAAAAAAAAAAAAAAAAAA....', // Initial index guess overestimated
            '.....................AAAAA', // Initial index guess underestimated
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'Hello world.',
            '@@@@@@@@@@@@@@@@@@@@@@@@',
            ',,,,,,,,,,,,,,,,,,,,,,,,,',
            '~~~~~~~~~~~~~~~~~~~~~~~~~..................................',
            '                                      Hello',
            'Hello.                                 !',
        ].forEach((c) => {
            it(`should apply textOverflow properly [text='${c}']`, function() {
                const WRAP_WIDTH = 200;
                const element = stage.createElement({
                    Item: {
                        texture: {
                            type: TestTexture,
                            wordWrap: false,
                            textOverflow: 'ellipsis',
                            wordWrapWidth: WRAP_WIDTH,
                            text: c,
                            async: false
                        }, visible: true},
                });
                root.children = [element];
                const texture = root.tag("Item").texture;
                stage.drawFrame();
                chai.assert(texture.source.renderInfo.lines.length === 1);
                chai.assert(texture.source.renderInfo.w < WRAP_WIDTH);
                chai.assert(texture.source.renderInfo.w > 0);
                chai.assert(texture.source.renderInfo.lines[0].substr(-2) == '..');
            });
        });

        [
            {textOverflow: 'clip', suffix: null},
            {textOverflow: 'ellipsis', suffix: '..'},
            {textOverflow: '(...)', suffix: '(...)'}
        ].forEach((c) => {
            it(`should not wrap paragraph [overflow=${c.textOverflow}]`, function() {
                const WRAP_WIDTH = 900;
                const element = stage.createElement({
                    Item: {
                        texture: {
                            type: TestTexture,
                            wordWrap: false,
                            textOverflow: c.textOverflow,
                            wordWrapWidth: WRAP_WIDTH,
                            text: EXAMPLE_TEXT,
                            async: false
                        }, visible: true},
                });
                root.children = [element];
                const texture = root.tag("Item").texture;
                stage.drawFrame();
                chai.assert(texture.source.renderInfo.lines.length === 1);
                chai.assert(texture.source.renderInfo.w < WRAP_WIDTH);
                chai.assert(texture.source.renderInfo.w > 0);
                if (c.suffix !== null) {
                    chai.assert(texture.source.renderInfo.lines[0].substr(-c.suffix.length) == c.suffix);
                }
            });

            it(`should not wrap text that fits [overflow=${c.textOverflow}]`, function() {
                const WRAP_WIDTH = 250;
                const element = stage.createElement({
                    Reference:{
                        y: 42,
                        w: WRAP_WIDTH,
                        h: 4,
                        rect: true,
                        color: 0xff00ffff,
                    },
                    Item: {
                        texture: {
                            type: TestTexture,
                            wordWrap: false,
                            textOverflow: c.textOverflow,
                            wordWrapWidth: WRAP_WIDTH,
                            text: 'Hello',
                            async: false
                        }, visible: true},
                });
                root.children = [element];
                const texture = root.tag("Item").texture;
                stage.drawFrame();
                chai.assert(texture.source.renderInfo.lines.length === 1);
                chai.assert(texture.source.renderInfo.w < WRAP_WIDTH);
                chai.assert(texture.source.renderInfo.w > 0);
                chai.assert(texture.source.renderInfo.lines[0].substr(-5) == 'Hello');
            });

            it(`should work with empty strings [overflow=${c.textOverflow}]`, function() {
                const WRAP_WIDTH = 100;
                const element = stage.createElement({
                    Reference:{
                        y: 42,
                        w: WRAP_WIDTH,
                        h: 4,
                        rect: true,
                        color: 0xff00ffff,
                    },
                    Item: {
                        texture: {
                            type: TestTexture,
                            wordWrap: false,
                            textOverflow: c.textOverflow,
                            wordWrapWidth: WRAP_WIDTH,
                            text: '',
                            async: false
                        }, visible: true},
                });
                root.children = [element];
                const texture = root.tag("Item").texture;
                stage.drawFrame();
                chai.assert(texture.source == null);
            });

        });
    });

    describe('regression', function() {

        afterEach(() => {
            root.children = [];
        })

        it('should apply dim function to texture [all]', function() {
            const comp = stage.createElement({
                w: 500,
                h: 150,
                Item: {
                    w: w => w,
                    h: h => h,
                    texture: {
                        type: TestTexture,
                        text: 'hello'
                    }
                }
            });
            comp.addTag('testComp');
            root.children = [comp];

            stage.drawFrame();
            const elem = root.tag("testComp").tag('Item');
            chai.assert(elem.texture.text == 'hello');
            chai.assert(elem.texture.w === 500);
            chai.assert(elem.texture.h === 150);
            chai.assert(elem.core.w === 500);
            chai.assert(elem.core.h === 150);
        });

        it('should apply dim function to texture [single]', function() {
            const comp = stage.createElement({
                w: 500,
                h: 150,
                Item: {
                    w: w => w,
                    texture: {
                        type: TestTexture,
                        text: 'hello'
                    }
                }
            });
            comp.addTag('testComp');
            root.children = [comp]

            stage.drawFrame();
            const elem = root.tag("testComp").tag('Item');
            chai.assert(elem.texture.text == 'hello');
            chai.assert(elem.texture.w === 500);
            chai.assert(elem.texture.h !== 150);
            chai.assert(elem.core.w === 500);
            chai.assert(elem.core.h !== 150);
        });

        it('should ignore dim funcs for "x" and "y" ', function() {
            const comp = stage.createElement({
                w: 500,
                h: 150,
                x: 200,
                y: 300,
                Item: {
                    x: x => x,
                    y: y => y,
                    texture: {
                        type: TestTexture,
                        text: 'hello'
                    }
                }
            });

            comp.addTag('testComp');
            root.children = [comp]

            stage.drawFrame();
            const elem = root.tag("testComp").tag('Item');
            chai.assert(elem.texture.text == 'hello');
            chai.assert(elem.texture.w !== 500);
            chai.assert(elem.texture.h !== 150);
            chai.assert(elem.core.w !== 500);
            chai.assert(elem.core.h !== 150);

        })

    });

});
