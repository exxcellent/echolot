/*
 * This file (BlockTest.js) is part of the Echolot Project (hereinafter "Echolot").
 * Copyright (C) 2008-2011 eXXcellent Solutions GmbH.
 *
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 */

/**
 * A test class for the Sync.Block.js
 *
 * @author Oliver Pehnke
 * @version $Id: BlockTest.js
 */
exxcellent.test.BlockTest = Core.extend(
    {
        $construct: function (testArea) {
            var block = new exxcellent.Block({
                renderId: "exxcellentUnitTestBlock",
                styleName: "Default"
            });
            for (var i = 0; i < 200; i++) {
                block.add(new Echo.Label({
                    text: "Test Label " + i,
                    layoutData: {
                        background: "#AAAABB",
                        floating: 'right',
                        width: "10em"
                    }
                }));
                block.add(new Echo.Label({
                    text: "Test Value " + i,
                    layoutData: {
                        background: "#FFAAAA",
                        marginRight: "10em"
                    }
                }));
            }
            var controlColumn = new Echo.Column({
                styleName: "TestControl",
                children: [
                    new Echo.Label({
                        text: "Block", styleName: "Title"
                    })
                ]
            });
            testArea.add(new Echo.SplitPane({
                styleName: "TestControl",
                children: [
                    controlColumn,
                    block]
            }));
        }
    });