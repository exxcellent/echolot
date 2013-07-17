/*
 * This file (Default.StyleSheet.js) is part of the Echolot Project (hereinafter "Echolot").
 * Copyright (C) 2008-2011 eXXcellent Solutions GmbH.
 *
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 */

/**
 * The whole Layout looks like this:
 * <pre>
 * +----+-----------------+
 * | A* | TestArea        |   A* = TestControl
 * |    | +--------------+|
 * |    | |  Overview/   ||
 * |    | |  Default     ||
 * |    | +--------------+|
 * +----+-----------------+
 * </pre>
 */
exxcellent.test.TestApp.StyleSheet = new Echo.StyleSheet(
    {
        "Title": { // Used as titles in the TestArea control column
            "Label": {
                font: {
                    size: "28px",
                    typeface: 'Serif'
                },
                layoutData: {
                    insets: "5px 5px 0 5px"
                },
                foreground: "#cfd0d1"
            }
        },
        "ExpanderTest": {
            "exxcellent.Expander": { // that one using an image background
                hideText: "verstecken",
                hideImage: {
                    url: "image/expander/up.png", x: 0, y: 0
                },
                showText: "anzeigen",
                showImage: {
                    url: "image/expander/down.png", x: 0, y: 0
                },

                show: true,
                title: "Only one child (style ExpanderTest)",

                speed: 200,
                rolloverForeground: "#444444",
                rolloverBackground: "#B8DDFF",
                rolloverBackgroundImage: {
                    url: "image/expander/hl.png", x: 0, y: 0, repeat: "repeat-x"
                },
                //titleInsets: "5px",
                titleForeground: "#8E8E8F",
                iconTextMarginTop: "5px",
                iconTextMargin: "20px",
                iconTextForeground: "#444444",
                iconTextFont: {
                    size: "9px",
                    typeface: 'sans-serif'
                },
                titleFont: {
                    size: "14px",
                    typeface: 'sans-serif'
                },
                headerHeight: "24px",
                headerBorder: {
                    bottom: "1px dashed #808080"
                }
            }
        },
        "Default": {
            "exxcellent.Expander": {
                hideText: "hide child zero",
                hideImage: {
                    url: "image/expander/up.png", x: 0, y: 0
                },
                showText: "show child zero",
                showImage: {
                    url: "image/expander/down.png", x: 0, y: 0
                },
                show: false,

                speed: 500,
                rolloverBackground: "#B8DDFF",
                titleInsets: "0",
                headerInsets: "10px 0 10px 0",
                titleForeground: "#8E8E8F",
                titlePosition: "left",
                iconTextMargin: "5px",
                iconTextForeground: "#AFAFAF",
                iconTextFont: {
                    size: "9px",
                    typeface: 'sans-serif'
                },
                titleFont: {
                    size: "12px",
                    typeface: 'sans-serif'
                },
                headerHeight: "32px",
                headerBorder: {
                    bottom: "1px solid #808080"
                }
            },
            "AbstractButton": {
                focusedEnabled: true,
                focusedBorder: "1px dashed #FF0000",
                foreground: "#000000",
                pressedBackgroundImage: {
                    url: "image/InputFieldBackgroundPressed.png",
                    y: "50%"
                },
                rolloverBackground: "#737172",
                rolloverForeground: "#FFFFFF",
                rolloverEnabled: true,
                insets: "5px",
                height: "20px",
                font: {
                    size: "11px"
                },
                disabledForeground: "#93bed5",
                layoutData: {
                    insets: "2px 2px 0 2px"
                }
            },
            "Label": {
                font: {
                    size: "14px",
                    typeface: 'Serif',
                    bold: true
                },
                layoutData: {
                    insets: "5px 5px 0 5px"
                }
            },
            "AbstractListComponent": {
                border: "2px groove #cfdfff",
                background: "#cfdfff"
            },
            "exxcellent.DatePicker": {
                insets: "5px 1px",
                background: "#ffffff",
                border: "1px solid #999999",
                backgroundImage: {
                    url: "image/input_shadow.png"
                }
            },
            "TextComponent": {
                insets: "5px 1px",
                background: "#ffffff",
                border: "1px solid #999999",
                backgroundImage: {
                    url: "image/input_shadow.png"
                }
            },
            "WindowPane": {
                ieAlphaRenderBorder: true,
                titleForeground: "#ffffff",
                titleBackground: "#2f2f4f",
                titleInsets: "5px 10px",
                controlsInsets: "-1px 5px",
                closeIcon: "image/window/simple/ControlClose.png",
                closeRolloverIcon: "image/window/simple/ControlCloseRollover.png",
                maximizeIcon: "image/window/simple/ControlMaximize.png",
                maximizeRolloverIcon: "image/window/simple/ControlMaximizeRollover.png",
                minimizeIcon: "image/window/simple/ControlMinimize.png",
                minimizeRolloverIcon: "image/window/simple/ControlMinimizeRollover.png",
                titleBackgroundImage: {
                    url: "image/window/simple/Header.png",
                    repeat: "repeat-x",
                    y: "50%"
                },
                border: {
                    contentInsets: "8px 14px 14px 8px",
                    borderInsets: "17px 23px 23px 17px",
                    topLeft: "image/window/simple/BorderTopLeft.png",
                    top: "image/window/simple/BorderTop.png",
                    topRight: "image/window/simple/BorderTopRight.png",
                    left: "image/window/simple/BorderLeft.png",
                    right: "image/window/simple/BorderRight.png",
                    bottomLeft: "image/window/simple/BorderBottomLeft.png",
                    bottom: "image/window/simple/BorderBottom.png",
                    bottomRight: "image/window/simple/BorderBottomRight.png"
                }
            },
            "Column": {
                border: {
                    bottomx: "1px solid #afafaf",
                    bottomy: "1px solid #afafaf",
                    topx: "1px solid #dfdfdf",
                    topy: "1px solid #dfdfdf"
                },
                cellSpacing: 0,
                insets: "20px",
                layoutData: {
                    insets: "0",
                    background: "#ffffff",
                    backgroundImage: {
                        url: "image/fill/main-bg.png",
                        repeat: ["repeat-x"],
                        x: 0,
                        y: 0
                    }
                }
            },
            "Grid": {
                insets: "5px"
            }
        },
        "Overview": {
            "Column": {
                border: {
                    bottomx: "1px solid #afafaf",
                    bottomy: "1px solid #afafaf",
                    topx: "1px solid #dfdfdf",
                    topy: "1px solid #dfdfdf"
                },
                cellSpacing: 0,
                insets: "20px",
                background: "#FFFFFF",
                backgroundImage: {
                    url: "image/fill/side-bg.png",
                    repeat: ["repeat-y"],
                    x: 0,
                    y: 0
                }
            },
            "Row": {
                border: {
                    bottom: "1px solid #7b7b7b"
                },
                insets: "10px"
            },
            "Label": {
                font: {
                    size: "18px",
                    typeface: 'sans-serif'
                },
                layoutData: {
                    insets: "5px 5px 0 5px"
                },
                foreground: "#7b7b7b"
            },
            "AbstractButton": {
                insets: "5px",
                textPosition: "bottom",
                lineWrap: "true",
                font: {
                    size: "11px"
                },
                disabledForeground: "#93bed5",
                layoutData: {
                    insets: "5px"
                }
            }
        },
        "TestArea": {  // the background of the right main content
        },
        "TestControl": {
            "SplitPane": {
                separatorHeight: 0,
                separatorWidth: 0,
                resizable: false,
                separatorPosition: 200
            },
            "Column": {
                border: {
                    bottomx: "1px solid #afafaf",
                    bottomy: "1px solid #afafaf",
                    topx: "1px solid #dfdfdf",
                    topy: "1px solid #dfdfdf"
                },
                cellSpacing: 0,
                insets: "0 5px",// top left
                layoutData: {
                    insets: "0",
                    alignment: "left",
                    background: "#ffffff",
                    backgroundImage: {
                        url: "image/fill/side-bg.png",
                        repeat: ["repeat-y"],
                        x: 0,
                        y: 0
                    }
                }
            }
        },
        "TestControlList": {
            "SplitPane": {
                separatorHeight: 0,
                separatorWidth: 0,
                resizable: false,
                separatorPosition: 200
            },
            "AbstractButton": {
                icon: "image/logo/echolot-logo-96.jpg"
            },
            "Column": {
                layoutData: {
                    alignment: "right",
                    insets: "5px"
                }
            }
        },
        "TestControlBackground": {
            "ContentPane": {         // the overall background
                background: "#FFFFFF",
                backgroundImage: {
                    url: "image/fill/carbon.jpg",
                    repeat: ["repeat-y"],
                    x: 0,
                    y: 0
                }
            }
        }
    });
