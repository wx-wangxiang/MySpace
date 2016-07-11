var YUEWEN = function(doc, win, undefined) {
    var ACTIVE = "active",
    REVERSE = "reverse";
    var exports = {
        el: {},
        load: function(url, callback) {
            var self = this;
            callback = callback || 
            function() {};
            var eleScript = document.createElement("script");
            eleScript.onload = function() {
                if (!eleScript.isInited) {
                    eleScript.isInited = true;
                    callback.call(self)
                }
            };
            eleScript.onreadystatechange = function() {
                if (!eleScript.isInited && /^loaded|complete$/.test(eleScript.readyState)) {
                    eleScript.isInited = true;
                    callback.call(self)
                }
            };
            eleScript.src = url;
            doc.getElementsByTagName("head")[0].appendChild(eleScript)
        },
        scrollLoading: function(images) {
            var cache = [];
            if (images && images.length) {
                images.each(function() {
                    if (doc.querySelector) {
                        this.src = "data:image/gif;base64,R0lGODlhCgAKAIAAAP///wAAACH5BAEAAAAALAAAAAAKAAoAAAIIhI+py+0PYysAOw=="
                    }
                    cache.push({
                        obj: this,
                        src: $(this).attr("data-src")
                    })
                });
                var loading = function() {
                    var winHeight = $(win).height(),
                    winWidth = $(win).width();
                    $.each(cache, 
                    function(index, data) {
                        var ele = data.obj;
                        if (!ele) {
                            return
                        }
                        var rect = ele.getBoundingClientRect();
                        if (rect.left == 0 && rect.top == 0) {
                            return
                        }
                        var width = ele.clientWidth,
                        height = ele.clientHeight;
                        var isVerticalIn = false;
                        if (rect.top + height >= 0 && rect.top < winHeight) {
                            isVerticalIn = true
                        }
                        var isHorizonalIn = false;
                        if (rect.left + width >= 0 && rect.left < winWidth) {
                            isHorizonalIn = true
                        }
                        if (isVerticalIn && isHorizonalIn) {
                            ele.src = data.src;
                            ele.removeAttribute("data-src");
                            data.obj = null
                        }
                    })
                };
                this.el.container.on("scroll", loading);
                this.el.container.on("resize", loading);
                loading()
            }
        },
        swipe: function(el, type, callback) {
            var self = this;
            if ($.isFunction(callback) == false) {
                return self
            }
            var start = {
                x: 0,
                y: 0
            },
            delta = {};
            var events = {
                start: function(event) {
                    var touches = event.touches[0];
                    start = {
                        x: touches.pageX,
                        y: touches.pageY,
                        time: +new Date
                    }
                },
                move: function(event) {
                    if (event.touches.length > 1 || event.scale && event.scale !== 1) {
                        return
                    }
                    var touches = event.touches[0];
                    delta = {
                        x: touches.pageX - start.x,
                        y: touches.pageY - start.y
                    }
                },
                end: function(event) {
                    var duration = +new Date - start.time;
                    var isValidSlide = Number(duration) < 500;
                    if (isValidSlide) {
                        var deltaX = Math.abs(delta.x),
                        deltaY = Math.abs(delta.y);
                        if (deltaX > 20 && deltaY < deltaX) {
                            if (delta.x < 0 && type == "left" || delta.x > 0 && type == "right") {
                                callback.call(el[0], events)
                            }
                        }
                        if (deltaY > 20 && deltaX < deltaY) {
                            if (delta.y < 0 && type == "top" || delta.y > 0 && type == "bottom") {
                                callback.call(el[0], events)
                            }
                        }
                    }
                    start = {};
                    delta = {}
                }
            };
            el.on("touchstart", events.start);
            el.on("touchmove", events.move);
            el.on("touchend", events.end);
            return self
        },
        slide: function(buttons, callback) {
            var self = this;
            if (typeof buttons == "string") {
                buttons = $(buttons)
            }
            if (buttons && buttons.length) {
                var current = 0;
                var targets = $.map(buttons, 
                function(button, index) {
                    var hash = "";
                    button = $(button);
                    if (button.hasClass(ACTIVE)) {
                        current = index
                    } else if ((hash = button.attr("data-hash")) && location.hash.replace("#", "") == hash) {
                        current = index
                    }
                    return $("#" + button.data("index", index).attr("data-rel"))
                });
                buttons.eq(current).addClass(ACTIVE);
                buttons.on("click", 
                function() {
                    var button = $(this),
                    index = +button.data("index");
                    if (button.hasClass(ACTIVE) == false) {
                        _slide(index)
                    }
                });
                var _slide = function(index) {
                    buttons.eq(current).removeClass(ACTIVE);
                    buttons.eq(index).addClass(ACTIVE);
                    $(targets[current]).removeClass(ACTIVE);
                    $(targets[index]).addClass(ACTIVE);
                    if ($.isFunction(callback)) {
                        callback.call(self, buttons.eq(index), targets[index], buttons.eq(current), targets[current])
                    }
                    current = index
                }
            }
            return this
        },
        slidePreload: function() {
            var self = this;
            self.isPreload = true;
            return self
        },
        slideHomeApp: function() {
            var self = this;
            var elTabX = self.el.tabApp = $("#tabApp");
            var elTabLine = self.el.tabLine = $("#tabLine");
            var elTabBtns = elTabX.find("a");
            var _callbackTab = function(isTrigger) {
                var elActive = elTabX.find("." + ACTIVE),
                left = 0;
                if (elActive.length) {
                    left = elActive.position().left;
                    elTabLine.css({
                        width: elActive.width()
                    });
                    if (history.pushState) {
                        elTabLine.css({
                            webkitTransform: "translateX(" + left + "px)",
                            transform: "translateX(" + left + "px)"
                        })
                    } else {
                        elTabLine.css({
                            left: elActive.position().left
                        })
                    }
                }
                if (win.FN_hash && isTrigger !== true) {
                    var hash = elActive.attr("data-hash");
                    location.replace(location.href.split("#")[0] + "#" + hash);
                    FN_hash();
                    self.el.container.trigger("scroll")
                }
            };
            self.slide(elTabBtns, _callbackTab);
            _callbackTab(true);
            if (win.SIZE == "S") {
                var elUl = $("#mobile ul");
                self.swipe(elUl, "left", 
                function() {
                    var index = elTabX.find("." + ACTIVE).data("index") * 1;
                    index++;
                    if (index > elTabBtns.length - 1) {
                        index = 0
                    }
                    elTabBtns.eq(index).trigger("click")
                });
                self.swipe(elUl, "right", 
                function() {
                    var index = elTabX.find("." + ACTIVE).data("index") * 1;
                    index--;
                    if (index < 0) {
                        index = elTabBtns.length - 1
                    }
                    elTabBtns.eq(index).trigger("click")
                });
                $("#mobile a").removeAttr("target");
                $(".mNoBlank").removeAttr("target")
            }
            return self
        },
        slideBrand: function() {
            var self = this;
            var elBrandDescX = self.el.brandDescX = $("#brandDescX");
            var elBrandNavX = self.el.brandNavX = $("#brandNavX");
            var elDescLs,
            elNavLs;
            if (elBrandDescX.length && elBrandNavX.length) {
                elDescLs = elBrandDescX.find("li");
                elNavLs = elBrandNavX.find("a");
                elNavLs.each(function(index) {
                    $(this).data("index", index).on("mouseenter", 
                    function() {
                        var elNav = $(this),
                        elActive = null,
                        indexActive = -1,
                        indexCurrent = elNav.data("index");
                        clearTimeout(self.timerNavHover);
                        self.timerNavHover = setTimeout(function() {
                            if (elNav.hasClass(ACTIVE) === false) {
                                elActive = elBrandNavX.find("." + ACTIVE);
                                if (elActive.length == 1) {
                                    indexActive = elActive.data("index");
                                    elActive.removeClass(ACTIVE)
                                }
                                elNav.addClass(ACTIVE);
                                var isResverse = false;
                                if (indexCurrent < indexActive) {
                                    isResverse = true
                                }
                                var elDescActive = elDescLs.eq(indexActive);
                                if (elDescActive.length) {
                                    elDescActive.removeClass("in").removeClass(REVERSE).addClass("out");
                                    if (isResverse) {
                                        elDescActive.addClass(REVERSE)
                                    }
                                }
                                elDescLs.eq(indexCurrent).addClass("in").removeClass(REVERSE).removeClass("out");
                                if (isResverse) {
                                    elDescLs.eq(indexCurrent).addClass(REVERSE)
                                }
                            }
                        },
                        225)
                    })
                });
                elBrandNavX.on("mouseleave", 
                function() {
                    clearTimeout(self.timerNavHover)
                })
            }
            return self
        },
        slideHomeHeader: function() {
            var self = this;
            var elHeader = self.el.header,
            elDots = self.el.dots;
            if (elHeader.length) {
                var _autoplay = function() {
                    if (!self.timerSlide) {
                        self.timerSlide = setInterval(function() {
                            var index = $("#hdDotX ." + ACTIVE).data("index") * 1 + 1;
                            if (!elDots[index]) {
                                index = 0
                            }
                            elDots.eq(index).trigger("click")
                        },
                        5e3)
                    }
                };
                if (win.SIZE !== "S") {
                    elHeader.on("mouseenter", 
                    function() {
                        clearInterval(self.timerSlide);
                        self.timerSlide = null
                    }).on("mouseleave", 
                    function() {
                        _autoplay()
                    });
                    $(doc).on("mouseover", 
                    function() {
                        if (!self.isPreload) {
                            setTimeout(function() {
                                if (!self.isPreload) {
                                    self.slidePreload()
                                }
                            },
                            4e3);
                            setTimeout(function() {
                                _autoplay()
                            },
                            5e3)
                        }
                    })
                } else {
                    self.swipe(elHeader, "left", 
                    function() {
                        var index = $("#hdDotX ." + ACTIVE).data("index") * 1;
                        index++;
                        if (index > elDots.length - 1) {
                            index = 0
                        }
                        elDots.eq(index).trigger("click")
                    });
                    self.swipe(elHeader, "right", 
                    function() {
                        var index = $("#hdDotX ." + ACTIVE).data("index") * 1;
                        index--;
                        if (index < 0) {
                            index = elDots.length - 1
                        }
                        elDots.eq(index).trigger("click")
                    })
                }
            }
            return this
        },
        scrollBarFixed: function() {
            var self = this;
            var elHeader = self.el.header,
            container = self.el.container;
            self.el.hdBar = $("#ywHdBar");
            var elBar;
            var elBarNav = $("#ywMnavBtn"),
            elBarNavName = $("#ywMnavName");
            self.el.barNav = elBarNav;
            var indexNav = 0;
            var arrModule = [];
            var elMnavAs = $("#ywMnav > a").each(function(index) {
                var href = this.getAttribute("href");
                if (/^#/.test(href)) {
                    arrModule.push($(href))
                }
                var hash = location.hash.replace("&", "");
                if (hash == href) {
                    indexNav = index
                }
            });
            if (elHeader.length) {
                if (win.SIZE == "S") {
                    elBar = self.el.hdBar;
                    container.on("scroll", 
                    function(event) {
                        var st = $(this).scrollTop(),
                        distance = 50;
                        if (st <= 0) {
                            elBar.removeClass("fixed");
                            elBar.css("opacity", 1)
                        } else {
                            elBar.addClass("fixed");
                            elBar.css("opacity", Math.min(st, 30) / 30)
                        }
                        var arrTop = $.map(arrModule, 
                        function(module) {
                            return module[0].getBoundingClientRect().top
                        }),
                        arrTopAbs = $.map(arrTop, 
                        function(top) {
                            return Math.abs(top)
                        });
                        var min = Math.min.apply(null, arrTopAbs);
                        $.each(arrTop, 
                        function(index, top) {
                            if (index == 0 && top > 0 || index == arrTop.length - 1 && top < 0 || Math.abs(top) == min) {
                                elMnavAs.removeClass(ACTIVE);
                                elBarNavName.html(elMnavAs.eq(index).addClass(ACTIVE).html());
                                indexNav = index
                            }
                        })
                    });
                    elBarNav.on("touchstart", 
                    function() {
                        $(this).toggleClass(ACTIVE)
                    })
                } else if (!win.APP) {
                    elBar = $("#ywBarX");
                    if (elBar.length == 0) {
                        return self
                    }
                    self.el.barX = elBar;
                    var cl = elBar[0].className.split(" ")[0] + "-fixed";
                    var fnStatus = function(index, isHash) {
                        elMnavAs.removeClass(ACTIVE);
                        elMnavAs.eq(index).addClass(ACTIVE);
                        var href = elMnavAs.eq(index).attr("href");
                        if (/#/.test(href)) {
                            location.replace("#&" + href.split("#")[1])
                        }
                        indexNav = index
                    };
                    self.el.container.on("scroll", 
                    function() {
                        var st = $(this).scrollTop();
                        if (st <= 0) {
                            elBar.removeClass(cl);
                            elBar.css("opacity", 1)
                        } else {
                            elBar.addClass(cl);
                            elBar.css("opacity", Math.min(st, 50) / 50)
                        }
                        if (self.triggerScroll) {
                            $.each(arrModule, 
                            function(index, el) {
                                if (el[0] == self.triggerScroll) {
                                    indexNav = index
                                }
                            });
                            return
                        }
                        if (st == doc.documentElement.scrollHeight - doc.documentElement.clientHeight) {
                            indexNav = arrModule.length - 1;
                            fnStatus(indexNav, true);
                            return
                        }
                        $.each(arrModule, 
                        function(index, module) {
                            var ele = module[0];
                            if (indexNav !== index && Math.abs(ele.getBoundingClientRect().top) <= 75) {
                                fnStatus(index, true)
                            }
                        })
                    });
                    if (indexNav != 0) {
                        fnStatus(indexNav)
                    }
                    self.el.container.trigger("scroll")
                }
            }
            return self
        },
        tapHomeCopy: function() {
            var self = this;
            self.el.copy = $("#ywCopyX");
            var timerLongTap = null,
            targetLongTap = null;
            var elCopy = self.el.copy;
            if (elCopy.length && win.SIZE == "S") {
                var willLeft = Math.round((elCopy[0].scrollWidth - elCopy.width()) / 2);
                elCopy.scrollLeft(willLeft);
                elCopy.on("scroll", 
                function() {
                    self.el.container.trigger("scroll");
                    if (!this.scrollEd && elCopy.scrollLeft() !== willLeft) {
                        $("#copyright svg").hide();
                        this.scrollEd = true
                    }
                });
                var posCopy = {
                    x: 0,
                    y: 0
                };
                elCopy.find("li > div").on({
                    touchstart: function(event) {
                        var target = event.touches[0] || event;
                        posCopy = {
                            x: target.pageX,
                            y: target.pageY
                        };
                        var li = this;
                        targetLongTap = li;
                        timerLongTap = setTimeout(function() {
                            if (targetLongTap == li) {
                                $(li).addClass(ACTIVE)
                            }
                        },
                        500)
                    }
                });
                $(doc).on("touchend", 
                function() {
                    clearTimeout(timerLongTap);
                    targetLongTap = null;
                    elCopy.find("." + ACTIVE).removeClass(ACTIVE)
                }).on("touchmove", 
                function(event) {
                    var target = event.touches[0] || event;
                    if (Math.abs(target.pageX - posCopy.x) > 5 || Math.abs(target.pageY - posCopy.y) > 5) {
                        clearTimeout(timerLongTap)
                    }
                })
            } else if (elCopy.length) {
                var ul = elCopy.find("ul");
                var marginLeft = parseInt(ul.css("marginLeft"));
                ul.find("li").on("mouseenter", 
                function() {
                    var rect = this.getBoundingClientRect(),
                    move = 0,
                    winWidth = $(win).width();
                    if (rect.left < 0 || rect.right > winWidth) {
                        if (rect.left < 0) {
                            move = Math.floor( - 1 * rect.left)
                        } else {
                            move = Math.ceil(winWidth - rect.right)
                        }
                        if ([].map) {
                            ul.css({
                                msTransform: "translateX(" + move + "px)",
                                transform: "translateX(" + move + "px)"
                            })
                        } else {
                            ul.css("marginLeft", marginLeft + move)
                        }
                    }
                }).on("mouseleave", 
                function() {
                    if ([].map) {
                        ul.css({
                            msTransform: "none",
                            transform: "none"
                        })
                    } else {
                        ul.css("marginLeft", marginLeft)
                    }
                })
            }
            return self
        },
        showImage: function(url) {
            var self = this;
            var overlay = self.el.overlay;
            if (!overlay) {
                overlay = $("#ywOverlay");
                overlay.data("origin", overlay.html()).on("click", 
                function() {
                    $(this).removeClass(ACTIVE).hide()
                });
                self.el.overlay = overlay
            } else if (overlay.data("lasturl") === url) {
                overlay.addClass(ACTIVE).show();
                return
            } else {
                overlay.html(overlay.data("origin"))
            }
            var box = overlay.children("div").removeAttr("style");
            overlay.show();
            var image = new Image;
            image.onload = function() {
                var width = this.width,
                height = this.height;
                setTimeout(function() {
                    box.css({
                        width: width,
                        height: height
                    }).html('<img src="' + url + '">');
                    overlay.data("lasturl", url)
                },
                200)
            };
            image.error = function() {
                box.html('<div class="error">图片没有加载出来，可以稍后重试。</div>')
            };
            image.src = url;
            return this
        },
        scrollIntoView: function(el, callback, direction) {
            var self = this;
            var $win = self.el.container;
            direction = direction || "top";
            var scrollMethod = "scroll" + direction.slice(0, 1).toUpperCase() + direction.slice(1, direction.length);
            if (el && el.length) {
                clearTimeout(self.timerScroll);
                var st = $win[scrollMethod](),
                offT = el.offset()[direction] + st;
                if (win.SIZE == "S") {
                    offT -= 50
                } else if (!win.APP) {
                    offT = el.offset()[direction] - 74
                }
                var rate = 10,
                nowSt = st;
                var step = function() {
                    var move = (offT - nowSt) / rate;
                    if (Math.abs(move) < 1 / rate) {
                        $win[scrollMethod](offT);
                        if ($.isFunction(callback)) {
                            callback.call(el[0])
                        }
                    } else {
                        nowSt = nowSt + move;
                        $win[scrollMethod](nowSt);
                        self.timerScroll = setTimeout(step, 20)
                    }
                };
                step()
            }
            return self
        },
        eventsGlobal: function() {
            var self = this;
            $(doc).delegate("a", "click", 
            function(event) {
                var hrefAttr = this.getAttribute("href"),
                href = this.href;
                if (/^#/.test(hrefAttr)) {
                    self.scrollIntoView($(hrefAttr), 
                    function() {
                        if (win.SIZE != "S") {
                            location.replace("#&" + hrefAttr.split("#")[1]);
                            self.triggerScroll = null
                        }
                    });
                    if (win.SIZE == "S") {} else if (/nav/.test(this.className)) {
                        self.triggerScroll = this;
                        $(this).addClass(ACTIVE).siblings("a").removeClass(ACTIVE)
                    }
                    event.preventDefault()
                } else if (/\.(?:png|jpg)$/.test(hrefAttr)) {
                    self.showImage(hrefAttr);
                    event.preventDefault()
                } else if (/#/.test(hrefAttr)) {
                    $(this).parent().find("." + ACTIVE).removeClass(ACTIVE);
                    $(this).addClass(ACTIVE)
                }
            });
            this.scrollLoading($("img[data-src]"));
            return self
        },
        eventsHome: function() {
            var self = this;
            self.slideHomeHeader();
            self.scrollBarFixed();
            self.slideHomeApp();
            self.slideBrand();
            self.tapHomeCopy();
            var elBarNav;
            if (win.SIZE == "S") {
                elBarNav = self.el.barNav || $("#ywMnavBtn");
                $("#ywMnav").click(function() {
                    elBarNav.removeClass(ACTIVE)
                })
            }
            return self
        },
        eventsApp: function() {
            var self = this;
            var regAndroid = /Android/i,
            isAndroid = regAndroid.test(navigator.userAgent);
            self.scrollBarFixed();
            self.slideHomeApp();
            var scale = 1;
            if (! [].map && (scale = $(win).width() / 1440) > 1) {
                self.el.header.css("overflow", "hidden").find("s").each(function() {
                    var elS = $(this);
                    elS.css("zoom", scale).css("left", -.5 * $(win).width() * (scale - 1))
                })
            }
            var elTabX = self.el.tabApp;
            if (elTabX) {
                elTabX.find("a").on({
                    mouseenter: function() {
                        var ele = this,
                        el = $(ele),
                        index = -1,
                        imgurl = "";
                        if (!ele.isPreload) {
                            index = +el.data("index") + 1;
                            imgurl = $("#hdAPP" + index).find("s").css("background-image");
                            if (imgurl) {
                                imgurl = imgurl.split('"')[1];
                                if (imgurl) { (new Image).src = imgurl
                                }
                            }
                        }
                        ele.isPreload = true
                    }
                })
            }
            return self
        },
        init: function() {
            var self = this;
            self.el.container = win.SIZE == "S" ? $("#ywPage") : $(win);
            self.el.header = $("#ywHeader");
            self.el.dots = $("#hdDotX a");
            if (win.APP) {
                self.eventsApp()
            } else {
                self.eventsHome()
            }
            self.eventsGlobal();
            return self
        }
    };
    return exports
} (document, window);